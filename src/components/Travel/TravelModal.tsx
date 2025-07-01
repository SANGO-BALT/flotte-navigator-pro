
import React, { useState, useEffect } from 'react';
import { X, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Travel {
  id?: string;
  vehiclePlate: string;
  vehicleBrand: string;
  departure: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  passengers: string;
  capacity: string;
  driverName: string;
  status: string;
  price: string;
  distance: string;
}

interface TravelModalProps {
  travel?: Travel | null;
  onClose: () => void;
  onSave?: (travelData: any) => void;
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
    passengers: '',
    capacity: '',
    driverName: '',
    status: 'programmé',
    price: '',
    distance: '',
  });

  useEffect(() => {
    if (travel) {
      setFormData({
        vehiclePlate: travel.vehiclePlate || '',
        vehicleBrand: travel.vehicleBrand || '',
        departure: travel.departure || '',
        destination: travel.destination || '',
        departureDate: travel.departureDate || '',
        departureTime: travel.departureTime || '',
        arrivalTime: travel.arrivalTime || '',
        passengers: travel.passengers?.toString() || '',
        capacity: travel.capacity?.toString() || '',
        driverName: travel.driverName || '',
        status: travel.status || 'programmé',
        price: travel.price?.toString() || '',
        distance: travel.distance?.toString() || '',
      });
    }
  }, [travel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(travel ? 'Modifier voyage:' : 'Nouveau voyage:', formData);
    if (onSave) {
      onSave(formData);
    }
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bus className="w-6 h-6 text-blue-500" />
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
          {/* Véhicule et conducteur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Plaque du véhicule *
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
                Marque/Modèle véhicule
              </label>
              <Input
                name="vehicleBrand"
                value={formData.vehicleBrand}
                onChange={handleChange}
                placeholder="Mercedes Sprinter"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom du conducteur *
            </label>
            <Input
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Jean Dupont"
              required
            />
          </div>

          {/* Trajet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Départ *
              </label>
              <Input
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                placeholder="Paris"
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
                placeholder="Lyon"
                required
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
                placeholder="465"
              />
            </div>
          </div>

          {/* Date et horaires */}
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
                Heure de départ *
              </label>
              <Input
                name="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heure d'arrivée prévue
              </label>
              <Input
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Passagers et tarification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Capacité véhicule *
              </label>
              <Input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre de passagers
              </label>
              <Input
                name="passengers"
                type="number"
                value={formData.passengers}
                onChange={handleChange}
                placeholder="25"
                max={formData.capacity}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix par passager (€) *
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="45"
                required
              />
            </div>
          </div>

          {/* Statut */}
          {travel && (
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
          )}

          {/* Résumé */}
          {formData.passengers && formData.price && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Résumé financier</h4>
              <p className="text-sm text-muted-foreground">
                Revenus prévus: <span className="font-medium text-foreground">
                  {Number(formData.passengers) * Number(formData.price)}€
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Taux de remplissage: <span className="font-medium text-foreground">
                  {formData.capacity ? Math.round((Number(formData.passengers) / Number(formData.capacity)) * 100) : 0}%
                </span>
              </p>
            </div>
          )}

          {/* Boutons d'action */}
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
