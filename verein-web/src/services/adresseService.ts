import api from './api';

export interface Adresse {
  id: number;
  vereinId?: number;
  adresseTypId?: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  stadtteil?: string;
  bundesland?: string;
  land?: string;
  postfach?: string;
  telefonnummer?: string;
  faxnummer?: string;
  email?: string;
  kontaktperson?: string;
  hinweis?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
  deletedFlag?: boolean;
}

export interface CreateAdresseDto {
  vereinId?: number;
  adresseTypId?: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  stadtteil?: string;
  bundesland?: string;
  land?: string;
  postfach?: string;
  telefonnummer?: string;
  faxnummer?: string;
  email?: string;
  kontaktperson?: string;
  hinweis?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
}

export interface UpdateAdresseDto {
  vereinId?: number;
  adresseTypId?: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  stadtteil?: string;
  bundesland?: string;
  land?: string;
  postfach?: string;
  telefonnummer?: string;
  faxnummer?: string;
  email?: string;
  kontaktperson?: string;
  hinweis?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
}

class AdresseService {
  private readonly baseUrl = '/api/Adressen';

  /**
   * Get all addresses
   */
  async getAll(): Promise<Adresse[]> {
    return await api.get<Adresse[]>(this.baseUrl);
  }

  /**
   * Get address by ID
   */
  async getById(id: number): Promise<Adresse> {
    return await api.get<Adresse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get addresses by Verein ID
   */
  async getByVereinId(vereinId: number): Promise<Adresse[]> {
    return await api.get<Adresse[]>(`${this.baseUrl}/verein/${vereinId}`);
  }

  /**
   * Create new address
   */
  async create(data: CreateAdresseDto): Promise<Adresse> {
    return await api.post<Adresse>(this.baseUrl, data);
  }

  /**
   * Update existing address
   */
  async update(id: number, data: UpdateAdresseDto): Promise<Adresse> {
    return await api.put<Adresse>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete address (soft delete)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Format address as single line string
   */
  formatAddress(adresse: Adresse): string {
    const parts: string[] = [];
    
    if (adresse.strasse) {
      parts.push(adresse.strasse);
    }
    if (adresse.hausnummer) {
      parts.push(adresse.hausnummer);
    }
    if (adresse.plz || adresse.ort) {
      const cityPart = [adresse.plz, adresse.ort].filter(Boolean).join(' ');
      parts.push(cityPart);
    }
    if (adresse.land) {
      parts.push(adresse.land);
    }
    
    return parts.join(', ');
  }

  /**
   * Format address as multi-line string
   */
  formatAddressMultiLine(adresse: Adresse): string[] {
    const lines: string[] = [];
    
    // Line 1: Street and number
    if (adresse.strasse || adresse.hausnummer) {
      const street = [adresse.strasse, adresse.hausnummer].filter(Boolean).join(' ');
      lines.push(street);
    }
    
    // Line 2: Additional address info
    if (adresse.adresszusatz) {
      lines.push(adresse.adresszusatz);
    }
    
    // Line 3: Postal code and city
    if (adresse.plz || adresse.ort) {
      const city = [adresse.plz, adresse.ort].filter(Boolean).join(' ');
      lines.push(city);
    }
    
    // Line 4: District (if exists)
    if (adresse.stadtteil) {
      lines.push(adresse.stadtteil);
    }
    
    // Line 5: State and Country
    const location = [adresse.bundesland, adresse.land].filter(Boolean).join(', ');
    if (location) {
      lines.push(location);
    }
    
    return lines;
  }

  /**
   * Check if address is valid (has minimum required fields)
   */
  isValidAddress(adresse: Partial<Adresse>): boolean {
    return !!(adresse.strasse && adresse.plz && adresse.ort);
  }

  /**
   * Get Google Maps URL for address
   */
  getGoogleMapsUrl(adresse: Adresse): string {
    if (adresse.latitude && adresse.longitude) {
      return `https://www.google.com/maps?q=${adresse.latitude},${adresse.longitude}`;
    }
    
    const addressString = this.formatAddress(adresse);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;
  }
}

export const adresseService = new AdresseService();
export default adresseService;

