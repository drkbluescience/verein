import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { nachrichtService } from '../../services';
import { NachrichtDto } from '../../types/brief.types';
import { useAuth } from '../../contexts/AuthContext';
import './NachrichtenList.css';

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

type FilterType = 'all' | 'unread' | 'read';

const NachrichtenList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mitgliedId = user?.mitgliedId;

  const { data: nachrichten = [], isLoading } = useQuery({
    queryKey: ['nachrichten', mitgliedId],
    queryFn: () => nachrichtService.getByMitgliedId(mitgliedId!),
    enabled: !!mitgliedId,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['nachrichten-unread', mitgliedId],
    queryFn: () => nachrichtService.getUnreadCount(mitgliedId!),
    enabled: !!mitgliedId,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Filter and search messages
  const filteredNachrichten = nachrichten.filter((n: NachrichtDto) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        n.betreff?.toLowerCase().includes(searchLower) ||
        n.absenderName?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    // Status filter
    if (filter === 'unread') return !n.gelesenDatum;
    if (filter === 'read') return !!n.gelesenDatum;
    return true;
  });

  const unreadCountNum = unreadCount?.count || 0;
  const readCountNum = nachrichten.filter((n: NachrichtDto) => n.gelesenDatum).length;

  return (
    <div className="nachrichten-page">
      <div className="page-header">
        <h1 className="page-title">{t('briefe:nachrichten.title')}</h1>
        {unreadCountNum > 0 && (
          <p className="page-subtitle" style={{ color: '#ffffff' }}>
            {unreadCountNum} {t('briefe:nachrichten.unread')}
          </p>
        )}
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('briefe:nachrichten.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title={t('common:clear')}
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('briefe:nachrichten.filters.all')} <span className="tab-count">{nachrichten.length}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          {t('briefe:nachrichten.filters.unread')} <span className="tab-count">{unreadCountNum}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          {t('briefe:nachrichten.filters.read')} <span className="tab-count">{readCountNum}</span>
        </button>
      </div>

      {/* Messages Table */}
      {isLoading ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : filteredNachrichten.length === 0 ? (
        <div className="nachrichten-table-container">
          <div className="empty-state">
            <div className="empty-icon">
              <InboxIcon />
            </div>
            <h3>{filter === 'all' ? t('briefe:nachrichten.empty') : t('briefe:nachrichten.noMessages')}</h3>
            <p>{filter === 'all' ? t('briefe:nachrichten.emptyDescription') : t('briefe:nachrichten.noMessagesDescription')}</p>
          </div>
        </div>
      ) : (
        <div className="nachrichten-table-container">
          <table className="nachrichten-table">
            <thead>
              <tr>
                <th>{t('briefe:nachrichten.table.sender')}</th>
                <th>{t('briefe:nachrichten.table.subject')}</th>
                <th>{t('briefe:nachrichten.table.date')}</th>
                <th>{t('briefe:nachrichten.table.time')}</th>
                <th>{t('briefe:nachrichten.table.status')}</th>
                <th>{t('briefe:nachrichten.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredNachrichten.map((nachricht: NachrichtDto) => (
                <tr
                  key={nachricht.id}
                  onClick={() => navigate(`/nachrichten/${nachricht.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{nachricht.absenderName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="table-link">{nachricht.betreff}</span>
                      {!nachricht.gelesenDatum && (
                        <span className="new-badge">{t('briefe:nachrichten.filters.unread')}</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(nachricht.gesendetDatum)}</td>
                  <td>{formatTime(nachricht.gesendetDatum)}</td>
                  <td>
                    <span className={`status-badge ${nachricht.gelesenDatum ? 'read' : 'unread'}`}>
                      {nachricht.gelesenDatum ? (
                        <><CheckIcon /> {t('briefe:nachrichten.table.read')}</>
                      ) : (
                        t('briefe:nachrichten.table.unread')
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/nachrichten/${nachricht.id}`);
                        }}
                        title={t('briefe:nachrichten.table.view')}
                      >
                        <EyeIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NachrichtenList;

