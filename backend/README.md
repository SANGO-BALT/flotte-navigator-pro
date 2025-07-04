# Backend - Système de Gestion de Flotte

Backend REST API pour le système de gestion de flotte de véhicules développé avec Node.js, Express, TypeScript et PostgreSQL.

## 🚀 Technologies Utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Langage typé
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM et gestion de base de données
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des données
- **multer** - Upload de fichiers

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- PostgreSQL (v13 ou supérieur)

## 🛠️ Installation

1. **Cloner le repository et aller dans le dossier backend**
   ```bash
   cd backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Puis éditer le fichier `.env` avec vos configurations :
   ```env
   # Port du serveur
   PORT=5000
   
   # Base de données PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/fleet_management_db?schema=public"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="24h"
   
   # Environnement
   NODE_ENV="development"
   
   # CORS Origins (séparés par des virgules)
   CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
   ```

4. **Créer la base de données PostgreSQL**
   ```bash
   # Se connecter à PostgreSQL
   psql -U postgres
   
   # Créer la base de données
   CREATE DATABASE fleet_management_db;
   ```

5. **Générer le client Prisma et exécuter les migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

6. **Optionnel : Seeder la base de données**
   ```bash
   npm run db:seed
   ```

## 🚦 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📚 API Documentation

### Authentification

#### POST `/api/auth/login`
Connexion utilisateur
```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur
```json
{
  "email": "user@example.com",
  "password": "motdepasse",
  "nom": "Nom",
  "prenom": "Prénom",
  "telephone": "+241 01 23 45 67",
  "poste": "Chauffeur",
  "departement": "Transport",
  "dateEmbauche": "2024-01-01",
  "adresse": "Libreville, Gabon",
  "dateNaissance": "1990-01-01",
  "numeroEmploye": "EMP001"
}
```

#### GET `/api/auth/me`
Obtenir le profil utilisateur connecté
```
Authorization: Bearer <token>
```

### Véhicules

#### GET `/api/vehicles`
Liste tous les véhicules avec pagination et filtres
```
Query parameters:
- page: number (défaut: 1)
- limit: number (défaut: 10)
- status: string (optionnel)
- type: string (optionnel)
- search: string (optionnel)
```

#### GET `/api/vehicles/:id`
Obtenir un véhicule par ID

#### POST `/api/vehicles`
Créer un nouveau véhicule (Admin/Gestionnaire uniquement)

#### PUT `/api/vehicles/:id`
Mettre à jour un véhicule (Admin/Gestionnaire uniquement)

#### DELETE `/api/vehicles/:id`
Supprimer un véhicule (Admin uniquement)

### Utilisateurs

#### GET `/api/users`
Liste tous les utilisateurs (Admin/Gestionnaire uniquement)

#### POST `/api/users`
Créer un nouvel utilisateur (Admin uniquement)

### Carburant

#### GET `/api/fuel`
Liste tous les enregistrements de carburant

#### POST `/api/fuel`
Créer un enregistrement de carburant

### Maintenance

#### GET `/api/maintenance`
Liste tous les enregistrements de maintenance

### Violations

#### GET `/api/violations`
Liste toutes les violations

### GPS

#### GET `/api/gps`
Obtenir les données GPS récentes

### Documents

#### GET `/api/documents`
Liste tous les documents

### Rapports

#### GET `/api/reports/dashboard`
Obtenir les statistiques du tableau de bord

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

## 👥 Rôles et Permissions

- **ADMIN** : Accès total à toutes les fonctionnalités
- **GESTIONNAIRE** : Gestion des véhicules, utilisateurs et données
- **CONDUCTEUR** : Ajout d'enregistrements de carburant et consultation
- **UTILISATEUR** : Consultation uniquement

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── middleware/          # Middlewares Express
│   │   ├── auth.ts         # Authentification JWT
│   │   ├── errorHandler.ts # Gestion d'erreurs
│   │   └── notFound.ts     # 404 handler
│   ├── routes/             # Routes API
│   │   ├── auth.ts         # Authentification
│   │   ├── vehicles.ts     # Gestion véhicules
│   │   ├── users.ts        # Gestion utilisateurs
│   │   ├── fuel.ts         # Gestion carburant
│   │   ├── maintenance.ts  # Gestion maintenance
│   │   ├── violations.ts   # Gestion violations
│   │   ├── gps.ts          # Gestion GPS
│   │   ├── documents.ts    # Gestion documents
│   │   └── reports.ts      # Rapports et statistiques
│   └── server.ts           # Point d'entrée principal
├── prisma/
│   ├── schema.prisma       # Schéma de base de données
│   └── migrations/         # Migrations base de données
├── uploads/                # Fichiers uploadés
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Modèles de Données

### Utilisateur (User)
- Informations personnelles et professionnelles
- Rôles et permissions
- Authentification

### Véhicule (Vehicle)
- Informations techniques
- Statut et responsable
- Relations avec autres entités

### Enregistrement Carburant (FuelRecord)
- Consommation et coûts
- Station et conducteur

### Maintenance (MaintenanceRecord)
- Type et description
- Coûts et pièces
- Planning et statut

### Violation (Violation)
- Type et montant
- Conducteur et véhicule
- Statut de paiement

### GPS (GPSRecord)
- Position et vitesse
- Timestamp et statut

### Document (Document)
- Type et validité
- Métadonnées et stockage

## 🔧 Scripts Disponibles

- `npm run dev` : Démarre le serveur en mode développement
- `npm run build` : Compile le TypeScript
- `npm start` : Démarre le serveur en production
- `npm run db:generate` : Génère le client Prisma
- `npm run db:migrate` : Exécute les migrations
- `npm run db:seed` : Seed la base de données
- `npm test` : Lance les tests

## 🔐 Sécurité

- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Validation des entrées
- Limitation du taux de requêtes
- CORS configuré
- Headers de sécurité avec Helmet

## 📝 Variables d'Environnement

Toutes les variables sont documentées dans `.env.example`. Les principales :

- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Clé secrète pour JWT
- `PORT` : Port du serveur
- `CORS_ORIGINS` : Domaines autorisés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.