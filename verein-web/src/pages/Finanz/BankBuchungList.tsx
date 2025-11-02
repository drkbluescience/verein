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

const BankBuchungList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuchung, setSelectedBuchung] = useState<BankBuchungDto | null>(null);

  // Get vereinId based on user type
  const vereinId = useMemo(() => {
    if (user?.type === 'dernek') return user.vereinId;
    return null; // Admin sees all
  }, [user]);

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

  // Filter and search
  const filteredBankBuchungen = useMemo(() => {
    return bankBuchungen.filter(b => {
      // Type filter
      if (typeFilter === 'income' && b.betrag < 0) return false;
      if (typeFilter === 'expense' && b.betrag > 0) return false;

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
  }, [bankBuchungen, typeFilter, searchTerm]);

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
      <div className="list-header">
        <div>
          <h1>{t('finanz:bankTransactions.title')}</h1>
          <p className="list-subtitle">{t('finanz:bankTransactions.subtitle')}</p>
        </div>
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
            placeholder={t('common:search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">{t('finanz:filter.allTypes')}</option>
            <option value="income">{t('finanz:transaction.income')}</option>
            <option value="expense">{t('finanz:transaction.expense')}</option>
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
                <th>{t('finanz:bankTransactions.amount')}</th>
                <th>{t('finanz:bankTransactions.date')}</th>
                <th>{t('finanz:bankTransactions.type')}</th>
                <th>{t('finanz:bankTransactions.description')}</th>
                <th>{t('common:actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBankBuchungen.map((buchung) => (
                <tr key={buchung.id}>
                  <td className="cell-number">{buchung.referenz || '-'}</td>
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
                      onClick={() => navigate(`/finanz/bank/${buchung.id}`)}
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
              ))}
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

