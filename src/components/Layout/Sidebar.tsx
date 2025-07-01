
import React from 'react';
import { Car, Users, MapPin, Calendar, FileText, Settings, Home, Fuel, AlertTriangle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home },
  { id: 'vehicles', label: 'Véhicules', icon: Car },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'gps', label: 'GPS & Localisation', icon: MapPin },
  { id: 'fuel', label: 'Carburant', icon: Fuel },
  { id: 'violations', label: 'Contraventions', icon: AlertTriangle },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'reports', label: 'Rapports', icon: Calendar },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <div className="bg-card border-r border-border w-64 min-h-screen p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 fleet-gradient rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FleetPro</h1>
            <p className="text-sm text-muted-foreground">Gestion de Flotte</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
              currentPage === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
