
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPageTitle: string;
  currentUser?: any;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPageTitle, currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPage = () => {
    switch (location.pathname) {
      case '/': return 'dashboard';
      case '/vehicles': return 'vehicles';
      case '/users': return 'users';
      case '/maintenance': return 'maintenance';
      case '/gps': return 'gps';
      case '/fuel': return 'fuel';
      case '/violations': return 'violations';
      case '/travegab': return 'travel';
      case '/documents': return 'documents';
      case '/reports': return 'reports';
      case '/user-management': return 'user-management';
      case '/settings': return 'settings';
      case '/data-management': return 'data-management';
      default: return 'dashboard';
    }
  };

  const handlePageChange = (page: string) => {
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
      settings: '/settings',
      'data-management': '/data-management'
    };
    
    if (routes[page]) {
      navigate(routes[page]);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
        userRole={currentUser?.role}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPageTitle={currentPageTitle}
          currentUser={currentUser}
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
