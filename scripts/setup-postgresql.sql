
-- Script d'installation de la base de données PostgreSQL pour le système de gestion de flotte
-- Exécuter ce script après avoir créé la base de données 'fleet_management'

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    poste VARCHAR(100),
    departement VARCHAR(100),
    role VARCHAR(50) CHECK (role IN ('administrateur', 'gestionnaire', 'conducteur', 'mecanicien')) NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('actif', 'inactif', 'suspendu')) DEFAULT 'actif',
    date_embauche DATE,
    permis TEXT[], -- Array des types de permis
    adresse TEXT,
    date_naissance DATE,
    numero_employe VARCHAR(50) UNIQUE,
    mot_de_passe_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des véhicules
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marque VARCHAR(100) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    immatriculation VARCHAR(50) UNIQUE NOT NULL,
    annee INTEGER,
    type VARCHAR(50) CHECK (type IN ('voiture', 'camion', 'bus', 'moto', 'utilitaire')) NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('actif', 'inactif', 'maintenance', 'accidente')) DEFAULT 'actif',
    kilometrage INTEGER DEFAULT 0,
    date_achat DATE,
    prix_achat DECIMAL(15,2),
    couleur VARCHAR(50),
    carburant VARCHAR(20) CHECK (carburant IN ('essence', 'diesel', 'hybride', 'electrique')),
    numero_serie VARCHAR(100),
    date_assurance DATE,
    date_visite DATE,
    responsable_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des enregistrements de carburant
CREATE TABLE fuel_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    station VARCHAR(255),
    mileage INTEGER,
    receipt_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des enregistrements de maintenance
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) CHECK (type IN ('preventive', 'corrective', 'revision', 'reparation')) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('programme', 'en-cours', 'termine', 'annule')) DEFAULT 'programme',
    cout DECIMAL(15,2),
    garage VARCHAR(255),
    pieces TEXT[], -- Array des pièces utilisées
    kilometrage INTEGER,
    next_maintenance_date DATE,
    next_maintenance_km INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des contraventions
CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(255),
    amount DECIMAL(10,2),
    statut VARCHAR(20) CHECK (statut IN ('en-attente', 'paye', 'conteste', 'annule')) DEFAULT 'en-attente',
    reference_number VARCHAR(100),
    due_date DATE,
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des enregistrements GPS
CREATE TABLE gps_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(5,2),
    heading INTEGER, -- Direction en degrés
    altitude DECIMAL(10,2),
    timestamp TIMESTAMP NOT NULL,
    address TEXT,
    geofence VARCHAR(255), -- Zone géographique
    event_type VARCHAR(50), -- start, stop, speeding, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- assurance, visite, permis, etc.
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    expiry_date DATE,
    statut VARCHAR(20) CHECK (statut IN ('valide', 'expire', 'bientot-expire')) DEFAULT 'valide',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des voyages (pour le module TRAVEGAB)
CREATE TABLE voyages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID REFERENCES users(id),
    depart VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    heure TIME NOT NULL,
    capacite INTEGER NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('programme', 'en-cours', 'termine', 'annule')) DEFAULT 'programme',
    distance_km INTEGER,
    duree_prevue INTERVAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des passagers
CREATE TABLE passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    date_naissance DATE,
    piece_identite VARCHAR(100),
    adresse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voyage_id UUID NOT NULL REFERENCES voyages(id) ON DELETE CASCADE,
    passenger_id UUID NOT NULL REFERENCES passengers(id),
    numero_ticket VARCHAR(50) UNIQUE NOT NULL,
    siege VARCHAR(10),
    montant DECIMAL(10,2) NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('reserve', 'confirme', 'paye', 'annule')) DEFAULT 'reserve',
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_paiement TIMESTAMP,
    mode_paiement VARCHAR(50),
    notes TEXT
);

-- Table des itinéraires
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    depart VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance INTEGER, -- en kilomètres
    duree INTERVAL, -- durée estimée
    prix DECIMAL(10,2) NOT NULL,
    actif BOOLEAN DEFAULT true,
    stops TEXT[], -- Array des arrêts intermédiaires
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paramètres système
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_vehicles_statut ON vehicles(statut);
CREATE INDEX idx_vehicles_immatriculation ON vehicles(immatriculation);
CREATE INDEX idx_fuel_records_vehicle_date ON fuel_records(vehicle_id, date);
CREATE INDEX idx_maintenance_vehicle_date ON maintenance_records(vehicle_id, date);
CREATE INDEX idx_violations_vehicle_date ON violations(vehicle_id, date);
CREATE INDEX idx_gps_vehicle_timestamp ON gps_records(vehicle_id, timestamp);
CREATE INDEX idx_voyages_date ON voyages(date);
CREATE INDEX idx_reservations_voyage ON reservations(voyage_id);

