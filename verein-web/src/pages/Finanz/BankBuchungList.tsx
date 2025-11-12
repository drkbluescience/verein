/**
 * Bank Buchung (Bank Transactions) List Page
 * Display bank transactions with filtering
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { bankBuchungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import { BankBuchungDto } from '../../types/finanz.types';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import BankBuchungFormModal from '../../components/Finanz/BankBuchungFormModal';
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

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const BankBuchungList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuchung, setSelectedBuchung] = useState<BankBuchungDto | null>(null);

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

  // Fetch bank transactions
  const { data: bankBuchungen = [], isLoading, error } = useQuery({
    queryKey: ['bankBuchungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        // Dernek user - get bank transactions for their verein
        return await bankBuchungService.getByVereinId(vereinId);
      }
      // Admin - get all bank transactions
      return await bankBuchungService.getAll();
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
  const filteredBankBuchungen = useMemo(() => {
    return bankBuchungen.filter(b => {
      // Verein filter (Admin only)
      if (selectedVereinId && b.vereinId !== selectedVereinId) return false;

      // Type filter
      if (typeFilter === 'income' && b.betrag < 0) return false;
      if (typeFilter === 'expense' && b.betrag > 0) return false;

      // Month/Year filter
      if (selectedMonth || selectedYear) {
        const buchungDate = new Date(b.buchungsdatum);

        if (selectedYear) {
          const year = buchungDate.getFullYear();
          if (year !== parseInt(selectedYear)) return false;
        }

        if (selectedMonth) {
          const month = buchungDate.getMonth() + 1; // JavaScript months are 0-indexed
          if (month !== parseInt(selectedMonth)) return false;
        }
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          b.referenz?.toLowerCase().includes(search) ||
          b.verwendungszweck?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [bankBuchungen, selectedVereinId, typeFilter, selectedMonth, selectedYear, searchTerm]);

  const getTransactionType = (betrag: number) => {
    if (betrag > 0) {
      return <span className="badge badge-success">{t('finanz:transaction.income')}</span>;
    }
    return <span className="badge badge-error">{t('finanz:transaction.expense')}</span>;
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  return (
    <div className="finanz-list">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:bankTransactions.title')}</h1>
        <p className="page-subtitle">{t('finanz:bankTransactions.subtitle')}</p>
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
        <button className="btn btn-primary" onClick={() => {
          setSelectedBuchung(null);
          setIsModalOpen(true);
        }}>
          <PlusIcon />
          {t('finanz:bankTransactions.new')}
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

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">{t('finanz:filter.allTypes')}</option>
            <option value="income">{t('finanz:transaction.income')}</option>
            <option value="expense">{t('finanz:transaction.expense')}</option>
          </select>

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
      {filteredBankBuchungen.length === 0 ? (
        <div className="empty-state">
          <p>{t('finanz:bankTransactions.empty')}</p>
        </div>
      ) : (
        <div className="list-table-container">
          <table className="list-table">
            <thead>
              <tr>
                <th>{t('finanz:bankTransactions.reference')}</th>
                {user?.type === 'admin' && <th>{t('common:verein')}</th>}
                <th>{t('finanz:bankTransactions.amount')}</th>
                <th>{t('finanz:bankTransactions.date')}</th>
                <th>{t('finanz:bankTransactions.type')}</th>
                <th>{t('finanz:bankTransactions.description')}</th>
                <th>{t('common:common.actionsColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBankBuchungen.map((buchung) => {
                const verein = vereine.find(v => v.id === buchung.vereinId);
                return (
                  <tr key={buchung.id}>
                    <td className="cell-number">{buchung.referenz || '-'}</td>
                    {user?.type === 'admin' && (
                      <td className="cell-verein">{verein?.name || '-'}</td>
                    )}
                    <td className={`cell-amount ${buchung.betrag > 0 ? 'positive' : 'negative'}`}>
                      {buchung.betrag > 0 ? '+' : ''}€ {Math.abs(buchung.betrag).toFixed(2)}
                    </td>
                    <td className="cell-date">
                      {new Date(buchung.buchungsdatum).toLocaleDateString()}
                    </td>
                    <td>{getTransactionType(buchung.betrag)}</td>
                    <td className="cell-description">{buchung.verwendungszweck || '-'}</td>
                    <td className="cell-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/finanzen/bank/${buchung.id}`)}
                      title={t('common:view')}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedBuchung(buchung);
                        setIsModalOpen(true);
                      }}
                      title={t('common:edit')}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="list-summary">
        <p>
          {t('finanz:bankTransactions.total')}: <strong>{filteredBankBuchungen.length}</strong>
        </p>
        <p>
          {t('finanz:bankTransactions.totalAmount')}: <strong>€ {filteredBankBuchungen.reduce((sum, b) => sum + b.betrag, 0).toFixed(2)}</strong>
        </p>
      </div>

      {/* Modal Form */}
      <BankBuchungFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBuchung(null);
        }}
        buchung={selectedBuchung}
        mode={selectedBuchung ? 'edit' : 'create'}
      />
    </div>
  );
};

export default BankBuchungList;

