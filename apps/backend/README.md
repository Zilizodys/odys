# Backend Odys

Ce dossier contient le backend de l'application Odys, développé avec FastAPI.

## Installation

1. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Sur Unix/MacOS
# ou
.\venv\Scripts\activate  # Sur Windows
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

## Développement

Pour lancer le serveur de développement :
```bash
uvicorn app.main:app --reload
```

Le serveur sera accessible à l'adresse : http://localhost:8000

## Documentation API

Une fois le serveur lancé, la documentation interactive est disponible à :
- Swagger UI : http://localhost:8000/docs
- ReDoc : http://localhost:8000/redoc 