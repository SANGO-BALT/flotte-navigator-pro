
import React, { useState } from 'react';
import { X, Upload, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VehicleModalProps {
  onClose: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    type: 'voiture',
    year: '',
    serviceDate: '',
    circulationDate: '',
    mileage: '',
    engine: '',
    fuel: 'essence',
    transmission: 'manuelle',
    insurance: '',
    registrationCard: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouveau véhicule:', formData);
    // Ici vous pourrez ajouter la logique pour sauvegarder
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
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Ajouter un véhicule</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Photo */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Photo du véhicule
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour télécharger ou glissez une image
              </p>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Plaque d'immatriculation *
              </label>
              <Input
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                placeholder="AB-123-CD"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type de véhicule *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="voiture">Voiture</option>
                <option value="utilitaire">Utilitaire</option>
                <option value="moto">Moto</option>
                <option value="camion">Camion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Marque *
              </label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Peugeot"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Modèle *
              </label>
              <Input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="308"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Année *
              </label>
              <Input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                placeholder="2020"
                min="1990"
                max="2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kilométrage
              </label>
              <Input
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>
          </div>

          {/* Dates importantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de mise en service *
              </label>
              <Input
                name="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de mise en circulation *
              </label>
              <Input
                name="circulationDate"
                type="date"
                value={formData.circulationDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Informations techniques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Motorisation
              </label>
              <Input
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="1.6 HDi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type de carburant
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybride">Hybride</option>
                <option value="electrique">Électrique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Boîte de vitesse
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="manuelle">Manuelle</option>
                <option value="automatique">Automatique</option>
                <option value="semi-automatique">Semi-automatique</option>
              </select>
            </div>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Numéro d'assurance
              </label>
              <Input
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                placeholder="ASS123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Numéro carte grise
              </label>
              <Input
                name="registrationCard"
                value={formData.registrationCard}
                onChange={handleChange}
                placeholder="CG123456789"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              Ajouter le véhicule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
