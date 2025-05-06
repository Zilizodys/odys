from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
import httpx
import os
import json
import logging
import uuid
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from supabase import create_client, Client
import asyncio
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from functools import lru_cache
import re
import os.path

# Charger les variables d'environnement
load_dotenv()

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration de DuckDuckGo
search_wrapper = DuckDuckGoSearchAPIWrapper(
    region="fr-fr",
    time="y",
    max_results=10  # Augmenté pour avoir plus de résultats
)
web_search = DuckDuckGoSearchRun(api_wrapper=search_wrapper)

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://odys.fr", "https://odys-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = "https://awpplalldxideqwgzjgf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHBsYWxsZHhpZGVxd2d6amdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUzNTM5MiwiZXhwIjoyMDYwMTExMzkyfQ.dhz57vk4naNczrg8XpTcg77G2qib9_R_Y8cew-0WOm8"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Activity(BaseModel):
    id: str
    title: str
    description: str
    category: str
    price: float
    address: str
    imageurl: str
    city: str
    duration: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    booking_url: Optional[str] = None

class SuggestionRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: str
    traveler_type: str
    interests: List[str]

class SuggestionResponse(BaseModel):
    success: bool = True
    activities: List[Activity]
    error: Optional[str] = None
    details: Optional[Union[str, Dict[str, Any]]] = None

# Données de test pour les villes principales
TEST_DATA = {
    "Paris": os.path.join(os.path.dirname(__file__), "test_data", "paris.json"),
    "London": os.path.join(os.path.dirname(__file__), "test_data", "london.json"),
    "Barcelona": os.path.join(os.path.dirname(__file__), "test_data", "barcelona.json"),
    "Barcelone": os.path.join(os.path.dirname(__file__), "test_data", "barcelona.json")  # Ajout de l'alias français
}

# Mapping des catégories frontend vers backend
CATEGORY_MAPPING = {
    'cultural': 'culture',
    'romantic': 'romantique',
    'gastronomy': 'gastronomie',
    'party': 'fete',
    'sport': 'sport',
    'nature': 'nature'
}

# Mapping inverse pour la conversion backend vers frontend
CATEGORY_MAPPING_REVERSE = {v: k for k, v in CATEGORY_MAPPING.items()}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def fetch_supabase(destination):
    response = supabase.table("activities").select("*").eq("city", destination).execute()
    return response.data if response.data else []

@lru_cache(maxsize=100)
async def fetch_ia(destination: str, budget: str, traveler_type: str, interests: tuple) -> List[Dict]:
    """Cache les résultats de l'IA pour éviter les appels répétés"""
    # ... reste du code ...

