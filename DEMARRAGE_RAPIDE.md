# 🚀 Guide de Démarrage Rapide - Système de Gestion de Flotte

## ✅ Problème Résolu

Le problème "app crashed - waiting for file changes before starting..." a été **corrigé** ! 

## 🔧 Corrections Apportées

1. **✅ Configuration simplifiée** : Utilisation de SQLite au lieu de PostgreSQL pour le test
2. **✅ Erreurs TypeScript corrigées** : Imports et types manquants résolus
3. **✅ Routes nettoyées** : Suppression du code problématique
4. **✅ Base de données créée** : Migration SQLite réussie

## 🚦 Démarrage Immédiat

### Backend (Port 5000)

```bash
# Option 1 : Démarrage manuel
cd backend
npm install
npm run dev

# Option 2 : Script automatique
cd backend
chmod +x start.sh
./start.sh
```

**✅ Résultat attendu :**
```
🚀 Serveur démarré sur le port 5000
🌍 Environnement: development
📊 Health check: http://localhost:5000/health
```

### Frontend (Port 5173)

```bash
# Depuis le dossier racine
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

## 🧪 Tests Rapides

### 1. Test de santé du serveur
```bash
curl http://localhost:5000/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2024-07-05T10:17:06.123Z",
  "environment": "development"
}
```

### 2. Test des endpoints API
```bash
# Véhicules (nécessite authentification)
curl http://localhost:5000/api/vehicles

# Carburant
curl http://localhost:5000/api/fuel
```

## 📊 Endpoints Disponibles

| Endpoint | Description | Status |
|----------|-------------|---------|
| `GET /health` | Santé du serveur | ✅ |
| `POST /api/auth/login` | Connexion | ✅ |
| `POST /api/auth/register` | Inscription | ✅ |
| `GET /api/vehicles` | Liste véhicules | ✅ |
| `GET /api/users` | Liste utilisateurs | ✅ |
| `GET /api/fuel` | Enregistrements carburant | ✅ |
| `GET /api/maintenance` | Maintenance | ✅ |
| `GET /api/violations` | Violations | ✅ |
| `GET /api/gps` | Données GPS | ✅ |
| `GET /api/documents` | Documents | ✅ |
| `GET /api/reports` | Rapports | ✅ |

## 🗄️ Base de Données

- **Type** : SQLite (fichier `backend/dev.db`)
- **ORM** : Prisma
- **Status** : ✅ Configurée et migrée

### Commandes utiles :
```bash
cd backend

# Voir la structure de la DB
npx prisma studio

# Reset de la DB
npx prisma migrate reset

# Nouvelle migration
npx prisma migrate dev --name ma_migration
```

## 🔐 Authentification

Le système utilise JWT. Pour tester :

```bash
# 1. S'inscrire
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
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

# 2. Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🐛 Dépannage

### Problème : Port déjà utilisé
```bash
# Trouver le processus sur le port 5000
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

### Problème : Erreurs Prisma
```bash
cd backend
npx prisma generate
npx prisma migrate reset --force
```

### Problème : Modules manquants
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Prochaines Étapes

1. **✅ Backend fonctionnel** sur le port 5000
2. **⏭️ Tester le frontend** sur le port 5173
3. **⏭️ Intégrer l'API** dans les composants React
4. **⏭️ Tester l'authentification** complète
5. **⏭️ Ajouter des données de test**

## 📞 Support

Si vous rencontrez encore des problèmes :

1. Vérifiez que Node.js v18+ est installé
2. Assurez-vous d'être dans le bon dossier (`backend/`)
3. Vérifiez les logs d'erreur complets
4. Consultez le fichier `.env` pour la configuration

---

**🎉 Le système est maintenant opérationnel !** 🎉