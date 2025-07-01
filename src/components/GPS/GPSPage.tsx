
import React, { useState } from 'react';
import { MapPin, Navigation, Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MapComponent from './MapComponent';

const GPSPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('all');

  const vehicles = [
    {
      id: '1',
      plate: 'AB-123-CD',
      brand: 'Peugeot 308',
      status: 'en-mouvement',
      location: 'Avenue des Champs-Élysées, 75008 Paris',
      speed: 45,
      lastUpdate: '2024-07-01 14:30',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    {
      id: '2',
      plate: 'EF-456-GH',
      brand: 'Renault Trafic',
      status: 'arrêté',
      location: 'Place Bellecour, 69002 Lyon',
      speed: 0,
      lastUpdate: '2024-07-01 14:25',
      coordinates: { lat: 45.7578, lng: 4.8320 },
    },
    {
      id: '3',
      plate: 'IJ-789-KL',
      brand: 'Yamaha MT-07',
      status: 'en-mouvement',
      location: 'Vieux-Port, 13001 Marseille',
      speed: 30,
      lastUpdate: '2024-07-01 14:32',
      coordinates: { lat: 43.2965, lng: 5.3698 },
    },
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedVehicle === 'all' || vehicle.id === selectedVehicle;
    
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    'en-mouvement': 'bg-green-100 text-green-800',
    'arrêté': 'bg-orange-100 text-orange-800',
    'hors-ligne': 'bg-red-100 text-red-800',
  };

  const handleRefresh = () => {
    console.log('Actualisation des positions GPS...');
    // Simulation de rafraîchissement
  };

  const handleViewHistory = (vehicleId: string) => {
    console.log('Voir historique GPS du véhicule:', vehicleId);
    alert('Historique GPS - Fonctionnalité en développement');
  };

  return (
    <div className="p-6">
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">Tous les véhicules</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate} - {vehicle.brand}
              </option>
            ))}
          </select>
          
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          
          <Button className="fleet-button-primary">
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte avec OpenStreetMap intégré */}
        <div className="lg:col-span-2">
          <div className="fleet-card h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Carte temps réel - OpenStreetMap</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Centrer
                </Button>
                <Button variant="outline" size="sm">
                  Plein écran
                </Button>
              </div>
            </div>
            
            {/* Carte OpenStreetMap intégrée */}
            <div className="w-full h-80">
              <MapComponent 
                vehicles={filteredVehicles} 
                selectedVehicle={selectedVehicle !== 'all' ? selectedVehicle : undefined}
              />
            </div>
          </div>
        </div>

        {/* Liste des véhicules */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Véhicules trackés</h3>
          
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="fleet-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{vehicle.plate}</h4>
                  <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
                  {vehicle.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-foreground">{vehicle.location}</p>
                </div>
                
                {vehicle.status === 'en-mouvement' && (
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-foreground">{vehicle.speed} km/h</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    GPS: {vehicle.coordinates.lat.toFixed(4)}, {vehicle.coordinates.lng.toFixed(4)}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Dernière mise à jour: {vehicle.lastUpdate}
                </p>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  Localiser
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewHistory(vehicle.id)}
                >
                  Historique
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'en-mouvement').length}</p>
          <p className="text-sm text-muted-foreground">En mouvement</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'arrêté').length}</p>
          <p className="text-sm text-muted-foreground">Arrêtés</p>
        </div>
        <div className="fleet-card text-center">
          <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
          <p className="text-sm text-muted-foreground">Total géolocalisés</p>
        </div>
        <div className="fleet-card text-center">
          <Navigation className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {Math.round(vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length)}
          </p>
          <p className="text-sm text-muted-foreground">Vitesse moyenne</p>
        </div>
      </div>
    </div>
  );
};

export default GPSPage;