-- Fonctions de mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour la mise à jour automatique
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_violations_updated_at BEFORE UPDATE ON violations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voyages_updated_at BEFORE UPDATE ON voyages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des paramètres par défaut
INSERT INTO system_settings (key, value, description, category) VALUES
('company_name', 'Système de Gestion de Flotte', 'Nom de l''entreprise', 'general'),
('company_address', 'Libreville, Gabon', 'Adresse de l''entreprise', 'general'),
('company_phone', '+241 01 23 45 67', 'Téléphone de l''entreprise', 'general'),
('company_email', 'contact@fleet.ga', 'Email de l''entreprise', 'general'),
('default_currency', 'FCFA', 'Devise par défaut', 'general'),
('default_language', 'fr', 'Langue par défaut', 'general'),
('session_timeout', '60', 'Durée de session en minutes', 'security'),
('password_expiry', '90', 'Expiration mot de passe en jours', 'security'),
('auto_backup', 'true', 'Sauvegarde automatique', 'system'),
('backup_frequency', 'daily', 'Fréquence de sauvegarde', 'system');

-- Insertion des données d'exemple
INSERT INTO users (nom, prenom, email, telephone, poste, departement, role, date_embauche, permis, numero_employe) VALUES
('Admin', 'Système', 'admin@fleet.ga', '+241 01 00 00 00', 'Administrateur', 'Administration', 'administrateur', '2024-01-01', ARRAY['B'], 'ADMIN001'),
('Obame', 'Jean', 'jean.obame@fleet.ga', '+241 01 23 45 67', 'Chauffeur Principal', 'Transport', 'conducteur', '2020-01-15', ARRAY['B', 'C'], 'EMP001'),
('Mbourou', 'Marie', 'marie.mbourou@fleet.ga', '+241 07 89 12 34', 'Gestionnaire de Flotte', 'Administration', 'gestionnaire', '2019-03-20', ARRAY['B'], 'EMP002');

-- Récupérer les IDs des utilisateurs pour les véhicules
INSERT INTO vehicles (marque, modele, immatriculation, annee, type, kilometrage, date_achat, prix_achat, couleur, carburant, numero_serie, date_assurance, date_visite, responsable_id) 
SELECT 'Toyota', 'Corolla', 'AB-123-CD', 2020, 'voiture', 45000, '2020-03-15', 15000000, 'Blanc', 'essence', 'TOY123456789', '2024-12-31', '2024-08-15', u.id
FROM users u WHERE u.numero_employe = 'EMP001'
UNION ALL
SELECT 'Peugeot', '308', 'EF-456-GH', 2019, 'voiture', 67000, '2019-06-20', 12000000, 'Noir', 'diesel', 'PEU987654321', '2024-11-30', '2024-09-10', u.id
FROM users u WHERE u.numero_employe = 'EMP002';

-- Vue pour les statistiques
CREATE VIEW vehicle_stats AS
SELECT 
    v.id,
    v.immatriculation,
    v.marque,
    v.modele,
    v.statut,
    COALESCE(SUM(f.total_cost), 0) as total_fuel_cost,
    COALESCE(SUM(m.cout), 0) as total_maintenance_cost,
    COALESCE(SUM(viol.amount), 0) as total_violations_cost,
    COUNT(DISTINCT f.id) as fuel_records_count,
    COUNT(DISTINCT m.id) as maintenance_records_count,
    COUNT(DISTINCT viol.id) as violations_count
FROM vehicles v
LEFT JOIN fuel_records f ON v.id = f.vehicle_id
LEFT JOIN maintenance_records m ON v.id = m.vehicle_id
LEFT JOIN violations viol ON v.id = viol.vehicle_id
GROUP BY v.id, v.immatriculation, v.marque, v.modele, v.statut;

COMMENT ON DATABASE fleet_management IS 'Base de données pour le système de gestion de flotte de véhicules';

-- Afficher le résumé de l'installation
SELECT 'Installation terminée avec succès!' as message;
SELECT 'Tables créées: ' || count(*) as tables_count FROM information_schema.tables WHERE table_schema = 'public';
SELECT 'Utilisateurs créés: ' || count(*) as users_count FROM users;
SELECT 'Véhicules créés: ' || count(*) as vehicles_count FROM vehicles;
