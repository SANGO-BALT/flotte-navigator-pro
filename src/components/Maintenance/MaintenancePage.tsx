
import React, { useState } from 'react';
import { Search, Plus, Wrench, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaintenanceModal from './MaintenanceModal';

const MaintenancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const maintenances = [
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      vehicleBrand: 'Peugeot 308',
      type: 'Révision générale',
      scheduledDate: '2024-08-15',
      status: 'programmée',
      priority: 'normale',
      description: 'Révision des 60 000 km',
      cost: 450,
    },
    {
      id: '2',
      vehiclePlate: 'EF-456-GH',
      vehicleBrand: 'Renault Trafic',
      type: 'Réparation',
      scheduledDate: '2024-07-30',
      status: 'en-cours',
      priority: 'urgente',
      description: 'Problème de freinage',
      cost: 320,
    },
    {
      id: '3',
      vehiclePlate: 'IJ-789-KL',
      vehicleBrand: 'Yamaha MT-07',
      type: 'Contrôle technique',
      scheduledDate: '2024-09-10',
      status: 'terminée',
      priority: 'normale',
      description: 'Contrôle technique annuel',
      cost: 78,
    },
  ];

  const filteredMaintenances = maintenances.filter(maintenance => {
    const matchesSearch = maintenance.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || maintenance.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    'programmée': 'bg-blue-100 text-blue-800',
    'en-cours': 'bg-orange-100 text-orange-800',
    'terminée': 'bg-green-100 text-green-800',
    'annulée': 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    'normale': 'bg-gray-100 text-gray-800',
    'urgente': 'bg-red-100 text-red-800',
    'critique': 'bg-red-200 text-red-900',
  };

  return (
    <div className="p-6">
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par plaque, véhicule, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">Tous les statuts</option>
            <option value="programmée">Programmée</option>
            <option value="en-cours">En cours</option>
            <option value="terminée">Terminée</option>
            <option value="annulée">Annulée</option>
          </select>
          
          <Button onClick={() => setShowModal(true)} className="fleet-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Programmer maintenance
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Wrench className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{maintenances.length}</p>
          <p className="text-sm text-muted-foreground">Total maintenances</p>
        </div>
        <div className="fleet-card text-center">
          <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{maintenances.filter(m => m.status === 'programmée').length}</p>
          <p className="text-sm text-muted-foreground">Programmées</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{maintenances.filter(m => m.status === 'en-cours').length}</p>
          <p className="text-sm text-muted-foreground">En cours</p>
        </div>
        <div className="fleet-card text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{maintenances.filter(m => m.priority === 'urgente').length}</p>
          <p className="text-sm text-muted-foreground">Urgentes</p>
        </div>
      </div>

      {/* Liste des maintenances */}
      <div className="fleet-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Véhicule</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date prévue</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Priorité</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Coût</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map((maintenance) => (
                <tr key={maintenance.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{maintenance.vehiclePlate}</p>
                      <p className="text-sm text-muted-foreground">{maintenance.vehicleBrand}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{maintenance.type}</p>
                    <p className="text-xs text-muted-foreground">{maintenance.description}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{new Date(maintenance.scheduledDate).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[maintenance.status]}`}>
                      {maintenance.status.charAt(0).toUpperCase() + maintenance.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[maintenance.priority]}`}>
                      {maintenance.priority.charAt(0).toUpperCase() + maintenance.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-foreground">{maintenance.cost}€</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de maintenance */}
      {showModal && (
        <MaintenanceModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MaintenancePage;
