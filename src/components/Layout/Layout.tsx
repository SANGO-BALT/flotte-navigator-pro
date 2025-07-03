
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPageTitle: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPageTitle, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Navigate to the page - in a real app this would use router
    const routes: { [key: string]: string } = {
      dashboard: '/',
      vehicles: '/vehicles',
      users: '/users',
      maintenance: '/maintenance',
      gps: '/gps',
      fuel: '/fuel',
      violations: '/violations',
      travel: '/travegab',
      documents: '/documents',
      reports: '/reports',
      'user-management': '/user-management',
      settings: '/settings'
    };
    
    if (routes[page]) {
      window.location.href = routes[page];
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
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
