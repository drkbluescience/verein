/**
 * Bank Payment Info Component
 * Displays bank account information and payment instructions for members
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BankPaymentInfo.css';

interface BankPaymentInfoProps {
  vereinId: number;
  referenceNumber?: string;
}

const BankPaymentInfo: React.FC<BankPaymentInfoProps> = ({ vereinId, referenceNumber }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz']);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // TODO: Bu bilgiler backend'den gelecek (Verein ayarlarından)
  const bankInfo = {
    accountHolder: 'DITIB Türkisch-Islamische Gemeinde',
    bankName: 'Sparkasse',
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const defaultReference = referenceNumber || `M${vereinId}-${new Date().getFullYear()}`;

  return (
    <div className="bank-payment-info">
      <div className="bank-info-header">
        <h3>{t('finanz:bankPayment.title')}</h3>
        <p className="bank-info-subtitle">{t('finanz:bankPayment.subtitle')}</p>
      </div>

      <div className="bank-details-card">
        <div className="bank-detail-row">
          <span className="detail-label">{t('finanz:bankPayment.accountHolder')}</span>
          <span className="detail-value">{bankInfo.accountHolder}</span>
        </div>

        <div className="bank-detail-row">
          <span className="detail-label">{t('finanz:bankPayment.bankName')}</span>
          <span className="detail-value">{bankInfo.bankName}</span>
        </div>

        <div className="bank-detail-row highlight">
          <span className="detail-label">{t('finanz:bankPayment.iban')}</span>
          <div className="detail-value-with-copy">
            <span className="detail-value">{bankInfo.iban}</span>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(bankInfo.iban, 'iban')}
              title={t('finanz:bankPayment.copyIban')}
            >
              {copiedField === 'iban' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        <div className="bank-detail-row">
          <span className="detail-label">{t('finanz:bankPayment.bic')}</span>
          <span className="detail-value">{bankInfo.bic}</span>
        </div>

        <div className="bank-detail-row highlight reference-row">
          <span className="detail-label">{t('finanz:bankPayment.reference')}</span>
          <div className="detail-value-with-copy">
            <span className="detail-value reference-value">{defaultReference}</span>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(defaultReference, 'reference')}
              title={t('finanz:bankPayment.copyReference')}
            >
              {copiedField === 'reference' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        <div className="reference-warning">
          <span className="warning-icon">⚠️</span>
          <div className="warning-text">
            <strong>{t('finanz:bankPayment.referenceImportant')}</strong>
            <p>{t('finanz:bankPayment.referenceDescription')}</p>
          </div>
        </div>
      </div>

      <div className="payment-instructions">
        <h4>{t('finanz:bankPayment.instructions')}</h4>
        <ol className="instructions-list">
          <li>{t('finanz:bankPayment.step1')}</li>
          <li>{t('finanz:bankPayment.step2')}</li>
          <li>{t('finanz:bankPayment.step3')}</li>
          <li>{t('finanz:bankPayment.step4')}</li>
          <li>{t('finanz:bankPayment.step5')}</li>
        </ol>
      </div>

      <div className="after-payment-info">
        <h4>{t('finanz:bankPayment.afterPayment')}</h4>
        <p>{t('finanz:bankPayment.afterPaymentDesc')}</p>
      </div>
    </div>
  );
};

export default BankPaymentInfo;

