
import React, { useState } from 'react';
import { Search, Plus, Bus, Printer, Edit, Trash, FileText, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TravelModal from './TravelModal';
import InvoiceModal from './InvoiceModal';

const TravelPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState(null);

  const [travels, setTravels] = useState([
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      vehicleBrand: 'Mercedes Sprinter',
      departure: 'Paris',
      destination: 'Lyon',
      departureDate: '2024-07-15',
      departureTime: '08:00',
      arrivalTime: '12:00',
      passengers: 25,
      capacity: 30,
      driverName: 'Jean Dupont',
      status: 'programmé',
      price: 45,
      distance: 465,
      invoiceGenerated: false,
    },
    {
      id: '2',
      vehiclePlate: 'EF-456-GH',
      vehicleBrand: 'Iveco Daily',
      departure: 'Marseille',
      destination: 'Nice',
      departureDate: '2024-07-10',
      departureTime: '14:00',
      arrivalTime: '16:30',
      passengers: 18,
      capacity: 20,
      driverName: 'Marie Martin',
      status: 'terminé',
      price: 25,
      distance: 200,
      invoiceGenerated: true,
      invoiceNumber: 'FAC-2024-001',
    },
  ]);

  const filteredTravels = travels.filter(travel => {
    const matchesSearch = 
      travel.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || travel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddTravel = () => {
    setSelectedTravel(null);
    setShowTravelModal(true);
  };

  const handleEditTravel = (travel) => {
    setSelectedTravel(travel);
    setShowTravelModal(true);
  };

  const handleDeleteTravel = (travelId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce voyage ?')) {
      setTravels(prev => prev.filter(t => t.id !== travelId));
    }
  };

  const handleSaveTravel = (travelData) => {
    if (selectedTravel) {
      setTravels(prev => prev.map(t => 
        t.id === selectedTravel.id 
          ? { ...travelData, id: selectedTravel.id }
          : t
      ));
    } else {
      const newTravel = {
        ...travelData,
        id: Date.now().toString(),
        invoiceGenerated: false,
      };
      setTravels(prev => [...prev, newTravel]);
    }
  };

  const handleGenerateInvoice = (travel) => {
    setSelectedTravel(travel);
    setShowInvoiceModal(true);
  };

  const handlePrintTickets = (travel) => {
    console.log('Imprimer tickets pour voyage:', travel);
    window.print();
  };

  const statusColors = {
    'programmé': 'bg-blue-100 text-blue-800',
    'en-cours': 'bg-orange-100 text-orange-800',
    'terminé': 'bg-green-100 text-green-800',
    'annulé': 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par véhicule, destination, conducteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
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
          
          <Button onClick={handleAddTravel} className="fleet-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau voyage
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Bus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{travels.length}</p>
          <p className="text-sm text-muted-foreground">Total voyages</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{travels.filter(t => t.status === 'programmé').length}</p>
          <p className="text-sm text-muted-foreground">Programmés</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{travels.filter(t => t.status === 'terminé').length}</p>
          <p className="text-sm text-muted-foreground">Terminés</p>
        </div>
        <div className="fleet-card text-center">
          <Receipt className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {travels.reduce((acc, t) => acc + (t.passengers * t.price), 0)}€
          </p>
          <p className="text-sm text-muted-foreground">Revenus total</p>
        </div>
      </div>

      {/* Table des voyages */}
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
                <th className="text-left py-3 px-4 font-semibold text-foreground">Revenus</th>
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
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${(travel.passengers / travel.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[travel.status]}`}>
                      {travel.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">
                      {travel.passengers * travel.price}€
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {travel.price}€/passager
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePrintTickets(travel)}
                        title="Imprimer tickets"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleGenerateInvoice(travel)}
                        title="Générer facture"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditTravel(travel)}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteTravel(travel.id)}
                        title="Supprimer"
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTravels.length === 0 && (
          <div className="text-center py-12">
            <Bus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Aucun voyage trouvé
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showTravelModal && (
        <TravelModal 
          travel={selectedTravel}
          onClose={() => {
            setShowTravelModal(false);
            setSelectedTravel(null);
          }}
          onSave={handleSaveTravel}
        />
      )}

      {showInvoiceModal && (
        <InvoiceModal 
          travel={selectedTravel}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedTravel(null);
          }}
        />
      )}
    </div>
  );
};

export default TravelPage;
