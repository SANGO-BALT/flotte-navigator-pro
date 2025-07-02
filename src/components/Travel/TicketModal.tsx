
import React from 'react';
import { X, Ticket, Download, Print } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketModalProps {
  booking: any;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Téléchargement du ticket en cours...');
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Ticket de voyage
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-dashed border-blue-300">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">TRANSPORT GABON</h3>
              <p className="text-sm text-blue-700">Ticket de voyage</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">N° Ticket:</span>
                <span className="font-mono">{booking.ticketNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Passager:</span>
                <span>{booking.passengerName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Trajet:</span>
                <span>{booking.itinerary}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(booking.departureDate).toLocaleDateString('fr-FR')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Heure:</span>
                <span>{booking.departureTime}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Véhicule:</span>
                <span>{booking.vehiclePlate}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Siège:</span>
                <span>{booking.seatNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span className="capitalize">{booking.ticketType}</span>
              </div>
              
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold">Montant:</span>
                <span className="font-bold">{booking.amount} FCFA</span>
              </div>
            </div>
            
            <div className="text-center mt-4 text-xs text-blue-600">
              <p>Présentez ce ticket à l'embarquement</p>
              <p>Bon voyage !</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-3 mt-6">
            <Button onClick={handlePrint} variant="outline">
              <Print className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={handleDownload} className="fleet-button-primary">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
