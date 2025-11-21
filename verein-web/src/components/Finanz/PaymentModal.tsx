/**
 * Payment Modal Component
 * Modal for making payments on member claims
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { mitgliedZahlungService, mitgliedForderungZahlungService } from '../../services/finanzService';
import { MitgliedForderungDto, CreateMitgliedZahlungDto, CreateMitgliedForderungZahlungDto } from '../../types/finanz.types';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  claim: MitgliedForderungDto | null;
  onClose: () => void;
  onSuccess?: () => void;
}

// SVG Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, claim, onClose, onSuccess }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [paymentMethod, setPaymentMethod] = useState<string>('Banküberweisung');
  const [amount, setAmount] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset form when claim changes
  React.useEffect(() => {
    if (claim) {
      setAmount(claim.betrag.toString());
      setReference(claim.forderungsnummer || '');
      setNote('');
      setPaymentMethod('Banküberweisung');
    }
  }, [claim]);

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: CreateMitgliedZahlungDto) => {
      return await mitgliedZahlungService.create(paymentData);
    },
    onSuccess: async (payment) => {
      // Create allocation between payment and claim
      if (claim) {
        const allocationData: CreateMitgliedForderungZahlungDto = {
          forderungId: claim.id,
          zahlungId: payment.id,
          betrag: parseFloat(amount),
        };
        
        await mitgliedForderungZahlungService.create(allocationData);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['mitglied-forderungen'] });
      queryClient.invalidateQueries({ queryKey: ['mitglied-zahlungen'] });
      
      showToast(t('finanz:payment.success'), 'success');
      
      if (onSuccess) onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      showToast(error?.message || t('finanz:payment.error'), 'error');
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!claim || !user) return;

    setIsProcessing(true);

    const paymentData: CreateMitgliedZahlungDto = {
      vereinId: user.vereinId!,
      mitgliedId: user.mitgliedId!,
      forderungId: claim.id,
      zahlungTypId: claim.zahlungTypId,
      betrag: parseFloat(amount),
      waehrungId: claim.waehrungId,
      zahlungsdatum: new Date().toISOString(),
      zahlungsweg: paymentMethod,
      referenz: reference,
      bemerkung: note,
      statusId: 1, // Active
    };

    createPaymentMutation.mutate(paymentData);
  };

  const handleClose = () => {
    setAmount('');
    setReference('');
    setNote('');
    setPaymentMethod('Banküberweisung');
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen || !claim) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('finanz:payment.title')}</h2>
          <button className="modal-close" onClick={handleClose} disabled={isProcessing}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          {/* Claim Info */}
          <div className="claim-info-box">
            <h3>{claim.beschreibung || t('finanz:claims.title')}</h3>
            <div className="claim-details-grid">
              <div className="detail-item">
                <span className="label">{t('finanz:claims.number')}:</span>
                <span className="value">#{claim.forderungsnummer || claim.id}</span>
              </div>
              <div className="detail-item">
                <span className="label">{t('finanz:claims.amount')}:</span>
                <span className="value amount">{formatCurrency(claim.betrag)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="payment-form">
            {/* Payment Method */}
            <div className="form-group">
              <label htmlFor="paymentMethod">{t('finanz:payment.method')}</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={isProcessing}
                required
              >
                <option value="Banküberweisung">Banküberweisung</option>
                <option value="Bar">Bar</option>
                <option value="Kreditkarte">Kreditkarte</option>
                <option value="PayPal">PayPal</option>
                <option value="Lastschrift">Lastschrift</option>
              </select>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="amount">{t('finanz:payment.amount')}</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                max={claim.betrag}
                disabled={isProcessing}
                required
              />
              <small className="form-hint">
                {t('finanz:payment.maxAmount')}: {formatCurrency(claim.betrag)}
              </small>
            </div>

            {/* Reference */}
            <div className="form-group">
              <label htmlFor="reference">{t('finanz:payment.reference')}</label>
              <input
                type="text"
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={t('finanz:payment.referencePlaceholder')}
                disabled={isProcessing}
                maxLength={100}
              />
            </div>

            {/* Note */}
            <div className="form-group">
              <label htmlFor="note">{t('finanz:payment.note')}</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('finanz:payment.notePlaceholder')}
                disabled={isProcessing}
                rows={3}
                maxLength={250}
              />
            </div>

            {/* Payment Notice */}
            <div className="payment-notice">
              <p>{t('finanz:payment.notice')}</p>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
                disabled={isProcessing}
              >
                {t('common:cancel')}
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              >
                {isProcessing ? t('finanz:payment.processing') : t('finanz:payment.confirm')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

