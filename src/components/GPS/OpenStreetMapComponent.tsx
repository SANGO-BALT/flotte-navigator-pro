
import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    if (!mapRef.current) return;

    // Coordonnées réelles du Gabon
    const gabonBounds = {
      north: 2.318109,   // Frontière avec le Cameroun et la Guinée équatoriale
      south: -3.978809,  // Frontière avec le Congo
      east: 14.502347,   // Frontière avec le Congo
      west: 8.695471     // Côte atlantique
    };

    const gabonCenter = {
      lat: (gabonBounds.north + gabonBounds.south) / 2,  // ≈ -0.83°
      lng: (gabonBounds.east + gabonBounds.west) / 2     // ≈ 11.6°
    };

    // Villes principales du Gabon avec coordonnées exactes
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

    const createGabonMap = () => {
      const mapContainer = mapRef.current!;
      mapContainer.innerHTML = '';
      
      // Container principal avec carte stylisée
      const mapDiv = document.createElement('div');
      mapDiv.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #81d4fa 100%);
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        border: 2px solid #0277bd;
      `;

      // Fond océan Atlantique (ouest)
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

      // Forme approximative du Gabon
      const gabonShape = document.createElement('div');
      gabonShape.style.cssText = `
        position: absolute;
        top: 15%;
        left: 15%;
        width: 70%;
        height: 70%;
        background: linear-gradient(45deg, #2e7d32, #388e3c, #43a047);
        border: 3px solid #1b5e20;
        border-radius: 15% 85% 25% 75% / 85% 15% 85% 15%;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
      `;
      mapDiv.appendChild(gabonShape);

      // Ajout des villes du Gabon
      gabonCities.forEach(city => {
        // Conversion des coordonnées GPS en position sur la carte
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

        // Label de la ville
        const cityLabel = document.createElement('div');
        cityLabel.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: calc(${y}% + 15px);
          font-size: ${city.isCapital ? '14px' : '11px'};
          font-weight: ${city.isCapital ? 'bold' : '600'};
          color: #263238;
          background: rgba(255,255,255,0.9);
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

      // Positionnement des véhicules avec coordonnées réelles du Gabon
      vehicles.forEach((vehicle, index) => {
        // Vérifier si les coordonnées sont dans les limites du Gabon
        if (vehicle.coordinates.lat < gabonBounds.south || 
            vehicle.coordinates.lat > gabonBounds.north ||
            vehicle.coordinates.lng < gabonBounds.west || 
            vehicle.coordinates.lng > gabonBounds.east) {
          console.warn(`Véhicule ${vehicle.plate}: coordonnées hors du Gabon`);
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
        marker.title = `${vehicle.plate} - ${vehicle.status}\nPosition: ${vehicle.coordinates.lat.toFixed(4)}°, ${vehicle.coordinates.lng.toFixed(4)}°`;
        
        if (vehicle.status === 'en-mouvement') {
          marker.style.animation = 'pulse 2s infinite';
        }
        
        if (selectedVehicle === vehicle.id) {
          marker.style.transform = 'translate(-50%, -50%) scale(1.5)';
          marker.style.boxShadow = '0 0 0 6px rgba(33, 150, 243, 0.4)';
          marker.style.zIndex = '20';
        }

        marker.addEventListener('click', () => {
          const nearestCity = gabonCities.reduce((nearest, city) => {
            const distToCity = Math.sqrt(
              Math.pow(city.lat - vehicle.coordinates.lat, 2) + 
              Math.pow(city.lng - vehicle.coordinates.lng, 2)
            );
            const distToNearest = Math.sqrt(
              Math.pow(nearest.lat - vehicle.coordinates.lat, 2) + 
              Math.pow(nearest.lng - vehicle.coordinates.lng, 2)
            );
            return distToCity < distToNearest ? city : nearest;
          });

          alert(`🚗 Véhicule: ${vehicle.plate}
📍 Statut: ${vehicle.status}
🌍 Position: ${vehicle.coordinates.lat.toFixed(4)}°, ${vehicle.coordinates.lng.toFixed(4)}°
🏙️ Proche de: ${nearestCity.name}
🇬🇦 Région: Gabon`);
        });

        mapDiv.appendChild(marker);
      });

      // Contrôles de carte
      const controls = document.createElement('div');
      controls.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        z-index: 25;
      `;

      const controlButtons = [
        { symbol: '+', action: 'Zoom avant', color: '#2196f3' },
        { symbol: '-', action: 'Zoom arrière', color: '#2196f3' },
        { symbol: '🇬🇦', action: 'Centrer sur Gabon', color: '#4caf50' },
        { symbol: '📍', action: 'Ma position', color: '#ff9800' }
      ];

      controlButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.symbol;
        button.title = btn.action;
        button.style.cssText = `
          width: 36px;
          height: 36px;
          background: white;
          border: 2px solid ${btn.color};
          color: ${btn.color};
          cursor: pointer;
          font-weight: bold;
          font-size: ${btn.symbol === '🇬🇦' ? '12px' : '16px'};
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border-radius: 6px;
          transition: all 0.2s ease;
        `;
        button.addEventListener('mouseenter', () => {
          button.style.background = btn.color;
          button.style.color = 'white';
        });
        button.addEventListener('mouseleave', () => {
          button.style.background = 'white';
          button.style.color = btn.color;
        });
        button.addEventListener('click', () => {
          console.log(`Action: ${btn.action}`);
        });
        controls.appendChild(button);
      });

      mapDiv.appendChild(controls);

      // Légende améliorée
      const legend = document.createElement('div');
      legend.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 15px;
        background: rgba(255,255,255,0.95);
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 12px;
        z-index: 25;
        border: 2px solid #e0e0e0;
      `;
      
      legend.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; color: #1976d2;">🇬🇦 Gabon - Suivi GPS</div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background: #4caf50; border-radius: 50%; margin-right: 6px;"></div>
          En mouvement
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background: #ff9800; border-radius: 50%; margin-right: 6px;"></div>
          Arrêté
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background: #f44336; border-radius: 50%; margin-right: 6px;"></div>
          Hors ligne
        </div>
        <div style="margin-top: 6px; font-size: 10px; color: #666;">
          Coordonnées: ${gabonBounds.south.toFixed(2)}° à ${gabonBounds.north.toFixed(2)}°N<br>
          ${gabonBounds.west.toFixed(2)}° à ${gabonBounds.east.toFixed(2)}°E
        </div>
      `;
      
      mapDiv.appendChild(legend);

      // Animation CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
      `;
      document.head.appendChild(style);

      mapContainer.appendChild(mapDiv);
    };

    createGabonMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [vehicles, selectedVehicle]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg border-2 border-blue-200 bg-blue-50 shadow-lg"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-blue-800 border border-blue-200">
        🗺️ OpenStreetMap - République Gabonaise
      </div>
    </div>
  );
};

export default OpenStreetMapComponent;
