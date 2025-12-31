import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { vereinService } from '../../services/vereinService';
import './Sidebar.css';

interface MenuItem {
  path: string;
  labelKey: string; // Translation key instead of hard-coded label
  icon: React.ReactNode;
}

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const adminMenuItems: MenuItem[] = [
  { path: '/startseite', labelKey: 'navigation.dashboard', icon: <HomeIcon /> },
  { path: '/vereine', labelKey: 'navigation.vereine', icon: <BuildingIcon /> },
  { path: '/mitglieder', labelKey: 'navigation.mitglieder', icon: <UsersIcon /> },
  { path: '/veranstaltungen', labelKey: 'navigation.veranstaltungen', icon: <CalendarIcon /> },
  { path: '/finanzen', labelKey: 'navigation.finanz', icon: <CreditCardIcon /> },
  { path: '/finanzen/kassenbuch', labelKey: 'navigation.kassenbuch', icon: <BookIcon /> },
  { path: '/admin/page-notes', labelKey: 'navigation.pageNotes', icon: <FileTextIcon /> },
  { path: '/admin/organizations', labelKey: 'navigation.organizationAdmin', icon: <BuildingIcon /> },
  { path: '/berichte', labelKey: 'navigation.reports', icon: <BarChartIcon /> },
  { path: '/einstellungen', labelKey: 'navigation.settings', icon: <SettingsIcon /> },
];

const dernekMenuItems: MenuItem[] = [
  { path: '/startseite', labelKey: 'navigation.dashboard', icon: <HomeIcon /> },
  { path: '/verein', labelKey: 'navigation.dernek', icon: <BuildingIcon /> },
  { path: '/mitglieder', labelKey: 'navigation.mitgliederimiz', icon: <UsersIcon /> },
  { path: '/veranstaltungen', labelKey: 'navigation.etkinliklerimiz', icon: <CalendarIcon /> },
  { path: '/briefe', labelKey: 'navigation.briefe', icon: <MailIcon /> },
  { path: '/finanzen', labelKey: 'navigation.finanz', icon: <CreditCardIcon /> },
  { path: '/finanzen/kassenbuch', labelKey: 'navigation.kassenbuch', icon: <BookIcon /> },
  { path: '/berichte', labelKey: 'navigation.raporlarimiz', icon: <BarChartIcon /> },
  { path: '/einstellungen', labelKey: 'navigation.settings', icon: <SettingsIcon /> },
];

const mitgliedMenuItems: MenuItem[] = [
  { path: '/startseite', labelKey: 'navigation.dashboard', icon: <HomeIcon /> },
  { path: '/nachrichten', labelKey: 'navigation.nachrichten', icon: <InboxIcon /> },
  { path: '/meine-veranstaltungen', labelKey: 'navigation.etkinlikler', icon: <CalendarIcon /> },
  { path: '/meine-familie', labelKey: 'navigation.ailem', icon: <UsersIcon /> },
  { path: '/meine-finanzen', labelKey: 'navigation.finanz', icon: <CreditCardIcon /> },
  { path: '/einstellungen', labelKey: 'navigation.settings', icon: <SettingsIcon /> },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout, selectedVereinId } = useAuth();
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation('common');
  const [, forceUpdate] = useState({});

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const menuItems = user?.type === 'admin' ? adminMenuItems :
                   user?.type === 'dernek' ? dernekMenuItems :
                   mitgliedMenuItems;

  // For dernek users, use their vereinId
  // For mitglied users, use selectedVereinId
  const vereinId = user?.type === 'dernek' ? user.vereinId : selectedVereinId;

  const { data: currentVerein } = useQuery({
    queryKey: ['verein', vereinId],
    queryFn: () => vereinService.getById(vereinId!),
    enabled: !!vereinId && (user?.type === 'dernek' || user?.type === 'mitglied'),
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    return user?.firstName?.[0]?.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || 'User';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {getInitials()}
          </div>
          <div className="profile-info">
            <p className="profile-name">{getFullName()}</p>
            <p className="profile-email">{user?.email || ''}</p>
          </div>
          <button className="profile-button" onClick={() => navigate('/profil')}>
            <UserIcon />
            <span>{t('navigation.profile')}</span>
          </button>
        </div>

        {/* Dernek Info - For dernek and mitglied users */}
        {currentVerein && (user?.type === 'dernek' || user?.type === 'mitglied') && (
          <div className="verein-info">
            <div className="verein-header">
              <BuildingIcon />
              <div className="verein-details">
                <span className="verein-name">{currentVerein.name}</span>
                <span className="verein-status">
                  {currentVerein.aktiv ? `● ${t('status.active')}` : `○ ${t('status.inactive')}`}
                </span>
              </div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            // For dernek users, replace /verein with dynamic vereinId path
            const itemPath = item.path === '/verein' && user?.type === 'dernek' && user.vereinId
              ? `/vereine/${user.vereinId}`
              : item.path;

            return (
              <NavLink
                key={item.path}
                to={itemPath}
                end={item.path === '/startseite' || item.path === '/finanzen'}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOutIcon />
            <span>{t('navigation.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
