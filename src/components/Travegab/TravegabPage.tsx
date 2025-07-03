import React, { useState, useEffect } from 'react';
import { Search, Plus, Bus, Users, MapPin, Ticket, Calendar, Edit, Eye, FileText, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TravegabModal from './TravegabModal';
import { useToast } from '@/hooks/use-toast';
import { TravegabDatabase } from '@/services/database';
import { Voyage, Passenger, Reservation, Itinerary } from '@/types/travegab';

const TravegabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('voyages');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'voyage' | 'passenger' | 'reservation' | 'itinerary'>('voyage');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  // États pour les données
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [passagers, setPassagers] = useState<Passenger[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [itineraires, setItineraires] = useState<Itinerary[]>([]);

  // Initialiser la base de données et charger les données
  useEffect(() => {
    TravegabDatabase.initializeDatabase();
    loadData();
  }, []);

  const loadData = () => {
    setVoyages(TravegabDatabase.getVoyages());
    setPassagers(TravegabDatabase.getPassengers());
    setReservations(TravegabDatabase.getReservations());
    setItineraires(TravegabDatabase.getItineraries());
  };

  const statusColors = {
    'programmé': 'bg-blue-100 text-blue-800',
    'en-cours': 'bg-orange-100 text-orange-800',
    'confirmé': 'bg-green-100 text-green-800',
    'terminé': 'bg-gray-100 text-gray-800',
    'payé': 'bg-emerald-100 text-emerald-800',
    'annulé': 'bg-red-100 text-red-800'
  };

  const tabs = [
    { id: 'voyages', label: 'Voyages', icon: Bus },
    { id: 'passagers', label: 'Passagers', icon: Users },
    { id: 'reservations', label: 'Réservations', icon: Ticket },
    { id: 'itineraires', label: 'Itinéraires', icon: MapPin }
  ];

  const openModal = (type: 'voyage' | 'passenger' | 'reservation' | 'itinerary', mode: 'create' | 'edit' | 'view' = 'create', item?: any) => {
    setModalType(type);
    setModalMode(mode);
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleSave = (data: any) => {
    const newId = modalMode === 'create' ? Date.now().toString() : selectedItem?.id;
    
    switch (modalType) {
      case 'voyage':
        if (modalMode === 'create') {
          const newVoyage = { ...data, id: newId, passagers: 0 };
          TravegabDatabase.addVoyage(newVoyage);
        } else {
          TravegabDatabase.updateVoyage(newId, data);
        }
        setVoyages(TravegabDatabase.getVoyages());
        break;
        
      case 'passenger':
        if (modalMode === 'create') {
          const newPassenger = { ...data, id: newId };
          TravegabDatabase.addPassenger(newPassenger);
          
          // Si un voyage est assigné, créer automatiquement une réservation
          if (data.voyageAssigne) {
            const voyage = voyages.find(v => v.id === data.voyageAssigne);
            if (voyage) {
              const newReservation = {
                id: `${newId}-res`,
                numeroTicket: `TK-${newId}`,
                passager: `${data.prenom} ${data.nom}`,
                voyage: `${voyage.depart} → ${voyage.destination}`,
                siege: `A${Math.floor(Math.random() * 30) + 1}`,
                montant: voyage.prix,
                statut: 'confirmé' as const,
                dateReservation: new Date().toISOString().split('T')[0]
              };
              TravegabDatabase.addReservation(newReservation);
              setReservations(TravegabDatabase.getReservations());
            }
          }
        } else {
          TravegabDatabase.updatePassenger(newId, data);
        }
        setPassagers(TravegabDatabase.getPassengers());
        break;
        
      case 'reservation':
        if (modalMode === 'create') {
          const newReservation = { 
            ...data, 
            id: newId, 
            numeroTicket: `TK-${newId}`, 
            dateReservation: new Date().toISOString().split('T')[0] 
          };
          TravegabDatabase.addReservation(newReservation);
        } else {
          TravegabDatabase.updateReservation(newId, data);
        }
        setReservations(TravegabDatabase.getReservations());
        break;
        
      case 'itinerary':
        if (modalMode === 'create') {
          const newItinerary = { ...data, id: newId, actif: true };
          TravegabDatabase.addItinerary(newItinerary);
        } else {
          TravegabDatabase.updateItinerary(newId, data);
        }
        setItineraires(TravegabDatabase.getItineraries());
        break;
    }

    const action = modalMode === 'create' ? 'ajouté' : 'modifié';
    const itemName = modalType === 'voyage' ? 'Voyage' : 
                    modalType === 'passenger' ? 'Passager' : 
                    modalType === 'reservation' ? 'Réservation' : 'Itinéraire';

    toast({
      title: "Succès",
      description: `${itemName} ${action} avec succès`,
    });
  };

  const handleDelete = (id: string) => {
    switch (modalType) {
      case 'voyage':
        TravegabDatabase.deleteVoyage(id);
        setVoyages(TravegabDatabase.getVoyages());
        break;
      case 'passenger':
        TravegabDatabase.deletePassenger(id);
        setPassagers(TravegabDatabase.getPassengers());
        break;
      case 'reservation':
        TravegabDatabase.deleteReservation(id);
        setReservations(TravegabDatabase.getReservations());
        break;
      case 'itinerary':
        TravegabDatabase.deleteItinerary(id);
        setItineraires(TravegabDatabase.getItineraries());
        break;
    }

    const itemName = modalType === 'voyage' ? 'Voyage' : 
                    modalType === 'passenger' ? 'Passager' : 
                    modalType === 'reservation' ? 'Réservation' : 'Itinéraire';

    toast({
      title: "Succès",
      description: `${itemName} supprimé avec succès`,
    });
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'voyages':
        return voyages.filter(v => 
          v.depart.toLowerCase().includes(term) || 
          v.destination.toLowerCase().includes(term) ||
          v.vehicule.toLowerCase().includes(term)
        );
      case 'passagers':
        return passagers.filter(p => 
          p.nom.toLowerCase().includes(term) || 
          p.prenom.toLowerCase().includes(term) ||
          p.telephone.includes(term)
        );
      case 'reservations':
        return reservations.filter(r => 
          r.passager.toLowerCase().includes(term) || 
          r.numeroTicket.toLowerCase().includes(term) ||
          r.voyage.toLowerCase().includes(term)
        );
      case 'itineraires':
        return itineraires.filter(i => 
          i.nom.toLowerCase().includes(term) || 
          i.depart.toLowerCase().includes(term) ||
          i.destination.toLowerCase().includes(term)
        );
      default:
        return [];
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
          🚌 TRAVEGAB
        </h1>
        <p className="text-muted-foreground text-lg">
          Système de gestion des voyages et transport au Gabon
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{voyages.length}</p>
              <p className="text-sm text-muted-foreground">Voyages actifs</p>
            </div>
            <Bus className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{passagers.length}</p>
              <p className="text-sm text-muted-foreground">Passagers</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{reservations.length}</p>
              <p className="text-sm text-muted-foreground">Réservations</p>
            </div>
            <Ticket className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{itineraires.length}</p>
              <p className="text-sm text-muted-foreground">Itinéraires</p>
            </div>
            <MapPin className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all ${
              activeTab === tab.id 
                ? 'bg-background text-foreground shadow-sm font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Barre de recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Rechercher ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => openModal(activeTab === 'voyages' ? 'voyage' : activeTab === 'passagers' ? 'passenger' : activeTab === 'reservations' ? 'reservation' : 'itinerary')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Contenu principal */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {activeTab === 'voyages' && (
                  <>
                    <th className="text-left py-4 px-6 font-semibold">Véhicule</th>
                    <th className="text-left py-4 px-6 font-semibold">Trajet</th>
                    <th className="text-left py-4 px-6 font-semibold">Date & Heure</th>
                    <th className="text-left py-4 px-6 font-semibold">Passagers</th>
                    <th className="text-left py-4 px-6 font-semibold">Statut</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </>
                )}
                {activeTab === 'passagers' && (
                  <>
                    <th className="text-left py-4 px-6 font-semibold">Nom Complet</th>
                    <th className="text-left py-4 px-6 font-semibold">Téléphone</th>
                    <th className="text-left py-4 px-6 font-semibold">Email</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </>
                )}
                {activeTab === 'reservations' && (
                  <>
                    <th className="text-left py-4 px-6 font-semibold">N° Ticket</th>
                    <th className="text-left py-4 px-6 font-semibold">Passager</th>
                    <th className="text-left py-4 px-6 font-semibold">Voyage</th>
                    <th className="text-left py-4 px-6 font-semibold">Siège</th>
                    <th className="text-left py-4 px-6 font-semibold">Montant</th>
                    <th className="text-left py-4 px-6 font-semibold">Statut</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </>
                )}
                {activeTab === 'itineraires' && (
                  <>
                    <th className="text-left py-4 px-6 font-semibold">Nom</th>
                    <th className="text-left py-4 px-6 font-semibold">Trajet</th>
                    <th className="text-left py-4 px-6 font-semibold">Distance</th>
                    <th className="text-left py-4 px-6 font-semibold">Durée</th>
                    <th className="text-left py-4 px-6 font-semibold">Prix</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData().map((item: any) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  {activeTab === 'voyages' && (
                    <>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-blue-500" />
                          <p className="font-medium text-foreground">{item.vehicule}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.depart} → {item.destination}</p>
                        <p className="text-sm text-muted-foreground">{item.prix?.toLocaleString()} FCFA</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{new Date(item.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm text-muted-foreground">{item.heure}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.passagers}/{item.capacite}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.statut] || 'bg-gray-100 text-gray-800'}`}>
                          {item.statut}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openModal('voyage', 'edit', item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openModal('voyage', 'view', item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                  
                  {activeTab === 'passagers' && (
                    <>
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{item.prenom} {item.nom}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.telephone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openModal('passenger', 'edit', item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openModal('passenger', 'view', item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                  
                  {activeTab === 'reservations' && (
                    <>
                      <td className="py-4 px-6">
                        <p className="font-mono font-medium text-foreground">{item.numeroTicket}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.passager}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.voyage}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground font-mono">{item.siege}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground font-medium">{item.montant?.toLocaleString()} FCFA</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.statut] || 'bg-gray-100 text-gray-800'}`}>
                          {item.statut}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openModal('reservation', 'view', item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openModal('reservation', 'edit', item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                  
                  {activeTab === 'itineraires' && (
                    <>
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{item.nom}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.depart} → {item.destination}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.distance} km</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">{item.duree}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground font-medium">{item.prix?.toLocaleString()} FCFA</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openModal('itinerary', 'edit', item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openModal('itinerary', 'view', item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData().length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground text-lg">Aucun résultat trouvé</p>
            <p className="text-muted-foreground text-sm mt-2">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <TravegabModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={selectedItem}
        type={modalType}
        mode={modalMode}
        voyagesData={voyages}
      />
    </div>
  );
};

export default TravegabPage;
