
import React, { useState, useEffect } from 'react';
import { X, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Maintenance {
  id?: string;
  vehiclePlate: string;
  vehicleBrand?: string;
  type: string;
  scheduledDate: string;
  description: string;
  priority: string;
  estimatedCost: string;
  garage: string;
  status?: string;
  completedDate?: string;
  finalCost?: string;
}

interface MaintenanceModalProps {
  maintenance?: Maintenance | null;
  onClose: () => void;
  onSave?: (maintenanceData: any) => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ maintenance, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    type: 'révision',
    scheduledDate: '',
    description: '',
    priority: 'normale',
    estimatedCost: '',
    garage: '',
    status: 'planifiée',
    completedDate: '',
    finalCost: '',
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehiclePlate: maintenance.vehiclePlate || '',
        type: maintenance.type || 'révision',
        scheduledDate: maintenance.scheduledDate || '',
        description: maintenance.description || '',
        priority: maintenance.priority || 'normale',
        estimatedCost: maintenance.estimatedCost?.toString() || '',
        garage: maintenance.garage || '',
        status: maintenance.status || 'planifiée',
        completedDate: maintenance.completedDate || '',
        finalCost: maintenance.finalCost?.toString() || '',
      });
    }
  }, [maintenance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(maintenance ? 'Modifier maintenance:' : 'Nouvelle maintenance:', formData);
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
      <div className="bg-card rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {maintenance ? 'Modifier la maintenance' : 'Programmer une maintenance'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              Type de maintenance *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="révision">Révision</option>
              <option value="réparation">Réparation</option>
              <option value="contrôle-technique">Contrôle technique</option>
              <option value="vidange">Vidange</option>
              <option value="pneus">Changement pneus</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date prévue *
            </label>
            <Input
              name="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priorité
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="normale">Normale</option>
              <option value="urgente">Urgente</option>
              <option value="critique">Critique</option>
            </select>
          </div>

          {/* Statut pour modification */}
          {maintenance && (
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
                <option value="planifiée">Planifiée</option>
                <option value="en-cours">En cours</option>
                <option value="terminée">Terminée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Détails de la maintenance..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Coût estimé (€)
              </label>
              <Input
                name="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={handleChange}
                placeholder="250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Garage
              </label>
              <Input
                name="garage"
                value={formData.garage}
                onChange={handleChange}
                placeholder="Garage Martin"
              />
            </div>
          </div>

          {/* Champs additionnels pour maintenance terminée */}
          {maintenance && formData.status === 'terminée' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date de fin
                </label>
                <Input
                  name="completedDate"
                  type="date"
                  value={formData.completedDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Coût final (€)
                </label>
                <Input
                  name="finalCost"
                  type="number"
                  value={formData.finalCost}
                  onChange={handleChange}
                  placeholder="275"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {maintenance ? 'Modifier' : 'Programmer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;
