
import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Itinerary {
  id?: string;
  name: string;
  departure: string;
  destination: string;
  distance: number;
  duration: string;
  priceSimple: number;
  priceGroup: number;
  isActive: boolean;
}

interface ItineraryModalProps {
  itinerary?: Itinerary | null;
  onClose: () => void;
  onSave: (itinerary: Itinerary) => void;
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({ itinerary, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    departure: '',
    destination: '',
    distance: '',
    duration: '',
    priceSimple: '',
    priceGroup: '',
    isActive: true,
  });

  useEffect(() => {
    if (itinerary) {
      setFormData({
        name: itinerary.name || '',
        departure: itinerary.departure || '',
        destination: itinerary.destination || '',
        distance: itinerary.distance?.toString() || '',
        duration: itinerary.duration || '',
        priceSimple: itinerary.priceSimple?.toString() || '',
        priceGroup: itinerary.priceGroup?.toString() || '',
        isActive: itinerary.isActive ?? true,
      });
    }
  }, [itinerary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      distance: Number(formData.distance),
      priceSimple: Number(formData.priceSimple),
      priceGroup: Number(formData.priceGroup),
      id: itinerary?.id
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-500" />
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
              placeholder="Libreville - Port-Gentil"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Départ *
              </label>
              <Input
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                placeholder="Libreville"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Destination *
              </label>
              <Input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Port-Gentil"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance (km) *
              </label>
              <Input
                name="distance"
                type="number"
                value={formData.distance}
                onChange={handleChange}
                placeholder="300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Durée estimée *
              </label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="5h 30min"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix billet simple (FCFA) *
              </label>
              <Input
                name="priceSimple"
                type="number"
                value={formData.priceSimple}
                onChange={handleChange}
                placeholder="15000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix billet groupe (FCFA) *
              </label>
              <Input
                name="priceGroup"
                type="number"
                value={formData.priceGroup}
                onChange={handleChange}
                placeholder="12000"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded border-border"
            />
            <label className="text-sm text-foreground">
              Itinéraire actif
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {itinerary ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryModal;
