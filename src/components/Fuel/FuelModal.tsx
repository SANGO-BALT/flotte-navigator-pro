
import React, { useState, useEffect } from 'react';
import { X, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FuelModalProps {
  record?: any;
  onClose: () => void;
  onSave?: (recordData: any) => void;
}

const FuelModal: React.FC<FuelModalProps> = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    date: new Date().toISOString().split('T')[0],
    fuelType: 'diesel',
    quantity: '',
    unitPrice: '',
    station: '',
    mileage: '',
    notes: '',
  });

  useEffect(() => {
    if (record) {
      setFormData({
        vehiclePlate: record.vehiclePlate || '',
        date: record.date || new Date().toISOString().split('T')[0],
        fuelType: record.fuelType?.toLowerCase() || 'diesel',
        quantity: record.quantity?.toString() || '',
        unitPrice: record.unitPrice?.toString() || '',
        station: record.station || '',
        mileage: record.mileage?.toString() || '',
        notes: record.notes || '',
      });
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recordData = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      totalCost: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
      mileage: parseInt(formData.mileage),
      fuelType: formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1),
    };
    
    if (onSave) {
      onSave(recordData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const totalCost = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Fuel className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {record ? 'Modifier le plein' : 'Ajouter un plein'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                Date *
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
              Type de carburant *
            </label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="diesel">Diesel</option>
              <option value="essence">Essence</option>
              <option value="gpl">GPL</option>
              <option value="electrique">Électrique</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantité (L) *
              </label>
              <Input
                name="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="45.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prix/L (FCFA) *
              </label>
              <Input
                name="unitPrice"
                type="number"
                step="1"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="650"
                required
              />
            </div>
          </div>

          {/* Affichage du total calculé */}
          {totalCost > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total calculé:</span>
                <span className="text-lg font-bold text-foreground">{totalCost.toLocaleString()} FCFA</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Station-service
            </label>
            <Input
              name="station"
              value={formData.station}
              onChange={handleChange}
              placeholder="Total Station Centre"
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
              placeholder="85340"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Remarques éventuelles..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {record ? 'Modifier' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelModal;
