import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation('common');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const getPageTitle = () => {
    if (title) return title;

    const path = location.pathname;
    if (path === '/startseite') return t('navigation.dashboard');
    if (path.startsWith('/vereine')) {
      // For dernek users viewing their own verein, show "Dernek" instead of "Dernekler"
      if (user?.type === 'dernek' && user.vereinId && path === `/vereine/${user.vereinId}`) {
        return t('navigation.dernek');
      }
      return t('navigation.vereine');
    }
    if (path.startsWith('/mitglieder')) return t('navigation.mitglieder');
    if (path.startsWith('/veranstaltungen')) return t('navigation.veranstaltungen');
    if (path.startsWith('/meine-veranstaltungen')) return t('navigation.etkinlikler');
    if (path.startsWith('/meine-familie')) return t('navigation.ailem');
    if (path.startsWith('/berichte')) return t('navigation.reports');
    if (path.startsWith('/finanzen')) return t('navigation.finanz');
    if (path.startsWith('/einstellungen')) return t('navigation.settings');
    if (path.startsWith('/profil')) return t('navigation.profile');

    return t('app.name');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries();
      // Refresh the current page by navigating to it
      navigate(location.pathname + location.search, { replace: true });
    } finally {
      setIsRefreshing(false);
    }
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
            <button
              className="header-btn"
              title={t('actions.refresh')}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <span className={`btn-icon ${isRefreshing ? 'rotating' : ''}`}>🔄</span>
            </button>
            <button className="header-btn" title={t('header.notifications')}>
              <span className="btn-icon">🔔</span>
            </button>
            <button className="header-btn" title={t('header.settings')}>
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
                      {user?.type === 'admin' ? t('userTypes.admin') :
                       user?.type === 'dernek' ? t('userTypes.dernek') :
                       t('userTypes.mitglied')}
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
                    {t('navigation.logout')}
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
