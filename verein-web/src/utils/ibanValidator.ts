/**
 * IBAN Validator Utility
 * Provides client-side IBAN validation functions
 */

/**
 * Validates IBAN format using mod-97 algorithm
 * @param iban - IBAN string to validate
 * @returns true if IBAN is valid, false otherwise
 */
export const isValidIban = (iban: string): boolean => {
  if (!iban) return false;

  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Check IBAN length (15-34 characters)
  if (cleanIban.length < 15 || cleanIban.length > 34) {
    return false;
  }

  // Check if it starts with 2 letters followed by 2 digits
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
    return false;
  }

  // Perform mod-97 check
  return mod97Check(cleanIban);
};

/**
 * Performs mod-97 check on IBAN
 * @param iban - Clean IBAN string
 * @returns true if mod-97 check passes
 */
const mod97Check = (iban: string): boolean => {
  // Move first 4 characters to end
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (char) => {
    return (char.charCodeAt(0) - 55).toString();
  });

  // Calculate mod 97
  let remainder = numeric;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97) + remainder.slice(9);
  }

  return parseInt(remainder, 10) % 97 === 1;
};

/**
 * Extracts country code from IBAN
 * @param iban - IBAN string
 * @returns Country code (e.g., 'DE', 'AT', 'CH')
 */
export const getIbanCountryCode = (iban: string): string | null => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (cleanIban.length >= 2) {
    return cleanIban.slice(0, 2);
  }
  return null;
};

/**
 * Formats IBAN with spaces for readability
 * @param iban - IBAN string
 * @returns Formatted IBAN (e.g., 'DE89 3704 0044 0532 0130 00')
 */
export const formatIban = (iban: string): string => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Validates IBAN and returns detailed error message
 * @param iban - IBAN string to validate
 * @returns Object with validation result and message
 */
export const validateIbanDetailed = (
  iban: string
): { isValid: boolean; message: string } => {
  if (!iban || iban.trim() === '') {
    return {
      isValid: false,
      message: 'IBAN boş olamaz',
    };
  }

  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  if (cleanIban.length < 15 || cleanIban.length > 34) {
    return {
      isValid: false,
      message: `IBAN uzunluğu 15-34 karakter arasında olmalıdır (${cleanIban.length} karakter)`,
    };
  }

  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
    return {
      isValid: false,
      message: 'IBAN formatı geçersiz. 2 harf + 2 rakam + alfanümerik karakterler olmalıdır',
    };
  }

  if (!mod97Check(cleanIban)) {
    return {
      isValid: false,
      message: 'IBAN kontrol rakamları geçersiz',
    };
  }

  return {
    isValid: true,
    message: 'IBAN geçerli',
  };
};

/**
 * IBAN country code to country name mapping
 */
const COUNTRY_CODES: Record<string, string> = {
  AD: 'Andorra',
  AE: 'Birleşik Arap Emirlikleri',
  AL: 'Arnavutluk',
  AT: 'Avusturya',
  AZ: 'Azerbaycan',
  BA: 'Bosna ve Hersek',
  BE: 'Belçika',
  BG: 'Bulgaristan',
  BH: 'Bahreyn',
  BR: 'Brezilya',
  BY: 'Belarus',
  CH: 'İsviçre',
  CR: 'Kosta Rika',
  CY: 'Kıbrıs',
  CZ: 'Çek Cumhuriyeti',
  DE: 'Almanya',
  DK: 'Danimarka',
  DO: 'Dominik Cumhuriyeti',
  EE: 'Estonya',
  EG: 'Mısır',
  ES: 'İspanya',
  FI: 'Finlandiya',
  FO: 'Faroe Adaları',
  FR: 'Fransa',
  GB: 'Birleşik Krallık',
  GE: 'Gürcistan',
  GI: 'Cebelitarık',
  GL: 'Grönland',
  GR: 'Yunanistan',
  GT: 'Guatemala',
  HR: 'Hırvatistan',
  HU: 'Macaristan',
  IE: 'İrlanda',
  IL: 'İsrail',
  IS: 'İzlanda',
  IT: 'İtalya',
  JO: 'Ürdün',
  KW: 'Kuveyt',
  KZ: 'Kazakistan',
  LB: 'Lübnan',
  LI: 'Lihtenştayn',
  LT: 'Litvanya',
  LU: 'Lüksemburg',
  LV: 'Letonya',
  MC: 'Monako',
  MD: 'Moldavya',
  ME: 'Karadağ',
  MK: 'Kuzey Makedonya',
  MR: 'Mauritania',
  MT: 'Malta',
  MU: 'Mauritius',
  NL: 'Hollanda',
  NO: 'Norveç',
  PK: 'Pakistan',
  PL: 'Polonya',
  PS: 'Filistin',
  PT: 'Portekiz',
  QA: 'Katar',
  RO: 'Romanya',
  RS: 'Sırbistan',
  SA: 'Suudi Arabistan',
  SE: 'İsveç',
  SI: 'Slovenya',
  SK: 'Slovakya',
  SM: 'San Marino',
  TN: 'Tunus',
  TR: 'Türkiye',
  UA: 'Ukrayna',
  VA: 'Vatikan',
  VG: 'Virgin Adaları',
  XK: 'Kosova',
};

/**
 * Gets country name from IBAN country code
 * @param iban - IBAN string
 * @returns Country name or null
 */
export const getCountryNameFromIban = (iban: string): string | null => {
  const countryCode = getIbanCountryCode(iban);
  if (!countryCode) return null;
  return COUNTRY_CODES[countryCode] || null;
};

