/**
 * Mitglied Forderung (Claim) Detail Page
 * Display claim details with edit/delete actions
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedForderungService } from '../../services/finanzService';
import { mitgliedService } from '../../services/mitgliedService';
import { vereinService } from '../../services/vereinService';
import keytableService from '../../services/keytableService';
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

  // Determine back URL based on user type
  const backUrl = user?.type === 'mitglied' ? '/meine-finanzen' : '/finanzen/forderungen';
  const editUrl = user?.type === 'mitglied'
    ? `/meine-finanzen/forderungen/${id}/edit`
    : `/finanzen/forderungen/${id}/edit`;

  // Check if user can edit/delete (only admin and dernek)
  const canEdit = user?.type === 'admin' || user?.type === 'dernek';

  // Fetch claim details
  const { data: forderung, isLoading, error } = useQuery({
    queryKey: ['forderung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await mitgliedForderungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Fetch member details (only for admin/dernek)
  const { data: mitglied } = useQuery({
    queryKey: ['mitglied', forderung?.mitgliedId],
    queryFn: async () => {
      if (!forderung?.mitgliedId) return null;
      return await mitgliedService.getById(forderung.mitgliedId);
    },
    enabled: !!forderung?.mitgliedId && canEdit,
  });

  // Fetch verein details
  const { data: verein } = useQuery({
    queryKey: ['verein', forderung?.vereinId],
    queryFn: async () => {
      if (!forderung?.vereinId) return null;
      return await vereinService.getById(forderung.vereinId);
    },
    enabled: !!forderung?.vereinId,
  });

  // Fetch payment allocations
  const { data: allocations = [] } = useQuery({
    queryKey: ['forderung-allocations', id],
    queryFn: async () => {
      if (!id) return [];
      return await mitgliedForderungService.getAllocations(parseInt(id));
    },
    enabled: !!id,
  });

  // Fetch keytable data
  const { data: zahlungTypen = [] } = useQuery({
    queryKey: ['keytable', 'zahlungtypen'],
    queryFn: () => keytableService.getZahlungTypen(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const { data: waehrungen = [] } = useQuery({
    queryKey: ['keytable', 'waehrungen'],
    queryFn: () => keytableService.getWaehrungen(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('ID not found');
      await mitgliedForderungService.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forderungen'] });
      navigate(backUrl);
    },
  });

  if (isLoading) return <Loading />;
  if (error || !forderung) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  // Check authorization
  if (user?.type === 'dernek' && user.vereinId !== forderung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  // Calculate payment status
  const totalAllocated = allocations.reduce((sum, a) => sum + a.betrag, 0);
  const remainingAmount = forderung.betrag - totalAllocated;
  const isPartiallyPaid = totalAllocated > 0 && remainingAmount > 0;
  const isFullyPaid = forderung.statusId === ZahlungStatus.BEZAHLT || remainingAmount <= 0;

  const getStatusBadge = (statusId: number) => {
    if (isFullyPaid) {
      return <span className="badge badge-success">{t('finanz:status.paid')}</span>;
    }
    if (isPartiallyPaid) {
      return <span className="badge badge-info">Kısmen Ödendi</span>;
    }
    return <span className="badge badge-warning">{t('finanz:status.open')}</span>;
  };

  return (
    <div className="finanz-detail">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{forderung.forderungsnummer || t('finanz:claims.title')}</h1>
        <p className="page-subtitle">{t('finanz:claims.detail')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate(backUrl)}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        {canEdit && (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(editUrl)}
            >
              <EditIcon />
              {t('common:common.edit')}
            </button>
            <button
              className="btn btn-error"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
            >
              <TrashIcon />
              {deleteMutation.isPending ? t('common:common.deleting') : t('common:common.delete')}
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Claim Information - Compact */}
        <div className="detail-section">
          <h2>{t('finanz:claims.information')}</h2>
          <div className="detail-grid-compact">
            {/* Show member info only for admin/dernek */}
            {canEdit && mitglied && (
              <>
                <div className="detail-item">
                  <label>{t('finanz:member.number')}</label>
                  <div className="detail-value">{mitglied.mitgliedsnummer}</div>
                </div>
                <div className="detail-item">
                  <label>{t('finanz:member.name')}</label>
                  <div className="detail-value">
                    <Link to={`/mitglieder/${mitglied.id}`} className="link-primary">
                      {mitglied.vorname} {mitglied.nachname}
                    </Link>
                  </div>
                </div>
              </>
            )}
            {/* Verein Name - For admin and mitglied users (not for dernek) */}
            {user?.type !== 'dernek' && verein && (
              <div className="detail-item">
                <label>{t('finanz:verein.name')}</label>
                <div className="detail-value">{verein.name}</div>
              </div>
            )}
            <div className="detail-item">
              <label>{t('finanz:claims.amount')}</label>
              <div className="detail-value amount">
                {waehrungen.find(w => w.id === forderung.waehrungId)?.code || '€'} {forderung.betrag.toFixed(2)}
              </div>
            </div>
            {/* Remaining Amount - NEW */}
            <div className="detail-item">
              <label>{t('finanz:claims.remainingAmount')}</label>
              <div className="detail-value amount">
                {waehrungen.find(w => w.id === forderung.waehrungId)?.code || '€'} {remainingAmount.toFixed(2)}
              </div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.type')}</label>
              <div className="detail-value">{zahlungTypen.find(zt => zt.id === forderung.zahlungTypId)?.name || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:claims.status')}</label>
              <div className="detail-value">{getStatusBadge(forderung.statusId)}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:claims.dueDate')}</label>
              <div className="detail-value">{new Date(forderung.faelligkeit).toLocaleDateString()}</div>
            </div>
            <div className="detail-item full-width">
              <label>{t('finanz:claims.description')}</label>
              <div className="detail-value">{forderung.beschreibung || '-'}</div>
            </div>
          </div>
        </div>

        {/* Payment Progress Section */}
        <div className="detail-section payment-progress-section">
          <h2>💰 {t('finanz:claims.paymentProgress')}</h2>

          {/* Progress Bar */}
          <div className="payment-progress-container">
            <div className="progress-header">
              <span className="progress-label">{t('finanz:claims.totalAmount')}: € {forderung.betrag.toFixed(2)}</span>
              <span className="progress-percentage">
                {Math.round((totalAllocated / forderung.betrag) * 100)}% {t('finanz:claims.paid')}
              </span>
            </div>
            <div className="progress-bar-wrapper">
              <div
                className={`progress-bar-fill ${isFullyPaid ? 'complete' : isPartiallyPaid ? 'partial' : 'empty'}`}
                style={{ width: `${Math.min((totalAllocated / forderung.betrag) * 100, 100)}%` }}
              />
            </div>
            <div className="progress-amounts">
              <div className="progress-paid">
                <span className="amount-label">{t('finanz:claims.paidAmount')}:</span>
                <span className="amount-value success">€ {totalAllocated.toFixed(2)}</span>
              </div>
              <div className="progress-remaining">
                <span className="amount-label">{t('finanz:claims.remainingAmount')}:</span>
                <span className={`amount-value ${remainingAmount > 0 ? 'warning' : 'success'}`}>
                  € {remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          {allocations.length > 0 && (
            <div className="payment-timeline">
              <h3>📜 {t('finanz:claims.paymentHistory')}</h3>
              <div className="timeline-container">
                {allocations.map((allocation, index) => (
                  <div key={allocation.id} className="timeline-item">
                    <div className="timeline-marker">
                      <div className="marker-dot completed" />
                      {index < allocations.length - 1 && <div className="marker-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-date">
                        {allocation.created
                          ? new Date(allocation.created).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })
                          : '-'}
                      </div>
                      <div className="timeline-details">
                        <span className="timeline-amount">€ {allocation.betrag.toFixed(2)}</span>
                        <span className="timeline-id">#{allocation.zahlungId}</span>
                        <span className="timeline-status">{t('finanz:status.confirmed')}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Pending payment indicator if not fully paid */}
                {remainingAmount > 0 && (
                  <div className="timeline-item pending">
                    <div className="timeline-marker">
                      <div className="marker-dot pending" />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-date">{t('finanz:claims.pendingPayment')}</div>
                      <div className="timeline-details">
                        <span className="timeline-amount pending">€ {remainingAmount.toFixed(2)}</span>
                        <span className="timeline-status pending">{t('finanz:status.waiting')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No payments yet */}
          {allocations.length === 0 && (
            <div className="no-payments-message">
              <div className="no-payments-icon">💳</div>
              <p>{t('finanz:claims.noPaymentsYet')}</p>
              <p className="no-payments-hint">{t('finanz:claims.waitingForPayment')}</p>
            </div>
          )}
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
                {deleteMutation.isPending ? t('common:common.deleting') : t('common:common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitgliedForderungDetail;

