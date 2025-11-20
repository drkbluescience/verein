/**
 * Bank Buchung (Bank Transaction) Detail Page
 * Display bank transaction details
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { bankBuchungService, mitgliedZahlungService, bankkontoService } from '../../services/finanzService';
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

  // Fetch bank account details
  const { data: bankkonto } = useQuery({
    queryKey: ['bankkonto', buchung?.bankKontoId],
    queryFn: async () => {
      if (!buchung?.bankKontoId) return null;
      return await bankkontoService.getById(buchung.bankKontoId);
    },
    enabled: !!buchung?.bankKontoId,
  });

  // Fetch related member payments
  const { data: relatedZahlungen = [] } = useQuery({
    queryKey: ['bankBuchung-zahlungen', id],
    queryFn: async () => {
      if (!id) return [];
      const zahlungen = await mitgliedZahlungService.getByBankBuchungId(parseInt(id));

      // Fetch member details for each payment
      const zahlungenWithMembers = await Promise.all(
        zahlungen.map(async (zahlung) => {
          const mitglied = await mitgliedService.getById(zahlung.mitgliedId);
          return {
            ...zahlung,
            mitgliedName: `${mitglied.vorname} ${mitglied.nachname}`,
          };
        })
      );

      return zahlungenWithMembers;
    },
    enabled: !!id,
  });

  // Fetch keytable data
  const { data: waehrungen = [] } = useQuery({
    queryKey: ['keytable', 'waehrungen'],
    queryFn: () => keytableService.getWaehrungen(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
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
      <div className="page-header">
        <h1 className="page-title">{buchung.referenz || t('finanz:bankTransactions.title')}</h1>
        <p className="page-subtitle">{t('finanz:bankTransactions.detail')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen/bank')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/finanzen/bank/${id}/edit`)}
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
        {/* Bank Transaction Information - Compact */}
        <div className="detail-section">
          <h2>{t('finanz:bankTransactions.information')}</h2>
          <div className="detail-grid-compact">
            {bankkonto && (
              <>
                <div className="detail-item">
                  <label>{t('finanz:bankAccount.holder')}</label>
                  <div className="detail-value">{bankkonto.kontoinhaber || '-'}</div>
                </div>
                <div className="detail-item">
                  <label>{t('finanz:bankAccount.iban')}</label>
                  <div className="detail-value">{bankkonto.iban}</div>
                </div>
                <div className="detail-item">
                  <label>{t('finanz:bankAccount.bank')}</label>
                  <div className="detail-value">{bankkonto.bankname || '-'}</div>
                </div>
              </>
            )}
            <div className="detail-item">
              <label>{t('finanz:bankTransactions.reference')}</label>
              <div className="detail-value">{buchung.referenz || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:bankTransactions.amount')}</label>
              <div className={`detail-value amount ${buchung.betrag > 0 ? 'positive' : 'negative'}`}>
                {buchung.betrag > 0 ? '+' : ''}
                {waehrungen.find(w => w.id === buchung.waehrungId)?.code || '€'} {Math.abs(buchung.betrag).toFixed(2)}
              </div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.currency')}</label>
              <div className="detail-value">{waehrungen.find(w => w.id === buchung.waehrungId)?.name || '-'}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:bankTransactions.date')}</label>
              <div className="detail-value">{new Date(buchung.buchungsdatum).toLocaleDateString()}</div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:bankTransactions.type')}</label>
              <div className="detail-value">{getTransactionType(buchung.betrag)}</div>
            </div>
            {buchung.empfaenger && (
              <div className="detail-item">
                <label>{t('finanz:bankTransactions.recipient')}</label>
                <div className="detail-value">{buchung.empfaenger}</div>
              </div>
            )}
            <div className="detail-item full-width">
              <label>{t('finanz:bankTransactions.description')}</label>
              <div className="detail-value">{buchung.verwendungszweck || '-'}</div>
            </div>
          </div>
        </div>

        {/* Related Member Payments */}
        <div className="detail-section">
          <h2>👥 {t('finanz:relatedPayments.title')}</h2>
          {relatedZahlungen.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('finanz:member.name')}</th>
                    <th>{t('finanz:payments.reference')}</th>
                    <th>{t('finanz:payments.amount')}</th>
                    <th>{t('finanz:payments.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedZahlungen.map((zahlung) => (
                    <tr key={zahlung.id}>
                      <td>
                        <Link to={`/mitglieder/${zahlung.mitgliedId}`} className="link-primary">
                          {zahlung.mitgliedName}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/meine-finanzen/zahlungen/${zahlung.id}`} className="link-primary">
                          {zahlung.referenz || `Z-${zahlung.id}`}
                        </Link>
                      </td>
                      <td>€ {zahlung.betrag.toFixed(2)}</td>
                      <td>{new Date(zahlung.zahlungsdatum).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-warning">
              <p>⚠️ {t('finanz:relatedPayments.noPayments')}</p>
            </div>
          )}
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
                {deleteMutation.isPending ? t('common:common.deleting') : t('common:common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankBuchungDetail;

