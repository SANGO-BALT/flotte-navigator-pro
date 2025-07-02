
import React, { useState } from 'react';
import { X, Ticket, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketModalProps {
  booking: any;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Ticket de voyage
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Ticket Content */}
          <div className="border-2 border-dashed border-border p-4 bg-muted/20">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-foreground">FLEET MANAGER TRANSPORT</h3>
              <p className="text-sm text-muted-foreground">Ticket de voyage</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billet N°:</span>
                <span className="font-medium">{booking.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passager:</span>
                <span className="font-medium">{booking.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trajet:</span>
                <span className="font-medium">{booking.itinerary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{booking.departureDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Heure:</span>
                <span className="font-medium">{booking.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Véhicule:</span>
                <span className="font-medium">{booking.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Siège:</span>
                <span className="font-medium">{booking.seatNumber}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Montant:</span>
                <span className="font-bold">{booking.amount} FCFA</span>
              </div>
            </div>
            
            <div className="text-center mt-4 text-xs text-muted-foreground">
              <p>Merci de conserver votre ticket durant tout le voyage</p>
              <p>Bonne route !</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            {isPrinting ? (
              <Button variant="outline" onClick={handleCancelPrint}>
                Annuler impression
              </Button>
            ) : (
              <Button onClick={handlePrint} className="fleet-button-primary">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer ticket
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
