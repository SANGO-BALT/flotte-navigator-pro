
import React, { useState } from 'react';
import { Search, Plus, Users, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserModal from './UserModal';

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@entreprise.com',
      phone: '06 12 34 56 78',
      birthDate: '1985-03-15',
      gender: 'M',
      address: '123 Rue de la Paix, 75001 Paris',
      profession: 'Chauffeur',
      grade: 'Senior',
      licenseNumber: 'PC123456789',
      status: 'active',
      joinDate: '2020-01-15',
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@entreprise.com',
      phone: '06 98 76 54 32',
      birthDate: '1990-07-22',
      gender: 'F',
      address: '456 Avenue des Champs, 69002 Lyon',
      profession: 'Gestionnaire de flotte',
      grade: 'Manager',
      licenseNumber: 'PC987654321',
      status: 'active',
      joinDate: '2019-05-10',
    },
    {
      id: '3',
      firstName: 'Pierre',
      lastName: 'Durand',
      email: 'pierre.durand@entreprise.com',
      phone: '06 11 22 33 44',
      birthDate: '1982-11-08',
      gender: 'M',
      address: '789 Boulevard Central, 13001 Marseille',
      profession: 'Mécanicien',
      grade: 'Technicien',
      licenseNumber: 'PC456789123',
      status: 'inactive',
      joinDate: '2021-03-20',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
      console.log('Utilisateur supprimé:', userId);
    }
  };

  const handleViewUser = (user) => {
    console.log('Voir détails utilisateur:', user);
    // Ici vous pouvez ouvrir un modal de détails ou naviguer vers une page détail
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Modifier utilisateur existant
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...userData, id: selectedUser.id }
          : user
      ));
    } else {
      // Ajouter nouvel utilisateur
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };
      setUsers([...users, newUser]);
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Actif',
    inactive: 'Inactif',
  };

  return (
    <div className="p-6">
      {/* Header avec recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, n° permis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={handleAddUser} className="fleet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter utilisateur
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
          <p className="text-sm text-muted-foreground">Total utilisateurs</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">Actifs</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'inactive').length}</p>
          <p className="text-sm text-muted-foreground">Inactifs</p>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="fleet-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Nom complet</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Profession</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Grade</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">N° Permis</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.gender === 'M' ? 'Homme' : 'Femme'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{user.profession}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{user.grade}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-mono text-foreground">{user.licenseNumber}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
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
              Aucun utilisateur trouvé pour "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification d'utilisateur */}
      {showModal && (
        <UserModal 
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersPage;
