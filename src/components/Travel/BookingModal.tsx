
import React, { useState } from 'react';
import { X, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookingModalProps {
  onClose: () => void;
  onSave: (booking: any) => void;
  passengers: any[];
  itineraries: any[];
  travels: any[];
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  onClose, 
  onSave, 
  passengers, 
  itineraries, 
  travels 
}) => {
  const [formData, setFormData] = useState({
    passengerId: '',
    travelId: '',
    seatNumber: '',
    ticketType: 'simple',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPassenger = passengers.find(p => p.id === formData.passengerId);
    const selectedTravel = travels.find(t => t.id === formData.travelId);
    const selectedItinerary = itineraries.find(i => 
      i.departure === selectedTravel?.departure && 
      i.destination === selectedTravel?.destination
    );

    const booking = {
      id: Date.now().toString(),
      ticketNumber: `TK-${String(Date.now()).slice(-6)}`,
      passengerId: formData.passengerId,
      passengerName: selectedPassenger ? `${selectedPassenger.firstName} ${selectedPassenger.lastName}` : '',
      travelId: formData.travelId,
      itinerary: selectedTravel ? `${selectedTravel.departure} → ${selectedTravel.destination}` : '',
      departureDate: selectedTravel?.departureDate || '',
      departureTime: selectedTravel?.departureTime || '',
      vehiclePlate: selectedTravel?.vehiclePlate || '',
      seatNumber: formData.seatNumber,
      ticketType: formData.ticketType,
      amount: selectedItinerary ? 
        (formData.ticketType === 'simple' ? selectedItinerary.priceSimple : selectedItinerary.priceGroup) : 0,
      status: 'confirmé',
      bookingDate: new Date().toISOString().split('T')[0],
    };

    onSave(booking);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
              Nouvelle réservation
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Passager *
            </label>
            <select
              name="passengerId"
              value={formData.passengerId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Sélectionner un passager</option>
              {passengers.map(passenger => (
                <option key={passenger.id} value={passenger.id}>
                  {passenger.firstName} {passenger.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Voyage *
            </label>
            <select
              name="travelId"
              value={formData.travelId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Sélectionner un voyage</option>
              {travels.filter(t => t.status === 'programmé').map(travel => (
                <option key={travel.id} value={travel.id}>
                  {travel.departure} → {travel.destination} - {travel.departureDate} à {travel.departureTime}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Numéro de siège *
            </label>
            <Input
              name="seatNumber"
              value={formData.seatNumber}
              onChange={handleChange}
              placeholder="A12"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Type de billet *
            </label>
            <select
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="simple">Billet simple</option>
              <option value="groupe">Billet groupe</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="fleet-button-primary">
              Créer la réservation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
