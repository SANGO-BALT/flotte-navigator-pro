import React, { useState, useEffect } from 'react';
import { X, User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  profession: string;
  grade: string;
  licenseNumber: string;
  status: string;
  joinDate: string;
  leaveStatus?: string;
  leaveStartDate?: string;
  leaveEndDate?: string;
}

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
  onSave?: (userData: any) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'M',
    address: '',
    profession: '',
    grade: '',
    licenseNumber: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    leaveStatus: 'none',
    leaveStartDate: '',
    leaveEndDate: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.gender,
        address: user.address,
        profession: user.profession,
        grade: user.grade,
        licenseNumber: user.licenseNumber,
        status: user.status,
        joinDate: user.joinDate,
        leaveStatus: user.leaveStatus || 'none',
        leaveStartDate: user.leaveStartDate || '',
        leaveEndDate: user.leaveEndDate || '',
        image: (user as any).image || '',
      });
      setImagePreview((user as any).image || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user ? 'Modifier utilisateur:' : 'Nouveau utilisateur:', formData);
    if (onSave) {
      onSave(formData);
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
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
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
              Photo de profil
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-24 h-24 object-cover rounded-full border"
                  />
                </div>
              )}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="user-image"
                />
                <label htmlFor="user-image" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour télécharger ou glissez une photo
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG ou GIF (max. 2MB)
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prénom *
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom *
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date de naissance *
                </label>
                <Input
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sexe *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone *
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Adresse domicile *
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Rue de la Paix, 75001 Paris"
                required
              />
            </div>
          </div>

          {/* Informations professionnelles */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Informations professionnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Profession *
                </label>
                <Input
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Chauffeur"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Sélectionner un grade</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Technicien">Technicien</option>
                  <option value="Manager">Manager</option>
                  <option value="Superviseur">Superviseur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  N° Permis de conduire *
                </label>
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="PC123456789"
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
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Date d'embauche
              </label>
              <Input
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Gestion des congés */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Gestion des congés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type de congé
                </label>
                <select
                  name="leaveStatus"
                  value={formData.leaveStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="none">Aucun congé en cours</option>
                  <option value="leave">Congé</option>
                  <option value="mission">Mission</option>
                  <option value="sick">Congé maladie</option>
                  <option value="maternity">Congé maternité</option>
                </select>
              </div>

              {formData.leaveStatus !== 'none' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date de début
                    </label>
                    <Input
                      name="leaveStartDate"
                      type="date"
                      value={formData.leaveStartDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date de fin
                    </label>
                    <Input
                      name="leaveEndDate"
                      type="date"
                      value={formData.leaveEndDate}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {user ? 'Modifier' : 'Ajouter'} l'utilisateur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
