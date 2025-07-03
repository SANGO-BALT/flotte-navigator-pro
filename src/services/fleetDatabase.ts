
import { Vehicle, User, FuelRecord, MaintenanceRecord, Violation, GPSRecord, Document } from '@/types/fleet';

// Clés pour localStorage
const STORAGE_KEYS = {
  VEHICLES: 'fleet_vehicles',
  USERS: 'fleet_users',
  FUEL_RECORDS: 'fleet_fuel_records',
  MAINTENANCE_RECORDS: 'fleet_maintenance_records',
  VIOLATIONS: 'fleet_violations',
  GPS_RECORDS: 'fleet_gps_records',
  DOCUMENTS: 'fleet_documents'
};

// Données par défaut pour les véhicules
const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: '1',
    marque: 'Toyota',
    modele: 'Corolla',
    immatriculation: 'AB-123-CD',
    annee: 2020,
    type: 'voiture',
    statut: 'actif',
    kilometrage: 45000,
    dateAchat: '2020-03-15',
    prixAchat: 15000000,
    couleur: 'Blanc',
    carburant: 'essence',
    numeroSerie: 'TOY123456789',
    dateAssurance: '2024-12-31',
    dateVisite: '2024-08-15',
    responsable: 'Jean Obame'
  },
  {
    id: '2',
    marque: 'Peugeot',
    modele: '308',
    immatriculation: 'EF-456-GH',
    annee: 2019,
    type: 'voiture',
    statut: 'actif',
    kilometrage: 67000,
    dateAchat: '2019-06-20',
    prixAchat: 12000000,
    couleur: 'Noir',
    carburant: 'diesel',
    numeroSerie: 'PEU987654321',
    dateAssurance: '2024-11-30',
    dateVisite: '2024-09-10',
    responsable: 'Marie Mbourou'
  }
];

// Données par défaut pour les utilisateurs
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    nom: 'Obame',
    prenom: 'Jean',
    email: 'jean.obame@fleet.ga',
    telephone: '+241 01 23 45 67',
    poste: 'Chauffeur Principal',
    departement: 'Transport',
    role: 'conducteur',
    statut: 'actif',
    dateEmbauche: '2020-01-15',
    permis: ['B', 'C'],
    adresse: 'Libreville, Gabon',
    dateNaissance: '1985-05-10',
    numeroEmploye: 'EMP001'
  },
  {
    id: '2',
    nom: 'Mbourou',
    prenom: 'Marie',
    email: 'marie.mbourou@fleet.ga',
    telephone: '+241 07 89 12 34',
    poste: 'Gestionnaire de Flotte',
    departement: 'Administration',
    role: 'gestionnaire',
    statut: 'actif',
    dateEmbauche: '2019-03-20',
    permis: ['B'],
    adresse: 'Port-Gentil, Gabon',
    dateNaissance: '1990-08-15',
    numeroEmploye: 'EMP002'
  }
];

// Service de base de données pour la flotte
export class FleetDatabase {
  // Véhicules
  static getVehicles(): Vehicle[] {
    const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return stored ? JSON.parse(stored) : DEFAULT_VEHICLES;
  }

