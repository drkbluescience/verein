/**
 * Bankkonto IBAN Search Component
 * Allows searching for bank accounts by IBAN and validating IBAN format
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bankkontoService } from '../../services/vereinService';
import { validateIbanDetailed, formatIban, getCountryNameFromIban } from '../../utils/ibanValidator';
import { BankkontoDto } from '../../types/verein';
import './BankkontoIbanSearch.css';

interface BankkontoIbanSearchProps {
  onSelect?: (bankkonto: BankkontoDto) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BankkontoIbanSearch: React.FC<BankkontoIbanSearchProps> = ({
  onSelect,
  onValidationChange,
}) => {
  const [iban, setIban] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  // Query for fetching bankkonto by IBAN
  const { data: bankkonto, isLoading: isSearching, error: searchError } = useQuery({
    queryKey: ['bankkonto', 'iban', iban],
    queryFn: () => bankkontoService.getByIban(iban),
    enabled: validationResult?.isValid ?? false,
    retry: false,
  });

  // Mutation for server-side IBAN validation
  const validateIbanMutation = useMutation({
    mutationFn: (ibanToValidate: string) => bankkontoService.validateIban(ibanToValidate),
    onSuccess: (result) => {
      setValidationResult(result);
      onValidationChange?.(result.isValid);
    },
    onError: () => {
      const result = { isValid: false, message: 'IBAN doğrulama başarısız' };
      setValidationResult(result);
      onValidationChange?.(false);
    },
  });

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIban(value);

    // Client-side validation
    const clientValidation = validateIbanDetailed(value);
    setValidationResult(clientValidation);
    onValidationChange?.(clientValidation.isValid);

    // Server-side validation if client-side passes
    if (clientValidation.isValid) {
      validateIbanMutation.mutate(value);
    }
  };

  const handleSelectBankkonto = () => {
    if (bankkonto) {
      onSelect?.(bankkonto);
    }
  };

  const countryName = getCountryNameFromIban(iban);
  const formattedIban = iban ? formatIban(iban) : '';

  return (
    <div className="bankkonto-iban-search">
      <div className="iban-input-group">
        <label htmlFor="iban-input">IBAN</label>
        <input
          id="iban-input"
          type="text"
          value={iban}
          onChange={handleIbanChange}
          placeholder="DE89 3704 0044 0532 0130 00"
          className={`iban-input ${validationResult?.isValid ? 'valid' : validationResult?.isValid === false ? 'invalid' : ''}`}
        />
        {formattedIban && (
          <div className="iban-formatted">
            <small>{formattedIban}</small>
          </div>
        )}
      </div>

      {validationResult && (
        <div className={`validation-message ${validationResult.isValid ? 'success' : 'error'}`}>
          <span className="icon">{validationResult.isValid ? '✓' : '✗'}</span>
          <span className="message">{validationResult.message}</span>
        </div>
      )}

      {countryName && (
        <div className="country-info">
          <small>Ülke: {countryName}</small>
        </div>
      )}

      {validateIbanMutation.isPending && (
        <div className="loading">
          <small>IBAN doğrulanıyor...</small>
        </div>
      )}

      {searchError && (
        <div className="error-message">
          <small>Banka hesabı bulunamadı</small>
        </div>
      )}

      {isSearching && (
        <div className="loading">
          <small>Banka hesabı aranıyor...</small>
        </div>
      )}

      {bankkonto && (
        <div className="bankkonto-result">
          <div className="bankkonto-info">
            <h4>Bulunan Banka Hesabı</h4>
            <div className="info-row">
              <label>Hesap Sahibi:</label>
              <span>{bankkonto.kontoinhaber}</span>
            </div>
            <div className="info-row">
              <label>IBAN:</label>
              <span>{formatIban(bankkonto.iban || '')}</span>
            </div>
            {bankkonto.bic && (
              <div className="info-row">
                <label>BIC:</label>
                <span>{bankkonto.bic}</span>
              </div>
            )}
            {bankkonto.bankname && (
              <div className="info-row">
                <label>Banka:</label>
                <span>{bankkonto.bankname}</span>
              </div>
            )}
            <button
              className="btn-select"
              onClick={handleSelectBankkonto}
              type="button"
            >
              Seç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankkontoIbanSearch;

