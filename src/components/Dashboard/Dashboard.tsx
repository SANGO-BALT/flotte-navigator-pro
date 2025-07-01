
import React from 'react';
import { Car, Users, AlertTriangle, Wrench, Calendar, Fuel } from 'lucide-react';
import StatsCard from './StatsCard';
import VehicleAlerts from './VehicleAlerts';
import MaintenanceSchedule from './MaintenanceSchedule';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Véhicules Total',
      value: '156',
      change: '+12',
      changeType: 'positive' as const,
      icon: Car,
    },
    {
      title: 'Utilisateurs Actifs',
      value: '89',
      change: '+5',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Maintenance Due',
      value: '23',
      change: '+8',
      changeType: 'negative' as const,
      icon: Wrench,
    },
    {
      title: 'Contraventions',
      value: '7',
      change: '-3',
      changeType: 'positive' as const,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphiques et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="fleet-card">
            <h3 className="text-lg font-semibold mb-4">Aperçu de la Flotte</h3>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Graphique des véhicules par statut</p>
            </div>
          </div>
        </div>

        <div>
          <VehicleAlerts />
        </div>
      </div>

      {/* Planning de maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceSchedule />
        
        <div className="fleet-card">
          <h3 className="text-lg font-semibold mb-4">Consommation Carburant</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Fuel className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Cette semaine</p>
                  <p className="text-sm text-muted-foreground">1,247 L</p>
                </div>
              </div>
              <span className="text-green-500 font-medium">-5%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">Ce mois</p>
                  <p className="text-sm text-muted-foreground">4,892 L</p>
                </div>
              </div>
              <span className="text-red-500 font-medium">+2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
