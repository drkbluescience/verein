/**
 * Mitglied Forderung (Claim) Detail Page
 * Display claim details with edit/delete actions
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedForderungService } from '../../services/finanzService';
import { ZahlungStatus } from '../../types/finanz.types';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './FinanzDetail.css';

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const MitgliedForderungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch claim details
  const { data: forderung, isLoading, error } = useQuery({
    queryKey: ['forderung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await mitgliedForderungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('ID not found');
      await mitgliedForderungService.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forderungen'] });
      navigate('/finanz/forderungen');
    },
  });

  if (isLoading) return <Loading />;
  if (error || !forderung) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  // Check authorization
  if (user?.type === 'dernek' && user.vereinId !== forderung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  const getStatusBadge = (statusId: number) => {
    if (statusId === ZahlungStatus.BEZAHLT) {
      return <span className="badge badge-success">{t('finanz:status.paid')}</span>;
    }
    return <span className="badge badge-warning">{t('finanz:status.open')}</span>;
  };

  return (
    <div className="finanz-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/finanz/forderungen')}>
          <BackIcon />
          {t('common:back')}
        </button>
        <div className="header-content">
          <h1>{forderung.forderungsnummer || t('finanz:claims.title')}</h1>
          <p className="detail-subtitle">{t('finanz:claims.detail')}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/finanz/forderungen/${id}/edit`)}
          >
            <EditIcon />
            {t('common:edit')}
          </button>
          <button
            className="btn btn-error"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <TrashIcon />
            {t('common:delete')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Main Info */}
        <div className="detail-section">
          <h2>{t('finanz:claims.information')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('finanz:claims.number')}</label>
              <p>{forderung.forderungsnummer || '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('finanz:claims.amount')}</label>
              <p className="amount">€ {forderung.betrag.toFixed(2)}</p>
            </div>
            <div className="info-item">
              <label>{t('finanz:claims.status')}</label>
              <p>{getStatusBadge(forderung.statusId)}</p>
            </div>
            <div className="info-item">
              <label>{t('finanz:claims.dueDate')}</label>
              <p>{new Date(forderung.faelligkeit).toLocaleDateString()}</p>
            </div>
            <div className="info-item full-width">
              <label>{t('finanz:claims.description')}</label>
              <p>{forderung.beschreibung || '-'}</p>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="detail-section">
          <h2>{t('common:auditInfo')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('common:created')}</label>
              <p>{forderung.created ? new Date(forderung.created).toLocaleString() : '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('common:createdBy')}</label>
              <p>{forderung.createdBy || '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('common:modified')}</label>
              <p>{forderung.modified ? new Date(forderung.modified).toLocaleString() : '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('common:modifiedBy')}</label>
              <p>{forderung.modifiedBy || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t('common:confirmDelete')}</h2>
            <p>{t('finanz:claims.deleteConfirm')}</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t('common:cancel')}
              </button>
              <button
                className="btn btn-error"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? t('common:deleting') : t('common:delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitgliedForderungDetail;

