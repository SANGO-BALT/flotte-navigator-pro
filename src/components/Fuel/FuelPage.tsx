
import React, { useState, useEffect } from 'react';
import { Search, Plus, Fuel, TrendingUp, Calendar, Eye, Edit, Trash, Printer, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FleetDatabase } from '@/services/fleetDatabase';
import { FuelRecord } from '@/types/fleet';
import FuelModal from './FuelModal';
import FuelTicketModal from './FuelTicketModal';

const FuelPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);

  useEffect(() => {
    loadFuelRecords();
  }, []);

  const loadFuelRecords = () => {
    const records = FleetDatabase.getFuelRecords();
    setFuelRecords(records);
  };

  const filteredRecords = fuelRecords.filter(record =>
    record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCost = fuelRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const totalQuantity = fuelRecords.reduce((sum, record) => sum + record.quantity, 0);
  const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

  const handleView = (record: FuelRecord) => {
    setSelectedRecord(record);
    setShowTicketModal(true);
  };

  const handleEdit = (record: FuelRecord) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plein ?')) {
      FleetDatabase.deleteFuelRecord(recordId);
      loadFuelRecords();
      toast({
        title: "Plein supprimé",
        description: "Le plein a été supprimé avec succès.",
      });
    }
  };

  const handlePrintTicket = (record: FuelRecord) => {
    setSelectedRecord(record);
    setShowTicketModal(true);
  };

  const handleSave = (recordData: Omit<FuelRecord, 'id'>) => {
    if (editingRecord) {
      FleetDatabase.updateFuelRecord(editingRecord.id, recordData);
      toast({
        title: "Plein modifié",
        description: "Le plein a été modifié avec succès.",
      });
    } else {
      FleetDatabase.addFuelRecord({
        ...recordData,
        id: Date.now().toString(),
      });
      toast({
        title: "Plein ajouté",
        description: "Le nouveau plein a été enregistré avec succès.",
      });
    }
    loadFuelRecords();
    setEditingRecord(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(fuelRecords, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `pleins_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées avec succès.",
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
            importedData.forEach(record => {
              FleetDatabase.addFuelRecord({
                ...record,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              });
            });
            loadFuelRecords();
            toast({
              title: "Import réussi",
              description: `${importedData.length} pleins importés avec succès.`,
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
      {/* Header avec recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par plaque, véhicule, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => setShowModal(true)} className="fleet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter plein
        </Button>
      </div>

      {/* Statistiques en FCFA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Fuel className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalQuantity.toFixed(0)}L</p>
          <p className="text-sm text-muted-foreground">Total consommé</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalCost.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground">Coût total</p>
        </div>
        <div className="fleet-card text-center">
          <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{averagePrice.toFixed(0)} FCFA/L</p>
          <p className="text-sm text-muted-foreground">Prix moyen</p>
        </div>
        <div className="fleet-card text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{fuelRecords.length}</p>
          <p className="text-sm text-muted-foreground">Pleins ce mois</p>
        </div>
      </div>

      {/* Liste des pleins avec actions */}
      <div className="fleet-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Historique des pleins</h3>
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
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Véhicule</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Carburant</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Quantité</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Prix/L</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Station</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{new Date(record.date).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{record.vehiclePlate}</p>
                      <p className="text-sm text-muted-foreground">{record.vehicleBrand}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.fuelType === 'diesel' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.fuelType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-foreground">{record.quantity}L</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{record.unitPrice.toLocaleString()} FCFA</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-foreground">{record.totalCost.toLocaleString()} FCFA</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{record.station}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(record)} title="Voir">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handlePrintTicket(record)} title="Imprimer ticket">
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} title="Modifier">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} title="Supprimer">
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/modification de plein */}
      {showModal && (
        <FuelModal 
          record={editingRecord}
          onClose={() => {
            setShowModal(false);
            setEditingRecord(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Modal de ticket d'impression */}
      {showTicketModal && selectedRecord && (
        <FuelTicketModal
          record={selectedRecord}
          onClose={() => {
            setShowTicketModal(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default FuelPage;
