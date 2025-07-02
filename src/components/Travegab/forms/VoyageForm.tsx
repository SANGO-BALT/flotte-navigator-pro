
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoyageFormProps {
  formData: any;
  setFormData: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
  availableVehicles: any[];
}

const VoyageForm: React.FC<VoyageFormProps> = ({ formData, setFormData, mode, availableVehicles }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicule">Véhicule Assigné</Label>
          <Select value={formData.vehicule} onValueChange={(value) => setFormData({...formData, vehicule: value})} disabled={mode === 'view'}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.nom} - {vehicle.capacite} places
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="capacite">Capacité</Label>
          <Input 
            id="capacite"
            value={availableVehicles.find(v => v.id === formData.vehicule)?.capacite || ''}
            disabled
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="depart">Ville de Départ</Label>
          <Input 
            id="depart"
            value={formData.depart || ''}
            onChange={(e) => setFormData({...formData, depart: e.target.value})}
            placeholder="Ex: Libreville"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="Ex: Port-Gentil"
            disabled={mode === 'view'}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="heure">Heure</Label>
          <Input 
            id="heure"
            type="time"
            value={formData.heure || ''}
            onChange={(e) => setFormData({...formData, heure: e.target.value})}
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="prix">Prix (FCFA)</Label>
          <Input 
            id="prix"
            type="number"
            value={formData.prix || ''}
            onChange={(e) => setFormData({...formData, prix: parseInt(e.target.value)})}
            placeholder="15000"
            disabled={mode === 'view'}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="statut">Statut</Label>
        <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})} disabled={mode === 'view'}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="programmé">Programmé</SelectItem>
            <SelectItem value="confirmé">Confirmé</SelectItem>
            <SelectItem value="en-cours">En cours</SelectItem>
            <SelectItem value="terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VoyageForm;
