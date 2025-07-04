# 🚗 Système de Gestion de Flotte - Projet Complet

Ce projet complet comprend un **Frontend React** et un **Backend Node.js** pour un système de gestion de flotte de véhicules.

## 📁 Structure du Projet

```
📦 fleet-management-system/
├── 📁 frontend/                    # Application React (dossier racine actuel)
│   ├── 📁 src/
│   │   ├── 📁 components/          # Composants React
│   │   ├── 📁 pages/              # Pages de l'application
│   │   ├── 📁 services/           # Services API
│   │   └── 📁 types/              # Types TypeScript
│   ├── package.json
│   └── README.md
└── 📁 backend/                     # API REST Node.js
    ├── 📁 src/
    │   ├── 📁 routes/             # Routes API
    │   ├── 📁 middleware/         # Middlewares Express
    │   └── server.ts
    ├── 📁 prisma/
    │   └── schema.prisma          # Schéma base de données
    ├── package.json
    └── README.md
```

## 🌐 Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 avec Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Authentification**: JWT tokens

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **Authentification**: JWT + bcrypt
- **Validation**: express-validator

## 🚀 Installation et Configuration

### 1. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
# DATABASE_URL="postgresql://username:password@localhost:5432/fleet_management_db"
# JWT_SECRET="your-secret-key"
# PORT=5000

# Créer la base de données PostgreSQL
createdb fleet_management_db

# Générer le client Prisma et exécuter les migrations
npm run db:generate
npm run db:migrate

# Démarrer le serveur backend
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### 2. Configuration du Frontend

```bash
# Depuis le dossier racine (frontend)
npm install

# Créer un fichier .env.local pour l'API
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Démarrer l'application frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🔧 Variables d'Environnement

### Backend (.env)
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/fleet_management_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
NODE_ENV="development"
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Fonctionnalités

### 🔐 Authentification
- Connexion/Déconnexion
- Inscription d'utilisateurs
- Gestion des rôles (Admin, Gestionnaire, Conducteur, Utilisateur)
- Protection des routes

### 🚗 Gestion des Véhicules
- CRUD complet des véhicules
- Recherche et filtrage
- Assignation de responsables
- Suivi des statuts

### 👥 Gestion des Utilisateurs
- Création et modification d'utilisateurs
- Gestion des rôles et permissions
- Profils utilisateurs

### ⛽ Gestion du Carburant
- Enregistrement des pleins
- Calcul des coûts
- Historique par véhicule

### 🔧 Maintenance
- Planification des maintenances
- Suivi des interventions
- Gestion des coûts

### 🚨 Violations
- Enregistrement des contraventions
- Suivi des paiements
- Gestion par conducteur

### 📍 Suivi GPS
- Localisation en temps réel
- Historique des trajets
- Statuts des véhicules

### 📄 Documents
- Gestion des documents véhicules
- Upload de fichiers
- Suivi des échéances

### 📈 Rapports
- Tableau de bord avec statistiques
- Rapports de consommation
- Analyses de coûts

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Profil utilisateur

### Véhicules
- `GET /api/vehicles` - Liste des véhicules
- `POST /api/vehicles` - Créer un véhicule
- `GET /api/vehicles/:id` - Détails véhicule
- `PUT /api/vehicles/:id` - Modifier véhicule
- `DELETE /api/vehicles/:id` - Supprimer véhicule

### Autres modules
- `/api/users` - Gestion utilisateurs
- `/api/fuel` - Gestion carburant
- `/api/maintenance` - Gestion maintenance
- `/api/violations` - Gestion violations
- `/api/gps` - Données GPS
- `/api/documents` - Gestion documents
- `/api/reports` - Rapports et statistiques

## 🔒 Sécurité

### Backend
- Authentification JWT
- Hachage des mots de passe (bcrypt)
- Validation des entrées
- Rate limiting
- CORS configuré
- Headers de sécurité (Helmet)

### Frontend
- Protection des routes
- Gestion sécurisée des tokens
- Validation côté client
- Sanitisation des données

## 🗄️ Modèles de Données

### Utilisateur
```typescript
interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'CONDUCTEUR' | 'UTILISATEUR';
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  // ... autres champs
}
```

### Véhicule
```typescript
interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  type: 'VOITURE' | 'MOTO' | 'CAMION' | 'BUS';
  statut: 'ACTIF' | 'MAINTENANCE' | 'HORS_SERVICE';
  // ... autres champs
}
```

## 🚀 Déploiement

### Backend (Production)
```bash
# Build
npm run build

# Démarrer en production
npm start
```

### Frontend (Production)
```bash
# Build pour production
npm run build

# Les fichiers sont dans dist/
```

### Docker (Optionnel)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Scripts Disponibles

### Backend
- `npm run dev` - Développement avec hot reload
- `npm run build` - Build production
- `npm start` - Démarrer en production
- `npm run db:migrate` - Migrations base de données
- `npm run db:generate` - Générer client Prisma

### Frontend
- `npm run dev` - Serveur développement
- `npm run build` - Build production
- `npm run preview` - Prévisualiser build
- `npm run lint` - Linting

## 🧪 Tests

### Backend
```bash
npm test
```

### Frontend
```bash
npm test
```

## 📞 Support

### Problèmes Courants

1. **Erreur de connexion à la base**
   - Vérifier que PostgreSQL est démarré
   - Vérifier la DATABASE_URL dans .env

2. **Erreur CORS**
   - Vérifier CORS_ORIGINS dans le backend
   - Vérifier VITE_API_URL dans le frontend

3. **Token JWT invalide**
   - Vérifier JWT_SECRET
   - Vider le localStorage du navigateur

### Aide
- Consulter les logs du serveur
- Vérifier la console du navigateur
- Consulter la documentation Prisma
- Vérifier les endpoints avec un outil comme Postman

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Développer et tester
4. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

## 🎯 Prochaines Étapes

1. **Installation des dépendances backend**
2. **Configuration de la base de données**
3. **Test des endpoints API**
4. **Intégration frontend-backend**
5. **Test de l'application complète**

Le système est maintenant complet et prêt à être utilisé ! 🚀