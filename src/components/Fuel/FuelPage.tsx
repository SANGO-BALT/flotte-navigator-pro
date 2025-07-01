
import React, { useState } from 'react';
import { Search, Plus, Fuel, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FuelModal from './FuelModal';

const FuelPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fuelRecords = [
    {
      id: '1',
      vehiclePlate: 'AB-123-CD',
      vehicleBrand: 'Peugeot 308',
      date: '2024-07-01',
      fuelType: 'Diesel',
      quantity: 45,
      unitPrice: 1.52,
      totalCost: 68.40,
      station: 'Total Station Centre',
      mileage: 85340,
    },
    {
      id: '2',
      vehiclePlate: 'EF-456-GH',
      vehicleBrand: 'Renault Trafic',
      date: '2024-06-30',
      fuelType: 'Diesel',
      quantity: 65,
      unitPrice: 1.48,
      totalCost: 96.20,
      station: 'Shell Autoroute A6',
      mileage: 120450,
    },
    {
      id: '3',
      vehiclePlate: 'IJ-789-KL',
      vehicleBrand: 'Yamaha MT-07',
      date: '2024-06-29',
      fuelType: 'Essence',
      quantity: 15,
      unitPrice: 1.67,
      totalCost: 25.05,
      station: 'Esso Centre Ville',
      mileage: 45120,
    },
  ];

  const filteredRecords = fuelRecords.filter(record =>
    record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCost = fuelRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const totalQuantity = fuelRecords.reduce((sum, record) => sum + record.quantity, 0);
  const averagePrice = totalCost / totalQuantity;

  return (
    <div className="p-6">
      {/* Header avec recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par plaque, véhicule, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => setShowModal(true)} className="fleet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter plein
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <Fuel className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalQuantity.toFixed(0)}L</p>
          <p className="text-sm text-muted-foreground">Total consommé</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalCost.toFixed(0)}€</p>
          <p className="text-sm text-muted-foreground">Coût total</p>
        </div>
        <div className="fleet-card text-center">
          <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{averagePrice.toFixed(2)}€/L</p>
          <p className="text-sm text-muted-foreground">Prix moyen</p>
        </div>
        <div className="fleet-card text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{fuelRecords.length}</p>
          <p className="text-sm text-muted-foreground">Pleins ce mois</p>
        </div>
      </div>

      {/* Liste des pleins */}
      <div className="fleet-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Historique des pleins</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              Filtrer par date
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Véhicule</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Carburant</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Quantité</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Prix/L</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Station</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Km</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{new Date(record.date).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{record.vehiclePlate}</p>
                      <p className="text-sm text-muted-foreground">{record.vehicleBrand}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.fuelType === 'Diesel' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.fuelType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-foreground">{record.quantity}L</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{record.unitPrice.toFixed(2)}€</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-foreground">{record.totalCost.toFixed(2)}€</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{record.station}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">{record.mileage.toLocaleString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de plein */}
      {showModal && (
        <FuelModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default FuelPage;
