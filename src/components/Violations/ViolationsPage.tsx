
import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, Calendar, Eye, Edit, Trash, Printer, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FleetDatabase } from '@/services/fleetDatabase';
import { Violation } from '@/types/fleet';
import ViolationModal from './ViolationModal';
import ViolationPrintModal from './ViolationPrintModal';

// Type adapter for components that expect different Violation interface
interface ComponentViolation {
  id?: string;
  vehiclePlate: string;
  vehicleBrand?: string;
  type: string;
  date: string;
  location: string;
  amount: string;
  status: string;
  description: string;
  driverName: string;
  referenceNumber?: string;
}

const ViolationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<ComponentViolation | null>(null);
  const [editingViolation, setEditingViolation] = useState<Violation | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = () => {
    const violationsList = FleetDatabase.getViolations();
    setViolations(violationsList);
  };

  // Convert fleet Violation to component Violation
  const toComponentViolation = (violation: Violation): ComponentViolation => ({
    id: violation.id,
    vehiclePlate: violation.vehiclePlate || violation.vehiculeId || 'N/A',
    vehicleBrand: '', // Not available in fleet Violation type
    type: violation.type,
    date: violation.date,
    location: violation.lieu || violation.location || 'Non spécifié',
    amount: violation.montant?.toString() || violation.amount?.toString() || '0',
    status: violation.statut || violation.status || 'en-attente',
    description: violation.description || '',
    driverName: violation.conducteurNom || violation.driverName || violation.conducteur || 'Non spécifié',
    referenceNumber: violation.numeroReference || violation.numeroContravention,
  });

  // Convert component Violation to fleet Violation
  const toFleetViolation = (componentViolation: ComponentViolation, id?: string): Violation => ({
    id: id || Date.now().toString(),
    vehiculeId: componentViolation.vehiclePlate,
    vehiclePlate: componentViolation.vehiclePlate,
    conducteurId: 'unknown',
    conducteurNom: componentViolation.driverName,
    conducteur: componentViolation.driverName,
    type: componentViolation.type as any,
    description: componentViolation.description,
    date: componentViolation.date,
    lieu: componentViolation.location,
    montant: Number(componentViolation.amount),
    statut: componentViolation.status as any,
    numeroContravention: componentViolation.referenceNumber || '',
    numeroReference: componentViolation.referenceNumber,
    location: componentViolation.location,
    amount: Number(componentViolation.amount),
    status: componentViolation.status,
    driverName: componentViolation.driverName,
  });

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.vehiculeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.conducteurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.lieu.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || violation.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = violations.reduce((sum, violation) => sum + violation.montant, 0);
  const paidAmount = violations.filter(v => v.statut === 'payée').reduce((sum, v) => sum + v.montant, 0);
  const pendingAmount = violations.filter(v => v.statut === 'en-attente').reduce((sum, v) => sum + v.montant, 0);

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
    'feu-rouge': 'Feu rouge',
    'téléphone': 'Téléphone au volant',
    'ceinture': 'Ceinture de sécurité',
    'autre': 'Autre',
  };

  const handleView = (violation: Violation) => {
    setSelectedViolation(toComponentViolation(violation));
    setShowPrintModal(true);
  };

  const handleEdit = (violation: Violation) => {
    setEditingViolation(violation);
    setShowModal(true);
  };

  const handleDelete = (violationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette contravention ?')) {
      FleetDatabase.deleteViolation(violationId);
      loadViolations();
      toast({
        title: "Contravention supprimée",
        description: "La contravention a été supprimée avec succès.",
      });
    }
  };

  const handlePrint = (violation: Violation) => {
    setSelectedViolation(toComponentViolation(violation));
    setShowPrintModal(true);
  };

  const handleSave = (violationData: ComponentViolation) => {
    if (editingViolation) {
      const updatedViolation = toFleetViolation(violationData, editingViolation.id);
      FleetDatabase.updateViolation(editingViolation.id, updatedViolation);
      toast({
        title: "Contravention modifiée",
        description: "La contravention a été modifiée avec succès.",
      });
    } else {
      const newViolation = toFleetViolation(violationData);
      newViolation.numeroReference = `CV${new Date().getFullYear()}${String(violations.length + 1).padStart(3, '0')}`;
      FleetDatabase.addViolation(newViolation);
      toast({
        title: "Contravention ajoutée",
        description: "La nouvelle contravention a été enregistrée avec succès.",
      });
    }
    loadViolations();
    setEditingViolation(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(violations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `contraventions_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Export réussi",
      description: "Les contraventions ont été exportées avec succès.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedData)) {
            importedData.forEach(violation => {
              const newViolation: Violation = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                vehiculeId: violation.vehiculeId || violation.vehiclePlate || 'N/A',
                vehiclePlate: violation.vehiclePlate || violation.vehiculeId || 'N/A',
                conducteurId: violation.conducteurId || 'unknown',
                conducteurNom: violation.conducteurNom || violation.driverName || 'Non spécifié',
                type: violation.type || 'autre',
                description: violation.description || '',
                date: violation.date || new Date().toISOString().split('T')[0],
                lieu: violation.lieu || violation.location || 'Non spécifié',
                montant: Number(violation.montant || violation.amount || 0),
                statut: violation.statut || violation.status || 'en-attente',
                numeroContravention: violation.numeroContravention || violation.referenceNumber || '',
                numeroReference: violation.numeroReference || `CV${new Date().getFullYear()}${String(Math.random() * 1000).padStart(3, '0')}`,
                // Compatibility fields
                conducteur: violation.conducteurNom || violation.driverName || 'Non spécifié',
                location: violation.lieu || violation.location || 'Non spécifié',
                amount: Number(violation.montant || violation.amount || 0),
                status: violation.statut || violation.status || 'en-attente',
                driverName: violation.conducteurNom || violation.driverName || 'Non spécifié',
              };
              FleetDatabase.addViolation(newViolation);
            });
            loadViolations();
            toast({
              title: "Import réussi",
              description: `${importedData.length} contraventions importées avec succès.`,
            });
          }
        } catch (error) {
          toast({
            title: "Erreur d'import",
            description: "Le fichier n'est pas au bon format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
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
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
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
                    <p className="font-mono text-sm text-foreground">{violation.numeroReference || violation.numeroContravention}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{new Date(violation.date).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{violation.vehiculeId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{violation.conducteurNom}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{typeLabels[violation.type] || violation.type}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-foreground">{violation.montant.toLocaleString()} FCFA</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[violation.statut]}`}>
                      {statusLabels[violation.statut]}
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
          violation={editingViolation ? toComponentViolation(editingViolation) : null}
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
