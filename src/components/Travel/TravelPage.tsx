
import React, { useState } from 'react';
import { Search, Plus, Bus, Users, MapPin, Ticket, Calendar, Edit, Trash, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TravelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('travels');
  const [searchTerm, setSearchTerm] = useState('');

  // Données de test simples
  const travels = [
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      departure: 'Libreville',
      destination: 'Port-Gentil',
      departureDate: '2024-07-15',
      departureTime: '08:00',
      passengers: 25,
      capacity: 30,
      status: 'programmé',
      price: 15000
    },
    {
      id: '2',
      vehiclePlate: 'EF-456-GH',
      departure: 'Libreville',
      destination: 'Franceville',
      departureDate: '2024-07-16',
      departureTime: '06:00',
      passengers: 18,
      capacity: 20,
      status: 'en-cours',
      price: 25000
    }
  ];

  const passengers = [
    { id: '1', firstName: 'Marie', lastName: 'Mbourou', phone: '+241 01 23 45 67' },
    { id: '2', firstName: 'Jean', lastName: 'Obame', phone: '+241 07 89 12 34' }
  ];

  const statusColors = {
    'programmé': 'bg-blue-100 text-blue-800',
    'en-cours': 'bg-orange-100 text-orange-800',
    'terminé': 'bg-green-100 text-green-800'
  };

  const tabs = [
    { id: 'travels', label: 'Voyages', icon: Bus },
    { id: 'passengers', label: 'Voyageurs', icon: Users },
    { id: 'itineraries', label: 'Itinéraires', icon: MapPin },
    { id: 'bookings', label: 'Réservations', icon: Ticket }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          🚌 Module de Gestion des Voyages
        </h1>
        <p className="text-muted-foreground">
          Gérez les voyages, passagers, itinéraires et réservations
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <Bus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground text-center">{travels.length}</p>
          <p className="text-sm text-muted-foreground text-center">Voyages</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground text-center">{passengers.length}</p>
          <p className="text-sm text-muted-foreground text-center">Voyageurs</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground text-center">4</p>
          <p className="text-sm text-muted-foreground text-center">Itinéraires</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <Ticket className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground text-center">12</p>
          <p className="text-sm text-muted-foreground text-center">Réservations</p>
        </div>
      </div>

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

      {/* Header avec recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau {activeTab === 'travels' ? 'voyage' : activeTab === 'passengers' ? 'voyageur' : 'élément'}
        </Button>
      </div>

      {/* Contenu */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {activeTab === 'travels' && (
                  <>
                    <th className="text-left py-3 px-4 font-semibold">Véhicule</th>
                    <th className="text-left py-3 px-4 font-semibold">Trajet</th>
                    <th className="text-left py-3 px-4 font-semibold">Date/Heure</th>
                    <th className="text-left py-3 px-4 font-semibold">Passagers</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </>
                )}
                {activeTab === 'passengers' && (
                  <>
                    <th className="text-left py-3 px-4 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold">Téléphone</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'travels' && travels.map((travel) => (
                <tr key={travel.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{travel.vehiclePlate}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p>{travel.departure} → {travel.destination}</p>
                    <p className="text-sm text-muted-foreground">{travel.price} FCFA</p>
                  </td>
                  <td className="py-3 px-4">
                    <p>{travel.departureDate}</p>
                    <p className="text-sm text-muted-foreground">{travel.departureTime}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p>{travel.passengers}/{travel.capacity}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[travel.status]}`}>
                      {travel.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {activeTab === 'passengers' && passengers.map((passenger) => (
                <tr key={passenger.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p>{passenger.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {activeTab === 'itineraries' && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Fonctionnalité en cours de développement
                  </td>
                </tr>
              )}

              {activeTab === 'bookings' && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Fonctionnalité en cours de développement
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TravelPage;
