import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Violation {
  id?: string;
  vehiclePlate: string;
  vehicleBrand?: string;
  type: string;
  date: string;
  location: string;
  amount: string;
  status: string;
  description: string;
  driverName: string;
  referenceNumber?: string;
}

interface ViolationModalProps {
  violation?: Violation | null;
  onClose: () => void;
  onSave?: (violationData: any) => void;
}

const ViolationModal: React.FC<ViolationModalProps> = ({ violation, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    vehicleBrand: '',
    type: 'excès-vitesse',
    date: '',
    location: '',
    amount: '',
    status: 'en-attente',
    description: '',
    driverName: '',
    paymentDate: '',
    contestDate: '',
  });

  useEffect(() => {
    if (violation) {
      setFormData({
        vehiclePlate: violation.vehiclePlate || '',
        vehicleBrand: violation.vehicleBrand || '',
        type: violation.type || 'excès-vitesse',
        date: violation.date || '',
        location: violation.location || '',
        amount: violation.amount?.toString() || '',
        status: violation.status || 'en-attente',
        description: violation.description || '',
        driverName: violation.driverName || '',
        paymentDate: (violation as any).paymentDate || '',
        contestDate: (violation as any).contestDate || '',
      });
    }
  }, [violation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(violation ? 'Modifier contravention:' : 'Nouvelle contravention:', formData);
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {violation ? 'Modifier la contravention' : 'Ajouter une contravention'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Informations véhicule */}
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
                Marque/Modèle
              </label>
              <Input
                name="vehicleBrand"
                value={formData.vehicleBrand}
                onChange={handleChange}
                placeholder="Peugeot 308"
              />
            </div>
          </div>

          {/* Conducteur */}
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

          {/* Détails contravention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type de contravention *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="excès-vitesse">Excès de vitesse</option>
                <option value="stationnement">Stationnement</option>
                <option value="feux-rouge">Feux rouge</option>
                <option value="téléphone">Téléphone au volant</option>
                <option value="ceinture">Ceinture de sécurité</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de l'infraction *
              </label>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Lieu de l'infraction *
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Avenue des Champs-Élysées, Paris"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Détails de l'infraction..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={3}
            />
          </div>

          {/* Montant et statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Montant (FCFA) *
              </label>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="75000"
                required
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
                <option value="en-attente">En attente</option>
                <option value="payée">Payée</option>
                <option value="contestée">Contestée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
          </div>

          {/* Dates additionnelles selon le statut */}
          {formData.status === 'payée' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de paiement
              </label>
              <Input
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.status === 'contestée' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de contestation
              </label>
              <Input
                name="contestDate"
                type="date"
                value={formData.contestDate}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {violation ? 'Modifier' : 'Ajouter'} la contravention
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViolationModal;
