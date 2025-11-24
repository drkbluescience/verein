/**
 * Mitglied Finanz Page
 * Member's personal finance overview: claims, payments, balance
 * Accessible by: Mitglied (member) only
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedForderungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import Loading from '../../components/Common/Loading';
import PaymentTrendChart from '../../components/Finanz/PaymentTrendChart';
import PaymentInstructionCard from '../../components/PaymentInstructionCard';
import './MitgliedFinanz.css';

// Icons
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);


const MitgliedFinanz: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const mitgliedId = user?.mitgliedId;

  // Show paid claims state
  const [showPaidClaims, setShowPaidClaims] = useState(false);

  // Copied reference state
  const [copiedReference, setCopiedReference] = useState<number | null>(null);

  // Copy to clipboard function
  const copyToClipboard = (text: string, forderungId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedReference(forderungId);
      setTimeout(() => setCopiedReference(null), 2000);
    });
  };

  // Fetch financial summary (single API call)
  const { data: summary, isLoading } = useQuery({
    queryKey: ['mitglied-finanz-summary', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return null;
      return await mitgliedForderungService.getSummary(mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Fetch Mitglied data to get vereinId
  const { data: mitglied } = useQuery({
    queryKey: ['mitglied', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return null;
      return await mitgliedService.getById(mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Fetch Verein data to get bank account info
  const { data: verein } = useQuery({
    queryKey: ['verein', mitglied?.vereinId],
    queryFn: async () => {
      if (!mitglied?.vereinId) return null;
      return await vereinService.getById(mitglied.vereinId);
    },
    enabled: !!mitglied?.vereinId,
  });

  // Get payment urgency class
  const getPaymentUrgency = (dueDate: string): 'overdue' | 'urgent' | 'upcoming' | 'normal' => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue'; // Vadesi geçmiş
    if (diffDays <= 7) return 'urgent'; // 1-7 gün kaldı
    if (diffDays <= 30) return 'upcoming'; // 7-30 gün kaldı
    return 'normal'; // 30+ gün kaldı
  };

  // Redirect if not a member
  if (user?.type !== 'mitglied') {
    navigate('/startseite');
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Format date - Dynamic locale based on current language
  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!summary) {
    return <Loading />;
  }

  return (
    <div className="mitglied-finanz">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:mitgliedFinanz.title')}</h1>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/meine-finanzen/zahlungen')}
        >
          <HistoryIcon />
          {t('finanz:paymentHistory.title')}
        </button>
      </div>

      {/* Summary Section */}
      <div className="finance-summary">
        <div className="summary-card balance-card">
          <div className="summary-header">
            <h3>{t('finanz:mitgliedFinanz.currentBalance')}</h3>
          </div>
          <div className="summary-amount">
            <span className={summary.currentBalance > 0 ? 'negative' : 'positive'}>
              {formatCurrency(summary.currentBalance)}
            </span>
          </div>
        </div>

        <div className="summary-stats">
          <div className="summary-stat">
            <div className="stat-label">{t('finanz:mitgliedFinanz.totalPaid')}</div>
            <div className="stat-amount success">{formatCurrency(summary.totalPaid)}</div>
          </div>
          {summary.overdueCount > 0 && (
            <div className="summary-stat alert">
              <div className="stat-label">{t('finanz:mitgliedFinanz.overdueClaims')}</div>
              <div className="stat-amount error">{formatCurrency(summary.totalOverdue)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Trend Chart */}
      {summary.last12MonthsTrend.length > 0 && (
        <PaymentTrendChart data={summary.last12MonthsTrend} />
      )}

      {/* Unpaid Claims Section */}
      {summary.unpaidClaims.length > 0 && (
        <div className="finance-section">
          <div className="section-header">
            <h2>{t('finanz:mitgliedFinanz.unpaidClaimsTitle')}</h2>
            <span className="badge badge-info">{summary.unpaidClaims.length}</span>
          </div>
          <div className="claims-grid">
            {summary.unpaidClaims.map(forderung => {
                const urgency = getPaymentUrgency(forderung.faelligkeit);
                return (
                  <div
                    key={forderung.id}
                    className={`claim-item claim-${urgency}`}
                  >
                    <div
                      className="claim-content clickable"
                      onClick={() => navigate(`/meine-finanzen/forderungen/${forderung.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') navigate(`/meine-finanzen/forderungen/${forderung.id}`);
                      }}
                    >
                      <div className="claim-main">
                        <h4>{forderung.beschreibung || t('finanz:claims.title')}</h4>
                        <span className="claim-id">#{forderung.forderungsnummer || forderung.id}</span>
                      </div>
                      <div className="claim-details">
                        <div className="claim-date">
                          <CalendarIcon />
                          <span>{formatDate(forderung.faelligkeit)}</span>
                          {urgency === 'overdue' && (
                            <span className="urgency-badge overdue">{t('finanz:mitgliedFinanz.overdue')}</span>
                          )}
                          {urgency === 'urgent' && (
                            <span className="urgency-badge urgent">{t('finanz:mitgliedFinanz.urgent')}</span>
                          )}
                        </div>
                        <div className="claim-amount">{formatCurrency(forderung.betrag)}</div>
                        <div className="claim-status">
                          {forderung.statusId === 1 ? (
                            <span className="status-badge status-paid">✓ {t('finanz:mitgliedFinanz.paid')}</span>
                          ) : (
                            <span className="status-badge status-unpaid">{t('finanz:mitgliedFinanz.unpaid')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {forderung.statusId === 2 && (
                      <div className="claim-reference-section">
                        <span className="reference-label">{t('finanz:mitgliedFinanz.paymentReference')}:</span>
                        <span className="reference-value">F{forderung.id}-{new Date(forderung.faelligkeit).getFullYear()}</span>
                        <button
                          className="copy-reference-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`F${forderung.id}-${new Date(forderung.faelligkeit).getFullYear()}`, forderung.id);
                          }}
                          title={t('finanz:bankPayment.copyReference')}
                        >
                          {copiedReference === forderung.id ? '✓' : '📋'}
                        </button>
                      </div>
                    )}

                    {/* Payment Instruction Card */}
                    {forderung.statusId === 2 && verein?.hauptBankkonto?.iban && (
                      <PaymentInstructionCard
                        iban={verein.hauptBankkonto.iban}
                        bic={verein.hauptBankkonto.bic}
                        recipient={verein.name}
                        amount={forderung.betrag}
                        currency="EUR"
                        reference={`F${forderung.id}-${new Date(forderung.faelligkeit).getFullYear()}`}
                        dueDate={forderung.faelligkeit}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Paid Claims Section - Collapsible */}
      {summary.paidClaims.length > 0 && (
        <div className="finance-section">
          <button
            className="toggle-paid-claims-btn"
            onClick={() => setShowPaidClaims(!showPaidClaims)}
          >
            <span>{showPaidClaims ? '▼' : '▶'}</span>
            {showPaidClaims
              ? t('finanz:mitgliedFinanz.hidePaidClaims')
              : t('finanz:mitgliedFinanz.showPaidClaims')} ({summary.paidClaims.length})
          </button>

          {showPaidClaims && (
            <div className="claims-grid">
              {summary.paidClaims.map(forderung => (
                <div
                  key={forderung.id}
                  className="claim-item claim-paid"
                >
                  <div
                    className="claim-content clickable"
                    onClick={() => navigate(`/meine-finanzen/forderungen/${forderung.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') navigate(`/meine-finanzen/forderungen/${forderung.id}`);
                    }}
                  >
                    <div className="claim-main">
                      <h4>{forderung.beschreibung || t('finanz:claims.title')}</h4>
                      <span className="claim-id">#{forderung.forderungsnummer || forderung.id}</span>
                    </div>
                    <div className="claim-details">
                      <div className="claim-date">
                        <CalendarIcon />
                        <span>{formatDate(forderung.faelligkeit)}</span>
                      </div>
                      <div className="claim-amount">{formatCurrency(forderung.betrag)}</div>
                      <div className="claim-status">
                        <span className="status-badge status-paid">✓ {t('finanz:mitgliedFinanz.paid')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MitgliedFinanz;

