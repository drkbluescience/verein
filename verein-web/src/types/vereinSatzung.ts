export interface VereinSatzungDto {
  id: number;
  vereinId: number;
  dosyaPfad: string;
  satzungVom: string;
  aktif: boolean;
  bemerkung?: string;
  dosyaAdi?: string;
  dosyaBoyutu?: number;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
  deletedFlag?: boolean;
}

export interface CreateVereinSatzungDto {
  vereinId: number;
  dosyaPfad: string;
  satzungVom: string;
  aktif?: boolean;
  bemerkung?: string;
  dosyaAdi?: string;
  dosyaBoyutu?: number;
}

export interface UpdateVereinSatzungDto {
  satzungVom?: string;
  aktif?: boolean;
  bemerkung?: string;
}

export interface UploadSatzungRequest {
  vereinId: number;
  file: File;
  satzungVom: string;
  setAsActive?: boolean;
  bemerkung?: string;
}

