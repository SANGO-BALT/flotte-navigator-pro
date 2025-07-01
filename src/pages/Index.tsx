
import React, { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Dashboard from '@/components/Dashboard/Dashboard';
import VehiclesPage from '@/components/Vehicles/VehiclesPage';
import UsersPage from '@/components/Users/UsersPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pageComponents = {
    dashboard: <Dashboard />,
    vehicles: <VehiclesPage />,
    users: <UsersPage />,
    maintenance: <div className="p-6"><h2 className="text-2xl font-bold">Module Maintenance</h2><p className="text-muted-foreground">Interface de gestion de la maintenance en cours de développement...</p></div>,
    gps: <div className="p-6"><h2 className="text-2xl font-bold">Module GPS & Localisation</h2><p className="text-muted-foreground">Intégration OpenStreetMap en cours de développement...</p></div>,
    fuel: <div className="p-6"><h2 className="text-2xl font-bold">Gestion Carburant</h2><p className="text-muted-foreground">Module de gestion des carburants en cours de développement...</p></div>,
    violations: <div className="p-6"><h2 className="text-2xl font-bold">Contraventions</h2><p className="text-muted-foreground">Gestion des contraventions et amendes en cours de développement...</p></div>,
    documents: <div className="p-6"><h2 className="text-2xl font-bold">Documents</h2><p className="text-muted-foreground">Gestion des documents véhicules en cours de développement...</p></div>,
    reports: <div className="p-6"><h2 className="text-2xl font-bold">Rapports</h2><p className="text-muted-foreground">Génération de rapports en cours de développement...</p></div>,
    settings: <div className="p-6"><h2 className="text-2xl font-bold">Paramètres</h2><p className="text-muted-foreground">Configuration de l'application en cours de développement...</p></div>,
  };

  const pageTitles = {
    dashboard: 'Tableau de bord',
    vehicles: 'Gestion des véhicules',
    users: 'Gestion des utilisateurs',
    maintenance: 'Maintenance',
    gps: 'GPS & Localisation',
    fuel: 'Gestion Carburant',
    violations: 'Contraventions',
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
