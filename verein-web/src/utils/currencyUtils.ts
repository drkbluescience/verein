/**
 * Currency utility functions
 */

/**
 * Get currency symbol from currency ID
 * @param currencyId - Currency ID from Waehrung table
 * @returns Currency symbol (€, $, ₺, £, etc.)
 */
export const getCurrencySymbol = (currencyId?: number): string => {
  if (!currencyId) return '€'; // Default to EUR
  
  switch (currencyId) {
    case 1: return '€';  // EUR
    case 2: return '$';  // USD
    case 3: return '₺';  // TRY
    case 4: return '£';  // GBP
    case 5: return '¥';  // JPY
    case 6: return 'Fr'; // CHF
    default: return '€'; // Default to EUR
  }
};

/**
 * Get currency code from currency ID
 * @param currencyId - Currency ID from Waehrung table
 * @returns Currency code (EUR, USD, TRY, GBP, etc.)
 */
export const getCurrencyCode = (currencyId?: number): string => {
  if (!currencyId) return 'EUR'; // Default to EUR
  
  switch (currencyId) {
    case 1: return 'EUR';
    case 2: return 'USD';
    case 3: return 'TRY';
    case 4: return 'GBP';
    case 5: return 'JPY';
    case 6: return 'CHF';
    default: return 'EUR'; // Default to EUR
  }
};

/**
 * Format amount with currency symbol
 * @param amount - Amount to format
 * @param currencyId - Currency ID from Waehrung table
 * @param locale - Locale for formatting (default: 'de-DE')
 * @returns Formatted amount with currency symbol
 */
export const formatCurrency = (
  amount: number,
  currencyId?: number,
  locale: string = 'de-DE'
): string => {
  const currencyCode = getCurrencyCode(currencyId);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Format amount with currency symbol (simple version)
 * @param amount - Amount to format
 * @param currencyId - Currency ID from Waehrung table
 * @returns Formatted amount with currency symbol (e.g., "100€", "50₺")
 */
export const formatCurrencySimple = (
  amount: number,
  currencyId?: number
): string => {
  const symbol = getCurrencySymbol(currencyId);
  return `${amount.toFixed(2)}${symbol}`;
};