  static saveVehicles(vehicles: Vehicle[]): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }

  static addVehicle(vehicle: Vehicle): void {
    const vehicles = this.getVehicles();
    vehicles.push(vehicle);
    this.saveVehicles(vehicles);
  }

  static updateVehicle(id: string, updates: Partial<Vehicle>): void {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates };
      this.saveVehicles(vehicles);
    }
  }

  static deleteVehicle(id: string): void {
    const vehicles = this.getVehicles().filter(v => v.id !== id);
    this.saveVehicles(vehicles);
  }

  // Utilisateurs
  static getUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : DEFAULT_USERS;
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  static updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  static deleteUser(id: string): void {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
  }

  // Carburant
  static getFuelRecords(): FuelRecord[] {
    const stored = localStorage.getItem(STORAGE_KEYS.FUEL_RECORDS);
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        vehiculeId: '1',
        vehiclePlate: 'AB-123-CD',
        vehicleBrand: 'Toyota Corolla',
        date: '2024-07-01',
        fuelType: 'essence',
        quantity: 45,
        unitPrice: 750,
        totalCost: 33750,
        station: 'Total Station Centre',
        mileage: 85340
      }
    ];
  }

  static saveFuelRecords(records: FuelRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.FUEL_RECORDS, JSON.stringify(records));
  }

  static addFuelRecord(record: FuelRecord): void {
    const records = this.getFuelRecords();
    records.push(record);
    this.saveFuelRecords(records);
  }

  static updateFuelRecord(id: string, updates: Partial<FuelRecord>): void {
    const records = this.getFuelRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.saveFuelRecords(records);
    }
  }

  static deleteFuelRecord(id: string): void {
    const records = this.getFuelRecords().filter(r => r.id !== id);
    this.saveFuelRecords(records);
  }

  // Maintenance
  static getMaintenanceRecords(): MaintenanceRecord[] {
    const stored = localStorage.getItem(STORAGE_KEYS.MAINTENANCE_RECORDS);
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        vehiculeId: '1',
        vehiclePlate: 'AB-123-CD',
        vehicleBrand: 'Toyota Corolla',
        type: 'preventive',
        description: 'Vidange et révision',
        date: '2024-07-15',
        statut: 'terminé',
        cout: 75000,
        garage: 'Garage Central',
        pieces: ['Huile moteur', 'Filtre à huile'],
        kilometrage: 85000
      }
    ];
  }

  static saveMaintenanceRecords(records: MaintenanceRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, JSON.stringify(records));
  }

  static addMaintenanceRecord(record: MaintenanceRecord): void {
    const records = this.getMaintenanceRecords();
    records.push(record);
    this.saveMaintenanceRecords(records);
  }

  static updateMaintenanceRecord(id: string, updates: Partial<MaintenanceRecord>): void {
    const records = this.getMaintenanceRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.saveMaintenanceRecords(records);
    }
  }

  static deleteMaintenanceRecord(id: string): void {
    const records = this.getMaintenanceRecords().filter(r => r.id !== id);
    this.saveMaintenanceRecords(records);
  }

  // Violations
  static getViolations(): Violation[] {
    const stored = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
    return stored ? JSON.parse(stored) : [];
  }

  static saveViolations(violations: Violation[]): void {
    localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify(violations));
  }

  static addViolation(violation: Violation): void {
    const violations = this.getViolations();
    violations.push(violation);
    this.saveViolations(violations);
  }

  static updateViolation(id: string, updates: Partial<Violation>): void {
    const violations = this.getViolations();
    const index = violations.findIndex(v => v.id === id);
    if (index !== -1) {
      violations[index] = { ...violations[index], ...updates };
      this.saveViolations(violations);
    }
  }

  static deleteViolation(id: string): void {
    const violations = this.getViolations().filter(v => v.id !== id);
    this.saveViolations(violations);
  }

  // GPS
  static getGPSRecords(): GPSRecord[] {
    const stored = localStorage.getItem(STORAGE_KEYS.GPS_RECORDS);
    return stored ? JSON.parse(stored) : [];
  }

  static saveGPSRecords(records: GPSRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.GPS_RECORDS, JSON.stringify(records));
  }

  static addGPSRecord(record: GPSRecord): void {
    const records = this.getGPSRecords();
    records.push(record);
    this.saveGPSRecords(records);
  }

  // Documents
  static getDocuments(): Document[] {
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return stored ? JSON.parse(stored) : [];
  }

  static saveDocuments(documents: Document[]): void {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }

  static addDocument(document: Document): void {
    const documents = this.getDocuments();
    documents.push(document);
    this.saveDocuments(documents);
  }

  static updateDocument(id: string, updates: Partial<Document>): void {
    const documents = this.getDocuments();
    const index = documents.findIndex(d => d.id === id);
    if (index !== -1) {
      documents[index] = { ...documents[index], ...updates };
      this.saveDocuments(documents);
    }
  }

  static deleteDocument(id: string): void {
    const documents = this.getDocuments().filter(d => d.id !== id);
    this.saveDocuments(documents);
  }

  // Initialisation générale
  static initializeDatabase(): void {
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      this.saveVehicles(DEFAULT_VEHICLES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.saveUsers(DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FUEL_RECORDS)) {
      this.saveFuelRecords(this.getFuelRecords());
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAINTENANCE_RECORDS)) {
      this.saveMaintenanceRecords(this.getMaintenanceRecords());
    }
    if (!localStorage.getItem(STORAGE_KEYS.VIOLATIONS)) {
      this.saveViolations(this.getViolations());
    }
    if (!localStorage.getItem(STORAGE_KEYS.GPS_RECORDS)) {
      this.saveGPSRecords(this.getGPSRecords());
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      this.saveDocuments(this.getDocuments());
    }
  }

  // Utilitaires pour les relations
  static getVehicleById(id: string): Vehicle | undefined {
    return this.getVehicles().find(v => v.id === id);
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static getFuelRecordsByVehicle(vehiculeId: string): FuelRecord[] {
    return this.getFuelRecords().filter(r => r.vehiculeId === vehiculeId);
  }

  static getMaintenanceRecordsByVehicle(vehiculeId: string): MaintenanceRecord[] {
    return this.getMaintenanceRecords().filter(r => r.vehiculeId === vehiculeId);
  }

  static getViolationsByVehicle(vehiculeId: string): Violation[] {
    return this.getViolations().filter(v => v.vehiculeId === vehiculeId);
  }

  static getDocumentsByVehicle(vehiculeId: string): Document[] {
    return this.getDocuments().filter(d => d.vehiculeId === vehiculeId);
  }
}
