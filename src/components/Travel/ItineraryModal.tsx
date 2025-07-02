
import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ItineraryModalProps {
  itinerary?: any;
  onClose: () => void;
  onSave: (itineraryData: any) => void;
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({ itinerary, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    departure: 'Libreville',
    destination: 'Port-Gentil',
    distance: 300,
    duration: '5h 30min',
    priceSimple: 15000,
    priceGroup: 12000,
    isActive: true,
  });

  useEffect(() => {
    if (itinerary) {
      setFormData(itinerary);
    }
  }, [itinerary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {itinerary ? 'Modifier l\'itinéraire' : 'Nouvel itinéraire'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom de l'itinéraire *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Libreville - Port-Gentil"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Départ *
              </label>
              <select
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="Libreville">Libreville</option>
                <option value="Port-Gentil">Port-Gentil</option>
                <option value="Franceville">Franceville</option>
                <option value="Oyem">Oyem</option>
                <option value="Moanda">Moanda</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Destination *
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="Port-Gentil">Port-Gentil</option>
                <option value="Libreville">Libreville</option>
                <option value="Franceville">Franceville</option>
                <option value="Oyem">Oyem</option>
                <option value="Moanda">Moanda</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance (km)
              </label>
              <Input
                name="distance"
                type="number"
                value={formData.distance}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Durée estimée
              </label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Ex: 5h 30min"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix billet simple (FCFA)
              </label>
              <Input
                name="priceSimple"
                type="number"
                value={formData.priceSimple}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix billet groupe (FCFA)
              </label>
              <Input
                name="priceGroup"
                type="number"
                value={formData.priceGroup}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-foreground">
              Itinéraire actif
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {itinerary ? 'Modifier' : 'Créer'} l'itinéraire
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryModal;
