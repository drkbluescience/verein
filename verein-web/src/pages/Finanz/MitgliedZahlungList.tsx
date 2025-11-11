/**
 * Mitglied Zahlung (Payments) List Page
 * Display member payments with date range filtering
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedZahlungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import { MitgliedZahlungDto } from '../../types/finanz.types';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import MitgliedZahlungFormModal from '../../components/Finanz/MitgliedZahlungFormModal';
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

const MitgliedZahlungList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZahlung, setSelectedZahlung] = useState<MitgliedZahlungDto | null>(null);

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

  // Fetch payments
  const { data: zahlungen = [], isLoading, error } = useQuery({
    queryKey: ['zahlungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        // Dernek user - get all payments for their verein
        const allZahlungen = await mitgliedZahlungService.getAll();
        return allZahlungen.filter(z => z.vereinId === vereinId);
      }
      // Admin - get all payments
      return await mitgliedZahlungService.getAll();
    },
    enabled: !!user,
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

  // Month options
  const monthOptions = [
    { value: '1', label: t('common:months.january') },
    { value: '2', label: t('common:months.february') },
    { value: '3', label: t('common:months.march') },
    { value: '4', label: t('common:months.april') },
    { value: '5', label: t('common:months.may') },
    { value: '6', label: t('common:months.june') },
    { value: '7', label: t('common:months.july') },
    { value: '8', label: t('common:months.august') },
    { value: '9', label: t('common:months.september') },
    { value: '10', label: t('common:months.october') },
    { value: '11', label: t('common:months.november') },
    { value: '12', label: t('common:months.december') },
  ];

  // Filter and search
  const filteredZahlungen = useMemo(() => {
    return zahlungen.filter(z => {
      // Verein filter (Admin only)
      if (selectedVereinId && z.vereinId !== selectedVereinId) return false;

      // Month/Year filter
      if (selectedMonth || selectedYear) {
        const paymentDate = new Date(z.zahlungsdatum);

        if (selectedYear) {
          const year = paymentDate.getFullYear();
          if (year !== parseInt(selectedYear)) return false;
        }

        if (selectedMonth) {
          const month = paymentDate.getMonth() + 1; // JavaScript months are 0-indexed
          if (month !== parseInt(selectedMonth)) return false;
        }
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          z.referenz?.toLowerCase().includes(search) ||
          z.bemerkung?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [zahlungen, selectedVereinId, selectedMonth, selectedYear, searchTerm]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredZahlungen.map(z => ({
      [t('finanz:export.referenceColumn')]: z.referenz || '-',
      [t('finanz:export.amountColumn')]: z.betrag,
      [t('finanz:export.paymentDateColumn')]: new Date(z.zahlungsdatum).toLocaleDateString('tr-TR'),
      [t('finanz:export.paymentMethodColumn')]: z.zahlungsweg || '-',
      [t('finanz:export.descriptionColumn')]: z.bemerkung || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('finanz:export.paymentsSheet'));
    XLSX.writeFile(wb, `${t('finanz:export.paymentsFileName')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  return (
    <div className="finanz-list">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:payments.title')}</h1>
        <p className="page-subtitle">{t('finanz:payments.subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen')}
          title={t('common:back')}
        >
          <ArrowLeftIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-secondary" onClick={exportToExcel}>
          <DownloadIcon />
          Excel
        </button>
        <button className="btn btn-primary" onClick={() => {
          setSelectedZahlung(null);
          setIsModalOpen(true);
        }}>
          <PlusIcon />
          {t('finanz:payments.new')}
        </button>
      </div>

      {/* Filters */}
      <div className="list-filters">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('common:actions.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          {/* Admin: Verein Filter */}
          {user?.type === 'admin' && (
            <select
              value={selectedVereinId || ''}
              onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
              className="filter-select"
            >
              <option value="">{t('finanz:filter.allVereine')}</option>
              {vereine.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            <option value="">{t('finanz:filter.allYears')}</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select"
          >
            <option value="">{t('finanz:filter.allMonths')}</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredZahlungen.length === 0 ? (
        <div className="empty-state">
          <p>{t('finanz:payments.empty')}</p>
        </div>
      ) : (
        <div className="list-table-container">
          <table className="list-table">
            <thead>
              <tr>
                <th>{t('finanz:payments.number')}</th>
                <th>{t('finanz:payments.amount')}</th>
                <th>{t('finanz:payments.date')}</th>
                <th>{t('finanz:payments.method')}</th>
                <th>{t('finanz:payments.description')}</th>
                <th>{t('common:common.actionsColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredZahlungen.map((zahlung) => (
                <tr key={zahlung.id}>
                  <td className="cell-number">{zahlung.referenz || '-'}</td>
                  <td className="cell-amount">€ {zahlung.betrag.toFixed(2)}</td>
                  <td className="cell-date">
                    {new Date(zahlung.zahlungsdatum).toLocaleDateString()}
                  </td>
                  <td>{zahlung.zahlungsweg || '-'}</td>
                  <td className="cell-description">{zahlung.bemerkung || '-'}</td>
                  <td className="cell-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/meine-finanzen/zahlungen/${zahlung.id}`)}
                      title={t('common:view')}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedZahlung(zahlung);
                        setIsModalOpen(true);
                      }}
                      title={t('common:edit')}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="list-summary">
        <p>
          {t('finanz:payments.total')}: <strong>{filteredZahlungen.length}</strong>
        </p>
        <p>
          {t('finanz:payments.totalAmount')}: <strong>€ {filteredZahlungen.reduce((sum, z) => sum + z.betrag, 0).toFixed(2)}</strong>
        </p>
      </div>

      {/* Modal Form */}
      <MitgliedZahlungFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedZahlung(null);
        }}
        zahlung={selectedZahlung}
        mode={selectedZahlung ? 'edit' : 'create'}
      />
    </div>
  );
};

export default MitgliedZahlungList;

