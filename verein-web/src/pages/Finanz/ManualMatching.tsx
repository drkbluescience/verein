import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { bankBuchungService } from '../../services/finanzService';
import { mitgliedService } from '../../services/mitgliedService';
import Loading from '../../components/Common/Loading';
import './ManualMatching.css';

const ManualMatching: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const vereinId = user?.vereinId || 0;

  const [selectedMitglied, setSelectedMitglied] = useState<{ [key: number]: number }>({});

  // Fetch unmatched bank transactions
  const { data: unmatchedTransactions = [], isLoading: isLoadingUnmatched } = useQuery({
    queryKey: ['unmatchedBankBuchungen', vereinId],
    queryFn: () => bankBuchungService.getUnmatched(vereinId),
    enabled: !!vereinId,
  });

  // Fetch members for dropdown
  const { data: mitglieder = [], isLoading: isLoadingMitglieder } = useQuery({
    queryKey: ['mitglieder', vereinId],
    queryFn: () => mitgliedService.getByVereinId(vereinId),
    enabled: !!vereinId,
  });

  // Match mutation
  const matchMutation = useMutation({
    mutationFn: ({ bankBuchungId, mitgliedId }: { bankBuchungId: number; mitgliedId: number }) =>
      bankBuchungService.matchToMember(bankBuchungId, mitgliedId),
    onSuccess: (data, variables) => {
      showToast(t('manualMatching.matchSuccess', { ns: 'finanz' }), 'success');
      queryClient.invalidateQueries({ queryKey: ['unmatchedBankBuchungen'] });
      queryClient.invalidateQueries({ queryKey: ['bankBuchungen'] });
      queryClient.invalidateQueries({ queryKey: ['mitgliedZahlungen'] });
      // Clear selection
      setSelectedMitglied(prev => {
        const newState = { ...prev };
        delete newState[variables.bankBuchungId];
        return newState;
      });
    },
    onError: (error: any) => {
      showToast(error.message || t('manualMatching.matchError', { ns: 'finanz' }), 'error');
    },
  });

  const handleMatch = (bankBuchungId: number) => {
    const mitgliedId = selectedMitglied[bankBuchungId];
    if (!mitgliedId) {
      showToast(t('manualMatching.selectMemberWarning', { ns: 'finanz' }), 'warning');
      return;
    }

    matchMutation.mutate({ bankBuchungId, mitgliedId });
  };

  if (isLoadingUnmatched || isLoadingMitglieder) {
    return <Loading />;
  }

  return (
    <div className="manual-matching-container">
      <div className="page-header">
        <h1>🔗 {t('manualMatching.title', { ns: 'finanz' })}</h1>
        <p className="page-description">
          {t('manualMatching.description', { ns: 'finanz' })}
        </p>
      </div>

      {unmatchedTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>{t('manualMatching.allMatched', { ns: 'finanz' })}</h3>
          <p>{t('manualMatching.noUnmatchedPayments', { ns: 'finanz' })}</p>
        </div>
      ) : (
        <div className="unmatched-table-container">
          <div className="table-header">
            <h3>{t('manualMatching.unmatchedPayments', { ns: 'finanz' })} ({unmatchedTransactions.length})</h3>
          </div>

          <div className="unmatched-table">
            {unmatchedTransactions.map((transaction: any) => (
              <div key={transaction.id} className="unmatched-row">
                <div className="transaction-info">
                  <div className="transaction-main">
                    <strong className="transaction-empfaenger">{transaction.empfaenger || 'Bilinmeyen'}</strong>
                    <span className="transaction-amount">{transaction.betrag.toFixed(2)} €</span>
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-date">
                      📅 {new Date(transaction.buchungsdatum).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="transaction-verwendungszweck">
                      💬 {transaction.verwendungszweck || '-'}
                    </span>
                    {transaction.referenz && (
                      <span className="transaction-referenz">
                        🔖 {transaction.referenz}
                      </span>
                    )}
                  </div>
                </div>

                <div className="matching-controls">
                  <select
                    className="member-select"
                    value={selectedMitglied[transaction.id] || ''}
                    onChange={(e) =>
                      setSelectedMitglied(prev => ({
                        ...prev,
                        [transaction.id]: Number(e.target.value)
                      }))
                    }
                  >
                    <option value="">{t('manualMatching.selectMember', { ns: 'finanz' })}</option>
                    {mitglieder.map((mitglied: any) => (
                      <option key={mitglied.id} value={mitglied.id}>
                        {mitglied.vorname} {mitglied.nachname} ({mitglied.mitgliedsnummer})
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-primary btn-match"
                    onClick={() => handleMatch(transaction.id)}
                    disabled={!selectedMitglied[transaction.id] || matchMutation.isPending}
                  >
                    {matchMutation.isPending ? t('manualMatching.matching', { ns: 'finanz' }) : t('manualMatching.matchButton', { ns: 'finanz' })}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualMatching;

