
import React from 'react';
import { Calendar, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
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

  return (
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
            <span>Plaque d'immatriculation:</span>
            <span className="font-medium text-foreground">{vehicle.plate}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Année:</span>
            <span className="font-medium text-foreground">{vehicle.year}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Kilométrage:</span>
            <span className="font-medium text-foreground">{vehicle.mileage.toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Années de service:</span>
            <span className={`font-medium ${isOldVehicle ? 'text-red-500' : 'text-foreground'}`}>
              {serviceYears} ans
            </span>
          </div>
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
          <Button variant="outline" size="sm" className="flex-1">
            <MapPin className="w-4 h-4 mr-1" />
            Localiser
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Détails
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
