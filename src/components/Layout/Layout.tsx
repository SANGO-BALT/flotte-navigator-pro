
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPageTitle: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPageTitle, onLogout }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPageTitle={currentPageTitle}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
