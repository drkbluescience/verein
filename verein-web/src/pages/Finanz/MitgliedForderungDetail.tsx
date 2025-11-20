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

  // Fetch claim details
  const { data: forderung, isLoading, error } = useQuery({
    queryKey: ['forderung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await mitgliedForderungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Fetch member details
  const { data: mitglied } = useQuery({
    queryKey: ['mitglied', forderung?.mitgliedId],
    queryFn: async () => {
      if (!forderung?.mitgliedId) return null;
      return await mitgliedService.getById(forderung.mitgliedId);
    },
    enabled: !!forderung?.mitgliedId,
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
      navigate('/meine-finanzen/forderungen');
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
          onClick={() => navigate('/meine-finanzen/forderungen')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/meine-finanzen/forderungen/${id}/edit`)}
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
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Claim Information - Compact */}
        <div className="detail-section">
          <h2>{t('finanz:claims.information')}</h2>
          <div className="detail-grid-compact">
            {mitglied && (
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
            <div className="detail-item">
              <label>{t('finanz:claims.number')}</label>
              <div className="detail-value">{forderung.forderungsnummer || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:claims.amount')}</label>
              <div className="detail-value amount">
                {waehrungen.find(w => w.id === forderung.waehrungId)?.code || '€'} {forderung.betrag.toFixed(2)}
              </div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.currency')}</label>
              <div className="detail-value">{waehrungen.find(w => w.id === forderung.waehrungId)?.name || '-'}</div>
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

        {/* Payment History */}
        {allocations.length > 0 && (
          <div className="detail-section">
            <h2>💰 Ödeme Geçmişi</h2>
            <div className="payment-summary">
              <div className="summary-item">
                <label>Toplam Fatura:</label>
                <strong className="amount-total">€ {forderung.betrag.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <label>Ödenen:</label>
                <strong className="amount-paid">€ {totalAllocated.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <label>Kalan:</label>
                <strong className={remainingAmount > 0 ? "amount-remaining" : "amount-zero"}>
                  € {remainingAmount.toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="payment-history-table">
              <table>
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Tutar</th>
                    <th>Ödeme ID</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => (
                    <tr key={allocation.id}>
                      <td>{allocation.created ? new Date(allocation.created).toLocaleDateString('tr-TR') : '-'}</td>
                      <td><strong>€ {allocation.betrag.toFixed(2)}</strong></td>
                      <td>#{allocation.zahlungId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


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

