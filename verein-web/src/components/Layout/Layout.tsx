import React, { useState } from 'react';
import Sidebar from './Sidebar';
import PageNoteButton from '../PageNote/PageNoteButton';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="layout-main">
        <main className="layout-content">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <span className="menu-icon">☰</span>
      </button>

      {/* Floating Page Note Button - For admin and dernek users */}
      {(user?.type === 'admin' || user?.type === 'dernek') && <PageNoteButton />}
    </div>
  );
};

export default Layout;
