
import React from 'react';
import { X, Wrench, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Maintenance {
  id?: string;
  vehiclePlate: string;
  vehicleBrand?: string;
  type: string;
  scheduledDate: string;
  description: string;
  priority: string;
  status: string;
  estimatedCost: number;
  finalCost?: number;
  garage: string;
  completedDate?: string;
  createdDate: string;
}

interface MaintenancePrintModalProps {
  maintenance: Maintenance;
  onClose: () => void;
}

const MaintenancePrintModal: React.FC<MaintenancePrintModalProps> = ({ maintenance, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const priorityLabels = {
    faible: 'Faible',
    normale: 'Normale',
    élevée: 'Élevée',
    urgente: 'Urgente',
  };

  const statusLabels = {
    planifiée: 'Planifiée',
    'en-cours': 'En cours',
    terminée: 'Terminée',
    reportée: 'Reportée',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold">Fiche Maintenance - {maintenance.vehiclePlate}</h2>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">FICHE DE MAINTENANCE</h1>
            <div className="text-lg font-semibold text-orange-600">{maintenance.type}</div>
            <div className="text-lg font-bold text-gray-700">Véhicule: {maintenance.vehiclePlate}</div>
            {maintenance.vehicleBrand && (
              <div className="text-gray-600">{maintenance.vehicleBrand}</div>
            )}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Détails de la maintenance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{maintenance.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Priorité:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    maintenance.priority === 'urgente' ? 'bg-red-100 text-red-800' :
                    maintenance.priority === 'élevée' ? 'bg-orange-100 text-orange-800' :
                    maintenance.priority === 'normale' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {priorityLabels[maintenance.priority] || maintenance.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Statut:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    maintenance.status === 'terminée' ? 'bg-green-100 text-green-800' :
                    maintenance.status === 'en-cours' ? 'bg-blue-100 text-blue-800' :
                    maintenance.status === 'reportée' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {statusLabels[maintenance.status] || maintenance.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Garage:</span>
                  <span>{maintenance.garage}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Dates importantes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Date programmée:</span>
                  <span>{new Date(maintenance.scheduledDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date de création:</span>
                  <span>{new Date(maintenance.createdDate).toLocaleDateString('fr-FR')}</span>
                </div>
                {maintenance.completedDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Date de réalisation:</span>
                    <span>{new Date(maintenance.completedDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coûts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Coûts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Coût estimé:</span>
                  <span className="font-bold text-blue-600">{maintenance.estimatedCost.toLocaleString()} FCFA</span>
                </div>
                {maintenance.finalCost && (
                  <div className="flex justify-between">
                    <span className="font-medium">Coût final:</span>
                    <span className="font-bold text-green-600">{maintenance.finalCost.toLocaleString()} FCFA</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{maintenance.description}</p>
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

export default MaintenancePrintModal;
