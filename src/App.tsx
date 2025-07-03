
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/Settings/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout/Header';
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
import LoginPage from '@/components/Auth/LoginPage';
import NotFound from '@/pages/NotFound';
import { FleetDatabase } from '@/services/fleetDatabase';
import './App.css';

function App() {
  useEffect(() => {
    // Initialiser la base de données au démarrage de l'application
    FleetDatabase.initializeDatabase();
    console.log('Base de données Fleet initialisée avec succès');
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="fleet-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={
              <Layout>
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
