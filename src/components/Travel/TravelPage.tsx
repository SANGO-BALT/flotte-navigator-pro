
import React, { useState } from 'react';
import { Search, Plus, Bus, Users, MapPin, Ticket, Calendar, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TravelModal from './TravelModal';
import InvoiceModal from './InvoiceModal';
import PassengerModal from './PassengerModal';
import ItineraryModal from './ItineraryModal';
import BookingModal from './BookingModal';
import TicketModal from './TicketModal';
import { hasPermission } from '@/utils/permissions';

const TravelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('travels');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const userRole = 'manager'; // À récupérer du contexte

  // États pour chaque entité
  const [travels, setTravels] = useState([
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      vehicleBrand: 'Mercedes Sprinter',
      departure: 'Libreville',
      destination: 'Port-Gentil',
      departureDate: '2024-07-15',
      departureTime: '08:00',
      arrivalTime: '13:30',
      passengers: 25,
      capacity: 30,
      driverName: 'Jean Dupont',
      status: 'programmé',
      price: 15000,
      distance: 300,
    }
  ]);

  const [passengers, setPassengers] = useState([
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Mbourou',
      gender: 'F',
      phone: '+241 XX XX XX XX'
    }
  ]);

  const [itineraries, setItineraries] = useState([
    {
      id: '1',
      name: 'Libreville - Port-Gentil',
      departure: 'Libreville',
      destination: 'Port-Gentil',
      distance: 300,
      duration: '5h 30min',
      priceSimple: 15000,
      priceGroup: 12000,
      isActive: true
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: '1',
      ticketNumber: 'TK-001',
      passengerId: '1',
      passengerName: 'Marie Mbourou',
      travelId: '1',
      itinerary: 'Libreville → Port-Gentil',
      departureDate: '2024-07-15',
      departureTime: '08:00',
      vehiclePlate: 'AB-123-CD',
      seatNumber: 'A12',
      ticketType: 'simple',
      amount: 15000,
      status: 'confirmé',
      bookingDate: '2024-07-10'
    }
  ]);

  // Filtres
  const filteredTravels = travels.filter(travel => {
    const matchesSearch = 
      travel.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || travel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPassengers = passengers.filter(passenger =>
    `${passenger.firstName} ${passenger.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passenger.phone.includes(searchTerm)
  );

  const filteredBookings = bookings.filter(booking =>
    booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers pour les voyages
  const handleAddTravel = () => {
    if (!hasPermission(userRole, 'travel', 'create')) return;
    setSelectedItem(null);
    setShowTravelModal(true);
  };

  const handleEditTravel = (travel) => {
    if (!hasPermission(userRole, 'travel', 'edit')) return;
    setSelectedItem(travel);
    setShowTravelModal(true);
  };

  const handleDeleteTravel = (travelId) => {
    if (!hasPermission(userRole, 'travel', 'delete')) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce voyage ?')) {
      setTravels(prev => prev.filter(t => t.id !== travelId));
    }
  };

  const handleSaveTravel = (travelData) => {
    if (selectedItem) {
      setTravels(prev => prev.map(t => 
        t.id === selectedItem.id ? { ...travelData, id: selectedItem.id } : t
      ));
    } else {
      setTravels(prev => [...prev, { ...travelData, id: Date.now().toString() }]);
    }
  };

  // Handlers pour les passagers
  const handleAddPassenger = () => {
    if (!hasPermission(userRole, 'travel', 'create')) return;
    setSelectedItem(null);
    setShowPassengerModal(true);
  };

  const handleEditPassenger = (passenger) => {
    if (!hasPermission(userRole, 'travel', 'edit')) return;
    setSelectedItem(passenger);
    setShowPassengerModal(true);
  };

  const handleSavePassenger = (passengerData) => {
    if (selectedItem) {
      setPassengers(prev => prev.map(p => 
        p.id === selectedItem.id ? { ...passengerData, id: selectedItem.id } : p
      ));
    } else {
      setPassengers(prev => [...prev, { ...passengerData, id: Date.now().toString() }]);
    }
  };

  // Handlers pour les itinéraires
  const handleAddItinerary = () => {
    if (!hasPermission(userRole, 'travel', 'create')) return;
    setSelectedItem(null);
    setShowItineraryModal(true);
  };

  const handleSaveItinerary = (itineraryData) => {
    if (selectedItem) {
      setItineraries(prev => prev.map(i => 
        i.id === selectedItem.id ? { ...itineraryData, id: selectedItem.id } : i
      ));
    } else {
      setItineraries(prev => [...prev, { ...itineraryData, id: Date.now().toString() }]);
    }
  };

  // Handlers pour les réservations
  const handleAddBooking = () => {
    if (!hasPermission(userRole, 'travel', 'create')) return;
    setShowBookingModal(true);
  };

  const handleSaveBooking = (bookingData) => {
    setBookings(prev => [...prev, bookingData]);
  };

  const handleCancelBooking = (bookingId) => {
    if (!hasPermission(userRole, 'travel', 'delete')) return;
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'annulé' } : b
      ));
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedItem(booking);
    setShowTicketModal(true);
  };

  const handleGenerateInvoice = (travel) => {
    if (!hasPermission(userRole, 'travel', 'print')) return;
    setSelectedItem(travel);
    setShowInvoiceModal(true);
  };

  const statusColors = {
    'programmé': 'bg-blue-100 text-blue-800',
    'en-cours': 'bg-orange-100 text-orange-800',
    'terminé': 'bg-green-100 text-green-800',
    'annulé': 'bg-red-100 text-red-800',
    'confirmé': 'bg-green-100 text-green-800',
  };

  const tabs = [
    { id: 'travels', label: 'Voyages', icon: Bus },
    { id: 'passengers', label: 'Voyageurs', icon: Users },
    { id: 'itineraries', label: 'Itinéraires', icon: MapPin },
    { id: 'bookings', label: 'Réservations', icon: Ticket },
  ];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Header avec recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Rechercher ${activeTab === 'travels' ? 'un voyage' : activeTab === 'passengers' ? 'un voyageur' : activeTab === 'itineraries' ? 'un itinéraire' : 'une réservation'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {activeTab === 'travels' && (
            <>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="all">Tous les statuts</option>
                <option value="programmé">Programmés</option>
                <option value="en-cours">En cours</option>
                <option value="terminé">Terminés</option>
                <option value="annulé">Annulés</option>
              </select>
              {hasPermission(userRole, 'travel', 'create') && (
                <Button onClick={handleAddTravel} className="fleet-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau voyage
                </Button>
              )}
            </>
          )}
          
          {activeTab === 'passengers' && hasPermission(userRole, 'travel', 'create') && (
            <Button onClick={handleAddPassenger} className="fleet-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau voyageur
            </Button>
          )}
          
          {activeTab === 'itineraries' && hasPermission(userRole, 'travel', 'create') && (
            <Button onClick={handleAddItinerary} className="fleet-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel itinéraire
            </Button>
          )}
          
          {activeTab === 'bookings' && hasPermission(userRole, 'travel', 'create') && (
            <Button onClick={handleAddBooking} className="fleet-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle réservation
            </Button>
          )}
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'travels' && (
        <div className="fleet-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Véhicule</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Trajet</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date/Heure</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Passagers</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTravels.map((travel) => (
                  <tr key={travel.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{travel.vehiclePlate}</p>
                        <p className="text-sm text-muted-foreground">{travel.vehicleBrand}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-foreground">{travel.departure} → {travel.destination}</p>
                        <p className="text-xs text-muted-foreground">{travel.distance} km</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-foreground">
                          {new Date(travel.departureDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {travel.departureTime} - {travel.arrivalTime}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{travel.passengers}/{travel.capacity}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[travel.status]}`}>
                        {travel.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {hasPermission(userRole, 'travel', 'edit') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditTravel(travel)}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission(userRole, 'travel', 'delete') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteTravel(travel.id)}
                            title="Supprimer"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'passengers' && (
        <div className="fleet-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nom complet</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Sexe</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Téléphone</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPassengers.map((passenger) => (
                  <tr key={passenger.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">
                        {passenger.gender === 'M' ? 'Masculin' : 'Féminin'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{passenger.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {hasPermission(userRole, 'travel', 'edit') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditPassenger(passenger)}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'itineraries' && (
        <div className="fleet-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Trajet</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Distance</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Prix</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {itineraries.map((itinerary) => (
                  <tr key={itinerary.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">{itinerary.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">
                        {itinerary.departure} → {itinerary.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">{itinerary.duration}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{itinerary.distance} km</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-foreground">Simple: {itinerary.priceSimple} FCFA</p>
                        <p className="text-xs text-muted-foreground">Groupe: {itinerary.priceGroup} FCFA</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        itinerary.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {itinerary.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="fleet-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Ticket</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Passager</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Voyage</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Montant</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{booking.ticketNumber}</p>
                        <p className="text-xs text-muted-foreground">Siège: {booking.seatNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{booking.passengerName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-foreground">{booking.itinerary}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.departureDate} - {booking.departureTime}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">{booking.amount} FCFA</p>
                      <p className="text-xs text-muted-foreground">{booking.ticketType}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewTicket(booking)}
                          title="Voir ticket"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === 'confirmé' && hasPermission(userRole, 'travel', 'delete') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCancelBooking(booking.id)}
                            title="Annuler"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showTravelModal && (
        <TravelModal 
          travel={selectedItem}
          onClose={() => {
            setShowTravelModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveTravel}
        />
      )}

      {showPassengerModal && (
        <PassengerModal 
          passenger={selectedItem}
          onClose={() => {
            setShowPassengerModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSavePassenger}
        />
      )}

      {showItineraryModal && (
        <ItineraryModal 
          itinerary={selectedItem}
          onClose={() => {
            setShowItineraryModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveItinerary}
        />
      )}

      {showBookingModal && (
        <BookingModal 
          onClose={() => setShowBookingModal(false)}
          onSave={handleSaveBooking}
          passengers={passengers}
          itineraries={itineraries}
          travels={travels}
        />
      )}

      {showTicketModal && (
        <TicketModal 
          booking={selectedItem}
          onClose={() => {
            setShowTicketModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showInvoiceModal && (
        <InvoiceModal 
          travel={selectedItem}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default TravelPage;
