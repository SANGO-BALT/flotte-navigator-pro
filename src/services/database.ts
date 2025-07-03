
import { Vehicle, Voyage, Passenger, Reservation, Itinerary } from '@/types/travegab';

// Clés pour localStorage
const STORAGE_KEYS = {
  VEHICLES: 'travegab_vehicles',
  VOYAGES: 'travegab_voyages',
  PASSENGERS: 'travegab_passengers',
  RESERVATIONS: 'travegab_reservations',
  ITINERARIES: 'travegab_itineraries'
};

// Données initiales par défaut
const DEFAULT_VEHICLES: Vehicle[] = [
  { id: 'BUS-001-GA', nom: 'Bus Mercedes 35 places', capacite: 35, statut: 'disponible' },
  { id: 'BUS-002-GA', nom: 'Bus Toyota 30 places', capacite: 30, statut: 'disponible' },
  { id: 'BUS-003-GA', nom: 'Bus Isuzu 25 places', capacite: 25, statut: 'disponible' },
  { id: 'VAN-001-GA', nom: 'Van Toyota Hiace', capacite: 12, statut: 'disponible' }
];

const DEFAULT_VOYAGES: Voyage[] = [
  {
    id: '1',
    vehicule: 'BUS-001-GA',
    depart: 'Libreville',
    destination: 'Port-Gentil',
    date: '2024-07-15',
    heure: '08:00',
    passagers: 28,
    capacite: 35,
    statut: 'confirmé',
    prix: 15000
  },
  {
    id: '2',
    vehicule: 'BUS-002-GA',
    depart: 'Libreville',
    destination: 'Franceville',
    date: '2024-07-16',
    heure: '06:30',
    passagers: 22,
    capacite: 30,
    statut: 'en-cours',
    prix: 25000
  },
  {
    id: '3',
    vehicule: 'BUS-003-GA',
    depart: 'Port-Gentil',
    destination: 'Lambaréné',
    date: '2024-07-17',
    heure: '14:00',
    passagers: 15,
    capacite: 25,
    statut: 'programmé',
    prix: 12000
  }
];

// Service de base de données
export class TravegabDatabase {
  // Véhicules
  static getVehicles(): Vehicle[] {
    const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return stored ? JSON.parse(stored) : DEFAULT_VEHICLES;
  }

  static saveVehicles(vehicles: Vehicle[]): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }

  // Voyages
  static getVoyages(): Voyage[] {
    const stored = localStorage.getItem(STORAGE_KEYS.VOYAGES);
    return stored ? JSON.parse(stored) : DEFAULT_VOYAGES;
  }

  static saveVoyages(voyages: Voyage[]): void {
    localStorage.setItem(STORAGE_KEYS.VOYAGES, JSON.stringify(voyages));
  }

  static addVoyage(voyage: Voyage): void {
    const voyages = this.getVoyages();
    voyages.push(voyage);
    this.saveVoyages(voyages);
  }

  static updateVoyage(id: string, updates: Partial<Voyage>): void {
    const voyages = this.getVoyages();
    const index = voyages.findIndex(v => v.id === id);
    if (index !== -1) {
      voyages[index] = { ...voyages[index], ...updates };
      this.saveVoyages(voyages);
    }
  }

  static deleteVoyage(id: string): void {
    const voyages = this.getVoyages().filter(v => v.id !== id);
    this.saveVoyages(voyages);
  }

  // Passagers
  static getPassengers(): Passenger[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PASSENGERS);
    return stored ? JSON.parse(stored) : [
      { id: '1', nom: 'Mbourou', prenom: 'Marie', telephone: '+241 01 23 45 67', email: 'marie.mbourou@email.ga' },
      { id: '2', nom: 'Obame', prenom: 'Jean', telephone: '+241 07 89 12 34', email: 'jean.obame@email.ga' },
      { id: '3', nom: 'Nguema', prenom: 'Paul', telephone: '+241 06 55 44 33', email: 'paul.nguema@email.ga' }
    ];
  }

  static savePassengers(passengers: Passenger[]): void {
    localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(passengers));
  }

  static addPassenger(passenger: Passenger): void {
    const passengers = this.getPassengers();
    passengers.push(passenger);
    this.savePassengers(passengers);
  }

  static updatePassenger(id: string, updates: Partial<Passenger>): void {
    const passengers = this.getPassengers();
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      passengers[index] = { ...passengers[index], ...updates };
      this.savePassengers(passengers);
    }
  }

  static deletePassenger(id: string): void {
    const passengers = this.getPassengers().filter(p => p.id !== id);
    this.savePassengers(passengers);
  }

  // Réservations
  static getReservations(): Reservation[] {
    const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        numeroTicket: 'TK-001234',
        passager: 'Marie Mbourou',
        voyage: 'Libreville → Port-Gentil',
        siege: 'A12',
        montant: 15000,
        statut: 'confirmé',
        dateReservation: '2024-07-10'
      },
      {
        id: '2',
        numeroTicket: 'TK-001235',
        passager: 'Jean Obame',
        voyage: 'Libreville → Franceville',
        siege: 'B08',
        montant: 25000,
        statut: 'payé',
        dateReservation: '2024-07-12'
      }
    ];
  }

  static saveReservations(reservations: Reservation[]): void {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }

  static addReservation(reservation: Reservation): void {
    const reservations = this.getReservations();
    reservations.push(reservation);
    this.saveReservations(reservations);
  }

  static updateReservation(id: string, updates: Partial<Reservation>): void {
    const reservations = this.getReservations();
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations[index] = { ...reservations[index], ...updates };
      this.saveReservations(reservations);
    }
  }

  static deleteReservation(id: string): void {
    const reservations = this.getReservations().filter(r => r.id !== id);
    this.saveReservations(reservations);
  }

  // Itinéraires
  static getItineraries(): Itinerary[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        nom: 'Libreville - Port-Gentil',
        depart: 'Libreville',
        destination: 'Port-Gentil',
        distance: 300,
        duree: '5h 30min',
        prix: 15000,
        actif: true
      },
      {
        id: '2',
        nom: 'Libreville - Franceville',
        depart: 'Libreville',
        destination: 'Franceville',
        distance: 650,
        duree: '10h 45min',
        prix: 25000,
        actif: true
      }
    ];
  }

  static saveItineraries(itineraries: Itinerary[]): void {
    localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
  }

  static addItinerary(itinerary: Itinerary): void {
    const itineraries = this.getItineraries();
    itineraries.push(itinerary);
    this.saveItineraries(itineraries);
  }

  static updateItinerary(id: string, updates: Partial<Itinerary>): void {
    const itineraries = this.getItineraries();
    const index = itineraries.findIndex(i => i.id === id);
    if (index !== -1) {
      itineraries[index] = { ...itineraries[index], ...updates };
      this.saveItineraries(itineraries);
    }
  }

  static deleteItinerary(id: string): void {
    const itineraries = this.getItineraries().filter(i => i.id !== id);
    this.saveItineraries(itineraries);
  }

  // Initialiser la base de données
  static initializeDatabase(): void {
    // Créer les données par défaut si elles n'existent pas
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      this.saveVehicles(DEFAULT_VEHICLES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOYAGES)) {
      this.saveVoyages(DEFAULT_VOYAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PASSENGERS)) {
      this.savePassengers(this.getPassengers());
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      this.saveReservations(this.getReservations());
    }
    if (!localStorage.getItem(STORAGE_KEYS.ITINERARIES)) {
      this.saveItineraries(this.getItineraries());
    }
  }
}
