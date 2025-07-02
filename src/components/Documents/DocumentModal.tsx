
import React, { useState, useEffect } from 'react';
import { X, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DocumentModalProps {
  document?: any;
  onClose: () => void;
  onSave?: (documentData: any) => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'carte-grise',
    vehiclePlate: '',
    expiryDate: '',
    type: 'PDF',
    size: '1.0 MB',
    description: '',
    status: 'valide',
  });

  const categories = [
    { value: 'carte-grise', label: 'Carte grise' },
    { value: 'assurance', label: 'Assurance' },
    { value: 'permis', label: 'Permis de conduire' },
    { value: 'visite-technique', label: 'Visite technique' },
    { value: 'facture', label: 'Facture' },
    { value: 'contrat', label: 'Contrat' },
    { value: 'autre', label: 'Autre' },
  ];

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || '',
        category: document.category || 'carte-grise',
        vehiclePlate: document.vehiclePlate || '',
        expiryDate: document.expiryDate || '',
        type: document.type || 'PDF',
        size: document.size || '1.0 MB',
        description: document.description || '',
        status: document.status || 'valide',
      });
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'PDF',
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {document ? 'Modifier le document' : 'Ajouter un document'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload de fichier */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fichier
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez-déposez votre fichier ou cliquez pour sélectionner
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>Choisir un fichier</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Nom du document */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom du document *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="nom-document.pdf"
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Plaque véhicule (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Véhicule associé
            </label>
            <Input
              name="vehiclePlate"
              value={formData.vehiclePlate}
              onChange={handleChange}
              placeholder="AB-123-CD (optionnel)"
            />
          </div>

          {/* Date d'expiration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date d'expiration
            </label>
            <Input
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du document..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={3}
            />
          </div>

          {/* Informations du fichier */}
          {formData.name && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Type: {formData.type}</span>
                <span>Taille: {formData.size}</span>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {document ? 'Modifier' : 'Ajouter'} le document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentModal;
