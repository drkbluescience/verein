/**
 * Verein DITIB Zahlung (DITIB Payments) List Page
 * Display DITIB payments with filtering
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { vereinDitibZahlungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import * as XLSX from 'xlsx';
import './FinanzList.css';

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const VereinDitibZahlungList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Get vereinId based on user type
  const vereinId = useMemo(() => {
    if (user?.type === 'dernek') return user.vereinId;
    return null; // Admin sees all
  }, [user]);

  // Fetch Vereine (for Admin dropdown)
  const { data: vereine = [] } = useQuery({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  // Fetch DITIB payments
  const { data: ditibZahlungen = [], isLoading, error } = useQuery({
    queryKey: ['ditibZahlungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        return await vereinDitibZahlungService.getByVereinId(vereinId);
      }
      return await vereinDitibZahlungService.getAll();
    },
    enabled: !!user,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => vereinDitibZahlungService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ditibZahlungen'] });
      alert(t('ditibPayments.deleteSuccess', { ns: 'finanz' }));
    },
    onError: (error: any) => {
      alert(`${t('common:error.title')}: ${error.message || t('ditibPayments.deleteError', { ns: 'finanz' })}`);
    },
  });

  // Generate year options (last 5 years + current + next year)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i.toString());
    }
    return years;
  }, []);

  // Filter payments
  const filteredZahlungen = useMemo(() => {
    return ditibZahlungen.filter(zahlung => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        zahlung.referenz?.toLowerCase().includes(searchLower) ||
        zahlung.bemerkung?.toLowerCase().includes(searchLower) ||
        zahlung.zahlungsperiode.includes(searchLower);

      // Verein filter (Admin only)
      const matchesVerein = !selectedVereinId || zahlung.vereinId === selectedVereinId;

      // Status filter
      const matchesStatus = !selectedStatus || zahlung.statusId.toString() === selectedStatus;

      // Year filter
      const matchesYear = !selectedYear || zahlung.zahlungsperiode.startsWith(selectedYear);

      return matchesSearch && matchesVerein && matchesStatus && matchesYear;
    });
  }, [ditibZahlungen, searchTerm, selectedVereinId, selectedStatus, selectedYear]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredZahlungen.reduce((sum, z) => sum + z.betrag, 0);
    const paid = filteredZahlungen.filter(z => z.statusId === 1).reduce((sum, z) => sum + z.betrag, 0);
    const pending = filteredZahlungen.filter(z => z.statusId === 2).reduce((sum, z) => sum + z.betrag, 0);
    return { total, paid, pending, count: filteredZahlungen.length };
  }, [filteredZahlungen]);

  // Export to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [t('ditibPayments.reportTitle', { ns: 'finanz' }), ''],
      [''],
      [
        t('ditibPayments.date', { ns: 'finanz' }),
        t('ditibPayments.verein', { ns: 'finanz' }),
        t('ditibPayments.amount', { ns: 'finanz' }),
        t('common:currency'),
        t('ditibPayments.period', { ns: 'finanz' }),
        t('ditibPayments.status', { ns: 'finanz' }),
        t('ditibPayments.reference', { ns: 'finanz' }),
        t('ditibPayments.notes', { ns: 'finanz' })
      ],
      ...filteredZahlungen.map(z => [
        new Date(z.zahlungsdatum).toLocaleDateString('tr-TR'),
        vereine.find(v => v.id === z.vereinId)?.name || z.vereinId,
        z.betrag,
        z.waehrungId === 1 ? 'EUR' : 'TRY',
        z.zahlungsperiode,
        z.statusId === 1 ? t('ditibPayments.statusPaid', { ns: 'finanz' }) : t('ditibPayments.statusPending', { ns: 'finanz' }),
        z.referenz || '',
        z.bemerkung || '',
      ]),
      [],
      [t('ditibPayments.total', { ns: 'finanz' }), '', stats.total.toFixed(2)],
      [t('ditibPayments.paid', { ns: 'finanz' }), '', stats.paid.toFixed(2)],
      [t('ditibPayments.pending', { ns: 'finanz' }), '', stats.pending.toFixed(2)],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, t('ditibPayments.title', { ns: 'finanz' }));
    XLSX.writeFile(wb, `ditib-odemeler-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('ditibPayments.deleteConfirm', { ns: 'finanz' }))) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={(error as Error).message} />;

  return (
    <div className="finanz-list-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('ditibPayments.title', { ns: 'finanz' })}</h1>
        <p className="page-subtitle">{t('ditibPayments.subtitle', { ns: 'finanz' })}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen')}
          title="Geri"
        >
          <ArrowLeftIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-secondary" onClick={exportToExcel}>
          <DownloadIcon />
          {t('ditibPayments.excel', { ns: 'finanz' })}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/finanzen/ditib-upload')}>
          📥 {t('ditibPayments.excelUpload', { ns: 'finanz' })}
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/finanzen/ditib-zahlungen/new')}>
          <PlusIcon />
          {t('ditibPayments.newPayment', { ns: 'finanz' })}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">{t('ditibPayments.totalPayment', { ns: 'finanz' })}</div>
          <div className="stat-value">€ {stats.total.toFixed(2)}</div>
          <div className="stat-subtitle">{t('ditibPayments.paymentsCount', { ns: 'finanz', count: stats.count })}</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-label">{t('ditibPayments.paid', { ns: 'finanz' })}</div>
          <div className="stat-value">€ {stats.paid.toFixed(2)}</div>
          <div className="stat-subtitle">{t('ditibPayments.paymentsCount', { ns: 'finanz', count: filteredZahlungen.filter(z => z.statusId === 1).length })}</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-label">{t('ditibPayments.pending', { ns: 'finanz' })}</div>
          <div className="stat-value">€ {stats.pending.toFixed(2)}</div>
          <div className="stat-subtitle">{t('ditibPayments.paymentsCount', { ns: 'finanz', count: filteredZahlungen.filter(z => z.statusId === 2).length })}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="list-filters">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('ditibPayments.searchPlaceholder', { ns: 'finanz' })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          {user?.type === 'admin' && (
            <select
              className="filter-select"
              value={selectedVereinId || ''}
              onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">{t('ditibPayments.allVereine', { ns: 'finanz' })}</option>
              {vereine.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          )}

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">{t('ditibPayments.allStatus', { ns: 'finanz' })}</option>
            <option value="1">{t('ditibPayments.statusPaid', { ns: 'finanz' })}</option>
            <option value="2">{t('ditibPayments.statusPending', { ns: 'finanz' })}</option>
          </select>

          <select
            className="filter-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">{t('ditibPayments.allYears', { ns: 'finanz' })}</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="list-table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>{t('ditibPayments.date', { ns: 'finanz' })}</th>
              <th>{t('ditibPayments.period', { ns: 'finanz' })}</th>
              {user?.type === 'admin' && <th>{t('ditibPayments.verein', { ns: 'finanz' })}</th>}
              <th>{t('ditibPayments.amount', { ns: 'finanz' })}</th>
              <th>{t('ditibPayments.paymentMethod', { ns: 'finanz' })}</th>
              <th>{t('ditibPayments.reference', { ns: 'finanz' })}</th>
              <th>{t('ditibPayments.status', { ns: 'finanz' })}</th>
              <th>{t('common:actionsColumn')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredZahlungen.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  {t('ditibPayments.noPaymentsFound', { ns: 'finanz' })}
                </td>
              </tr>
            ) : (
              filteredZahlungen.map((zahlung) => (
                <tr key={zahlung.id}>
                  <td>{new Date(zahlung.zahlungsdatum).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <span className="badge badge-info">{zahlung.zahlungsperiode}</span>
                  </td>
                  <td>
                    <strong>€ {zahlung.betrag.toFixed(2)}</strong>
                  </td>
                  <td>{zahlung.zahlungsweg || '-'}</td>
                  <td>{zahlung.referenz || '-'}</td>
                  <td>
                    <span className={`badge ${zahlung.statusId === 1 ? 'badge-success' : 'badge-warning'}`}>
                      {zahlung.statusId === 1
                        ? t('ditibPayments.statusPaid', { ns: 'finanz' })
                        : t('ditibPayments.statusPending', { ns: 'finanz' })}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/finanzen/ditib-zahlungen/${zahlung.id}`)}
                      title="Detay"
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/finanzen/ditib-zahlungen/${zahlung.id}/edit`)}
                      title="Düzenle"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(zahlung.id)}
                      title="Sil"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VereinDitibZahlungList;

