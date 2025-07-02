
import React from 'react';
import { X, Fuel, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FuelRecord {
  id: string;
  vehiclePlate: string;
  vehicleBrand: string;
  date: string;
  fuelType: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  station: string;
  mileage: number;
}

interface FuelTicketModalProps {
  record: FuelRecord;
  onClose: () => void;
}

const FuelTicketModal: React.FC<FuelTicketModalProps> = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Fuel className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Ticket Carburant</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} size="sm" className="fleet-button-primary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 print:p-4">
          {/* En-tête du ticket */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 mb-1">TICKET CARBURANT</h1>
            <div className="text-sm text-gray-600">N° {record.id}</div>
            <div className="border-b-2 border-dashed border-gray-300 my-3"></div>
          </div>

          {/* Informations véhicule */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">VÉHICULE</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Plaque:</span>
                <span className="font-mono font-bold">{record.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span>Modèle:</span>
                <span>{record.vehicleBrand}</span>
              </div>
              <div className="flex justify-between">
                <span>Kilométrage:</span>
                <span>{record.mileage.toLocaleString()} km</span>
              </div>
            </div>
          </div>

          <div className="border-b border-dashed border-gray-300 my-4"></div>

          {/* Détails du plein */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">DÉTAILS DU PLEIN</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(record.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Heure:</span>
                <span>{new Date().toLocaleTimeString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Station:</span>
                <span>{record.station}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-semibold">{record.fuelType}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-dashed border-gray-300 my-4"></div>

          {/* Calculs */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">CALCULS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Quantité:</span>
                <span className="font-mono">{record.quantity.toFixed(2)} L</span>
              </div>
              <div className="flex justify-between">
                <span>Prix unitaire:</span>
                <span className="font-mono">{record.unitPrice.toFixed(0)} FCFA/L</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL:</span>
                  <span className="font-mono">{record.totalCost.toFixed(0)} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-dashed border-gray-300 my-4"></div>

          {/* Pied de ticket */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Ticket généré le {new Date().toLocaleDateString('fr-FR')}</p>
            <p>à {new Date().toLocaleTimeString('fr-FR')}</p>
            <p className="mt-3">Merci pour votre confiance</p>
            <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
              <p>Système de Gestion de Flotte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelTicketModal;
