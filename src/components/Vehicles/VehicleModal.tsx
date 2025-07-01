
import React, { useState, useEffect } from 'react';
import { X, Upload, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Vehicle {
  id?: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  serviceDate: string;
  circulationDate: string;
  mileage: string;
  engine: string;
  fuel: string;
  transmission: string;
  insurance: string;
  registrationCard: string;
  vehicleFunction: string;
  status?: string;
  nextMaintenance?: string;
}

interface VehicleModalProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave?: (vehicleData: any) => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, onSave }) => {
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
    vehicleFunction: 'fonction',
    status: 'active',
    nextMaintenance: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plate: vehicle.plate || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        type: vehicle.type?.toLowerCase() || 'voiture',
        year: vehicle.year?.toString() || '',
        serviceDate: vehicle.serviceDate || '',
        circulationDate: vehicle.circulationDate || '',
        mileage: vehicle.mileage?.toString() || '',
        engine: vehicle.engine || '',
        fuel: vehicle.fuel || 'essence',
        transmission: vehicle.transmission || 'manuelle',
        insurance: vehicle.insurance || '',
        registrationCard: vehicle.registrationCard || '',
        vehicleFunction: vehicle.vehicleFunction || 'fonction',
        status: (vehicle as any).status || 'active',
        nextMaintenance: (vehicle as any).nextMaintenance || '',
        image: (vehicle as any).image || '',
      });
      setImagePreview((vehicle as any).image || '');
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(vehicle ? 'Modifier véhicule:' : 'Nouveau véhicule:', formData);
    if (onSave) {
      const dataToSave = vehicle ? { ...formData, id: vehicle.id } : formData;
      onSave(dataToSave);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
            </h2>
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
            <div className="space-y-4">
              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-32 h-24 object-cover rounded-lg border"
                  />
                </div>
              )}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="vehicle-image"
                />
                <label htmlFor="vehicle-image" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour télécharger ou glissez une image
                  </p>
                </label>
              </div>
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
                Fonction du véhicule *
              </label>
              <select
                name="vehicleFunction"
                value={formData.vehicleFunction}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="fonction">Fonction</option>
                <option value="liaison">Liaison</option>
                <option value="transport-personnel">Transport du personnel</option>
                <option value="transport-fret">Transport fret</option>
                <option value="transport-voyageur">Transport voyageur</option>
                <option value="taxi">Taxi</option>
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
                Boîte de vitesse *
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

          {/* Statut et maintenance (pour modification) */}
          {vehicle && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="active">En service</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Hors service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prochaine maintenance
                </label>
                <Input
                  name="nextMaintenance"
                  type="date"
                  value={formData.nextMaintenance}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

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
              {vehicle ? 'Modifier' : 'Ajouter'} le véhicule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
