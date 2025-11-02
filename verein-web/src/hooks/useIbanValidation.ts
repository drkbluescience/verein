/**
 * useIbanValidation Hook
 * Custom hook for IBAN validation and bank account search
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bankkontoService } from '../services/vereinService';
import { validateIbanDetailed, isValidIban } from '../utils/ibanValidator';
import { BankkontoDto } from '../types/verein';

interface UseIbanValidationOptions {
  autoSearch?: boolean;
  onSuccess?: (bankkonto: BankkontoDto) => void;
  onError?: (error: Error) => void;
}

interface UseIbanValidationReturn {
  iban: string;
  setIban: (iban: string) => void;
  validationResult: { isValid: boolean; message: string } | null;
  bankkonto: BankkontoDto | undefined;
  isValidating: boolean;
  isSearching: boolean;
  error: Error | null;
  clearIban: () => void;
  validateAndSearch: (ibanValue: string) => Promise<void>;
}

export const useIbanValidation = (
  options: UseIbanValidationOptions = {}
): UseIbanValidationReturn => {
  const { autoSearch = true, onSuccess, onError } = options;

  const [iban, setIbanState] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  // Mutation for server-side IBAN validation
  const validateMutation = useMutation({
    mutationFn: (ibanToValidate: string) => bankkontoService.validateIban(ibanToValidate),
    onSuccess: (result) => {
      setValidationResult(result);
    },
    onError: (error) => {
      const errorResult = {
        isValid: false,
        message: 'IBAN doğrulama başarısız',
      };
      setValidationResult(errorResult);
      onError?.(error as Error);
    },
  });

  // Query for fetching bankkonto by IBAN
  const { data: bankkonto, isLoading: isSearching, error: searchError } = useQuery({
    queryKey: ['bankkonto', 'iban', iban],
    queryFn: () => bankkontoService.getByIban(iban),
    enabled: autoSearch && (validationResult?.isValid ?? false),
    retry: false,
  });

  // Handle query success
  useEffect(() => {
    if (bankkonto) {
      onSuccess?.(bankkonto);
    }
  }, [bankkonto, onSuccess]);

  // Handle query error
  useEffect(() => {
    if (searchError) {
      onError?.(searchError as Error);
    }
  }, [searchError, onError]);

  const setIban = useCallback((value: string) => {
    setIbanState(value);

    // Client-side validation
    const clientValidation = validateIbanDetailed(value);
    setValidationResult(clientValidation);

    // Server-side validation if client-side passes
    if (clientValidation.isValid) {
      validateMutation.mutate(value);
    }
  }, []);

  const validateAndSearch = useCallback(async (ibanValue: string): Promise<void> => {
    setIbanState(ibanValue);

    // Client-side validation
    const clientValidation = validateIbanDetailed(ibanValue);
    setValidationResult(clientValidation);

    if (clientValidation.isValid) {
      // Server-side validation
      const serverValidation = await validateMutation.mutateAsync(ibanValue);
      if (serverValidation.isValid) {
        // Search for bankkonto
        try {
          const result = await bankkontoService.getByIban(ibanValue);
          onSuccess?.(result);
        } catch (error) {
          onError?.(error as Error);
          throw error;
        }
      }
    }
  }, []);

  const clearIban = useCallback(() => {
    setIbanState('');
    setValidationResult(null);
  }, []);

  return {
    iban,
    setIban,
    validationResult,
    bankkonto: bankkonto as BankkontoDto | undefined,
    isValidating: validateMutation.isPending,
    isSearching,
    error: (searchError as Error) || null,
    clearIban,
    validateAndSearch,
  };
};

export default useIbanValidation;

