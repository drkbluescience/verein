/**
 * Mitglied Zahlung History Page
 * Member's payment history with filtering and search
 * Accessible by: Mitglied (member) only
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedZahlungService } from '../../services/finanzService';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { format } from 'date-fns';
import { de, tr } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import './FinanzList.css';

// Icons
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

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);



const MitgliedZahlungHistory: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const mitgliedId = user?.mitgliedId;

  // Fetch payments
  const { data: zahlungen = [], isLoading, error } = useQuery({
    queryKey: ['mitglied-zahlungen', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return [];
      const allZahlungen = await mitgliedZahlungService.getAll();
      return allZahlungen.filter(z => z.mitgliedId === mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Filter and sort payments
  const filteredZahlungen = useMemo(() => {
    let filtered = [...zahlungen];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(z =>
        z.referenz?.toLowerCase().includes(term) ||
        z.bemerkung?.toLowerCase().includes(term)
      );
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(z => new Date(z.zahlungsdatum) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(z => new Date(z.zahlungsdatum) <= endDate);
    }

    // Amount range filter
    if (minAmount) {
      filtered = filtered.filter(z => z.betrag >= parseFloat(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter(z => z.betrag <= parseFloat(maxAmount));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.zahlungsdatum).getTime();
        const dateB = new Date(b.zahlungsdatum).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.betrag - b.betrag : b.betrag - a.betrag;
      }
    });

    return filtered;
  }, [zahlungen, searchTerm, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'de' ? de : tr;
    return format(date, 'dd.MM.yyyy', { locale });
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
    setMinAmount('');
    setMaxAmount('');
  };

  useEffect(() => {
    const yearParam = searchParams.get('year');
    if (!yearParam) return;
    const parsedYear = Number(yearParam);
    if (Number.isNaN(parsedYear)) return;
    setStartDate(new Date(parsedYear, 0, 1));
    setEndDate(new Date(parsedYear, 11, 31));
  }, [searchParams]);

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredZahlungen.map(z => ({
      [t('finanz:paymentHistory.paymentDate')]: formatDate(z.zahlungsdatum),
      [t('finanz:paymentHistory.paymentAmount')]: formatCurrency(z.betrag),
      [t('finanz:paymentHistory.paymentMethod')]: z.zahlungsweg || '-',
      [t('finanz:paymentHistory.paymentReference')]: z.referenz || '-',
      [t('finanz:paymentHistory.paymentDescription')]: z.bemerkung || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('finanz:paymentHistory.title'));
    XLSX.writeFile(wb, `${t('finanz:export.paymentHistoryFileName')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  // Redirect if not a member
  if (user?.type !== 'mitglied') {
    navigate('/startseite');
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={t('common:error.loadFailed')} />;
  }

  return (
    <div className="finance-list-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:paymentHistory.title')}</h1>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary"
          onClick={exportToExcel}
          disabled={filteredZahlungen.length === 0}
        >
          <DownloadIcon />
          {t('finanz:paymentHistory.exportExcel')}
        </button>
      </div>

      {/* Filters */}
      <div className="list-filters">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('finanz:paymentHistory.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title={t('common:actions.clear')}
            >
              <XIcon />
            </button>
          )}
        </div>

        <div className="filter-group">
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon />
            {t('finanz:paymentHistory.filters')}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>{t('finanz:paymentHistory.startDate')}</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  locale={i18n.language === 'de' ? 'de' : 'tr'}
                  dateFormat="dd.MM.yyyy"
                  placeholderText={t('finanz:paymentHistory.startDate')}
                  className="date-picker-input"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={20}
                  maxDate={endDate || new Date()}
                  isClearable
                />
              </div>
              <div className="filter-group">
                <label>{t('finanz:paymentHistory.endDate')}</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  locale={i18n.language === 'de' ? 'de' : 'tr'}
                  dateFormat="dd.MM.yyyy"
                  placeholderText={t('finanz:paymentHistory.endDate')}
                  className="date-picker-input"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={20}
                  minDate={startDate || undefined}
                  maxDate={new Date()}
                  isClearable
                />
              </div>
              <div className="filter-group">
                <label>{t('finanz:paymentHistory.minAmount')}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={minAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || parseFloat(value) >= 0) {
                      setMinAmount(value);
                    }
                  }}
                  placeholder="0.00"
                />
              </div>
              <div className="filter-group">
                <label>{t('finanz:paymentHistory.maxAmount')}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={maxAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || parseFloat(value) >= 0) {
                      setMaxAmount(value);
                    }
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="filter-row">
              <div className="filter-group">
                <label>{t('finanz:paymentHistory.sortBy')}</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}>
                  <option value="date">{t('finanz:paymentHistory.sortByDate')}</option>
                  <option value="amount">{t('finanz:paymentHistory.sortByAmount')}</option>
                </select>
              </div>
              <div className="filter-group">
                <label>{t('finanz:paymentHistory.sortOrder')}</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
                  <option value="desc">{t('finanz:paymentHistory.sortDescending')}</option>
                  <option value="asc">{t('finanz:paymentHistory.sortAscending')}</option>
                </select>
              </div>
              <div className="filter-actions">
                <button className="btn btn-secondary" onClick={clearFilters}>
                  {t('finanz:paymentHistory.clearFilters')}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Payment List */}
      {filteredZahlungen.length === 0 ? (
        <div className="empty-state">
          <p>{t('finanz:paymentHistory.noPayments')}</p>
        </div>
      ) : (
        <div className="list-table-container">
          <table className="list-table">
            <thead>
              <tr>
                <th>{t('finanz:paymentHistory.paymentReference')}</th>
                <th>{t('finanz:paymentHistory.paymentDescription')}</th>
                <th>{t('finanz:paymentHistory.paymentDate')}</th>
                <th>{t('finanz:paymentHistory.paymentAmount')}</th>
                <th>{t('finanz:paymentHistory.paymentMethod')}</th>
                <th>{t('common:common.actionsColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredZahlungen.map((zahlung) => (
                <tr key={zahlung.id}>
                  <td className="cell-number">{zahlung.referenz || '-'}</td>
                  <td className="cell-description">{zahlung.bemerkung || '-'}</td>
                  <td className="cell-date">{formatDate(zahlung.zahlungsdatum)}</td>
                  <td className="cell-amount">{formatCurrency(zahlung.betrag)}</td>
                  <td>{zahlung.zahlungsweg || '-'}</td>
                  <td className="cell-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/meine-finanzen/zahlungen/${zahlung.id}`)}
                      title={t('finanz:paymentHistory.viewDetails')}
                    >
                      <EyeIcon />
                    </button>
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

export default MitgliedZahlungHistory;
