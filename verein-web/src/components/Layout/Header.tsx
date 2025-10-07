import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/vereine')) return 'Dernekler';
    if (path.startsWith('/mitglieder')) return 'Üyeler';
    if (path.startsWith('/veranstaltungen')) return 'Etkinlikler';
    if (path.startsWith('/reports')) return 'Raporlar';
    
    return 'Verein Yönetimi';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">Verein</span>
          </Link>
        </div>
        
        <div className="header-center">
          <h1 className="header-title">{getPageTitle()}</h1>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="header-btn" title="Bildirimler">
              <span className="btn-icon">🔔</span>
            </button>
            <button className="header-btn" title="Ayarlar">
              <span className="btn-icon">⚙️</span>
            </button>
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">
                  {user?.type === 'admin' ? '👨‍💼' : '🏢'}
                </span>
                <span className="user-name">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="user-type">
                      {user?.type === 'admin' ? 'System Admin' : 'Dernek Yöneticisi'}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
