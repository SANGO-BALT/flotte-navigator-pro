import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Car, AlertTriangle, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FleetDatabase } from '@/services/fleetDatabase';
import { Vehicle as FleetVehicle } from '@/types/fleet';
import VehicleCard from './VehicleCard';
import VehicleModal from './VehicleModal';

// Type adapter interface for VehicleCard compatibility
interface VehicleCardData {
  id?: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  serviceDate: string;
  circulationDate: string;
  mileage: string;
  engine: string;
  fuel: string;
  transmission: string;
  insurance: string;
  registrationCard: string;
  vehicleFunction: string;
  image?: string;
  status?: string;
  nextMaintenance?: string;
}

const VehiclesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showOldVehicles, setShowOldVehicles] = useState(false);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    const vehiclesList = FleetDatabase.getVehicles();
    setVehicles(vehiclesList);
  };

  // Convert FleetVehicle to VehicleCardData
  const convertToCardData = (vehicle: FleetVehicle): VehicleCardData => ({
    id: vehicle.id,
    plate: vehicle.immatriculation,
    brand: vehicle.marque,
    model: vehicle.modele,
    type: vehicle.type,
    year: vehicle.annee.toString(),
    serviceDate: vehicle.dateAchat,
    circulationDate: vehicle.dateAchat,
    mileage: vehicle.kilometrage.toString(),
    engine: vehicle.numeroSerie,
    fuel: vehicle.carburant,
    transmission: 'manuelle',
    insurance: vehicle.dateAssurance,
    registrationCard: vehicle.numeroSerie,
    vehicleFunction: vehicle.responsable || 'fonction',
    image: vehicle.image,
    status: vehicle.statut === 'actif' ? 'active' : vehicle.statut === 'maintenance' ? 'maintenance' : 'inactive',
    nextMaintenance: vehicle.dateVisite,
  });

  // Convert VehicleCardData back to FleetVehicle
  const convertFromCardData = (cardData: VehicleCardData): Omit<FleetVehicle, 'id'> => ({
    marque: cardData.brand,
    modele: cardData.model,
    immatriculation: cardData.plate,
    annee: parseInt(cardData.year),
    type: cardData.type as 'voiture' | 'moto' | 'camion' | 'bus',
    statut: cardData.status === 'active' ? 'actif' : cardData.status === 'maintenance' ? 'maintenance' : 'hors-service',
    kilometrage: parseInt(cardData.mileage || '0'),
    dateAchat: cardData.serviceDate,
    prixAchat: 0,
    couleur: 'Non spécifiée',
    carburant: cardData.fuel as 'essence' | 'diesel' | 'electrique' | 'hybride',
    numeroSerie: cardData.engine || cardData.registrationCard,
    dateAssurance: cardData.insurance,
    dateVisite: cardData.nextMaintenance || cardData.serviceDate,
    responsable: cardData.vehicleFunction,
    notes: '',
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.modele.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || vehicle.type.toLowerCase() === filterType.toLowerCase();
    
    const serviceYears = new Date().getFullYear() - new Date(vehicle.dateAchat).getFullYear();
    const matchesAgeFilter = showOldVehicles ? serviceYears >= 5 : true;
    
    return matchesSearch && matchesFilter && matchesAgeFilter;
  });

  const oldVehiclesCount = vehicles.filter(v => {
    const serviceYears = new Date().getFullYear() - new Date(v.dateAchat).getFullYear();
    return serviceYears >= 5;
  }).length;

  const handleUpdateVehicle = (updatedCardData: VehicleCardData) => {
    if (updatedCardData.id) {
      const updatedFleetVehicle = convertFromCardData(updatedCardData);
      FleetDatabase.updateVehicle(updatedCardData.id, updatedFleetVehicle);
      loadVehicles();
      toast({
        title: "Véhicule modifié",
        description: "Le véhicule a été modifié avec succès.",
      });
    }
  };

  const handleAddVehicle = (newVehicleCardData: VehicleCardData) => {
    const newFleetVehicle = convertFromCardData(newVehicleCardData);
    FleetDatabase.addVehicle({
      ...newFleetVehicle,
      id: Date.now().toString(),
    });
    loadVehicles();
    toast({
      title: "Véhicule ajouté",
      description: "Le nouveau véhicule a été enregistré avec succès.",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(vehicles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `vehicules_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Export réussi",
      description: "Les véhicules ont été exportés avec succès.",
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
            importedData.forEach(vehicle => {
              FleetDatabase.addVehicle({
                ...vehicle,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              });
            });
            loadVehicles();
            toast({
              title: "Import réussi",
              description: `${importedData.length} véhicules importés avec succès.`,
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
            placeholder="Rechercher par plaque, marque, modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">Tous les véhicules</option>
            <option value="voiture">Voitures</option>
            <option value="utilitaire">Utilitaires</option>
            <option value="moto">Motos</option>
            <option value="camion">Camions</option>
          </select>
          
          <Button 
            variant={showOldVehicles ? "default" : "outline"}
            onClick={() => setShowOldVehicles(!showOldVehicles)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            ≥ 5 ans ({oldVehiclesCount})
          </Button>
          
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
          
          <Button onClick={() => setShowModal(true)} className="fleet-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter véhicule
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Car className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
          <p className="text-sm text-muted-foreground">Total véhicules</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.statut === 'actif').length}</p>
          <p className="text-sm text-muted-foreground">En service</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.statut === 'maintenance').length}</p>
          <p className="text-sm text-muted-foreground">En maintenance</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{oldVehiclesCount}</p>
          <p className="text-sm text-muted-foreground">≥ 5 ans service</p>
        </div>
      </div>

      {/* Liste des véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={convertToCardData(vehicle)} 
            onUpdate={handleUpdateVehicle}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Aucun véhicule trouvé
          </p>
        </div>
      )}

      {/* Modal d'ajout de véhicule */}
      {showModal && (
        <VehicleModal 
          onClose={() => setShowModal(false)}
          onSave={handleAddVehicle}
        />
      )}
    </div>
  );
};

export default VehiclesPage;
