# Odys

Application web moderne construite avec Next.js, Supabase et TypeScript.

## Technologies utilisées

- Next.js 15.3.0
- React 19
- TypeScript
- Supabase
- Tailwind CSS

## Configuration requise

- Node.js (version LTS recommandée)
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```
Puis remplir les variables dans `.env.local`

4. Lancer le serveur de développement
```bash
npm run dev
```

## Structure du projet

- `/src/app` - Routes et pages
- `/src/components` - Composants réutilisables
- `/src/lib` - Utilitaires et configurations
- `/src/types` - Types TypeScript

## Déploiement

Le projet est configuré pour être déployé sur Vercel. 