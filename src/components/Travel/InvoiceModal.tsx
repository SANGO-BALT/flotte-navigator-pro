
import React from 'react';
import { X, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceModalProps {
  travel: any;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ travel, onClose }) => {
  const invoiceNumber = travel.invoiceNumber || `FAC-${Date.now()}`;
  const invoiceDate = new Date().toLocaleDateString('fr-FR');
  const totalAmount = travel.passengers * travel.price;

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateProforma = () => {
    console.log('Génération facture proforma pour voyage:', travel);
    alert('Facture proforma générée avec succès !');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Facture - {invoiceNumber}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* En-tête facture */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">FLEET MANAGER</h3>
                <p className="text-sm text-muted-foreground">
                  Société de Transport<br />
                  123 Avenue de la République<br />
                  75000 Paris, France<br />
                  Tel: +33 1 23 45 67 89<br />
                  Email: contact@fleetmanager.com
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold text-foreground mb-2">FACTURE</h3>
                <p className="text-sm text-muted-foreground">
                  N° {invoiceNumber}<br />
                  Date: {invoiceDate}<br />
                  Voyage du {new Date(travel.departureDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Détails du voyage */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-foreground mb-4">Détails du voyage</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Véhicule:</strong> {travel.vehiclePlate} - {travel.vehicleBrand}</p>
                <p><strong>Conducteur:</strong> {travel.driverName}</p>
                <p><strong>Trajet:</strong> {travel.departure} → {travel.destination}</p>
              </div>
              <div>
                <p><strong>Date:</strong> {new Date(travel.departureDate).toLocaleDateString('fr-FR')}</p>
                <p><strong>Horaires:</strong> {travel.departureTime} - {travel.arrivalTime}</p>
                <p><strong>Distance:</strong> {travel.distance} km</p>
              </div>
            </div>
          </div>

          {/* Tableau de facturation */}
          <div className="mb-6">
            <table className="w-full border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left py-2 px-4 border border-border">Description</th>
                  <th className="text-center py-2 px-4 border border-border">Quantité</th>
                  <th className="text-right py-2 px-4 border border-border">Prix unitaire</th>
                  <th className="text-right py-2 px-4 border border-border">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-border">
                    Transport de passagers<br />
                    <small className="text-muted-foreground">
                      {travel.departure} vers {travel.destination}
                    </small>
                  </td>
                  <td className="text-center py-2 px-4 border border-border">{travel.passengers}</td>
                  <td className="text-right py-2 px-4 border border-border">{travel.price}€</td>
                  <td className="text-right py-2 px-4 border border-border font-semibold">
                    {totalAmount}€
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-muted">
                  <td colSpan={3} className="text-right py-2 px-4 border border-border font-semibold">
                    TOTAL HT:
                  </td>
                  <td className="text-right py-2 px-4 border border-border font-semibold">
                    {(totalAmount / 1.2).toFixed(2)}€
                  </td>
                </tr>
                <tr className="bg-muted">
                  <td colSpan={3} className="text-right py-2 px-4 border border-border font-semibold">
                    TVA (20%):
                  </td>
                  <td className="text-right py-2 px-4 border border-border font-semibold">
                    {(totalAmount - (totalAmount / 1.2)).toFixed(2)}€
                  </td>
                </tr>
                <tr className="bg-primary/10">
                  <td colSpan={3} className="text-right py-2 px-4 border border-border font-bold">
                    TOTAL TTC:
                  </td>
                  <td className="text-right py-2 px-4 border border-border font-bold text-lg">
                    {totalAmount}€
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Conditions de paiement */}
          <div className="mb-6 text-sm text-muted-foreground">
            <h4 className="font-semibold text-foreground mb-2">Conditions de paiement</h4>
            <p>Paiement à réception de facture - Aucun escompte pour paiement anticipé</p>
            <p>En cas de retard de paiement, indemnité forfaitaire de 40€ + intérêts de retard au taux de 3 fois le taux légal</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleGenerateProforma}>
              <FileText className="w-4 h-4 mr-2" />
              Proforma
            </Button>
            <Button onClick={handlePrint} className="fleet-button-primary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer facture
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
