
// Types pour le module Véhicules
export interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  annee: number;
  type: 'voiture' | 'moto' | 'camion' | 'bus';
  statut: 'actif' | 'maintenance' | 'hors-service';
  kilometrage: number;
  dateAchat: string;
  prixAchat: number;
  couleur: string;
  carburant: 'essence' | 'diesel' | 'electrique' | 'hybride';
  numeroSerie: string;
  dateAssurance: string;
  dateVisite: string;
  responsable?: string;
  notes?: string;
}

// Types pour le module Utilisateurs
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  departement: string;
  role: 'admin' | 'gestionnaire' | 'conducteur' | 'utilisateur';
  statut: 'actif' | 'inactif' | 'suspendu';
  dateEmbauche: string;
  permis: string[];
  adresse: string;
  dateNaissance: string;
  numeroEmploye: string;
  salaire?: number;
  photo?: string;
}

// Types pour le module Carburant
export interface FuelRecord {
  id: string;
  vehiculeId: string;
  vehiclePlate: string;
  vehicleBrand: string;
  date: string;
  fuelType: 'essence' | 'diesel';
  quantity: number;
  unitPrice: number;
  totalCost: number;
  station: string;
  mileage: number;
  conducteur?: string;
  facture?: string;
  notes?: string;
}

// Types pour le module Maintenance
export interface MaintenanceRecord {
  id: string;
  vehiculeId: string;
  vehiclePlate: string;
  vehicleBrand: string;
  type: 'preventive' | 'corrective' | 'urgence';
  description: string;
  date: string;
  datePrevu?: string;
  statut: 'programmé' | 'en-cours' | 'terminé' | 'reporté';
  cout: number;
  garage: string;
  pieces: string[];
  kilometrage: number;
  technicien?: string;
  duree?: string;
  garantie?: string;
  facture?: string;
  notes?: string;
}

// Types pour le module Violations
export interface Violation {
  id: string;
  vehiculeId: string;
  vehiclePlate: string;
  conducteurId: string;
  conducteurNom: string;
  type: 'exces-vitesse' | 'stationnement' | 'feu-rouge' | 'autre';
  description: string;
  date: string;
  lieu: string;
  montant: number;
  statut: 'en-attente' | 'payé' | 'contesté' | 'annulé';
  numeroContravention: string;
  dateEcheance?: string;
  datePaiement?: string;
  points?: number;
  tribunalCompetent?: string;
  notes?: string;
}

// Types pour le module GPS
export interface GPSRecord {
  id: string;
  vehiculeId: string;
  vehiclePlate: string;
  latitude: number;
  longitude: number;
  vitesse: number;
  direction: number;
  timestamp: string;
  adresse?: string;
  conducteur?: string;
  statut: 'en-mouvement' | 'arrete' | 'parking';
  kilometrage?: number;
  carburant?: number;
  temperature?: number;
}

// Types pour le module Documents
export interface Document {
  id: string;
  nom: string;
  type: 'assurance' | 'permis' | 'carte-grise' | 'facture' | 'contrat' | 'autre';
  vehiculeId?: string;
  utilisateurId?: string;
  dateCreation: string;
  dateExpiration?: string;
  taille: number;
  format: string;
  chemin: string;
  statut: 'valide' | 'expire' | 'en-attente' | 'rejete';
  description?: string;
  tags?: string[];
  version: number;
}
