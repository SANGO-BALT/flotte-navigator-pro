# 🎨 Commandes Installation Frontend

## ✅ Prérequis

Le **backend est maintenant fonctionnel** ! L'erreur de build a été résolue.

- ✅ Backend : Port 5000 (**opérationnel**)
- ⏭️ Frontend : Port 5173 (**à configurer**)

## 🚀 Installation Complète Frontend

### **1. Vérification des dépendances**
```bash
# Depuis le dossier racine (frontend)
npm install
```

### **2. Configuration API Backend**
```bash
# Créer le fichier de configuration
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Vérifier la création
cat .env.local
```

**Contenu attendu :**
```env
VITE_API_URL=http://localhost:5000/api
```

### **3. Démarrage Frontend**
```bash
npm run dev
```

**✅ Résultat attendu :**
```
  VITE v5.4.1  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🔄 Workflow Complet (Backend + Frontend)

### **Terminal 1 : Backend**
```bash
cd backend
npm run dev

# ✅ Serveur démarré sur le port 5000
# ✅ Environnement: development
# ✅ Health check: http://localhost:5000/health
```

### **Terminal 2 : Frontend**
```bash
# Retour au dossier racine
cd ../

# Configuration API (une seule fois)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Démarrage frontend
npm run dev

# ✅ Local: http://localhost:5173/
```

## 🧪 Tests de Connexion

### **1. Test Backend seul**
```bash
curl http://localhost:5000/health
```

**Réponse :**
```json
{
  "status": "OK",
  "timestamp": "2024-07-05T11:02:30.123Z",
  "environment": "development"
}
```

### **2. Test Frontend**
Ouvrir dans le navigateur : `http://localhost:5173`

### **3. Test Intégration**
1. Aller sur http://localhost:5173
2. Naviguer vers la page de connexion
3. Tenter une inscription/connexion
4. Vérifier que l'API backend répond

## 📱 Configuration Frontend Avancée

### **Variables d'environnement complètes**
```bash
cat > .env.local << EOF
# Configuration API Backend
VITE_API_URL=http://localhost:5000/api

# Configuration App
VITE_APP_NAME="Gestion de Flotte"
VITE_APP_VERSION="1.0.0"

# Debug (optionnel)
VITE_DEBUG=true
EOF
```

### **Vérification de la configuration**
```bash
# Vérifier les variables
cat .env.local

# Vérifier que Vite les charge
npm run dev
# Les variables VITE_* seront disponibles dans import.meta.env
```

## 🛠️ Scripts Frontend Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prévisualiser build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔧 Dépannage Frontend

### **Problème 1 : Erreur de connexion API**
```bash
# Vérifier que le backend tourne
curl http://localhost:5000/health

# Vérifier la configuration
cat .env.local

# Redémarrer le frontend
npm run dev
```

### **Problème 2 : Port déjà utilisé**
```bash
# Utiliser un autre port
npm run dev -- --port 3001

# Ou modifier la config dans vite.config.ts
```

### **Problème 3 : Modules manquants**
```bash
# Réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Problème 4 : Erreurs TypeScript**
```bash
# Check types
npm run type-check

# Build test
npm run build
```

## 🌐 URLs Complètes

| Service | URL | Status |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | ⏭️ À démarrer |
| **Backend API** | http://localhost:5000/api | ✅ Fonctionnel |
| **Health Check** | http://localhost:5000/health | ✅ Fonctionnel |

## 🔗 Configuration API Service

Le fichier `src/services/apiService.ts` est déjà configuré pour utiliser :
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## 🎯 Étapes Suivantes

1. **✅ Backend fonctionnel** (Port 5000)
2. **⏭️ Configurer le frontend** (Commands ci-dessus)
3. **⏭️ Tester l'authentification** complète
4. **⏭️ Naviguer dans l'interface**

## 📞 Aide

Si problèmes :

1. **Vérifier les logs** dans les deux terminaux
2. **Vérifier les réseaux** : Backend (5000) et Frontend (5173)
3. **Tester les endpoints** avec curl
4. **Consulter la console navigateur** (F12)

---

## 🚀 Commande Rapide

```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2) 
echo "VITE_API_URL=http://localhost:5000/api" > .env.local && npm run dev
```

**🎉 Système complet opérationnel !** 🎉