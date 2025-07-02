
import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  currentPageTitle: string;
  currentUser?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPageTitle, currentUser, onLogout }) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{currentPageTitle}</h2>
          <p className="text-muted-foreground">Gestion centralisée de votre flotte de véhicules</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher véhicule, utilisateur..."
              className="pl-10 w-80"
            />
          </div>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {currentUser && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <Button variant="outline" size="icon">
                <User className="w-4 h-4" />
              </Button>
              {onLogout && (
                <Button variant="outline" size="icon" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
