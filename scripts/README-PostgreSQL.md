
# Installation de la base de données PostgreSQL pour le système de gestion de flotte

## Prérequis

1. PostgreSQL 12+ installé sur votre système
2. Accès administrateur à PostgreSQL
3. Client PostgreSQL (psql, pgAdmin, ou autre)

## Instructions d'installation

### 1. Créer la base de données

Connectez-vous à PostgreSQL en tant qu'administrateur et créez la base de données :

```sql
-- Se connecter en tant que postgres
psql -U postgres

-- Créer la base de données
CREATE DATABASE fleet_management;

-- Créer un utilisateur dédié (optionnel mais recommandé)
CREATE USER fleet_user WITH PASSWORD 'your_secure_password';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE fleet_management TO fleet_user;

-- Se connecter à la nouvelle base de données
\c fleet_management;

-- Accorder les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO fleet_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fleet_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fleet_user;

-- Pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fleet_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fleet_user;
```

### 2. Exécuter le script d'installation

```bash
# Depuis le terminal, exécuter le script SQL
psql -U postgres -d fleet_management -f setup-postgresql.sql

# Ou si vous utilisez l'utilisateur fleet_user
psql -U fleet_user -d fleet_management -f setup-postgresql.sql
```

### 3. Vérifier l'installation

```sql
-- Se connecter à la base de données
psql -U fleet_user -d fleet_management

-- Vérifier les tables créées
\dt

-- Vérifier les données d'exemple
SELECT * FROM users;
SELECT * FROM vehicles;
SELECT * FROM system_settings;

-- Vérifier les vues
\dv

-- Tester la vue des statistiques
SELECT * FROM vehicle_stats;
```

## Configuration de l'application

### 1. Variables d'environnement

Créez un fichier `.env.local` dans votre projet avec :

```env
VITE_DATABASE_URL=postgresql://fleet_user:your_secure_password@localhost:5432/fleet_management
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Fleet Management System
```

### 2. Structure de la base de données

La base de données comprend les tables principales suivantes :

- **users** : Utilisateurs du système
- **vehicles** : Véhicules de la flotte
- **fuel_records** : Enregistrements de carburant
- **maintenance_records** : Enregistrements de maintenance
- **violations** : Contraventions
- **gps_records** : Données GPS
- **documents** : Documents associés
- **voyages** : Voyages (module TRAVEGAB)
- **passengers** : Passagers
- **reservations** : Réservations
- **itineraries** : Itinéraires
- **system_settings** : Paramètres système

### 3. Fonctionnalités incluses

- **UUID automatiques** pour tous les identifiants
- **Timestamps automatiques** (created_at, updated_at)
- **Contraintes de validation** sur les statuts et types
- **Index optimisés** pour les requêtes fréquentes
- **Vue des statistiques** (vehicle_stats)
- **Données d'exemple** pour démarrer rapidement

## Maintenance

### Sauvegarde

```bash
# Sauvegarde complète
pg_dump -U fleet_user -h localhost fleet_management > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde des données uniquement
pg_dump -U fleet_user -h localhost --data-only fleet_management > data_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauration

```bash
# Restaurer depuis une sauvegarde
psql -U fleet_user -d fleet_management < backup_file.sql
```

### Mise à jour

Pour mettre à jour la structure, créez des scripts de migration :

```sql
-- Exemple de migration
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS new_field VARCHAR(100);
```

## Sécurité

1. **Changez le mot de passe par défaut** dans les variables d'environnement
2. **Configurez SSL** pour les connexions en production
3. **Limitez l'accès réseau** à la base de données
4. **Sauvegardez régulièrement** vos données
5. **Monitorez les accès** et les performances

## Support et dépannage

### Problèmes courants

1. **Erreur de connexion** : Vérifiez les paramètres de connexion dans `.env`
2. **Permissions insuffisantes** : Vérifiez les privilèges utilisateur
3. **Tables manquantes** : Réexécutez le script d'installation

### Logs

```bash
# Consulter les logs PostgreSQL
tail -f /var/log/postgresql/postgresql-*.log

# Ou sur certains systèmes
journalctl -u postgresql -f
```

### Commandes utiles

```sql
-- Voir les connexions actives
SELECT * FROM pg_stat_activity WHERE datname = 'fleet_management';

-- Voir la taille de la base de données
SELECT pg_size_pretty(pg_database_size('fleet_management'));

-- Voir les statistiques des tables
SELECT schemaname,tablename,n_tup_ins,n_tup_upd,n_tup_del FROM pg_stat_user_tables;
```

## Contact

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.
