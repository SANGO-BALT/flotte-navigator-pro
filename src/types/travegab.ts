
export interface Vehicle {
  id: string;
  nom: string;
  capacite: number;
  statut: 'disponible' | 'en-service' | 'maintenance';
}

export interface Voyage {
  id: string;
  vehicule: string;
  depart: string;
  destination: string;
  date: string;
  heure: string;
  passagers: number;
  capacite: number;
  statut: 'programmé' | 'confirmé' | 'en-cours' | 'terminé';
  prix: number;
}

export interface Passenger {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  cni?: string;
  voyageAssigne?: string;
}

export interface Reservation {
  id: string;
  numeroTicket: string;
  passager: string;
  voyage: string;
  siege: string;
  montant: number;
  statut: 'confirmé' | 'payé' | 'annulé';
  dateReservation: string;
}

export interface Itinerary {
  id: string;
  nom: string;
  depart: string;
  destination: string;
  distance: number;
  duree: string;
  prix: number;
  actif: boolean;
  description?: string;
}
