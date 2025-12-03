import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefService } from '../../services';
import { BriefDto, BriefStatus, StatusLabels } from '../../types/brief.types';
import { useToast } from '../../contexts/ToastContext';
import './BriefeList.css';

const BriefeList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'sent'>('all');

  // Fetch briefe based on active tab
  const { data: briefe = [], isLoading } = useQuery({
    queryKey: ['briefe', activeTab],
    queryFn: async () => {
      switch (activeTab) {
        case 'drafts': return briefService.getDrafts();
        case 'sent': return briefService.getSent();
        default: return briefService.getAll();
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => briefService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.deleted'));
    },
    onError: () => showError(t('briefe:messages.deleteError')),
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(t('briefe:confirmDelete', { name }))) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR');
  };

  const getStatusBadge = (status: BriefStatus) => {
    const label = StatusLabels[status]?.[i18n.language as 'de' | 'tr'] || status;
    return (
      <span className={`status-badge ${status.toLowerCase()}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="briefe-list-page">
      <div className="page-header">
        <h1 className="page-title">{t('briefe:title')}</h1>
        <p className="page-subtitle">{t('briefe:subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div style={{ flex: 1 }}></div>
        <button className="btn-primary" onClick={() => navigate('/briefe/neu')}>
          ✉️ {t('briefe:newLetter')}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}>
          {t('briefe:tabs.all')}
        </button>
        <button className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}>
          {t('briefe:tabs.drafts')}
        </button>
        <button className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}>
          {t('briefe:tabs.sent')}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : briefe.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>{t('briefe:emptyState.title')}</h3>
          <p>{t('briefe:emptyState.description')}</p>
          <button className="btn-primary" onClick={() => navigate('/briefe/neu')}>
            {t('briefe:newLetter')}
          </button>
        </div>
      ) : (
        <div className="briefe-table-container">
          <table className="briefe-table">
            <thead>
              <tr>
                <th>{t('briefe:table.name')}</th>
                <th>{t('briefe:table.subject')}</th>
                <th>{t('briefe:table.status')}</th>
                <th>{t('briefe:table.recipients')}</th>
                <th>{t('briefe:table.date')}</th>
                <th>{t('briefe:table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {briefe.map((brief: BriefDto) => (
                <tr key={brief.id}>
                  <td className="name-cell">
                    <span className="brief-name">{brief.name}</span>
                    {brief.vorlageName && (
                      <span className="template-badge">📋 {brief.vorlageName}</span>
                    )}
                  </td>
                  <td>{brief.betreff}</td>
                  <td>{getStatusBadge(brief.status)}</td>
                  <td>{brief.empfaengerAnzahl > 0 ? brief.empfaengerAnzahl : '-'}</td>
                  <td>{formatDate(brief.gesendetDatum || brief.modified || brief.created)}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" onClick={() => navigate(`/briefe/${brief.id}`)}
                      title={t('common:view')}>👁️</button>
                    {brief.status === BriefStatus.Entwurf && (
                      <>
                        <button className="btn-icon" onClick={() => navigate(`/briefe/${brief.id}/bearbeiten`)}
                          title={t('common:edit')}>✏️</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(brief.id, brief.name)}
                          title={t('common:delete')}>🗑️</button>
                      </>
                    )}
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

export default BriefeList;

