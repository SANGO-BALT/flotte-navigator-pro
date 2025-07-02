import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Layers, Maximize, RotateCcw, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GPSHistoryModal from './GPSHistoryModal';

interface Vehicle {
  id: string;
  plate: string;
  coordinates: { lat: number; lng: number };
  status: string;
}

interface OpenStreetMapComponentProps {
  vehicles: Vehicle[];
  selectedVehicle?: string;
}

const OpenStreetMapComponent: React.FC<OpenStreetMapComponentProps> = ({ vehicles, selectedVehicle }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLayer, setMapLayer] = useState('standard');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Coordonnées du Gabon (Libreville comme centre)
  const gabonCenter = { lat: 0.4162, lng: 9.4673 };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Import dynamique de Leaflet
        const L = await import('leaflet');
        
        // Style CSS pour Leaflet
        if (!document.querySelector('#leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Initialiser la carte
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        const map = L.map(mapRef.current).setView([gabonCenter.lat, gabonCenter.lng], 7);
        leafletMapRef.current = map;

        // Couches de cartes
        const layers = {
          standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }),
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri'
          }),
          terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors'
          })
        };

        // Ajouter la couche par défaut
        layers[mapLayer].addTo(map);

        // Ajouter les véhicules
        vehicles.forEach((vehicle) => {
          const color = vehicle.status === 'en-mouvement' ? '#4caf50' : 
                       vehicle.status === 'arrêté' ? '#ff9800' : '#f44336';
          
          const marker = L.circleMarker([vehicle.coordinates.lat, vehicle.coordinates.lng], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);

          marker.bindPopup(`
            <div>
              <strong>${vehicle.plate}</strong><br>
              Statut: ${vehicle.status}<br>
              <button onclick="window.showVehicleHistory('${vehicle.id}')" class="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">
                Voir historique
              </button>
            </div>
          `);

          if (selectedVehicle === vehicle.id) {
            marker.openPopup();
            map.setView([vehicle.coordinates.lat, vehicle.coordinates.lng], 10);
          }
        });

        // Position utilisateur
        if (userLocation) {
          L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 10,
            fillColor: '#2196f3',
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map).bindPopup('Votre position');
        }

        // Fonction globale pour l'historique
        (window as any).showVehicleHistory = (vehicleId: string) => {
          setSelectedVehicleForHistory(vehicleId);
          setShowHistoryModal(true);
        };

        // Changer de couche
        const handleLayerChange = () => {
          map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
              map.removeLayer(layer);
            }
          });
          layers[mapLayer].addTo(map);
        };

        return () => {
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
          }
        };

      } catch (error) {
        console.error('Erreur lors du chargement de la carte:', error);
        // Fallback vers la carte personnalisée si Leaflet échoue
        createFallbackMap();
      }
    };

    initializeMap();
  }, [vehicles, selectedVehicle, mapLayer, userLocation]);

  const createFallbackMap = () => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
    // Coordonnées exactes du Gabon
    const gabonBounds = {
      north: 2.318109,
      south: -3.978809,
      east: 14.502347,
      west: 8.695471
    };

    const gabonCenter = {
      lat: -0.83,
      lng: 11.6
    };

    // Villes principales du Gabon
    const gabonCities = [
      { name: 'Libreville', lat: 0.4162, lng: 9.4673, isCapital: true, population: '703,904' },
      { name: 'Port-Gentil', lat: -0.7193, lng: 8.7815, isCapital: false, population: '136,462' },
      { name: 'Franceville', lat: -1.6332, lng: 13.5833, isCapital: false, population: '110,568' },
      { name: 'Oyem', lat: 1.5993, lng: 11.5793, isCapital: false, population: '60,685' },
      { name: 'Moanda', lat: -1.5336, lng: 13.1987, isCapital: false, population: '39,298' },
      { name: 'Mouila', lat: -1.8642, lng: 11.0564, isCapital: false, population: '22,469' },
      { name: 'Lambaréné', lat: -0.6998, lng: 10.2443, isCapital: false, population: '20,714' },
      { name: 'Tchibanga', lat: -2.8500, lng: 11.0167, isCapital: false, population: '19,365' },
    ];

    const mapLayers = {
      standard: {
        name: 'Standard',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #81d4fa 100%)',
        border: '#0277bd'
      },
      satellite: {
        name: 'Satellite',
        background: 'linear-gradient(135deg, #2e2e2e 0%, #1a1a1a 50%, #0a0a0a 100%)',
        border: '#4a4a4a'
      },
      terrain: {
        name: 'Terrain',
        background: 'linear-gradient(135deg, #8bc34a 0%, #4caf50 50%, #2e7d32 100%)',
        border: '#1b5e20'
      }
    };
    
    const currentLayer = mapLayers[mapLayer];
      
    // Container principal
    const mapDiv = document.createElement('div');
    mapDiv.style.cssText = `
      width: 100%;
      height: 100%;
      background: ${currentLayer.background};
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      border: 2px solid ${currentLayer.border};
      transform: scale(1);
      transform-origin: center;
      transition: transform 0.3s ease;
    `;

    // Océan Atlantique
    if (mapLayer === 'standard') {
      const oceanDiv = document.createElement('div');
      oceanDiv.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 15%;
        height: 100%;
        background: linear-gradient(90deg, #006064, #00838f);
        opacity: 0.7;
      `;
      mapDiv.appendChild(oceanDiv);
    }

    // Forme du Gabon
    const gabonShape = document.createElement('div');
    const shapeStyle = mapLayer === 'satellite' 
      ? 'background: linear-gradient(45deg, #4a4a4a, #666666, #333333);'
      : mapLayer === 'terrain'
      ? 'background: linear-gradient(45deg, #2e7d32, #388e3c, #43a047);'
      : 'background: linear-gradient(45deg, #2e7d32, #388e3c, #43a047);';
      
    gabonShape.style.cssText = `
      position: absolute;
      top: 15%;
      left: 15%;
      width: 70%;
      height: 70%;
      ${shapeStyle}
      border: 3px solid ${currentLayer.border};
      border-radius: 15% 85% 25% 75% / 85% 15% 85% 15%;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
    `;
    mapDiv.appendChild(gabonShape);

    // Villes
    gabonCities.forEach(city => {
      const x = ((city.lng - gabonBounds.west) / (gabonBounds.east - gabonBounds.west)) * 100;
      const y = ((gabonBounds.north - city.lat) / (gabonBounds.north - gabonBounds.south)) * 100;
        
      const cityMarker = document.createElement('div');
      cityMarker.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${city.isCapital ? '16px' : '12px'};
        height: ${city.isCapital ? '16px' : '12px'};
        background: ${city.isCapital ? '#d32f2f' : '#1976d2'};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        z-index: 10;
        transform: translate(-50%, -50%);
      `;
      cityMarker.title = `${city.name} - ${city.population} habitants`;
      mapDiv.appendChild(cityMarker);

      const cityLabel = document.createElement('div');
      cityLabel.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: calc(${y}% + 15px);
        font-size: ${city.isCapital ? '14px' : '11px'};
        font-weight: ${city.isCapital ? 'bold' : '600'};
        color: ${mapLayer === 'satellite' ? '#ffffff' : '#263238'};
        background: rgba(${mapLayer === 'satellite' ? '0,0,0' : '255,255,255'},0.9);
        padding: 3px 6px;
        border-radius: 4px;
        white-space: nowrap;
        transform: translateX(-50%);
        pointer-events: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        border: 1px solid #e0e0e0;
      `;
      cityLabel.textContent = city.name;
      mapDiv.appendChild(cityLabel);
    });

    // Véhicules
    vehicles.forEach((vehicle) => {
      if (vehicle.coordinates.lat < gabonBounds.south || 
          vehicle.coordinates.lat > gabonBounds.north ||
          vehicle.coordinates.lng < gabonBounds.west || 
          vehicle.coordinates.lng > gabonBounds.east) {
        return;
      }

      const x = ((vehicle.coordinates.lng - gabonBounds.west) / (gabonBounds.east - gabonBounds.west)) * 100;
      const y = ((gabonBounds.north - vehicle.coordinates.lat) / (gabonBounds.north - gabonBounds.south)) * 100;

      const marker = document.createElement('div');
      marker.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: 24px;
        height: 24px;
        background: ${vehicle.status === 'en-mouvement' ? '#4caf50' : vehicle.status === 'arrêté' ? '#ff9800' : '#f44336'};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
        z-index: 15;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
      `;
        
      marker.textContent = vehicle.plate.slice(-2);
      marker.title = `${vehicle.plate} - ${vehicle.status}`;
        
      if (vehicle.status === 'en-mouvement') {
        marker.style.animation = 'pulse 2s infinite';
      }
        
      if (selectedVehicle === vehicle.id) {
        marker.style.transform = 'translate(-50%, -50%) scale(1.5)';
        marker.style.boxShadow = '0 0 0 6px rgba(33, 150, 243, 0.4)';
        marker.style.zIndex = '20';
      }

      marker.addEventListener('click', () => {
        setSelectedVehicleForHistory(vehicle.id);
        setShowHistoryModal(true);
      });

      mapDiv.appendChild(marker);
    });

    // Position utilisateur
    if (userLocation) {
      const x = ((userLocation.lng - gabonBounds.west) / (gabonBounds.east - gabonBounds.west)) * 100;
      const y = ((gabonBounds.north - userLocation.lat) / (gabonBounds.north - gabonBounds.south)) * 100;

      const userMarker = document.createElement('div');
      userMarker.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: 20px;
        height: 20px;
        background: #2196f3;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.3);
        z-index: 25;
        transform: translate(-50%, -50%);
        animation: pulse 2s infinite;
      `;
      mapDiv.appendChild(userMarker);
    }

    mapContainer.appendChild(mapDiv);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([newLocation.lat, newLocation.lng], 12);
          }
        },
        (error) => {
          alert('Impossible de récupérer votre position: ' + error.message);
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  };

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([gabonCenter.lat, gabonCenter.lng], 7);
      setUserLocation(null);
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg border-2 border-blue-200 bg-blue-50 shadow-lg"
        style={{ minHeight: isFullscreen ? '100vh' : '400px' }}
      />
      
      {/* Contrôles de la carte */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
        {/* Sélecteur de couches */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <select
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value)}
            className="text-xs border-none bg-transparent focus:outline-none"
          >
            <option value="standard">Standard</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
        
        {/* Contrôles de zoom */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="w-8 h-8 p-0 rounded-none"
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="w-8 h-8 p-0 rounded-none border-t"
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Autres contrôles */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLocateUser}
            className="w-8 h-8 p-0 rounded-none"
            title="Ma position"
          >
            <Locate className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetView}
            className="w-8 h-8 p-0 rounded-none border-t"
            title="Réinitialiser la vue"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="w-8 h-8 p-0 rounded-none border-t"
            title="Plein écran"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md text-xs z-30">
        <div className="font-bold mb-2 text-blue-800">🇬🇦 Gabon - Suivi GPS</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>En mouvement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Arrêté</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Hors ligne</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Ma position</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal historique */}
      {showHistoryModal && (
        <GPSHistoryModal
          vehicleId={selectedVehicleForHistory}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedVehicleForHistory('');
          }}
        />
      )}
    </div>
  );
};

export default OpenStreetMapComponent;
