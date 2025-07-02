import React, { useState } from 'react';
import { MapPin, Navigation, Search, Filter, RefreshCw, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GabonMapComponent from './GabonMapComponent';
import GPSHistoryModal from './GPSHistoryModal';

const GPSPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState<string>('');

  // Véhicules avec coordonnées réelles du Gabon
  const vehicles = [
    {
      id: '1',
      plate: 'AB-123-CD',
      brand: 'Peugeot 308',
      status: 'en-mouvement',
      location: 'Avenue Bouet, Libreville',
      speed: 45,
      lastUpdate: '2024-07-01 14:30',
      coordinates: { lat: 0.4162, lng: 9.4673 }, // Libreville (capitale)
    },
    {
      id: '2',
      plate: 'EF-456-GH',
      brand: 'Renault Trafic',
      status: 'arrêté',
      location: 'Port Môle, Port-Gentil',
      speed: 0,
      lastUpdate: '2024-07-01 14:25',
      coordinates: { lat: -0.7193, lng: 8.7815 }, // Port-Gentil (ville pétrolière)
    },
    {
      id: '3',
      plate: 'IJ-789-KL',
      brand: 'Yamaha MT-07',
      status: 'en-mouvement',
      location: 'Centre-ville, Franceville',
      speed: 30,
      lastUpdate: '2024-07-01 14:32',
      coordinates: { lat: -1.6332, lng: 13.5833 }, // Franceville (sud-est)
    },
    {
      id: '4',
      plate: 'MN-012-OP',
      brand: 'Toyota Hilux',
      status: 'hors-ligne',
      location: 'Route Nationale, Oyem',
      speed: 0,
      lastUpdate: '2024-07-01 13:45',
      coordinates: { lat: 1.5993, lng: 11.5793 }, // Oyem (nord)
    },
    {
      id: '5',
      plate: 'QR-345-ST',
      brand: 'Mercedes Sprinter',
      status: 'en-mouvement',
      location: 'Lambaréné, Route Albert Schweitzer',
      speed: 55,
      lastUpdate: '2024-07-01 14:35',
      coordinates: { lat: -0.6998, lng: 10.2443 }, // Lambaréné (centre)
    },
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVehicleFilter = selectedVehicle === 'all' || vehicle.id === selectedVehicle;
    const matchesStatusFilter = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesVehicleFilter && matchesStatusFilter;
  });

  const statusColors = {
    'en-mouvement': 'bg-green-100 text-green-800',
    'arrêté': 'bg-orange-100 text-orange-800',
    'hors-ligne': 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    'en-mouvement': 'En mouvement',
    'arrêté': 'Arrêté',
    'hors-ligne': 'Hors ligne',
  };

  const handleRefresh = () => {
    console.log('Actualisation des positions GPS...');
    alert('Positions GPS actualisées');
  };

  const handleViewHistory = (vehicleId: string) => {
    setSelectedVehicleForHistory(vehicleId);
    setShowHistory(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedVehicle('all');
    setStatusFilter('all');
  };

  return (
    <div className="p-6">
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="all">Tous les statuts</option>
              <option value="en-mouvement">En mouvement</option>
              <option value="arrêté">Arrêtés</option>
              <option value="hors-ligne">Hors ligne</option>
            </select>
            
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>

            <Button onClick={handleResetFilters} variant="outline">
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Filtres rapides par statut */}
        <div className="flex gap-2 text-sm">
          <Button variant={statusFilter === 'en-mouvement' ? 'default' : 'outline'} size="sm"
                  onClick={() => setStatusFilter(statusFilter === 'en-mouvement' ? 'all' : 'en-mouvement')}>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            En mouvement ({vehicles.filter(v => v.status === 'en-mouvement').length})
          </Button>
          <Button variant={statusFilter === 'arrêté' ? 'default' : 'outline'} size="sm"
                  onClick={() => setStatusFilter(statusFilter === 'arrêté' ? 'all' : 'arrêté')}>
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            Arrêtés ({vehicles.filter(v => v.status === 'arrêté').length})
          </Button>
          <Button variant={statusFilter === 'hors-ligne' ? 'default' : 'outline'} size="sm"
                  onClick={() => setStatusFilter(statusFilter === 'hors-ligne' ? 'all' : 'hors-ligne')}>
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Hors ligne ({vehicles.filter(v => v.status === 'hors-ligne').length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte du Gabon */}
        <div className="lg:col-span-2">
          <div className="fleet-card h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Carte du Gabon - Suivi GPS</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Centrer sur Gabon
                </Button>
                <Button variant="outline" size="sm">
                  Plein écran
                </Button>
              </div>
            </div>
            
            <div className="w-full h-80">
              <GabonMapComponent 
                vehicles={filteredVehicles} 
                selectedVehicle={selectedVehicle !== 'all' ? selectedVehicle : undefined}
              />
            </div>
          </div>
        </div>

        {/* Liste des véhicules avec coordonnées du Gabon */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Véhicules trackés au Gabon ({filteredVehicles.length})
          </h3>
          
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="fleet-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{vehicle.plate}</h4>
                  <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
                  {statusLabels[vehicle.status]}
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
                    Coordonnées Gabon: {vehicle.coordinates.lat.toFixed(4)}°, {vehicle.coordinates.lng.toFixed(4)}°
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Dernière mise à jour: {vehicle.lastUpdate}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  Localiser sur carte
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewHistory(vehicle.id)}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Historique GPS
                </Button>
              </div>
            </div>
          ))}

          {filteredVehicles.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun véhicule trouvé au Gabon</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques GPS Gabon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'en-mouvement').length}</p>
          <p className="text-sm text-muted-foreground">En mouvement au Gabon</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'arrêté').length}</p>
          <p className="text-sm text-muted-foreground">Arrêtés</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{vehicles.filter(v => v.status === 'hors-ligne').length}</p>
          <p className="text-sm text-muted-foreground">Hors ligne</p>
        </div>
        <div className="fleet-card text-center">
          <Navigation className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {Math.round(vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length)}
          </p>
          <p className="text-sm text-muted-foreground">Vitesse moyenne (km/h)</p>
        </div>
      </div>

      {/* Modal d'historique GPS */}
      {showHistory && (
        <GPSHistoryModal
          vehicleId={selectedVehicleForHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default GPSPage;
