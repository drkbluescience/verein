/**
 * easyFiBu Dashboard
 * Tab-based financial management for associations
 * Includes: Kassenbuch, Kontenplan, Spendenprotokolle, Durchlaufende Posten, Jahresabschluss
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { vereinService } from '../../../services/vereinService';
import KontenTab from './KontenTab';
import KassenbuchTab from './KassenbuchTab';
import SpendenTab from './SpendenTab';
import TransitTab from './TransitTab';
import JahresabschlussTab from './JahresabschlussTab';
import './easyFiBu.css';

// Icons
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ArrowRightLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

type TabType = 'kassenbuch' | 'konten' | 'spenden' | 'transit' | 'jahresabschluss';

interface EasyFiBuDashboardProps {
  defaultTab?: TabType;
}

const EasyFiBuDashboard: React.FC<EasyFiBuDashboardProps> = ({ defaultTab = 'kassenbuch' }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);

  // Get vereinId based on user type
  const vereinId = useMemo(() => {
    if (user?.type === 'dernek') return user.vereinId;
    if (user?.type === 'admin') return selectedVereinId;
    return null;
  }, [user, selectedVereinId]);

  // Fetch Vereine (for Admin dropdown)
  const { data: vereine = [] } = useQuery({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  const tabs: { key: TabType; icon: React.ReactNode; label: string }[] = [
    { key: 'kassenbuch', icon: <BookIcon />, label: t('finanz:easyFiBu.tabs.kassenbuch') },
    { key: 'konten', icon: <ListIcon />, label: t('finanz:easyFiBu.tabs.konten') },
    { key: 'spenden', icon: <HeartIcon />, label: t('finanz:easyFiBu.tabs.spenden') },
    { key: 'transit', icon: <ArrowRightLeftIcon />, label: t('finanz:easyFiBu.tabs.transit') },
    { key: 'jahresabschluss', icon: <CalendarIcon />, label: t('finanz:easyFiBu.tabs.jahresabschluss') },
  ];

  const renderTabContent = () => {
    // Konten tab doesn't require vereinId
    if (activeTab === 'konten') {
      return <KontenTab vereinId={vereinId || undefined} />;
    }

    switch (activeTab) {
      case 'kassenbuch':
        return <KassenbuchTab vereinId={vereinId || undefined} />;
      case 'spenden':
        return <SpendenTab vereinId={vereinId || undefined} />;
      case 'transit':
        return <TransitTab vereinId={vereinId || undefined} />;
      case 'jahresabschluss':
        return <JahresabschlussTab vereinId={vereinId || undefined} />;
      default:
        return null;
    }
  };

  return (
    <div className="easyfibu-dashboard">
      {/* Header */}
      <div className="page-header easyfibu-header">
        <div className="page-header-title">
          <h1>easyFiBu</h1>
          <p>{t('finanz:easyFiBu.tabs.uebersicht')}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-controls">
          <div className="tab-buttons">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: activeTab === tab.key ? 'var(--surface-color)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.key ? '600' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '2px solid var(--primary-color)' : '2px solid transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {user?.type === 'admin' && (
            <div className="verein-filter">
              <label htmlFor="verein-select">{t('common:filter.selectVerein')}</label>
              <select
                id="verein-select"
                value={selectedVereinId || ''}
                onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
                className="filter-select"
              >
                <option value="">{t('common:filter.selectVerein')}</option>
                {vereine.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content" style={{ padding: '1.5rem' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EasyFiBuDashboard;
