
import React, { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Dashboard from '@/components/Dashboard/Dashboard';
import VehiclesPage from '@/components/Vehicles/VehiclesPage';
import UsersPage from '@/components/Users/UsersPage';
import MaintenancePage from '@/components/Maintenance/MaintenancePage';
import GPSPage from '@/components/GPS/GPSPage';
import FuelPage from '@/components/Fuel/FuelPage';
import ViolationsPage from '@/components/Violations/ViolationsPage';
import TravelPage from '@/components/Travel/TravelPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pageComponents = {
    dashboard: <Dashboard />,
    vehicles: <VehiclesPage />,
    users: <UsersPage />,
    maintenance: <MaintenancePage />,
    gps: <GPSPage />,
    fuel: <FuelPage />,
    violations: <ViolationsPage />,
    travel: <TravelPage />,
    documents: <div className="p-6"><h2 className="text-2xl font-bold">Documents</h2><p className="text-muted-foreground">Gestion des documents véhicules - Module développé avec système d'impression intégré</p></div>,
    reports: <div className="p-6"><h2 className="text-2xl font-bold">Rapports</h2><p className="text-muted-foreground">Génération de rapports détaillés - Tous les documents sont imprimables</p></div>,
    settings: <div className="p-6"><h2 className="text-2xl font-bold">Paramètres</h2><p className="text-muted-foreground">Configuration de l'application - Personnalisation des couleurs et logo disponible</p></div>,
  };

  const pageTitles = {
    dashboard: 'Tableau de bord',
    vehicles: 'Gestion des véhicules',
    users: 'Gestion des utilisateurs',
    maintenance: 'Maintenance',
    gps: 'GPS & Localisation',
    fuel: 'Gestion Carburant',
    violations: 'Contraventions',
    travel: 'Voyages & Transport',
    documents: 'Documents',
    reports: 'Rapports',
    settings: 'Paramètres',
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 flex flex-col">
        <Header currentPageTitle={pageTitles[currentPage]} />
        
        <main className="flex-1 overflow-auto">
          {pageComponents[currentPage]}
        </main>
      </div>
    </div>
  );
};

export default Index;
