/**
 * Mitglied Zahlung (Payment) Detail Page
 * Display payment details with allocated claims
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedZahlungService, mitgliedForderungZahlungService, mitgliedForderungService } from '../../services/finanzService';
import { mitgliedService } from '../../services/mitgliedService';
import keytableService from '../../services/keytableService';
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

const MitgliedZahlungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch payment details
  const { data: zahlung, isLoading, error } = useQuery({
    queryKey: ['zahlung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await mitgliedZahlungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Fetch member details
  const { data: mitglied } = useQuery({
    queryKey: ['mitglied', zahlung?.mitgliedId],
    queryFn: async () => {
      if (!zahlung?.mitgliedId) return null;
      return await mitgliedService.getById(zahlung.mitgliedId);
    },
    enabled: !!zahlung?.mitgliedId,
  });

  // Fetch payment allocations (which claims this payment was allocated to)
  const { data: allocations = [] } = useQuery({
    queryKey: ['zahlung-allocations', id],
    queryFn: async () => {
      if (!id) return [];
      const allocs = await mitgliedForderungZahlungService.getByZahlungId(parseInt(id));

      // Fetch forderung details for each allocation
      const allocsWithDetails = await Promise.all(
        allocs.map(async (alloc) => {
          const forderung = await mitgliedForderungService.getById(alloc.forderungId);
          return {
            ...alloc,
            forderungsnummer: forderung.forderungsnummer,
          };
        })
      );

      return allocsWithDetails;
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
      await mitgliedZahlungService.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahlungen'] });
      navigate('/meine-finanzen/zahlungen');
    },
  });

  if (isLoading) return <Loading />;
  if (error || !zahlung) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  // Check authorization
  if (user?.type === 'dernek' && user.vereinId !== zahlung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  // Calculate allocation totals
  const totalAllocated = allocations.reduce((sum, a) => sum + a.betrag, 0);
  const unallocatedAmount = zahlung.betrag - totalAllocated;

  return (
    <div className="finanz-detail">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{zahlung.referenz || t('finanz:payments.title')}</h1>
        <p className="page-subtitle">{t('finanz:payments.detail')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/meine-finanzen/zahlungen')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/meine-finanzen/zahlungen/${id}/edit`)}
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
        {/* Payment Information - Compact */}
        <div className="detail-section">
          <h2>{t('finanz:payments.information')}</h2>
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
              <label>{t('finanz:payments.number')}</label>
              <div className="detail-value">{zahlung.referenz || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.amount')}</label>
              <div className="detail-value amount">
                {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {zahlung.betrag.toFixed(2)}
              </div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.currency')}</label>
              <div className="detail-value">{waehrungen.find(w => w.id === zahlung.waehrungId)?.name || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.type')}</label>
              <div className="detail-value">{zahlungTypen.find(zt => zt.id === zahlung.zahlungTypId)?.name || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.date')}</label>
              <div className="detail-value">{new Date(zahlung.zahlungsdatum).toLocaleDateString()}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.method')}</label>
              <div className="detail-value">{zahlung.zahlungsweg || '-'}</div>
            </div>
            <div className="detail-item full-width">
              <label>{t('finanz:payments.description')}</label>
              <div className="detail-value">{zahlung.bemerkung || '-'}</div>
            </div>
          </div>
        </div>

        {/* Payment Allocations */}
        <div className="detail-section">
          <h2>📋 {t('finanz:allocations.title')}</h2>
          {allocations.length > 0 ? (
            <>
              <div className="payment-summary" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'var(--color-background-secondary)',
                borderRadius: '8px'
              }}>
                <div className="summary-item">
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {t('finanz:allocations.totalPayment')}
                  </label>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>
                    € {zahlung.betrag.toFixed(2)}
                  </strong>
                </div>
                <div className="summary-item">
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {t('finanz:allocations.allocated')}
                  </label>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--color-success)' }}>
                    € {totalAllocated.toFixed(2)}
                  </strong>
                </div>
                <div className="summary-item">
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {t('finanz:allocations.unallocated')}
                  </label>
                  <strong style={{
                    fontSize: '1.25rem',
                    color: unallocatedAmount > 0 ? 'var(--color-warning)' : 'var(--color-text)'
                  }}>
                    € {unallocatedAmount.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('finanz:claims.number')}</th>
                      <th>{t('finanz:allocations.amount')}</th>
                      <th>{t('finanz:allocations.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => (
                      <tr key={allocation.id}>
                        <td>
                          <Link
                            to={`/meine-finanzen/forderungen/${allocation.forderungId}`}
                            className="link-primary"
                          >
                            {allocation.forderungsnummer || `F-${allocation.forderungId}`}
                          </Link>
                        </td>
                        <td>€ {allocation.betrag.toFixed(2)}</td>
                        <td>{allocation.created ? new Date(allocation.created).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {unallocatedAmount > 0 && (
                <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                  <p>⚠️ {t('finanz:allocations.unallocatedWarning', { amount: unallocatedAmount.toFixed(2) })}</p>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <p>ℹ️ {t('finanz:allocations.noAllocations')}</p>
            </div>
          )}
        </div>


      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t('common:confirmDelete')}</h2>
            <p>{t('finanz:payments.deleteConfirm')}</p>
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

export default MitgliedZahlungDetail;

