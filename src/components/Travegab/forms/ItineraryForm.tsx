
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ItineraryFormProps {
  formData: any;
  setFormData: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ formData, setFormData, mode }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de l'itinéraire</Label>
        <Input 
          id="nom"
          value={formData.nom || ''}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          placeholder="Ex: Libreville - Port-Gentil"
          disabled={mode === 'view'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="depart">Point de départ</Label>
          <Input 
            id="depart"
            value={formData.depart || ''}
            onChange={(e) => setFormData({...formData, depart: e.target.value})}
            placeholder="Libreville"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="Port-Gentil"
            disabled={mode === 'view'}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="distance">Distance (km)</Label>
          <Input 
            id="distance"
            type="number"
            value={formData.distance || ''}
            onChange={(e) => setFormData({...formData, distance: parseInt(e.target.value)})}
            placeholder="300"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="duree">Durée</Label>
          <Input 
            id="duree"
            value={formData.duree || ''}
            onChange={(e) => setFormData({...formData, duree: e.target.value})}
            placeholder="5h 30min"
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
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Description de l'itinéraire, arrêts, conditions..."
          rows={3}
          disabled={mode === 'view'}
        />
      </div>
    </div>
  );
};

export default ItineraryForm;
