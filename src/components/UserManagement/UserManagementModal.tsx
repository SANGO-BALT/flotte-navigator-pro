
import React, { useState, useEffect } from 'react';
import { X, Users, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserManagementModalProps {
  user?: any;
  onClose: () => void;
  onSave?: (userData: any) => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
    permissions: [] as string[],
    status: 'active',
  });

  const allPermissions = [
    { id: 'vehicles', label: 'Gestion véhicules' },
    { id: 'users', label: 'Gestion personnels' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'gps', label: 'GPS & Localisation' },
    { id: 'fuel', label: 'Carburant' },
    { id: 'violations', label: 'Contraventions' },
    { id: 'travel', label: 'Voyages' },
    { id: 'documents', label: 'Documents' },
    { id: 'reports', label: 'Rapports' },
    { id: 'settings', label: 'Paramètres' },
    { id: 'user-management', label: 'Gestion utilisateurs système' },
  ];

  const rolePermissions = {
    'super-admin': ['all'],
    'manager': ['vehicles', 'users', 'maintenance', 'gps', 'fuel', 'violations', 'travel', 'documents', 'reports'],
    'operator': ['vehicles', 'gps', 'fuel', 'maintenance'],
    'viewer': ['view-only'],
  };

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'viewer',
        permissions: user.permissions || [],
        status: user.status || 'active',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user && formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const userData = {
      ...formData,
      permissions: formData.role === 'super-admin' ? ['all'] : 
                  formData.role === 'viewer' ? ['view-only'] :
                  rolePermissions[formData.role] || formData.permissions,
      lastLogin: user?.lastLogin || null,
    };

    if (onSave) {
      onSave(userData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: rolePermissions[newRole] || [],
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur système'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Informations personnelles
            </h3>
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
            </div>
          </div>

          {/* Compte utilisateur */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Compte utilisateur
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom d'utilisateur *
                </label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@fleet.com"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {user ? 'Nouveau mot de passe' : 'Mot de passe *'}
                  </label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required={!user}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {user ? 'Confirmer nouveau mot de passe' : 'Confirmer mot de passe *'}
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required={!user}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rôles et permissions */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Rôles et permissions
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rôle *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="viewer">Consulteur</option>
                    <option value="operator">Opérateur</option>
                    <option value="manager">Manager</option>
                    <option value="super-admin">Super Administrateur</option>
                  </select>
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

              {/* Permissions détaillées */}
              {formData.role !== 'super-admin' && formData.role !== 'viewer' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Permissions spécifiques
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border border-border rounded-lg">
                    {allPermissions.map(permission => (
                      <label key={permission.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.id)}
                          onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-foreground">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Description du rôle */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {formData.role === 'super-admin' && 'Accès complet à toutes les fonctionnalités du système.'}
                  {formData.role === 'manager' && 'Accès à la gestion des véhicules, personnels, maintenance et rapports.'}
                  {formData.role === 'operator' && 'Accès aux opérations quotidiennes: véhicules, GPS, carburant.'}
                  {formData.role === 'viewer' && 'Accès en lecture seule à toutes les informations.'}
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              {user ? 'Modifier' : 'Créer'} l'utilisateur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementModal;
