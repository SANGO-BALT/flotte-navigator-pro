
import React, { useState, useEffect } from 'react';
import { X, Bus, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TravelModalProps {
  travel?: any;
  onClose: () => void;
  onSave: (travelData: any) => void;
}

const TravelModal: React.FC<TravelModalProps> = ({ travel, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    vehicleBrand: 'Mercedes Sprinter',
    departure: 'Libreville',
    destination: 'Port-Gentil',
    departureDate: '',
    departureTime: '08:00',
    arrivalTime: '13:30',
    capacity: 30,
    driverName: '',
    status: 'programmé',
    price: 15000,
    distance: 300,
  });

  useEffect(() => {
    if (travel) {
      setFormData(travel);
    }
  }, [travel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, passengers: 0 });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bus className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {travel ? 'Modifier le voyage' : 'Nouveau voyage'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Plaque véhicule *
              </label>
              <Input
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                placeholder="AB-123-CD"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Marque véhicule
              </label>
              <select
                name="vehicleBrand"
                value={formData.vehicleBrand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="Mercedes Sprinter">Mercedes Sprinter</option>
                <option value="Toyota Hiace">Toyota Hiace</option>
                <option value="Nissan Urvan">Nissan Urvan</option>
                <option value="Ford Transit">Ford Transit</option>
              </select>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de départ *
              </label>
              <Input
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heure départ
              </label>
              <Input
                name="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heure arrivée
              </label>
              <Input
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Capacité
              </label>
              <Input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix (FCFA)
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min="0"
              />
            </div>
            
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
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Chauffeur
            </label>
            <Input
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Nom du chauffeur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="programmé">Programmé</option>
              <option value="en-cours">En cours</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {travel ? 'Modifier' : 'Créer'} le voyage
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelModal;
