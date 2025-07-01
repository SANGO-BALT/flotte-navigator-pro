
import React from 'react';
import { X, Car, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id?: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  serviceDate: string;
  circulationDate: string;
  mileage: string;
  engine: string;
  fuel: string;
  transmission: string;
  insurance: string;
  registrationCard: string;
  vehicleFunction: string;
  image?: string;
  status?: string;
  nextMaintenance?: string;
}

interface VehiclePrintModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehiclePrintModal: React.FC<VehiclePrintModalProps> = ({ vehicle, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const statusLabels = {
    active: 'En service',
    maintenance: 'Maintenance',
    inactive: 'Hors service',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Fiche Véhicule - {vehicle.plate}</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="fleet-button-primary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 print:p-6">
          {/* En-tête */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">FICHE VÉHICULE</h1>
            <div className="text-lg font-semibold text-primary">{vehicle.brand} {vehicle.model}</div>
            <div className="text-lg font-bold text-gray-700">Plaque: {vehicle.plate}</div>
          </div>

          {/* Photo du véhicule */}
          <div className="mb-6 text-center">
            <img
              src={vehicle.image || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-64 h-48 object-cover rounded-lg mx-auto border"
            />
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Informations générales</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Année:</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Fonction:</span>
                  <span>{vehicle.vehicleFunction || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Statut:</span>
                  <span>{statusLabels[vehicle.status || 'active']}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Caractéristiques techniques</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Moteur:</span>
                  <span>{vehicle.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Carburant:</span>
                  <span>{vehicle.fuel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Transmission:</span>
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Kilométrage:</span>
                  <span>{parseInt(vehicle.mileage).toLocaleString()} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates importantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Dates importantes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Mise en service:</span>
                  <span>{new Date(vehicle.serviceDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mise en circulation:</span>
                  <span>{new Date(vehicle.circulationDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Prochaine maintenance:</span>
                  <span>{vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR') : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Documents</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">N° Assurance:</span>
                  <span>{vehicle.insurance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">N° Carte grise:</span>
                  <span>{vehicle.registrationCard}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Fiche générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePrintModal;
