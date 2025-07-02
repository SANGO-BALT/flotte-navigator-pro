
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
import DocumentsPage from '@/components/Documents/DocumentsPage';
import ReportsPage from '@/components/Reports/ReportsPage';
import SettingsPage from '@/components/Settings/SettingsPage';
import UserManagementPage from '@/components/UserManagement/UserManagementPage';
import LoginPage from '@/components/Auth/LoginPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Si pas connecté, afficher la page de connexion
  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const pageComponents = {
    dashboard: <Dashboard />,
    vehicles: <VehiclesPage />,
    users: <UsersPage />,
    maintenance: <MaintenancePage />,
    gps: <GPSPage />,
    fuel: <FuelPage />,
    violations: <ViolationsPage />,
    travel: <TravelPage />,
    documents: <DocumentsPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
    'user-management': <UserManagementPage />,
  };

  const pageTitles = {
    dashboard: 'Tableau de bord',
    vehicles: 'Gestion des véhicules',
    users: 'Gestion des personnels',
    maintenance: 'Maintenance',
    gps: 'GPS & Localisation',
    fuel: 'Gestion Carburant',
    violations: 'Contraventions',
    travel: 'Voyages & Transport',
    documents: 'Gestion Électronique des Documents',
    reports: 'Rapports et Analyses',
    settings: 'Paramètres',
    'user-management': 'Gestion des Utilisateurs',
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      setCurrentUser(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        userRole={currentUser?.role}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          currentPageTitle={pageTitles[currentPage]}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto">
          {pageComponents[currentPage]}
        </main>
      </div>
    </div>
  );
};

export default Index;
