
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface TicketPrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
}

const TicketPrintPreview: React.FC<TicketPrintPreviewProps> = ({ isOpen, onClose, formData }) => {
  const printTicket = () => {
    window.print();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Aperçu du Ticket</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4 border rounded-lg bg-white text-black print:shadow-none">
          <div className="text-center">
            <h2 className="text-xl font-bold">🚌 TRAVEGAB</h2>
            <p className="text-sm">Ticket de Transport</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>N° Ticket:</span>
              <span className="font-mono">{formData.numeroTicket || 'TK-' + Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span>Passager:</span>
              <span>{formData.passager}</span>
            </div>
            <div className="flex justify-between">
              <span>Voyage:</span>
              <span>{formData.voyage}</span>
            </div>
            <div className="flex justify-between">
              <span>Siège:</span>
              <span>{formData.siege}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant:</span>
              <span>{formData.montant?.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Statut:</span>
              <span>{formData.statut}</span>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-600">
            <p>Merci de voyager avec TRAVEGAB</p>
            <p>Conservez ce ticket durant tout le voyage</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={printTicket}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketPrintPreview;
