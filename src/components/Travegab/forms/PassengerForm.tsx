
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PassengerFormProps {
  formData: any;
  setFormData: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
  availableVoyages: any[];
}

const PassengerForm: React.FC<PassengerFormProps> = ({ formData, setFormData, mode, availableVoyages }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input 
            id="nom"
            value={formData.nom || ''}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            placeholder="Nom de famille"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input 
            id="prenom"
            value={formData.prenom || ''}
            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            placeholder="Prénom"
            disabled={mode === 'view'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input 
            id="telephone"
            value={formData.telephone || ''}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
            placeholder="+241 XX XX XX XX"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="email@example.com"
            disabled={mode === 'view'}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cni">CNI / Passeport</Label>
        <Input 
          id="cni"
          value={formData.cni || ''}
          onChange={(e) => setFormData({...formData, cni: e.target.value})}
          placeholder="Numéro CNI ou Passeport"
          disabled={mode === 'view'}
        />
      </div>

      {mode === 'create' && (
        <div>
          <Label htmlFor="voyageAssigne">Assigner à un voyage (optionnel)</Label>
          <Select value={formData.voyageAssigne} onValueChange={(value) => setFormData({...formData, voyageAssigne: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un voyage" />
            </SelectTrigger>
            <SelectContent>
              {availableVoyages.map(voyage => (
                <SelectItem key={voyage.id} value={voyage.id}>
                  {voyage.depart} → {voyage.destination} - {new Date(voyage.date).toLocaleDateString('fr-FR')} à {voyage.heure}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default PassengerForm;
