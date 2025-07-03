
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, DollarSign, Printer } from 'lucide-react';
import VoyageForm from './forms/VoyageForm';
import PassengerForm from './forms/PassengerForm';
import ReservationForm from './forms/ReservationForm';
import ItineraryForm from './forms/ItineraryForm';
import TicketPrintPreview from './TicketPrintPreview';
import { TravegabDatabase } from '@/services/database';

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

  // Charger les véhicules depuis la base de données
  const availableVehicles = TravegabDatabase.getVehicles();

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

  // Filtrer les voyages en cours ou confirmés pour l'assignation des passagers
  const availableVoyages = voyagesData.filter(v => 
    v.statut === 'confirmé' || v.statut === 'en-cours' || v.statut === 'programmé'
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

  const renderForm = () => {
    switch (type) {
      case 'voyage':
        return (
          <VoyageForm 
            formData={formData} 
            setFormData={setFormData} 
            mode={mode} 
            availableVehicles={availableVehicles}
          />
        );
      case 'passenger':
        return (
          <PassengerForm 
            formData={formData} 
            setFormData={setFormData} 
            mode={mode} 
            availableVoyages={availableVoyages}
          />
        );
      case 'reservation':
        return (
          <ReservationForm 
            formData={formData} 
            setFormData={setFormData} 
            mode={mode} 
            availableVoyages={availableVoyages}
          />
        );
      case 'itinerary':
        return (
          <ItineraryForm 
            formData={formData} 
            setFormData={setFormData} 
            mode={mode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {getIcon()}
              <span>{getTitle()}</span>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}
            
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

      <TicketPrintPreview 
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        formData={formData}
      />
    </>
  );
};

export default TravegabModal;
