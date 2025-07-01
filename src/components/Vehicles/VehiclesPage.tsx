
import React, { useState } from 'react';
import { Search, Plus, Filter, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VehicleCard from './VehicleCard';
import VehicleModal from './VehicleModal';

const VehiclesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showOldVehicles, setShowOldVehicles] = useState(false);

  // Données d'exemple des véhicules
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      plate: 'AB-123-CD',
      brand: 'Peugeot',
      model: '308',
      type: 'Voiture',
      year: '2019',
      serviceDate: '2019-03-15',
      circulationDate: '2019-03-20',
      image: '/placeholder.svg',
      status: 'active',
      mileage: '85000',
      nextMaintenance: '2024-08-15',
      transmission: 'Manuelle',
    },
    {
      id: '2',
      plate: 'EF-456-GH',
      brand: 'Renault',
      model: 'Trafic',
      type: 'Utilitaire',
      year: '2020',
      serviceDate: '2020-01-10',
      circulationDate: '2020-01-15',
      image: '/placeholder.svg',
      status: 'maintenance',
      mileage: '120000',
      nextMaintenance: '2024-07-30',
      transmission: 'Automatique',
    },
    {
      id: '3',
      plate: 'IJ-789-KL',
      brand: 'Yamaha',
      model: 'MT-07',
      type: 'Moto',
      year: '2018',
      serviceDate: '2018-06-25',
      circulationDate: '2018-06-25',
      image: '/placeholder.svg',
      status: 'active',
      mileage: '45000',
      nextMaintenance: '2024-09-10',
      transmission: 'Manuelle',
    },
  ]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || vehicle.type.toLowerCase() === filterType.toLowerCase();
    
    const serviceYears = new Date().getFullYear() - new Date(vehicle.serviceDate).getFullYear();
    const matchesAgeFilter = showOldVehicles ? serviceYears >= 5 : true;
    
    return matchesSearch && matchesFilter && matchesAgeFilter;
  });

  const oldVehiclesCount = vehicles.filter(v => {
    const serviceYears = new Date().getFullYear() - new Date(v.serviceDate).getFullYear();
    return serviceYears >= 5;
  }).length;

  const handleUpdateVehicle = (updatedVehicle: any) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleAddVehicle = (newVehicle: any) => {
    const vehicleWithId = { ...newVehicle, id: Date.now().toString() };
    setVehicles(prev => [...prev, vehicleWithId]);
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
          </select>
          
          <Button 
            variant={showOldVehicles ? "default" : "outline"}
            onClick={() => setShowOldVehicles(!showOldVehicles)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            ≥ 5 ans ({oldVehiclesCount})
          </Button>
          
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
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">En service</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'maintenance').length}</p>
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
            vehicle={vehicle} 
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
