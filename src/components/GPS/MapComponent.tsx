
import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  vehicles: Array<{
    id: string;
    plate: string;
    coordinates: { lat: number; lng: number };
    status: string;
  }>;
  selectedVehicle?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ vehicles, selectedVehicle }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Simulation d'une carte OpenStreetMap avec Leaflet
    // Dans un vrai projet, vous installeriez 'leaflet' et 'react-leaflet'
    
    if (!mapRef.current) return;

    // Création d'une carte simulée
    const createSimulatedMap = () => {
      const mapContainer = mapRef.current!;
      mapContainer.innerHTML = '';
      
      // Container principal de la carte
      const mapDiv = document.createElement('div');
      mapDiv.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #e8f4f8 25%, transparent 25%), 
                    linear-gradient(-45deg, #e8f4f8 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #e8f4f8 75%), 
                    linear-gradient(-45deg, transparent 75%, #e8f4f8 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        position: relative;
        overflow: hidden;
      `;

      // Ajout des marqueurs pour chaque véhicule
      vehicles.forEach((vehicle, index) => {
        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          left: ${30 + index * 15}%;
          top: ${30 + index * 10}%;
          width: 24px;
          height: 24px;
          background: ${vehicle.status === 'en-mouvement' ? '#10b981' : '#f59e0b'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
          z-index: 10;
        `;
        
        marker.textContent = vehicle.plate.slice(-2);
        marker.title = `${vehicle.plate} - ${vehicle.status}`;
        
        // Effet de sélection
        if (selectedVehicle === vehicle.id) {
          marker.style.transform = 'scale(1.3)';
          marker.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        }

        marker.addEventListener('click', () => {
          alert(`Véhicule: ${vehicle.plate}\nStatut: ${vehicle.status}\nCoordonnées: ${vehicle.coordinates.lat}, ${vehicle.coordinates.lng}`);
        });

        mapDiv.appendChild(marker);
      });

      // Ajout de quelques éléments de carte fictifs
      const addMapElement = (left: string, top: string, color: string, text: string) => {
        const element = document.createElement('div');
        element.style.cssText = `
          position: absolute;
          left: ${left};
          top: ${top};
          padding: 4px 8px;
          background: ${color};
          color: white;
          font-size: 10px;
          border-radius: 4px;
          opacity: 0.7;
        `;
        element.textContent = text;
        mapDiv.appendChild(element);
      };

      addMapElement('10%', '10%', '#3b82f6', 'Paris');
      addMapElement('60%', '20%', '#10b981', 'Lyon');
      addMapElement('40%', '70%', '#f59e0b', 'Marseille');

      // Contrôles de zoom simulés
      const controls = document.createElement('div');
      controls.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        z-index: 20;
      `;

      ['+', '-'].forEach(symbol => {
        const button = document.createElement('button');
        button.textContent = symbol;
        button.style.cssText = `
          width: 30px;
          height: 30px;
          background: white;
          border: 1px solid #ccc;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        `;
        button.addEventListener('click', () => {
          console.log(`Zoom ${symbol === '+' ? 'in' : 'out'}`);
        });
        controls.appendChild(button);
      });

      mapDiv.appendChild(controls);
      mapContainer.appendChild(mapDiv);
    };

    createSimulatedMap();
    mapInstanceRef.current = true;

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [vehicles, selectedVehicle]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg border border-border"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapComponent;
