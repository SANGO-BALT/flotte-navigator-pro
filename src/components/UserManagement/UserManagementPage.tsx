
import React, { useState } from 'react';
import { Search, Plus, Users, Shield, Key, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserManagementModal from './UserManagementModal';

const UserManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [systemUsers, setSystemUsers] = useState([
    {
      id: '1',
      username: 'admin',
      email: 'admin@fleet.com',
      firstName: 'Super',
      lastName: 'Administrateur',
      role: 'super-admin',
      permissions: ['all'],
      status: 'active',
      lastLogin: '2024-07-01 14:30',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      username: 'manager1',
      email: 'manager@fleet.com',
      firstName: 'Jean',
      lastName: 'Manager',
      role: 'manager',
      permissions: ['vehicles', 'users', 'maintenance', 'reports'],
      status: 'active',
      lastLogin: '2024-07-01 12:15',
      createdDate: '2024-02-15',
    },
    {
      id: '3',
      username: 'operator1',
      email: 'operator@fleet.com',
      firstName: 'Marie',
      lastName: 'Operateur',
      role: 'operator',
      permissions: ['vehicles', 'gps', 'fuel'],
      status: 'active',
      lastLogin: '2024-07-01 10:45',
      createdDate: '2024-03-10',
    },
    {
      id: '4',
      username: 'viewer1',
      email: 'viewer@fleet.com',
      firstName: 'Pierre',
      lastName: 'Consulteur',
      role: 'viewer',
      permissions: ['view-only'],
      status: 'inactive',
      lastLogin: '2024-06-28 16:20',
      createdDate: '2024-04-05',
    },
  ]);

  const roles = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'super-admin', label: 'Super Administrateur' },
    { value: 'manager', label: 'Manager' },
    { value: 'operator', label: 'Opérateur' },
    { value: 'viewer', label: 'Consulteur' },
  ];

  const roleColors = {
    'super-admin': 'bg-purple-100 text-purple-800',
    'manager': 'bg-blue-100 text-blue-800',
    'operator': 'bg-green-100 text-green-800',
    'viewer': 'bg-gray-100 text-gray-800',
  };

  const roleLabels = {
    'super-admin': 'Super Admin',
    'manager': 'Manager',
    'operator': 'Opérateur',
    'viewer': 'Consulteur',
  };

  const statusColors = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    'active': 'Actif',
    'inactive': 'Inactif',
  };

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur système ?')) {
      setSystemUsers(systemUsers.filter(user => user.id !== userId));
    }
  };

  const handleSave = (userData) => {
    if (selectedUser) {
      setSystemUsers(systemUsers.map(user => 
        user.id === selectedUser.id 
          ? { ...userData, id: selectedUser.id }
          : user
      ));
    } else {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
      };
      setSystemUsers([...systemUsers, newUser]);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher utilisateurs système..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
        
        <Button onClick={handleAddUser} className="fleet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter utilisateur
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{systemUsers.length}</p>
          <p className="text-sm text-muted-foreground">Total utilisateurs</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {systemUsers.filter(u => u.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Actifs</p>
        </div>
        <div className="fleet-card text-center">
          <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {systemUsers.filter(u => u.role === 'super-admin' || u.role === 'manager').length}
          </p>
          <p className="text-sm text-muted-foreground">Administrateurs</p>
        </div>
        <div className="fleet-card text-center">
          <Key className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {systemUsers.filter(u => u.lastLogin && new Date(u.lastLogin).getTime() > Date.now() - 24*60*60*1000).length}
          </p>
          <p className="text-sm text-muted-foreground">Connectés 24h</p>
        </div>
      </div>

      {/* Table des utilisateurs système */}
      <div className="fleet-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Utilisateurs Système ({filteredUsers.length})
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              Paramètres sécurité
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Utilisateur</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Rôle</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Permissions</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Dernière connexion</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{user.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map((perm) => (
                        <span key={perm} className="px-2 py-1 bg-muted rounded text-xs">
                          {perm}
                        </span>
                      ))}
                      {user.permissions.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{user.permissions.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{user.lastLogin}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => console.log('Voir', user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchTerm ? `Aucun utilisateur trouvé pour "${searchTerm}"` : 'Aucun utilisateur système'}
            </p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification d'utilisateur */}
      {showModal && (
        <UserManagementModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
