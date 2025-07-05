# 🔄 Guide d'Utilisation - Backend vs Frontend

## ✅ Problème Résolu !

L'erreur `"Route / non trouvée"` est **normale** ! Voici pourquoi et comment bien utiliser le système.

## 🏗️ Architecture du Système

```
📦 Système de Gestion de Flotte
├── 🔧 BACKEND (API) - Port 5000
│   ├── Routes API : /api/*
│   ├── Authentification : /api/auth
│   └── Données : Base de données
│
└── 🎨 FRONTEND (Interface) - Port 5173
    ├── Interface utilisateur
    ├── Pages web
    └── Se connecte au backend
```

## 🎯 Ce Que Vous Avez Fait

✅ **Vous avez démarré le BACKEND** avec `npm run dev`
❌ **Vous avez essayé d'accéder à l'interface web** (qui n'existe pas sur le backend)

## 🚀 Utilisation Correcte

### **1. Backend API (Port 5000)**

**Ce que vous avez actuellement démarré :**

```bash
cd backend
npm run dev
```

**URLs Backend :**
- 📊 **Documentation API** : http://localhost:5000/
- 🏥 **Health Check** : http://localhost:5000/health  
- 🔐 **Auth API** : http://localhost:5000/api/auth
- 🚗 **Vehicles API** : http://localhost:5000/api/vehicles

### **2. Frontend Interface (Port 5173)**

**Ce qu'il faut démarrer SÉPARÉMENT :**

```bash
# Dans un NOUVEAU terminal, dossier racine
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

**URL Frontend :**
- 🎨 **Interface Web** : http://localhost:5173/

## 🧪 Tests Immédiats

### **✅ Tester le Backend (ce qui marche déjà)**

```bash
# Documentation complète de l'API
curl http://localhost:5000/

# Health check
curl http://localhost:5000/health

# Test d'inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@exemple.com",
    "password": "password123",
    "nom": "Test",
    "prenom": "User",
    "telephone": "+241123456789",
    "poste": "Testeur",
    "departement": "IT",
    "dateEmbauche": "2024-01-01",
    "adresse": "Libreville",
    "dateNaissance": "1990-01-01",
    "numeroEmploye": "TEST001"
  }'
```

### **⏭️ Démarrer le Frontend**

```bash
# Terminal 2 (nouveau)
cd .. # Retour au dossier racine
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm install  # Si pas fait
npm run dev  # Démarre sur port 5173
```

## 🌐 URLs Complètes

| Service | URL | Status | Utilisation |
|---------|-----|---------|-------------|
| **Backend API** | http://localhost:5000 | ✅ Actif | API/Données |
| **Health Check** | http://localhost:5000/health | ✅ Actif | Monitoring |
| **API Auth** | http://localhost:5000/api/auth | ✅ Actif | Authentification |
| **Frontend UI** | http://localhost:5173 | ⏭️ À démarrer | Interface Web |

## 📱 Réponse Actuelle du Backend

Maintenant quand vous allez sur http://localhost:5000, vous verrez :

```json
{
  "success": true,
  "message": "API Fleet Management - Backend",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "api": "/api",
    "auth": "/api/auth",
    "vehicles": "/api/vehicles",
    "users": "/api/users",
    "fuel": "/api/fuel",
    "maintenance": "/api/maintenance",
    "violations": "/api/violations",
    "gps": "/api/gps",
    "documents": "/api/documents",
    "reports": "/api/reports"
  },
  "frontend": "http://localhost:5173",
  "documentation": "Consultez le README.md pour plus d'informations"
}
```

## 🔄 Workflow Complet

### **Terminal 1 : Backend** (déjà fait ✅)
```bash
cd backend
npm run dev

# Console affiche :
# 🚀 Serveur démarré sur le port 5000
# 🌍 Environnement: development
# 📊 Health check: http://localhost:5000/health
# 🔗 API Documentation: http://localhost:5000/
# 🎨 Frontend: http://localhost:5173 (à démarrer séparément)
```

### **Terminal 2 : Frontend** (à faire ⏭️)
```bash
# Retour dossier racine
cd ..

# Configuration API
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Démarrage
npm install
npm run dev

# Console affiche :
# ➜  Local:   http://localhost:5173/
```

## 🎯 Ce Qui Va Se Passer

1. **✅ Backend** (Port 5000) : API fonctionnelle
2. **⏭️ Frontend** (Port 5173) : Interface web
3. **🔗 Connexion** : Frontend → Backend via API

## 🚀 Commande Rapide

```bash
# Backend (déjà démarré ✅)
# cd backend && npm run dev

# Frontend (nouveau terminal)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local && npm run dev
```

## 📞 Résumé

- ✅ **Backend fonctionne** sur http://localhost:5000
- ⏭️ **Démarrer frontend** sur http://localhost:5173  
- 🔗 **Frontend utilisera** le backend automatiquement
- 🎨 **Interface web** sera sur port 5173

**L'erreur était normale - vous regardiez le bon endroit au mauvais moment !** 😄