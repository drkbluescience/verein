/**
 * Bank Buchung (Bank Transaction) Detail Page
 * Display bank transaction details
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { bankBuchungService } from '../../services/finanzService';
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

const BankBuchungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch bank transaction details
  const { data: buchung, isLoading, error } = useQuery({
    queryKey: ['bankBuchung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await bankBuchungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('ID not found');
      await bankBuchungService.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankBuchungen'] });
      navigate('/finanzen/bank');
    },
  });

  if (isLoading) return <Loading />;
  if (error || !buchung) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  // Check authorization
  if (user?.type === 'dernek' && user.vereinId !== buchung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  const getTransactionType = (betrag: number) => {
    if (betrag > 0) {
      return <span className="badge badge-success">{t('finanz:transaction.income')}</span>;
    }
    return <span className="badge badge-error">{t('finanz:transaction.expense')}</span>;
  };

  return (
    <div className="finanz-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/finanzen/bank')}>
          <BackIcon />
          {t('common:back')}
        </button>
        <div className="header-content">
          <h1>{buchung.referenz || t('finanz:bankTransactions.title')}</h1>
          <p className="detail-subtitle">{t('finanz:bankTransactions.detail')}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/finanzen/bank/${id}/edit`)}
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
          <h2>{t('finanz:bankTransactions.information')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('finanz:bankTransactions.reference')}</label>
              <p>{buchung.referenz || '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('finanz:bankTransactions.amount')}</label>
              <p className={`amount ${buchung.betrag > 0 ? 'positive' : 'negative'}`}>
                {buchung.betrag > 0 ? '+' : ''}€ {Math.abs(buchung.betrag).toFixed(2)}
              </p>
            </div>
            <div className="info-item">
              <label>{t('finanz:bankTransactions.date')}</label>
              <p>{new Date(buchung.buchungsdatum).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <label>{t('finanz:bankTransactions.type')}</label>
              <p>{getTransactionType(buchung.betrag)}</p>
            </div>
            <div className="info-item full-width">
              <label>{t('finanz:bankTransactions.description')}</label>
              <p>{buchung.verwendungszweck || '-'}</p>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="detail-section">
          <h2>{t('common:auditInfo')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('common:created')}</label>
              <p>{buchung.created ? new Date(buchung.created).toLocaleString() : '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('common:createdBy')}</label>
              <p>{buchung.createdBy || '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('common:modified')}</label>
              <p>{buchung.modified ? new Date(buchung.modified).toLocaleString() : '-'}</p>
            </div>
            <div className="info-item">
              <label>{t('common:modifiedBy')}</label>
              <p>{buchung.modifiedBy || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t('common:confirmDelete')}</h2>
            <p>{t('finanz:bankTransactions.deleteConfirm')}</p>
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

export default BankBuchungDetail;

