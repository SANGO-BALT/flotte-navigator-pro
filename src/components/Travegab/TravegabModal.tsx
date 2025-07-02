
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';

interface TravegabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  type: 'voyage' | 'passenger' | 'reservation' | 'itinerary';
}

// Données de véhicules simulées (à connecter avec le vrai système)
const availableVehicles = [
  { id: 'BUS-001-GA', nom: 'Bus Mercedes 35 places', capacite: 35, statut: 'disponible' },
  { id: 'BUS-002-GA', nom: 'Bus Toyota 30 places', capacite: 30, statut: 'disponible' },
  { id: 'BUS-003-GA', nom: 'Bus Isuzu 25 places', capacite: 25, statut: 'disponible' },
  { id: 'VAN-001-GA', nom: 'Van Toyota Hiace', capacite: 12, statut: 'disponible' },
];

const TravegabModal: React.FC<TravegabModalProps> = ({ isOpen, onClose, onSave, initialData, type }) => {
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderVoyageForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicule">Véhicule Assigné</Label>
          <Select value={formData.vehicule} onValueChange={(value) => setFormData({...formData, vehicule: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.nom} - {vehicle.capacite} places
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="capacite">Capacité</Label>
          <Input 
            id="capacite"
            value={availableVehicles.find(v => v.id === formData.vehicule)?.capacite || ''}
            disabled
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="depart">Ville de Départ</Label>
          <Input 
            id="depart"
            value={formData.depart || ''}
            onChange={(e) => setFormData({...formData, depart: e.target.value})}
            placeholder="Ex: Libreville"
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="Ex: Port-Gentil"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="heure">Heure</Label>
          <Input 
            id="heure"
            type="time"
            value={formData.heure || ''}
            onChange={(e) => setFormData({...formData, heure: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="prix">Prix (FCFA)</Label>
          <Input 
            id="prix"
            type="number"
            value={formData.prix || ''}
            onChange={(e) => setFormData({...formData, prix: parseInt(e.target.value)})}
            placeholder="15000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="statut">Statut</Label>
        <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="programmé">Programmé</SelectItem>
            <SelectItem value="confirmé">Confirmé</SelectItem>
            <SelectItem value="en-cours">En cours</SelectItem>
            <SelectItem value="terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPassengerForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input 
            id="nom"
            value={formData.nom || ''}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            placeholder="Nom de famille"
          />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input 
            id="prenom"
            value={formData.prenom || ''}
            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            placeholder="Prénom"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input 
            id="telephone"
            value={formData.telephone || ''}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
            placeholder="+241 XX XX XX XX"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="email@example.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cni">CNI / Passeport</Label>
        <Input 
          id="cni"
          value={formData.cni || ''}
          onChange={(e) => setFormData({...formData, cni: e.target.value})}
          placeholder="Numéro CNI ou Passeport"
        />
      </div>
    </div>
  );

  const renderReservationForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="passager">Passager</Label>
          <Input 
            id="passager"
            value={formData.passager || ''}
            onChange={(e) => setFormData({...formData, passager: e.target.value})}
            placeholder="Nom du passager"
          />
        </div>
        <div>
          <Label htmlFor="voyage">Voyage</Label>
          <Input 
            id="voyage"
            value={formData.voyage || ''}
            onChange={(e) => setFormData({...formData, voyage: e.target.value})}
            placeholder="Trajet"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="siege">Siège</Label>
          <Input 
            id="siege"
            value={formData.siege || ''}
            onChange={(e) => setFormData({...formData, siege: e.target.value})}
            placeholder="A12"
          />
        </div>
        <div>
          <Label htmlFor="montant">Montant (FCFA)</Label>
          <Input 
            id="montant"
            type="number"
            value={formData.montant || ''}
            onChange={(e) => setFormData({...formData, montant: parseInt(e.target.value)})}
            placeholder="15000"
          />
        </div>
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmé">Confirmé</SelectItem>
              <SelectItem value="payé">Payé</SelectItem>
              <SelectItem value="annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderItineraryForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de l'itinéraire</Label>
        <Input 
          id="nom"
          value={formData.nom || ''}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          placeholder="Ex: Libreville - Port-Gentil"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="depart">Point de départ</Label>
          <Input 
            id="depart"
            value={formData.depart || ''}
            onChange={(e) => setFormData({...formData, depart: e.target.value})}
            placeholder="Libreville"
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="Port-Gentil"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="distance">Distance (km)</Label>
          <Input 
            id="distance"
            type="number"
            value={formData.distance || ''}
            onChange={(e) => setFormData({...formData, distance: parseInt(e.target.value)})}
            placeholder="300"
          />
        </div>
        <div>
          <Label htmlFor="duree">Durée</Label>
          <Input 
            id="duree"
            value={formData.duree || ''}
            onChange={(e) => setFormData({...formData, duree: e.target.value})}
            placeholder="5h 30min"
          />
        </div>
        <div>
          <Label htmlFor="prix">Prix (FCFA)</Label>
          <Input 
            id="prix"
            type="number"
            value={formData.prix || ''}
            onChange={(e) => setFormData({...formData, prix: parseInt(e.target.value)})}
            placeholder="15000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Description de l'itinéraire, arrêts, conditions..."
          rows={3}
        />
      </div>
    </div>
  );

  const getTitle = () => {
    const titles = {
      voyage: 'Nouveau Voyage',
      passenger: 'Nouveau Passager',
      reservation: 'Nouvelle Réservation',
      itinerary: 'Nouvel Itinéraire'
    };
    return titles[type];
  };

  const getIcon = () => {
    const icons = {
      voyage: Calendar,
      passenger: Users,
      reservation: DollarSign,
      itinerary: MapPin
    };
    const Icon = icons[type];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'voyage' && renderVoyageForm()}
          {type === 'passenger' && renderPassengerForm()}
          {type === 'reservation' && renderReservationForm()}
          {type === 'itinerary' && renderItineraryForm()}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TravegabModal;
