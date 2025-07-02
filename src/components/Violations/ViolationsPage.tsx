
import React, { useState } from 'react';
import { Search, Plus, AlertTriangle, Calendar, Eye, Edit, Trash, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ViolationModal from './ViolationModal';
import ViolationPrintModal from './ViolationPrintModal';

const ViolationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [editingViolation, setEditingViolation] = useState(null);

  const [violations, setViolations] = useState([
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      vehicleBrand: 'Peugeot 308',
      type: 'excès-vitesse',
      date: '2024-06-15',
      location: 'Boulevard Triomphal, Libreville',
      amount: 75000,
      status: 'en-attente',
      description: 'Excès de vitesse de 15 km/h au-dessus de la limite autorisée',
      driverName: 'Jean Dupont',
      referenceNumber: 'CV2024001',
    },
    {
      id: '2',
      vehiclePlate: 'EF-456-GH',
      vehicleBrand: 'Renault Trafic',
      type: 'stationnement',
      date: '2024-06-20',
      location: 'Centre-ville, Port-Gentil',
      amount: 25000,
      status: 'payée',
      description: 'Stationnement interdit zone bleue',
      driverName: 'Marie Martin',
      referenceNumber: 'CV2024002',
    },
    {
      id: '3',
      vehiclePlate: 'IJ-789-KL',
      vehicleBrand: 'Yamaha MT-07',
      type: 'feux-rouge',
      date: '2024-06-25',
      location: 'Carrefour Rond-Point, Libreville',
      amount: 50000,
      status: 'contestée',
      description: 'Passage au feu rouge',
      driverName: 'Pierre Durand',
      referenceNumber: 'CV2024003',
    },
  ]);

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = violations.reduce((sum, violation) => sum + violation.amount, 0);
  const paidAmount = violations.filter(v => v.status === 'payée').reduce((sum, v) => sum + v.amount, 0);
  const pendingAmount = violations.filter(v => v.status === 'en-attente').reduce((sum, v) => sum + v.amount, 0);

  const statusColors = {
    'en-attente': 'bg-orange-100 text-orange-800',
    'payée': 'bg-green-100 text-green-800',
    'contestée': 'bg-blue-100 text-blue-800',
    'annulée': 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    'en-attente': 'En attente',
    'payée': 'Payée',
    'contestée': 'Contestée',
    'annulée': 'Annulée',
  };

  const typeLabels = {
    'excès-vitesse': 'Excès de vitesse',
    'stationnement': 'Stationnement',
    'feux-rouge': 'Feux rouge',
    'téléphone': 'Téléphone au volant',
    'ceinture': 'Ceinture de sécurité',
    'autre': 'Autre',
  };

  const handleView = (violation) => {
    setSelectedViolation(violation);
    setShowPrintModal(true);
  };

  const handleEdit = (violation) => {
    setEditingViolation(violation);
    setShowModal(true);
  };

  const handleDelete = (violationId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette contravention ?')) {
      setViolations(violations.filter(violation => violation.id !== violationId));
    }
  };

  const handlePrint = (violation) => {
    setSelectedViolation(violation);
    setShowPrintModal(true);
  };

  const handleSave = (violationData) => {
    if (editingViolation) {
      setViolations(violations.map(violation => 
        violation.id === editingViolation.id 
          ? { ...violationData, id: editingViolation.id, referenceNumber: editingViolation.referenceNumber }
          : violation
      ));
    } else {
      const newViolation = {
        ...violationData,
        id: Date.now().toString(),
        referenceNumber: `CV${new Date().getFullYear()}${String(violations.length + 1).padStart(3, '0')}`,
      };
      setViolations([...violations, newViolation]);
    }
    setEditingViolation(null);
  };

  return (
    <div className="p-6">
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par plaque, conducteur, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les statuts</option>
          <option value="en-attente">En attente</option>
          <option value="payée">Payées</option>
          <option value="contestée">Contestées</option>
          <option value="annulée">Annulées</option>
        </select>
        
        <Button onClick={() => setShowModal(true)} className="fleet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter contravention
        </Button>
      </div>

      {/* Statistiques en FCFA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{violations.length}</p>
          <p className="text-sm text-muted-foreground">Total contraventions</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{pendingAmount.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground">En attente</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{paidAmount.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground">Payées</p>
        </div>
        <div className="fleet-card text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalAmount.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground">Montant total</p>
        </div>
      </div>

      {/* Liste des contraventions avec actions */}
      <div className="fleet-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Contraventions ({filteredViolations.length})
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              Statistiques
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Référence</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Véhicule</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Conducteur</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Montant</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr key={violation.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="font-mono text-sm text-foreground">{violation.referenceNumber}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{new Date(violation.date).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{violation.vehiclePlate}</p>
                      <p className="text-sm text-muted-foreground">{violation.vehicleBrand}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{violation.driverName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{typeLabels[violation.type]}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-foreground">{violation.amount.toLocaleString()} FCFA</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[violation.status]}`}>
                      {statusLabels[violation.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(violation)} title="Voir">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handlePrint(violation)} title="Imprimer">
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(violation)} title="Modifier">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(violation.id)} title="Supprimer">
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredViolations.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchTerm ? `Aucune contravention trouvée pour "${searchTerm}"` : 'Aucune contravention enregistrée'}
            </p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification de contravention */}
      {showModal && (
        <ViolationModal
          violation={editingViolation}
          onClose={() => {
            setShowModal(false);
            setEditingViolation(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Modal d'impression de contravention */}
      {showPrintModal && selectedViolation && (
        <ViolationPrintModal
          violation={selectedViolation}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedViolation(null);
          }}
        />
      )}
    </div>
  );
};

export default ViolationsPage;
