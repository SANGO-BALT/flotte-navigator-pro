
import React, { useState } from 'react';
import { Search, Plus, Wrench, Calendar, AlertTriangle, Eye, Edit, Trash, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaintenanceModal from './MaintenanceModal';

const MaintenancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  const [maintenances, setMaintenances] = useState([
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      vehicleBrand: 'Peugeot 308',
      type: 'révision',
      scheduledDate: '2024-08-15',
      description: 'Révision générale 50 000 km',
      priority: 'normale',
      status: 'planifiée',
      estimatedCost: 350,
      garage: 'Garage Martin',
      createdDate: '2024-07-01',
    },
    {
      id: '2',
      vehiclePlate: 'EF-456-GH',
      vehicleBrand: 'Renault Trafic',
      type: 'réparation',
      scheduledDate: '2024-07-30',
      description: 'Réparation système de freinage',
      priority: 'urgente',
      status: 'en-cours',
      estimatedCost: 650,
      garage: 'Garage Central',
      createdDate: '2024-06-15',
    },
    {
      id: '3',
      vehiclePlate: 'IJ-789-KL',
      vehicleBrand: 'Yamaha MT-07',
      type: 'contrôle-technique',
      scheduledDate: '2024-09-10',
      description: 'Contrôle technique réglementaire',
      priority: 'normale',
      status: 'terminée',
      estimatedCost: 85,
      garage: 'Centre de contrôle Auto+',
      createdDate: '2024-05-20',
      completedDate: '2024-06-10',
      finalCost: 85,
    },
  ]);

  const filteredMaintenances = maintenances.filter(maintenance => {
    const matchesSearch = 
      maintenance.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.garage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || maintenance.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddMaintenance = () => {
    setSelectedMaintenance(null);
    setShowModal(true);
  };

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowModal(true);
  };

  const handleDeleteMaintenance = (maintenanceId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) {
      setMaintenances(prev => prev.filter(m => m.id !== maintenanceId));
    }
  };

  const handleSaveMaintenance = (maintenanceData) => {
    if (selectedMaintenance) {
      setMaintenances(prev => prev.map(m => 
        m.id === selectedMaintenance.id 
          ? { ...maintenanceData, id: selectedMaintenance.id }
          : m
      ));
    } else {
      const newMaintenance = {
        ...maintenanceData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'planifiée',
      };
      setMaintenances(prev => [...prev, newMaintenance]);
    }
  };

  const handlePrintMaintenance = (maintenance) => {
    console.log('Imprimer maintenance:', maintenance);
    // Simulation d'impression
    window.print();
  };

  const statusColors = {
    'planifiée': 'bg-blue-100 text-blue-800',
    'en-cours': 'bg-orange-100 text-orange-800',
    'terminée': 'bg-green-100 text-green-800',
    'annulée': 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    'normale': 'bg-gray-100 text-gray-800',
    'urgente': 'bg-orange-100 text-orange-800',
    'critique': 'bg-red-100 text-red-800',
  };

  const typeLabels = {
    'révision': 'Révision',
    'réparation': 'Réparation',
    'contrôle-technique': 'Contrôle technique',
    'vidange': 'Vidange',
    'pneus': 'Changement pneus',
    'autre': 'Autre',
  };

  return (
    <div className="p-6">
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par véhicule, type, garage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">Tous les statuts</option>
            <option value="planifiée">Planifiées</option>
            <option value="en-cours">En cours</option>
            <option value="terminée">Terminées</option>
            <option value="annulée">Annulées</option>
          </select>
          
          <Button onClick={handleAddMaintenance} className="fleet-button-primary">
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
          <p className="text-2xl font-bold text-foreground">{maintenances.filter(m => m.status === 'planifiée').length}</p>
          <p className="text-sm text-muted-foreground">Planifiées</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Wrench className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{maintenances.filter(m => m.status === 'en-cours').length}</p>
          <p className="text-sm text-muted-foreground">En cours</p>
        </div>
        <div className="fleet-card text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{maintenances.filter(m => m.priority === 'critique' || m.priority === 'urgente').length}</p>
          <p className="text-sm text-muted-foreground">Urgentes</p>
        </div>
      </div>

      {/* Table des maintenances */}
      <div className="fleet-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Véhicule</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date prévue</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Priorité</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
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
                    <p className="text-sm text-foreground">{typeLabels[maintenance.type] || maintenance.type}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">
                      {new Date(maintenance.scheduledDate).toLocaleDateString('fr-FR')}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[maintenance.priority]}`}>
                      {maintenance.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[maintenance.status]}`}>
                      {maintenance.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">
                      {maintenance.finalCost || maintenance.estimatedCost}€
                      {maintenance.finalCost && maintenance.finalCost !== maintenance.estimatedCost && (
                        <span className="text-xs text-muted-foreground block">
                          (prévu: {maintenance.estimatedCost}€)
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePrintMaintenance(maintenance)}
                        title="Imprimer"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditMaintenance(maintenance)}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteMaintenance(maintenance.id)}
                        title="Supprimer"
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMaintenances.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Aucune maintenance trouvée
            </p>
          </div>
        )}
      </div>

      {/* Modal de maintenance */}
      {showModal && (
        <MaintenanceModal 
          maintenance={selectedMaintenance}
          onClose={() => {
            setShowModal(false);
            setSelectedMaintenance(null);
          }}
          onSave={handleSaveMaintenance}
        />
      )}
    </div>
  );
};

export default MaintenancePage;
