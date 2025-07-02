import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Layers, Maximize, RotateCcw, ZoomIn, ZoomOut, Locate, Route, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GPSHistoryModal from './GPSHistoryModal';

interface Vehicle {
  id: string;
  plate: string;
  coordinates: { lat: number; lng: number };
  status: string;
  speed?: number;
  heading?: number;
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
  const [showTraffic, setShowTraffic] = useState(false);
  const [realTimeTracking, setRealTimeTracking] = useState(false);

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

        // Couches de cartes améliorées
        const layers = {
          standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }),
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
          }),
          terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
          }),
          dark: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '© Stadia Maps',
            maxZoom: 20
          })
        };

        // Ajouter la couche par défaut
        layers[mapLayer].addTo(map);

        // Groupe de marqueurs pour les véhicules
        const vehicleGroup = L.layerGroup().addTo(map);

        // Fonction pour créer une icône de véhicule personnalisée
        const createVehicleIcon = (vehicle: Vehicle) => {
          const color = vehicle.status === 'en-mouvement' ? '#4caf50' : 
                       vehicle.status === 'arrêté' ? '#ff9800' : '#f44336';
          
          const rotation = vehicle.heading || 0;
          
          return L.divIcon({
            html: `
              <div style="
                width: 30px; 
                height: 30px; 
                background: ${color}; 
                border: 3px solid white; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transform: rotate(${rotation}deg);
              ">
                <div style="
                  width: 0; 
                  height: 0; 
                  border-left: 5px solid transparent; 
                  border-right: 5px solid transparent; 
                  border-bottom: 8px solid white;
                "></div>
              </div>
            `,
            className: 'custom-vehicle-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
        };

        // Ajouter les véhicules avec icônes personnalisées
        vehicles.forEach((vehicle) => {
          const icon = createVehicleIcon(vehicle);
          
          const marker = L.marker([vehicle.coordinates.lat, vehicle.coordinates.lng], {
            icon: icon
          }).addTo(vehicleGroup);

          // Popup avec informations détaillées
          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${vehicle.plate}</h3>
              <p style="margin: 2px 0;"><strong>Statut:</strong> ${vehicle.status}</p>
              ${vehicle.speed ? `<p style="margin: 2px 0;"><strong>Vitesse:</strong> ${vehicle.speed} km/h</p>` : ''}
              <p style="margin: 2px 0;"><strong>Position:</strong> ${vehicle.coordinates.lat.toFixed(4)}, ${vehicle.coordinates.lng.toFixed(4)}</p>
              <div style="margin-top: 10px;">
                <button onclick="window.showVehicleHistory('${vehicle.id}')" 
                        style="background: #2196f3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                  Voir historique
                </button>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Animation pour les véhicules en mouvement
          if (vehicle.status === 'en-mouvement') {
            let pulse = 0;
            const pulseAnimation = setInterval(() => {
              pulse += 0.1;
              const scale = 1 + Math.sin(pulse) * 0.1;
              marker.getElement()?.style.setProperty('transform', `scale(${scale})`);
            }, 100);
            
            // Nettoyer l'animation après 10 secondes
            setTimeout(() => clearInterval(pulseAnimation), 10000);
          }

          if (selectedVehicle === vehicle.id) {
            marker.openPopup();
            map.setView([vehicle.coordinates.lat, vehicle.coordinates.lng], 12);
          }
        });

        // Position utilisateur avec précision
        if (userLocation) {
          const userIcon = L.divIcon({
            html: `
              <div style="
                width: 20px; 
                height: 20px; 
                background: #2196f3; 
                border: 4px solid white; 
                border-radius: 50%; 
                box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.3);
                animation: pulse 2s infinite;
              "></div>
            `,
            className: 'user-location-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('Votre position');
        }

        // Traçage d'itinéraires (simulation)
        const routeCoordinates = [
          [0.4162, 9.4673], // Libreville
          [-0.7193, 8.7815], // Port-Gentil
        ];

        if (showTraffic) {
          L.polyline(routeCoordinates, {
            color: '#ff6b6b',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10'
          }).addTo(map).bindPopup('Route principale Libreville - Port-Gentil');
        }

        // Fonction globale pour l'historique
        (window as any).showVehicleHistory = (vehicleId: string) => {
          setSelectedVehicleForHistory(vehicleId);
          setShowHistoryModal(true);
        };

        // Gestion des couches
        const layerControl = L.control.layers({
          'Standard': layers.standard,
          'Satellite': layers.satellite,
          'Terrain': layers.terrain,
          'Sombre': layers.dark
        }, {
          'Véhicules': vehicleGroup,
        }).addTo(map);

        // Mise à jour automatique en temps réel
        if (realTimeTracking) {
          const updateInterval = setInterval(() => {
            // Simulation de mise à jour des positions
            console.log('Mise à jour temps réel des positions GPS...');
          }, 5000);

          return () => clearInterval(updateInterval);
        }

        return () => {
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
          }
        };

      } catch (error) {
        console.error('Erreur lors du chargement de la carte:', error);
        // Fallback vers la carte personnalisée si Leaflet échoue
        createAdvancedFallbackMap();
      }
    };

    initializeMap();
  }, [vehicles, selectedVehicle, mapLayer, userLocation, showTraffic, realTimeTracking]);

  const createAdvancedFallbackMap = () => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
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

    const gabonCities = [
      { name: 'Libreville', lat: 0.4162, lng: 9.4673, isCapital: true, population: '703,904' },
      { name: 'Port-Gentil', lat: -0.7193, lng: 8.7815, isCapital: false, population: '136,462' },
      { name: 'Franceville', lat: -1.6332, lng: 13.5833, isCapital: false, population: '110,568' },
      { name: 'Oyem', lat: 1.5993, lng: 11.5793, isCapital: false, population: '60,685' },
      { name: 'Moanda', lat: -1.5336, lng: 13.1987, isCapital: false, population: '39,298' },
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
      
    const mapDiv = document.createElement('div');
    mapDiv.style.cssText = `
      width: 100%;
      height: 100%;
      background: ${currentLayer.background};
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      border: 2px solid ${currentLayer.border};
    `;

    // Ajouter les éléments de la carte (villes, véhicules, etc.)
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
    });

    // Ajouter véhicules avec animations
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
        width: 28px;
        height: 28px;
        background: ${vehicle.status === 'en-mouvement' ? '#4caf50' : vehicle.status === 'arrêté' ? '#ff9800' : '#f44336'};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        color: white;
        font-weight: bold;
        z-index: 15;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
      `;
        
      // Ajouter icône de véhicule
      const vehicleIcon = document.createElement('div');
      vehicleIcon.innerHTML = '🚗';
      vehicleIcon.style.fontSize = '12px';
      marker.appendChild(vehicleIcon);
        
      if (vehicle.status === 'en-mouvement') {
        marker.style.animation = 'pulse 2s infinite, bounce 1s ease-in-out infinite alternate';
      }
        
      if (selectedVehicle === vehicle.id) {
        marker.style.transform = 'translate(-50%, -50%) scale(1.3)';
        marker.style.boxShadow = '0 0 0 8px rgba(33, 150, 243, 0.4)';
        marker.style.zIndex = '25';
      }

      marker.addEventListener('click', () => {
        setSelectedVehicleForHistory(vehicle.id);
        setShowHistoryModal(true);
      });

      mapDiv.appendChild(marker);
    });

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

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg border-2 border-blue-200 bg-blue-50 shadow-lg"
        style={{ minHeight: isFullscreen ? '100vh' : '400px' }}
      />
      
      {/* Contrôles avancés de la carte */}
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
            <option value="dark">Sombre</option>
          </select>
        </div>
        
        {/* Contrôles GPS avancés */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <Button
            variant={realTimeTracking ? "default" : "ghost"}
            size="sm"
            onClick={() => setRealTimeTracking(!realTimeTracking)}
            className="w-8 h-8 p-0 rounded-none"
            title="Suivi temps réel"
          >
            <Navigation className={`w-4 h-4 ${realTimeTracking ? 'animate-pulse' : ''}`} />
          </Button>
          <Button
            variant={showTraffic ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowTraffic(!showTraffic)}
            className="w-8 h-8 p-0 rounded-none border-t"
            title="Afficher routes"
          >
            <Route className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Contrôles de zoom */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => leafletMapRef.current?.zoomIn()}
            className="w-8 h-8 p-0 rounded-none"
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => leafletMapRef.current?.zoomOut()}
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
            onClick={() => leafletMapRef.current?.setView([gabonCenter.lat, gabonCenter.lng], 7)}
            className="w-8 h-8 p-0 rounded-none border-t"
            title="Centrer sur Gabon"
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

      {/* Légende améliorée */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md text-xs z-30">
        <div className="font-bold mb-2 text-blue-800 flex items-center gap-2">
          🇬🇦 Gabon - Traceur GPS Avancé
          {realTimeTracking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>En mouvement ({vehicles.filter(v => v.status === 'en-mouvement').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Arrêté ({vehicles.filter(v => v.status === 'arrêté').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Hors ligne ({vehicles.filter(v => v.status === 'hors-ligne').length})</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Ma position</span>
            </div>
          )}
          {showTraffic && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-red-500"></div>
              <span>Routes principales</span>
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
