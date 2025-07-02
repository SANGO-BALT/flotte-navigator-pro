
import React, { useState, useEffect } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookingModalProps {
  onClose: () => void;
  onSave: (booking: any) => void;
  passengers: any[];
  itineraries: any[];
  travels: any[];
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose, onSave, passengers, itineraries, travels }) => {
  const [formData, setFormData] = useState({
    passengerId: '',
    travelId: '',
    ticketType: 'simple',
    seatNumber: '',
    amount: '',
    notes: '',
  });

  const [selectedTravel, setSelectedTravel] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  useEffect(() => {
    if (formData.travelId) {
      const travel = travels.find(t => t.id === formData.travelId);
      setSelectedTravel(travel);
      
      if (travel) {
        const itinerary = itineraries.find(i => 
          i.departure === travel.departure && i.destination === travel.destination
        );
        setSelectedItinerary(itinerary);
        
        if (itinerary) {
          const price = formData.ticketType === 'simple' ? itinerary.priceSimple : itinerary.priceGroup;
          setFormData(prev => ({ ...prev, amount: price.toString() }));
        }
      }
    }
  }, [formData.travelId, formData.ticketType, travels, itineraries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passenger = passengers.find(p => p.id === formData.passengerId);
    const travel = selectedTravel;
    
    const booking = {
      id: Date.now().toString(),
      ticketNumber: `TK-${Date.now()}`,
      passengerId: formData.passengerId,
      passengerName: `${passenger?.firstName} ${passenger?.lastName}`,
      travelId: formData.travelId,
      itinerary: `${travel?.departure} → ${travel?.destination}`,
      departureDate: travel?.departureDate,
      departureTime: travel?.departureTime,
      vehiclePlate: travel?.vehiclePlate,
      seatNumber: formData.seatNumber,
      ticketType: formData.ticketType,
      amount: Number(formData.amount),
      status: 'confirmé',
      bookingDate: new Date().toISOString().split('T')[0],
      notes: formData.notes,
    };
    
    onSave(booking);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-500" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {passenger.firstName} {passenger.lastName} - {passenger.phone}
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
                    {travel.departure} → {travel.destination} - {travel.departureDate} {travel.departureTime}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Numéro de siège
              </label>
              <Input
                name="seatNumber"
                value={formData.seatNumber}
                onChange={handleChange}
                placeholder="A12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Montant (FCFA) *
              </label>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="15000"
                required
              />
            </div>
          </div>

          {selectedItinerary && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Détails de l'itinéraire</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Distance:</span>
                  <p className="font-medium">{selectedItinerary.distance} km</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Durée:</span>
                  <p className="font-medium">{selectedItinerary.duration}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Prix simple:</span>
                  <p className="font-medium">{selectedItinerary.priceSimple} FCFA</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Prix groupe:</span>
                  <p className="font-medium">{selectedItinerary.priceGroup} FCFA</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes additionnelles..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={3}
            />
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
