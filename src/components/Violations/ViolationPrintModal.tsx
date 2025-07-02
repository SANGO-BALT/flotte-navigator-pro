import React from 'react';
import { X, AlertTriangle, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Violation {
  id?: string;
  vehiclePlate: string;
  vehicleBrand?: string;
  type: string;
  date: string;
  location: string;
  amount: string;
  status: string;
  description: string;
  driverName: string;
  referenceNumber?: string;
}

interface ViolationPrintModalProps {
  violation: Violation;
  onClose: () => void;
}

const ViolationPrintModal: React.FC<ViolationPrintModalProps> = ({ violation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleCancelPrint = () => {
    if (confirm('Annuler l\'impression de la fiche de contravention ?')) {
      onClose();
    }
  };

  const statusLabels = {
    'en-attente': 'En attente',
    'payée': 'Payée',
    'contestée': 'Contestée',
    'annulée': 'Annulée',
  };

  const typeLabels = {
    'excès-vitesse': 'Excès de vitesse',
    'stationnement': 'Stationnement interdit',
    'feux-rouge': 'Grillage de feu rouge',
    'téléphone': 'Téléphone au volant',
    'ceinture': 'Ceinture de sécurité',
    'autre': 'Autre infraction',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Fiche Contravention - {violation.vehiclePlate}</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="fleet-button-primary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={handleCancelPrint} variant="outline">
              Annuler impression
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 print:p-6">
          {/* En-tête */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">FICHE DE CONTRAVENTION</h1>
            <div className="text-lg font-semibold text-red-600">
              {typeLabels[violation.type] || violation.type}
            </div>
            <div className="text-lg font-bold text-gray-700">Véhicule: {violation.vehiclePlate}</div>
            {violation.vehicleBrand && (
              <div className="text-gray-600">{violation.vehicleBrand}</div>
            )}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Détails de l'infraction</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Type d'infraction:</span>
                  <span>{typeLabels[violation.type] || violation.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{new Date(violation.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Lieu:</span>
                  <span className="text-right">{violation.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Conducteur:</span>
                  <span>{violation.driverName}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Informations administratives</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Montant:</span>
                  <span className="font-bold text-red-600 text-lg">
                    {parseInt(violation.amount).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Statut:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    violation.status === 'payée' ? 'bg-green-100 text-green-800' :
                    violation.status === 'contestée' ? 'bg-blue-100 text-blue-800' :
                    violation.status === 'annulée' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {statusLabels[violation.status] || violation.status}
                  </span>
                </div>
                {violation.referenceNumber && (
                  <div className="flex justify-between">
                    <span className="font-medium">N° de référence:</span>
                    <span>{violation.referenceNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description détaillée */}
          {violation.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {violation.description}
              </p>
            </div>
          )}

          {/* Informations de paiement ou contestation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Procédure</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              {violation.status === 'en-attente' && (
                <div>
                  <p className="font-medium text-blue-800 mb-2">Modalités de paiement:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Paiement dans les 30 jours suivant la notification</li>
                    <li>• Possibilité de contestation dans les 15 jours</li>
                    <li>• Paiement en ligne ou au guichet</li>
                  </ul>
                </div>
              )}
              {violation.status === 'payée' && (
                <div>
                  <p className="font-medium text-green-800 mb-2">Contravention réglée</p>
                  <p className="text-sm text-green-700">Cette contravention a été payée intégralement.</p>
                </div>
              )}
              {violation.status === 'contestée' && (
                <div>
                  <p className="font-medium text-blue-800 mb-2">Contestation en cours</p>
                  <p className="text-sm text-blue-700">Le dossier est en cours d'examen par les services compétents.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Fiche générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
            <p className="mt-2 text-xs">
              En cas de questions, contactez le service des contraventions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationPrintModal;
