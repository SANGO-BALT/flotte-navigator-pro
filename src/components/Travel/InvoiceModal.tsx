
import React from 'react';
import { X, FileText, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceModalProps {
  travel: any;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ travel, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Téléchargement de la facture en cours...');
  };

  if (!travel) return null;

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString('fr-FR');
  const totalAmount = travel.passengers * travel.price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Facture de voyage
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="bg-white p-8 rounded-lg border">
            {/* En-tête */}
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-blue-900">TRANSPORT GABON</h1>
                <p className="text-gray-600">Service de transport de voyageurs</p>
                <p className="text-sm text-gray-500">Libreville, Gabon</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-800">FACTURE</h2>
                <p className="text-gray-600">N° {invoiceNumber}</p>
                <p className="text-gray-600">Date: {invoiceDate}</p>
              </div>
            </div>

            {/* Informations voyage */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Détails du voyage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Trajet:</strong> {travel.departure} → {travel.destination}</p>
                  <p><strong>Date de départ:</strong> {new Date(travel.departureDate).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Heure:</strong> {travel.departureTime} - {travel.arrivalTime}</p>
                </div>
                <div>
                  <p><strong>Véhicule:</strong> {travel.vehiclePlate}</p>
                  <p><strong>Chauffeur:</strong> {travel.driverName}</p>
                  <p><strong>Distance:</strong> {travel.distance} km</p>
                </div>
              </div>
            </div>

            {/* Tableau des services */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Service</th>
                  <th className="text-center py-2">Quantité</th>
                  <th className="text-right py-2">Prix unitaire</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3">Transport de voyageurs</td>
                  <td className="text-center py-3">{travel.passengers}</td>
                  <td className="text-right py-3">{travel.price} FCFA</td>
                  <td className="text-right py-3">{totalAmount} FCFA</td>
                </tr>
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Sous-total:</span>
                  <span>{totalAmount} FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
                  <span>Total à payer:</span>
                  <span>{totalAmount} FCFA</span>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="text-xs text-gray-500">
              <p><strong>Conditions de paiement:</strong> Paiement à l'embarquement</p>
              <p><strong>Note:</strong> Cette facture est générée automatiquement</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-3 mt-6">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={handleDownload} className="fleet-button-primary">
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