@app.post("/suggestions")
async def get_suggestions(request: SuggestionRequest) -> SuggestionResponse:
    logger.info(f"Recherche pour {request.destination}")
    logger.info(f"Données reçues: {request.dict()}")
    logger.info(f"Intérêts: {request.interests}")
    logger.info(f"Fichiers de test disponibles: {list(TEST_DATA.keys())}")
    logger.info(f"Dossier courant: {os.getcwd()}")

    # Convertir les catégories du frontend vers le backend
    backend_interests = [CATEGORY_MAPPING.get(interest, interest) for interest in request.interests]
    logger.info(f"Intérêts convertis: {backend_interests}")

    # 1. Vérification dans Supabase d'abord
    existing_data = fetch_supabase(request.destination)
    logger.info(f"Données Supabase trouvées: {len(existing_data)} activités")
    
    # Si pas de données dans Supabase, utiliser les données de test
    if not existing_data:
        # Vérifier la destination en minuscules
        destination_lower = request.destination.lower()
        test_key = next((k for k in TEST_DATA.keys() if k.lower() == destination_lower), None)
        
        if test_key:
            test_file = TEST_DATA[test_key]
            logger.info(f"Tentative de lecture du fichier de test: {test_file}")
            if os.path.exists(test_file):
                try:
                    with open(test_file, 'r', encoding='utf-8') as f:
                        test_data = json.load(f)
                        logger.info(f"Données de test chargées pour {request.destination}: {len(test_data)} activités")
                        existing_data = test_data
                except Exception as e:
                    logger.error(f"Erreur lors de la lecture des données de test: {e}")
            else:
                logger.error(f"Fichier de test non trouvé: {test_file}")
                # Essayer de lister les fichiers dans le dossier test_data
                test_data_dir = os.path.join(os.path.dirname(__file__), "test_data")
                if os.path.exists(test_data_dir):
                    logger.info(f"Contenu du dossier test_data: {os.listdir(test_data_dir)}")
                else:
                    logger.error(f"Dossier test_data non trouvé: {test_data_dir}")
        else:
            logger.info(f"Pas de données de test disponibles pour {request.destination}")

    try:
        existing_activities = []
        for data in existing_data:
            # Convertir la catégorie du backend vers le frontend
            if 'category' in data:
                data['category'] = CATEGORY_MAPPING_REVERSE.get(data['category'].lower(), data['category'])
                logger.info(f"Conversion de catégorie: {data['category']}")
            existing_activities.append(Activity(**data))
        logger.info(f"Activités existantes après conversion: {len(existing_activities)}")
        
        # Filtrer par catégorie et budget
        filtered_activities = []
        for activity in existing_activities:
            activity_category = activity.category.lower()
            logger.info(f"Vérification de l'activité {activity.title} - Catégorie: {activity_category}")
            if activity_category in [interest.lower() for interest in request.interests]:
                logger.info(f"Activité {activity.title} correspond à la catégorie demandée")
                filtered_activities.append(activity)

        logger.info(f"Nombre d'activités filtrées: {len(filtered_activities)}")
        
        if filtered_activities:
            return SuggestionResponse(activities=filtered_activities)
        else:
            return SuggestionResponse(
                success=True,
                activities=[],
                error="Aucune activité trouvée pour cette destination"
            )
            
                except Exception as e:
        logger.error(f"Erreur lors du traitement des activités: {e}")
        return SuggestionResponse(
            success=True,
            activities=[],
            error=f"Erreur lors du traitement des activités: {str(e)}"
        )

def parse_crew_result(result: str) -> List[Dict]:
    try:
        # Extraire le JSON entre crochets
        match = re.search(r'\[[\s\S]*?\]', result)
        if not match:
            logger.error(f"No JSON array found in: {result}")
            return []
            
        json_str = match.group(0)
        activities_data = json.loads(json_str)
        
        valid_activities = []
        for data in activities_data:
            # Validation moins stricte
            if (
                isinstance(data.get('price'), (int, float)) and
                20 <= float(data.get('price', 0)) <= 50 and
                data.get('title', '').strip() and
                data.get('description', '').strip() and
                data.get('address', '').strip() and
                data.get('imageurl', '').startswith('http')
            ):
                # Générer un nouvel UUID
                data['id'] = str(uuid.uuid4())
                valid_activities.append(data)
            else:
                logger.warning(f"Invalid activity data: {data}")
            
        return valid_activities
    except Exception as e:
        logger.error(f"Error parsing crew result: {str(e)}")
        return []

def validate_address(address: str) -> bool:
    # Lieux touristiques sans numéro
    tourist_spots = [
        "miroir d'eau", "place de la bourse", "quai des chartrons",
        "jardin public", "place des quinconces", "place gambetta",
        "cathédrale saint-andré", "grand théâtre", "cité du vin",
        "marché des capucins", "base sous-marine", "darwin"
    ]
    
    # Accepter les lieux touristiques connus
    if any(spot.lower() in address.lower() for spot in tourist_spots):
        return True
    
    # Vérifier le format d'adresse classique
    pattern = r'.*\d+.*(?:33\d{3}).*(?:Bordeaux|Pessac|Talence|Mérignac|Bègles|Cenon)'
    return bool(re.match(pattern, address, re.IGNORECASE))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001) 