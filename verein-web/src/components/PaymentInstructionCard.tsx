import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { de, tr } from 'date-fns/locale';
import './PaymentInstructionCard.css';

interface PaymentInstructionCardProps {
  iban: string;
  bic?: string;
  recipient: string;
  amount: number;
  currency: string;
  reference: string;
  dueDate: string;
}

const PaymentInstructionCard: React.FC<PaymentInstructionCardProps> = ({
  iban,
  bic,
  recipient,
  amount,
  currency,
  reference,
  dueDate,
}) => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation('finanz');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatIban = (iban: string) => {
    // Format IBAN with spaces every 4 characters
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'de' ? de : tr;
    return format(date, 'dd.MM.yyyy', { locale });
  };

  return (
    <div className="payment-instruction-card">
      <div className="payment-instruction-header">
        <h3>💳 {t('paymentInstruction.title')}</h3>
        <p>{t('paymentInstruction.subtitle')}</p>
      </div>

      <div className="payment-instruction-body">
        {/* Recipient */}
        <div className="payment-field">
          <label>{t('paymentInstruction.recipient')}</label>
          <div className="payment-value">{recipient}</div>
        </div>

        {/* IBAN */}
        <div className="payment-field">
          <label>{t('paymentInstruction.iban')}</label>
          <div className="payment-value-with-copy">
            <span className="payment-value-mono">{formatIban(iban)}</span>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(iban, 'iban')}
              title={t('paymentInstruction.copyIban')}
            >
              {copiedField === 'iban' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* BIC (if available) */}
        {bic && (
          <div className="payment-field">
            <label>{t('paymentInstruction.bic')}</label>
            <div className="payment-value-with-copy">
              <span className="payment-value-mono">{bic}</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(bic, 'bic')}
                title={t('paymentInstruction.copyBic')}
              >
                {copiedField === 'bic' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="payment-field">
          <label>{t('paymentInstruction.amount')}</label>
          <div className="payment-value payment-amount">{formatCurrency(amount, currency)}</div>
        </div>

        {/* Reference Number */}
        <div className="payment-field payment-reference-field">
          <label>{t('paymentInstruction.reference')}</label>
          <div className="payment-value-with-copy">
            <span className="payment-value-mono payment-reference-value">{reference}</span>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(reference, 'reference')}
              title={t('paymentInstruction.copyReference')}
            >
              {copiedField === 'reference' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* Reference Warning */}
        <div className="payment-reference-warning">
          <p className="warning-text">{t('paymentInstruction.referenceWarning')}</p>
          <p className="warning-description">{t('paymentInstruction.referenceImportant')}</p>
        </div>

        {/* Due Date */}
        <div className="payment-field">
          <label>{t('paymentInstruction.dueDate')}</label>
          <div className="payment-value">{formatDate(dueDate)}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="payment-instruction-steps">
        <h4>{t('paymentInstruction.instructions')}</h4>
        <ol>
          <li>{t('paymentInstruction.step1')}</li>
          <li>{t('paymentInstruction.step2')}</li>
          <li>{t('paymentInstruction.step3')}</li>
          <li>{t('paymentInstruction.step4')}</li>
          <li>{t('paymentInstruction.step5')}</li>
        </ol>
      </div>

      {/* After Payment Info */}
      <div className="payment-instruction-footer">
        <h4>{t('paymentInstruction.afterPayment')}</h4>
        <p>{t('paymentInstruction.afterPaymentInfo')}</p>
      </div>
    </div>
  );
};

export default PaymentInstructionCard;

