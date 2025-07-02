
import React, { useState } from 'react';
import { X, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceModalProps {
  travel: any;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ travel, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleCancelPrint = () => {
    setIsPrinting(false);
  };

  const totalRevenue = travel.passengers * travel.price;
  const invoiceDate = new Date().toLocaleDateString('fr-FR');
  const invoiceNumber = `INV-${Date.now()}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Facture de voyage
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">FLEET MANAGER TRANSPORT</h3>
            <p className="text-muted-foreground">Facture de transport</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Informations client</h4>
              <p className="text-sm text-muted-foreground">Voyage organisé</p>
              <p className="text-sm text-muted-foreground">{travel.departure} → {travel.destination}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Facture N°: <span className="font-medium">{invoiceNumber}</span></p>
              <p className="text-sm text-muted-foreground">Date: <span className="font-medium">{invoiceDate}</span></p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">Description</th>
                  <th className="text-center p-3 font-semibold">Quantité</th>
                  <th className="text-right p-3 font-semibold">Prix unitaire</th>
                  <th className="text-right p-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">Transport {travel.departure} → {travel.destination}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(travel.departureDate).toLocaleDateString('fr-FR')} à {travel.departureTime}
                      </p>
                      <p className="text-sm text-muted-foreground">Véhicule: {travel.vehiclePlate}</p>
                    </div>
                  </td>
                  <td className="p-3 text-center">{travel.passengers}</td>
                  <td className="p-3 text-right">{travel.price} FCFA</td>
                  <td className="p-3 text-right font-semibold">{totalRevenue} FCFA</td>
                </tr>
              </tbody>
              <tfoot className="bg-muted">
                <tr>
                  <td colSpan={3} className="p-3 text-right font-semibold">Total HT:</td>
                  <td className="p-3 text-right font-semibold">{totalRevenue} FCFA</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right font-semibold">TVA (0%):</td>
                  <td className="p-3 text-right font-semibold">0 FCFA</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right font-bold">Total TTC:</td>
                  <td className="p-3 text-right font-bold text-lg">{totalRevenue} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Merci de votre confiance</p>
            <p>Fleet Manager Transport - Libreville, Gabon</p>
          </div>

          <div className="flex justify-end space-x-3">
            {isPrinting ? (
              <Button variant="outline" onClick={handleCancelPrint}>
                Annuler impression
              </Button>
            ) : (
              <Button onClick={handlePrint} className="fleet-button-primary">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer facture
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
