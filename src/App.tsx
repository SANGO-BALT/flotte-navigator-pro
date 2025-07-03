
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/Settings/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout/Layout';
import Dashboard from '@/components/Dashboard/Dashboard';
import VehiclesPage from '@/components/Vehicles/VehiclesPage';
import UsersPage from '@/components/Users/UsersPage';
import FuelPage from '@/components/Fuel/FuelPage';
import MaintenancePage from '@/components/Maintenance/MaintenancePage';
import ViolationsPage from '@/components/Violations/ViolationsPage';
import GPSPage from '@/components/GPS/GPSPage';
import DocumentsPage from '@/components/Documents/DocumentsPage';
import ReportsPage from '@/components/Reports/ReportsPage';
import TravegabPage from '@/components/Travegab/TravegabPage';
import UserManagementPage from '@/components/UserManagement/UserManagementPage';
import SettingsPage from '@/components/Settings/SettingsPage';
import DataManagementPage from '@/components/Admin/DataManagementPage';
import LoginPage from '@/components/Auth/LoginPage';
import NotFound from '@/pages/NotFound';
import { FleetDatabase } from '@/services/fleetDatabase';
import './App.css';

// Component to get current page title based on route
const AppContent = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Tableau de bord';
      case '/vehicles': return 'Gestion des véhicules';
      case '/users': return 'Gestion des utilisateurs';
      case '/fuel': return 'Gestion du carburant';
      case '/maintenance': return 'Maintenance';
      case '/violations': return 'Contraventions';
      case '/gps': return 'Suivi GPS';
      case '/documents': return 'Documents';
      case '/reports': return 'Rapports';
      case '/travegab': return 'TRAVEGAB';
      case '/user-management': return 'Gestion des utilisateurs';
      case '/settings': return 'Paramètres';
      case '/data-management': return 'Gestion des données';
      default: return 'Gestion de flotte';
    }
  };

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Si pas connecté et pas sur la page de connexion, rediriger vers login
  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // Si connecté et sur la page de connexion, rediriger vers dashboard
  if (isLoggedIn && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Page de connexion
  if (location.pathname === '/login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentPageTitle={getPageTitle()} 
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/fuel" element={<FuelPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/violations" element={<ViolationsPage />} />
        <Route path="/gps" element={<GPSPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/travegab" element={<TravegabPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/data-management" element={<DataManagementPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

function App() {
  useEffect(() => {
    // Initialiser la base de données au démarrage de l'application
    FleetDatabase.initializeDatabase();
    console.log('Base de données Fleet initialisée avec succès');
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <AppContent />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
