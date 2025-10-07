// Verein (Association) Types

export interface VereinDto {
  id: number;
  name: string;
  kurzname?: string;
  vereinsnummer?: string;
  mandantencode?: string;
  rechtsformId?: number;
  adresseId?: number;
  hauptBankkontoId?: number;
  telefon?: string;
  telefax?: string;
  fax?: string;
  email?: string;
  webseite?: string;
  vereinsregisterNummer?: string;
  vereinsregisterGericht?: string;
  steuernummer?: string;
  finanzamt?: string;
  ustIdNr?: string;
  gemeinnuetzig?: boolean;
  freistellungsbescheidVom?: string;
  freistellungsbescheidAz?: string;
  satzungVom?: string;
  gruendungsdatum?: string;
  aufloesungsdatum?: string;
  bemerkungen?: string;
  zweck?: string;
  vorstandsvorsitzender?: string;
  geschaeftsfuehrer?: string;
  vertreterEmail?: string;
  kontaktperson?: string;
  mitgliederzahl?: number;
  satzungPfad?: string;
  logoPfad?: string;
  externeReferenzId?: string;
  ePostEmpfangAdresse?: string;
  sepaGlaeubigerID?: string;
  socialMediaLinks?: string;
  aktiv: boolean;
  elektronischeSignaturKey?: string;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
  deletedFlag?: boolean;
}

export interface CreateVereinDto {
  name: string;
  vereinsnummer?: string;
  mandantencode?: string;
  rechtsformId?: number;
  adresseId?: number;
  hauptBankkontoId?: number;
  telefon?: string;
  telefax?: string;
  email?: string;
  webseite?: string;
  vereinsregisterNummer?: string;
  vereinsregisterGericht?: string;
  steuernummer?: string;
  finanzamt?: string;
  ustIdNr?: string;
  gemeinnuetzig?: boolean;
  freistellungsbescheidVom?: string;
  freistellungsbescheidAz?: string;
  satzungVom?: string;
  gruendungsdatum?: string;
  aufloesungsdatum?: string;
  bemerkungen?: string;
  aktiv?: boolean;
  elektronischeSignaturKey?: string;
}

export interface UpdateVereinDto {
  name?: string;
  vereinsnummer?: string;
  mandantencode?: string;
  rechtsformId?: number;
  adresseId?: number;
  hauptBankkontoId?: number;
  telefon?: string;
  telefax?: string;
  email?: string;
  webseite?: string;
  vereinsregisterNummer?: string;
  vereinsregisterGericht?: string;
  steuernummer?: string;
  finanzamt?: string;
  ustIdNr?: string;
  gemeinnuetzig?: boolean;
  freistellungsbescheidVom?: string;
  freistellungsbescheidAz?: string;
  satzungVom?: string;
  gruendungsdatum?: string;
  aufloesungsdatum?: string;
  bemerkungen?: string;
  aktiv?: boolean;
  elektronischeSignaturKey?: string;
}

// Adresse (Address) Types
export interface AdresseDto {
  id: number;
  vereinId: number;
  adresseTypId?: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  landId?: number;
  postfach?: string;
  postfachPlz?: string;
  postfachOrt?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv: boolean;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateAdresseDto {
  vereinId: number;
  adresseTypId?: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  landId?: number;
  postfach?: string;
  postfachPlz?: string;
  postfachOrt?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
}

// Bankkonto (Bank Account) Types
export interface BankkontoDto {
  id: number;
  vereinId: number;
  bankkontoTypId?: number;
  kontoinhaber?: string;
  iban?: string;
  bic?: string;
  bankname?: string;
  verwendungszweck?: string;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv: boolean;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateBankkontoDto {
  vereinId: number;
  bankkontoTypId?: number;
  kontoinhaber?: string;
  iban?: string;
  bic?: string;
  bankname?: string;
  verwendungszweck?: string;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Form Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
