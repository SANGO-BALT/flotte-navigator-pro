
import React, { useState } from 'react';
import { Calendar, MapPin, Wrench, AlertTriangle, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VehicleModal from './VehicleModal';

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
  year: number;
  serviceDate: string;
  circulationDate: string;
  image: string;
  status: string;
  mileage: number;
  nextMaintenance: string;
  transmission?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Calcul des années de service
  const serviceYears = new Date().getFullYear() - new Date(vehicle.serviceDate).getFullYear();
  const isOldVehicle = serviceYears >= 5;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-orange-100 text-orange-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'En service',
    maintenance: 'Maintenance',
    inactive: 'Hors service',
  };

  const handleLocate = () => {
    // Simulation de localisation GPS
    const coords = `${(Math.random() * 180 - 90).toFixed(4)}, ${(Math.random() * 360 - 180).toFixed(4)}`;
    alert(`Localisation du véhicule ${vehicle.plate}: ${coords}`);
  };

  const handleUpdate = (updatedData: any) => {
    const updatedVehicle = { ...vehicle, ...updatedData };
    if (onUpdate) {
      onUpdate(updatedVehicle);
    }
  };

  return (
    <>
      <div className="fleet-card relative">
        {isOldVehicle && (
          <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}

        <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
          <img
            src={`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
              {statusLabels[vehicle.status]}
            </span>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Plaque:</span>
              <span className="font-medium text-foreground">{vehicle.plate}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Année:</span>
              <span className="font-medium text-foreground">{vehicle.year}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Années de service:</span>
              <span className={`font-medium ${isOldVehicle ? 'text-red-500' : 'text-foreground'}`}>
                {serviceYears} ans {isOldVehicle && '⚠️'}
              </span>
            </div>

            {showDetails && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span>Kilométrage:</span>
                  <span className="font-medium text-foreground">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Transmission:</span>
                  <span className="font-medium text-foreground">{vehicle.transmission || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Prochaine maintenance:</span>
                  <span className="font-medium text-foreground">
                    {new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <div className="text-center p-2 bg-muted rounded-lg">
              <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-muted-foreground">Mise en service</p>
              <p className="text-xs font-medium text-foreground">
                {new Date(vehicle.serviceDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            
            <div className="text-center p-2 bg-muted rounded-lg">
              <Wrench className="w-4 h-4 mx-auto mb-1 text-orange-500" />
              <p className="text-xs text-muted-foreground">Prochaine maintenance</p>
              <p className="text-xs font-medium text-foreground">
                {new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
              <Eye className="w-4 h-4 mr-1" />
              {showDetails ? 'Masquer' : 'Détails'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLocate}>
              <MapPin className="w-4 h-4 mr-1" />
              Localiser
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              <Edit className="w-4 h-4 mr-1" />
              Modifier
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <VehicleModal 
          vehicle={vehicle}
          onClose={() => setShowModal(false)}
          onSave={handleUpdate}
        />
      )}
    </>
  );
};

export default VehicleCard;
