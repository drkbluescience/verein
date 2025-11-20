/**
 * Verein DITIB Zahlung (DITIB Payment) Detail Page
 * Display DITIB payment details
 * Accessible by: Admin, Dernek (organization admin)
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { vereinDitibZahlungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
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

const VereinDitibZahlungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch payment details
  const { data: zahlung, isLoading, error } = useQuery({
    queryKey: ['ditibZahlung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await vereinDitibZahlungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Fetch verein details
  const { data: verein } = useQuery({
    queryKey: ['verein', zahlung?.vereinId],
    queryFn: async () => {
      if (!zahlung?.vereinId) throw new Error('Verein ID not found');
      return await vereinService.getById(zahlung.vereinId);
    },
    enabled: !!zahlung?.vereinId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('ID not found');
      await vereinDitibZahlungService.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ditibZahlungen'] });
      navigate('/finanzen/ditib-zahlungen');
    },
    onError: (error: any) => {
      alert(`Hata: ${error.message || 'Ödeme silinemedi'}`);
    },
  });

  const handleDelete = () => {
    if (window.confirm('Bu DITIB ödemesini silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <Loading />;
  if (error || !zahlung) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  // Check authorization
  if (user?.type === 'dernek' && user.vereinId !== zahlung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  return (
    <div className="finanz-detail">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">DITIB Ödemesi #{zahlung.id}</h1>
        <p className="page-subtitle">{zahlung.zahlungsperiode} dönemi</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen/ditib-zahlungen')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/finanzen/ditib-zahlungen/${id}/edit`)}
        >
          <EditIcon />
          {t('common:common.edit')}
        </button>
        <button
          className="btn btn-error"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <TrashIcon />
          {deleteMutation.isPending ? t('common:common.deleting') : t('common:common.delete')}
        </button>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Payment Information - Compact 2-column layout */}
        <div className="detail-section">
          <h2>{t('finanz:ditibPayments.information')}</h2>
          <div className="detail-grid-compact">
            <div className="detail-item">
              <label>Dernek</label>
              <div className="detail-value">{verein?.name || zahlung.vereinId}</div>
            </div>
            <div className="detail-item">
              <label>Tutar</label>
              <div className="detail-value amount">€ {zahlung.betrag.toFixed(2)}</div>
            </div>
            <div className="detail-item">
              <label>Ödeme Tarihi</label>
              <div className="detail-value">{new Date(zahlung.zahlungsdatum).toLocaleDateString('tr-TR')}</div>
            </div>
            <div className="detail-item">
              <label>Ödeme Dönemi</label>
              <div className="detail-value">
                <span className="badge badge-info">{zahlung.zahlungsperiode}</span>
              </div>
            </div>
            <div className="detail-item">
              <label>Durum</label>
              <div className="detail-value">
                <span className={`badge ${zahlung.statusId === 1 ? 'badge-success' : 'badge-warning'}`}>
                  {zahlung.statusId === 1 ? 'Ödendi' : 'Bekliyor'}
                </span>
              </div>
            </div>
            <div className="detail-item">
              <label>Ödeme Yolu</label>
              <div className="detail-value">{zahlung.zahlungsweg || '-'}</div>
            </div>
            <div className="detail-item">
              <label>Referans No</label>
              <div className="detail-value">{zahlung.referenz || '-'}</div>
            </div>
            <div className="detail-item">
              <label>Banka Hesabı</label>
              <div className="detail-value">{zahlung.bankkontoId || '-'}</div>
            </div>
            {zahlung.bemerkung && (
              <div className="detail-item full-width">
                <label>Not</label>
                <div className="detail-value">{zahlung.bemerkung}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VereinDitibZahlungDetail;

