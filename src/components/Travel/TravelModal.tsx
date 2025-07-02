
import React, { useState, useEffect } from 'react';
import { X, Bus, Calendar, Clock, Users, MapPin } from 'lucide-react';
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
    vehicleBrand: '',
    departure: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
    passengers: 0,
    capacity: 30,
    driverName: '',
    status: 'programmé',
    price: 15000,
    distance: 0,
  });

  useEffect(() => {
    if (travel) {
      setFormData(travel);
    }
  }, [travel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'passengers' || name === 'capacity' || name === 'price' || name === 'distance' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const vehicles = [
    'AB-123-CD - Mercedes Sprinter',
    'EF-456-GH - Renault Trafic',
    'IJ-789-KL - Toyota Hiace',
    'MN-012-OP - Peugeot Boxer'
  ];

  const drivers = [
    'Jean Dupont',
    'Marie Nguema',
    'Paul Obame',
    'Claire Mintsa'
  ];

  const routes = [
    { departure: 'Libreville', destination: 'Port-Gentil', distance: 300 },
    { departure: 'Libreville', destination: 'Franceville', distance: 650 },
    { departure: 'Port-Gentil', destination: 'Lambaréné', distance: 120 },
    { departure: 'Oyem', destination: 'Libreville', distance: 320 }
  ];

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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Véhicule *
              </label>
              <select
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle} value={vehicle.split(' - ')[0]}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chauffeur *
              </label>
              <select
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Sélectionner un chauffeur</option>
                {drivers.map(driver => (
                  <option key={driver} value={driver}>
                    {driver}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ville de départ *
              </label>
              <select
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Sélectionner</option>
                <option value="Libreville">Libreville</option>
                <option value="Port-Gentil">Port-Gentil</option>
                <option value="Franceville">Franceville</option>
                <option value="Oyem">Oyem</option>
                <option value="Lambaréné">Lambaréné</option>
                <option value="Moanda">Moanda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ville de destination *
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Sélectionner</option>
                <option value="Libreville">Libreville</option>
                <option value="Port-Gentil">Port-Gentil</option>
                <option value="Franceville">Franceville</option>
                <option value="Oyem">Oyem</option>
                <option value="Lambaréné">Lambaréné</option>
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
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heure de départ *
              </label>
              <Input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heure d'arrivée *
              </label>
              <Input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Capacité
              </label>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance (km)
              </label>
              <Input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix (FCFA)
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1000"
                step="1000"
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
