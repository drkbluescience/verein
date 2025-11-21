/**
 * Payment Plan Suggestion Component
 * Provides smart installment suggestions for unpaid claims
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MitgliedForderungDto } from '../../types/finanz.types';
import './PaymentPlanSuggestion.css';

interface PaymentPlanSuggestionProps {
  unpaidClaims: MitgliedForderungDto[];
  onSelectPlan?: (plan: PaymentPlan) => void;
}

export interface PaymentPlan {
  id: string;
  name: string;
  totalAmount: number;
  monthlyPayment: number;
  numberOfMonths: number;
  installments: Installment[];
}

interface Installment {
  month: number;
  amount: number;
  dueDate: Date;
  claims: { id: number; amount: number }[];
}

const PaymentPlanSuggestion: React.FC<PaymentPlanSuggestionProps> = ({ unpaidClaims, onSelectPlan }) => {
  const { t } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const totalDebt = useMemo(() => {
    return unpaidClaims.reduce((sum, claim) => sum + claim.betrag, 0);
  }, [unpaidClaims]);

  // Generate payment plan suggestions
  const paymentPlans = useMemo<PaymentPlan[]>(() => {
    if (totalDebt === 0) return [];

    const plans: PaymentPlan[] = [];
    const today = new Date();

    // Plan 1: Pay all immediately
    plans.push({
      id: 'immediate',
      name: t('finanz:paymentPlan.immediate'),
      totalAmount: totalDebt,
      monthlyPayment: totalDebt,
      numberOfMonths: 1,
      installments: [{
        month: 1,
        amount: totalDebt,
        dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        claims: unpaidClaims.map(c => ({ id: c.id, amount: c.betrag })),
      }],
    });

    // Plan 2: 3 months installment
    if (totalDebt > 100) {
      const monthly3 = Math.ceil((totalDebt / 3) * 100) / 100;
      plans.push({
        id: '3months',
        name: t('finanz:paymentPlan.threeMonths'),
        totalAmount: totalDebt,
        monthlyPayment: monthly3,
        numberOfMonths: 3,
        installments: Array.from({ length: 3 }, (_, i) => ({
          month: i + 1,
          amount: i === 2 ? totalDebt - (monthly3 * 2) : monthly3,
          dueDate: new Date(today.getFullYear(), today.getMonth() + i + 1, 1),
          claims: [],
        })),
      });
    }

    // Plan 3: 6 months installment
    if (totalDebt > 200) {
      const monthly6 = Math.ceil((totalDebt / 6) * 100) / 100;
      plans.push({
        id: '6months',
        name: t('finanz:paymentPlan.sixMonths'),
        totalAmount: totalDebt,
        monthlyPayment: monthly6,
        numberOfMonths: 6,
        installments: Array.from({ length: 6 }, (_, i) => ({
          month: i + 1,
          amount: i === 5 ? totalDebt - (monthly6 * 5) : monthly6,
          dueDate: new Date(today.getFullYear(), today.getMonth() + i + 1, 1),
          claims: [],
        })),
      });
    }

    // Plan 4: 12 months installment
    if (totalDebt > 500) {
      const monthly12 = Math.ceil((totalDebt / 12) * 100) / 100;
      plans.push({
        id: '12months',
        name: t('finanz:paymentPlan.twelveMonths'),
        totalAmount: totalDebt,
        monthlyPayment: monthly12,
        numberOfMonths: 12,
        installments: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          amount: i === 11 ? totalDebt - (monthly12 * 11) : monthly12,
          dueDate: new Date(today.getFullYear(), today.getMonth() + i + 1, 1),
          claims: [],
        })),
      });
    }

    return plans;
  }, [totalDebt, unpaidClaims, t]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });
  };

  const handleSelectPlan = (plan: PaymentPlan) => {
    setSelectedPlanId(plan.id);
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  if (unpaidClaims.length === 0) {
    return null;
  }

  return (
    <div className="payment-plan-suggestion">
      <div className="plan-header">
        <h3>{t('finanz:paymentPlan.title')}</h3>
        <p className="plan-subtitle">{t('finanz:paymentPlan.subtitle')}</p>
      </div>

      <div className="plan-summary">
        <div className="summary-item">
          <span className="summary-label">{t('finanz:paymentPlan.totalDebt')}</span>
          <span className="summary-value">{formatCurrency(totalDebt)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{t('finanz:paymentPlan.numberOfClaims')}</span>
          <span className="summary-value">{unpaidClaims.length}</span>
        </div>
      </div>

      <div className="plans-grid">
        {paymentPlans.map(plan => (
          <div
            key={plan.id}
            className={`plan-card ${selectedPlanId === plan.id ? 'selected' : ''} ${plan.id === 'immediate' ? 'recommended' : ''}`}
            onClick={() => handleSelectPlan(plan)}
          >
            {plan.id === 'immediate' && (
              <div className="recommended-badge">{t('finanz:paymentPlan.recommended')}</div>
            )}
            <h4>{plan.name}</h4>
            <div className="plan-amount">{formatCurrency(plan.monthlyPayment)}</div>
            <div className="plan-period">{t('finanz:paymentPlan.perMonth')}</div>
            <div className="plan-details">
              <div className="detail-item">
                <span>{t('finanz:paymentPlan.duration')}</span>
                <strong>{plan.numberOfMonths} {t('finanz:paymentPlan.months')}</strong>
              </div>
              <div className="detail-item">
                <span>{t('finanz:paymentPlan.total')}</span>
                <strong>{formatCurrency(plan.totalAmount)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPlanSuggestion;

