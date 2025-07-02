
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReservationFormProps {
  formData: any;
  setFormData: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
  availableVoyages: any[];
}

const ReservationForm: React.FC<ReservationFormProps> = ({ formData, setFormData, mode, availableVoyages }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="passager">Passager</Label>
          <Input 
            id="passager"
            value={formData.passager || ''}
            onChange={(e) => setFormData({...formData, passager: e.target.value})}
            placeholder="Nom du passager"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="voyage">Voyage</Label>
          <Select value={formData.voyage} onValueChange={(value) => setFormData({...formData, voyage: value})} disabled={mode === 'view'}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un voyage" />
            </SelectTrigger>
            <SelectContent>
              {availableVoyages.map(voyage => (
                <SelectItem key={voyage.id} value={`${voyage.depart} → ${voyage.destination}`}>
                  {voyage.depart} → {voyage.destination} - {new Date(voyage.date).toLocaleDateString('fr-FR')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="siege">Siège</Label>
          <Input 
            id="siege"
            value={formData.siege || ''}
            onChange={(e) => setFormData({...formData, siege: e.target.value})}
            placeholder="A12"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="montant">Montant (FCFA)</Label>
          <Input 
            id="montant"
            type="number"
            value={formData.montant || ''}
            onChange={(e) => setFormData({...formData, montant: parseInt(e.target.value)})}
            placeholder="15000"
            disabled={mode === 'view'}
          />
        </div>
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})} disabled={mode === 'view'}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmé">Confirmé</SelectItem>
              <SelectItem value="payé">Payé</SelectItem>
              <SelectItem value="annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
