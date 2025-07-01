
import React, { useEffect, useRef } from 'react';

interface GabonMapComponentProps {
  vehicles: Array<{
    id: string;
    plate: string;
    coordinates: { lat: number; lng: number };
    status: string;
  }>;
  selectedVehicle?: string;
}

const GabonMapComponent: React.FC<GabonMapComponentProps> = ({ vehicles, selectedVehicle }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Création d'une carte simulée du Gabon
    const createGabonMap = () => {
      const mapContainer = mapRef.current!;
      mapContainer.innerHTML = '';
      
      // Container principal avec fond du Gabon
      const mapDiv = document.createElement('div');
      mapDiv.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e8f5e8 0%, #d4f0d4 50%, #c0ebc0 100%);
        position: relative;
        overflow: hidden;
        border-radius: 8px;
      `;

      // Ajout de la forme stylisée du Gabon
      const gabonShape = document.createElement('div');
      gabonShape.style.cssText = `
        position: absolute;
        top: 20%;
        left: 30%;
        width: 40%;
        height: 60%;
        background: rgba(34, 139, 34, 0.3);
        border: 2px solid #228B22;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        transform: rotate(-15deg);
      `;
      mapDiv.appendChild(gabonShape);

      // Villes principales du Gabon avec coordonnées approximatives
      const gabonCities = [
        { name: 'Libreville', x: '35%', y: '25%', isCapital: true },
        { name: 'Port-Gentil', x: '25%', y: '45%', isCapital: false },
        { name: 'Franceville', x: '55%', y: '70%', isCapital: false },
        { name: 'Oyem', x: '40%', y: '15%', isCapital: false },
        { name: 'Moanda', x: '60%', y: '65%', isCapital: false },
      ];

      gabonCities.forEach(city => {
        const cityMarker = document.createElement('div');
        cityMarker.style.cssText = `
          position: absolute;
          left: ${city.x};
          top: ${city.y};
          width: ${city.isCapital ? '12px' : '8px'};
          height: ${city.isCapital ? '12px' : '8px'};
          background: ${city.isCapital ? '#FF6B35' : '#4A90E2'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          z-index: 5;
        `;
        cityMarker.title = city.name;
        mapDiv.appendChild(cityMarker);

        // Label de la ville
        const cityLabel = document.createElement('div');
        cityLabel.style.cssText = `
          position: absolute;
          left: ${city.x};
          top: calc(${city.y} + 15px);
          font-size: ${city.isCapital ? '12px' : '10px'};
          font-weight: ${city.isCapital ? 'bold' : 'normal'};
          color: #333;
          background: rgba(255,255,255,0.8);
          padding: 2px 4px;
          border-radius: 3px;
          white-space: nowrap;
          transform: translateX(-50%);
          pointer-events: none;
        `;
        cityLabel.textContent = city.name;
        mapDiv.appendChild(cityLabel);
      });

      // Positionnement des véhicules sur la carte du Gabon
      const gabonBounds = {
        minLat: -4.0,
        maxLat: 2.3,
        minLng: 8.7,
        maxLng: 14.5
      };

      vehicles.forEach((vehicle, index) => {
        // Conversion des coordonnées GPS en position sur la carte
        const x = ((vehicle.coordinates.lng - gabonBounds.minLng) / (gabonBounds.maxLng - gabonBounds.minLng)) * 100;
        const y = ((gabonBounds.maxLat - vehicle.coordinates.lat) / (gabonBounds.maxLat - gabonBounds.minLat)) * 100;
        
        // Ajustement pour rester dans les limites de la carte
        const adjustedX = Math.max(10, Math.min(90, x));
        const adjustedY = Math.max(15, Math.min(85, y));

        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          left: ${adjustedX}%;
          top: ${adjustedY}%;
          width: 20px;
          height: 20px;
          background: ${vehicle.status === 'en-mouvement' ? '#10b981' : vehicle.status === 'arrêté' ? '#f59e0b' : '#ef4444'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: white;
          font-weight: bold;
          z-index: 10;
          transition: all 0.3s ease;
        `;
        
        marker.textContent = vehicle.plate.slice(-2);
        marker.title = `${vehicle.plate} - ${vehicle.status}`;
        
        // Animation pour véhicules en mouvement
        if (vehicle.status === 'en-mouvement') {
          marker.style.animation = 'pulse 2s infinite';
        }
        
        // Effet de sélection
        if (selectedVehicle === vehicle.id) {
          marker.style.transform = 'scale(1.4)';
          marker.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.4)';
          marker.style.zIndex = '15';
        }

        marker.addEventListener('click', () => {
          alert(`Véhicule: ${vehicle.plate}\nStatut: ${vehicle.status}\nPosition: ${vehicle.coordinates.lat.toFixed(4)}, ${vehicle.coordinates.lng.toFixed(4)}`);
        });

        mapDiv.appendChild(marker);
      });

      // Contrôles de zoom
      const controls = document.createElement('div');
      controls.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        z-index: 20;
      `;

      ['+', '-', '⌂'].forEach(symbol => {
        const button = document.createElement('button');
        button.textContent = symbol;
        button.style.cssText = `
          width: 32px;
          height: 32px;
          background: white;
          border: 1px solid #ddd;
          cursor: pointer;
          font-weight: bold;
          font-size: ${symbol === '⌂' ? '14px' : '16px'};
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 4px;
          transition: all 0.2s ease;
        `;
        button.addEventListener('mouseenter', () => {
          button.style.background = '#f0f0f0';
        });
        button.addEventListener('mouseleave', () => {
          button.style.background = 'white';
        });
        button.addEventListener('click', () => {
          console.log(`Action: ${symbol === '+' ? 'Zoom in' : symbol === '-' ? 'Zoom out' : 'Center on Gabon'}`);
        });
        controls.appendChild(button);
      });

      mapDiv.appendChild(controls);

      // Légende
      const legend = document.createElement('div');
      legend.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 15px;
        background: rgba(255,255,255,0.9);
        padding: 10px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        font-size: 11px;
        z-index: 20;
      `;
      
      legend.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">Légende</div>
        <div style="display: flex; align-items: center; margin-bottom: 3px;">
          <div style="width: 10px; height: 10px; background: #10b981; border-radius: 50%; margin-right: 5px;"></div>
          En mouvement
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 3px;">
          <div style="width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; margin-right: 5px;"></div>
          Arrêté
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; margin-right: 5px;"></div>
          Hors ligne
        </div>
      `;
      
      mapDiv.appendChild(legend);

      // Ajout des styles d'animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
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
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg border border-border bg-green-50"
      style={{ minHeight: '400px' }}
    />
  );
};

export default GabonMapComponent;
