
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, DollarSign, Clock, Printer, X } from 'lucide-react';

interface TravegabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  initialData?: any;
  type: 'voyage' | 'passenger' | 'reservation' | 'itinerary';
  mode?: 'create' | 'edit' | 'view';
  voyagesData?: any[];
}

// Données de véhicules simulées (à connecter avec le vrai système)
const availableVehicles = [
  { id: 'BUS-001-GA', nom: 'Bus Mercedes 35 places', capacite: 35, statut: 'disponible' },
  { id: 'BUS-002-GA', nom: 'Bus Toyota 30 places', capacite: 30, statut: 'disponible' },
  { id: 'BUS-003-GA', nom: 'Bus Isuzu 25 places', capacite: 25, statut: 'disponible' },
  { id: 'VAN-001-GA', nom: 'Van Toyota Hiace', capacite: 12, statut: 'disponible' },
];

const TravegabModal: React.FC<TravegabModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialData, 
  type, 
  mode = 'create',
  voyagesData = []
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && initialData?.id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        onDelete(initialData.id);
        onClose();
      }
    }
  };

  const handlePrint = () => {
    if (type === 'reservation') {
      setShowPrintPreview(true);
    }
  };

  const printTicket = () => {
    window.print();
    setShowPrintPreview(false);
  };

  // Filtrer les voyages en cours ou confirmés pour l'assignation des passagers
  const availableVoyages = voyagesData.filter(v => 
    v.statut === 'confirmé' || v.statut === 'en-cours' || v.statut === 'programmé'
  );

  const renderVoyageForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicule">Véhicule Assigné</Label>
          <Select value={formData.vehicule} onValueChange={(value) => setFormData({...formData, vehicule: value})} disabled={mode === 'view'}>
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="Ex: Port-Gentil"
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="heure">Heure</Label>
          <Input 
            id="heure"
            type="time"
            value={formData.heure || ''}
            onChange={(e) => setFormData({...formData, heure: e.target.value})}
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="statut">Statut</Label>
        <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})} disabled={mode === 'view'}>
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input 
            id="prenom"
            value={formData.prenom || ''}
            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            placeholder="Prénom"
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
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
          disabled={mode === 'view'}
        />
      </div>

      {mode === 'create' && (
        <div>
          <Label htmlFor="voyageAssigne">Assigner à un voyage (optionnel)</Label>
          <Select value={formData.voyageAssigne} onValueChange={(value) => setFormData({...formData, voyageAssigne: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un voyage" />
            </SelectTrigger>
            <SelectContent>
              {availableVoyages.map(voyage => (
                <SelectItem key={voyage.id} value={voyage.id}>
                  {voyage.depart} → {voyage.destination} - {new Date(voyage.date).toLocaleDateString('fr-FR')} à {voyage.heure}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="voyage">Voyage</Label>
          <Select value={formData.voyage} onValueChange={(value) => setFormData({...formData, voyage: value})} disabled={mode === 'view'}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un voyage" />
            </SelectTrigger>
            <SelectContent>
              {availableVoyages.map(voyage => (
                <SelectItem key={voyage.id} value={`${voyage.depart} → ${voyage.destination}`}>
                  {voyage.depart} → {voyage.destination} - {new Date(voyage.date).toLocaleDateString('fr-FR')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})} disabled={mode === 'view'}>
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
          disabled={mode === 'view'}
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="Port-Gentil"
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="duree">Durée</Label>
          <Input 
            id="duree"
            value={formData.duree || ''}
            onChange={(e) => setFormData({...formData, duree: e.target.value})}
            placeholder="5h 30min"
            disabled={mode === 'view'}
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
            disabled={mode === 'view'}
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
          disabled={mode === 'view'}
        />
      </div>
    </div>
  );

  const getTitle = () => {
    const actions = {
      create: 'Nouveau',
      edit: 'Modifier',
      view: 'Voir'
    };
    
    const titles = {
      voyage: 'Voyage',
      passenger: 'Passager',
      reservation: 'Réservation',
      itinerary: 'Itinéraire'
    };
    
    return `${actions[mode]} ${titles[type]}`;
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

  if (showPrintPreview && type === 'reservation') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Aperçu du Ticket</span>
              <Button variant="ghost" size="sm" onClick={() => setShowPrintPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-4 border rounded-lg bg-white text-black print:shadow-none">
            <div className="text-center">
              <h2 className="text-xl font-bold">🚌 TRAVEGAB</h2>
              <p className="text-sm">Ticket de Transport</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>N° Ticket:</span>
                <span className="font-mono">{formData.numeroTicket || 'TK-' + Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span>Passager:</span>
                <span>{formData.passager}</span>
              </div>
              <div className="flex justify-between">
                <span>Voyage:</span>
                <span>{formData.voyage}</span>
              </div>
              <div className="flex justify-between">
                <span>Siège:</span>
                <span>{formData.siege}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant:</span>
                <span>{formData.montant?.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Statut:</span>
                <span>{formData.statut}</span>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-600">
              <p>Merci de voyager avec TRAVEGAB</p>
              <p>Conservez ce ticket durant tout le voyage</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintPreview(false)}>
              Annuler
            </Button>
            <Button onClick={printTicket}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
            {mode === 'view' && (
              <>
                {type === 'reservation' && (
                  <Button type="button" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer Ticket
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose}>
                  Fermer
                </Button>
              </>
            )}
            
            {mode === 'edit' && (
              <>
                {onDelete && (
                  <Button type="button" variant="destructive" onClick={handleDelete}>
                    Supprimer
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit">
                  Modifier
                </Button>
              </>
            )}
            
            {mode === 'create' && (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TravegabModal;
