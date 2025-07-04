// User types
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste?: string;
  departement?: string;
  role: 'administrateur' | 'gestionnaire' | 'conducteur' | 'mecanicien';
  statut: 'actif' | 'inactif' | 'suspendu';
  date_embauche?: Date;
  permis?: string[];
  adresse?: string;
  date_naissance?: Date;
  numero_employe?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  poste?: string;
  departement?: string;
  role: 'administrateur' | 'gestionnaire' | 'conducteur' | 'mecanicien';
  date_embauche?: string;
  permis?: string[];
  adresse?: string;
  date_naissance?: string;
  numero_employe?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Vehicle types
export interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  annee?: number;
  type: 'voiture' | 'camion' | 'bus' | 'moto' | 'utilitaire';
  statut: 'actif' | 'inactif' | 'maintenance' | 'accidente';
  kilometrage: number;
  date_achat?: Date;
  prix_achat?: number;
  couleur?: string;
  carburant?: 'essence' | 'diesel' | 'hybride' | 'electrique';
  numero_serie?: string;
  date_assurance?: Date;
  date_visite?: Date;
  responsable_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Fuel types
export interface FuelRecord {
  id: string;
  vehicle_id: string;
  user_id?: string;
  date: Date;
  fuel_type: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  station?: string;
  mileage?: number;
  receipt_number?: string;
  notes?: string;
  created_at: Date;
}

// Maintenance types
export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  user_id?: string;
  type: 'preventive' | 'corrective' | 'revision' | 'reparation';
  description: string;
  date: Date;
  statut: 'programme' | 'en-cours' | 'termine' | 'annule';
  cout?: number;
  garage?: string;
  pieces?: string[];
  kilometrage?: number;
  next_maintenance_date?: Date;
  next_maintenance_km?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Violation types
export interface Violation {
  id: string;
  vehicle_id: string;
  driver_id?: string;
  type: string;
  description?: string;
  date: Date;
  location?: string;
  amount?: number;
  statut: 'en-attente' | 'paye' | 'conteste' | 'annule';
  reference_number?: string;
  due_date?: Date;
  paid_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// GPS types
export interface GPSRecord {
  id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  timestamp: Date;
  address?: string;
  geofence?: string;
  event_type?: string;
  created_at: Date;
}

// Document types
export interface Document {
  id: string;
  vehicle_id?: string;
  user_id?: string;
  type: string;
  nom: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  expiry_date?: Date;
  statut: 'valide' | 'expire' | 'bientot-expire';
  created_at: Date;
  updated_at: Date;
}

// TRAVEGAB types
export interface Voyage {
  id: string;
  vehicle_id: string;
  driver_id?: string;
  depart: string;
  destination: string;
  date: Date;
  heure: string;
  capacite: number;
  prix: number;
  statut: 'programme' | 'en-cours' | 'termine' | 'annule';
  distance_km?: number;
  duree_prevue?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Passenger {
  id: string;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  date_naissance?: Date;
  piece_identite?: string;
  adresse?: string;
  created_at: Date;
}

export interface Reservation {
  id: string;
  voyage_id: string;
  passenger_id: string;
  numero_ticket: string;
  siege?: string;
  montant: number;
  statut: 'reserve' | 'confirme' | 'paye' | 'annule';
  date_reservation: Date;
  date_paiement?: Date;
  mode_paiement?: string;
  notes?: string;
}

export interface Itinerary {
  id: string;
  nom: string;
  depart: string;
  destination: string;
  distance?: number;
  duree?: string;
  prix: number;
  actif: boolean;
  stops?: string[];
  created_at: Date;
  updated_at: Date;
}

// System settings
export interface SystemSetting {
  id: string;
  key: string;
  value?: string;
  description?: string;
  category?: string;
  created_at: Date;
  updated_at: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface AuthResponse {
  user: Omit<User, 'mot_de_passe_hash'>;
  token: string;
}