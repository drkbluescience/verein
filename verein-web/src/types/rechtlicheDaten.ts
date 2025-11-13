export interface RechtlicheDatenDto {
  id: number;
  vereinId: number;
  
  // Registergericht (Court Registration)
  registergerichtName?: string;
  registergerichtNummer?: string;
  registergerichtOrt?: string;
  registergerichtEintragungsdatum?: string;
  
  // Finanzamt (Tax Office)
  finanzamtName?: string;
  finanzamtNummer?: string;
  finanzamtOrt?: string;
  
  // Tax Status
  steuerpflichtig?: boolean;
  steuerbefreit?: boolean;
  gemeinnuetzigAnerkannt?: boolean;
  gemeinnuetzigkeitBis?: string;
  
  // Document Paths
  steuererklaerungPfad?: string;
  steuererklaerungJahr?: number;
  steuerbefreiungPfad?: string;
  gemeinnuetzigkeitsbescheidPfad?: string;
  registerauszugPfad?: string;
  
  // Notes
  bemerkung?: string;
  
  // Audit fields
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateRechtlicheDatenDto {
  vereinId: number;
  registergerichtName?: string;
  registergerichtNummer?: string;
  registergerichtOrt?: string;
  registergerichtEintragungsdatum?: string;
  finanzamtName?: string;
  finanzamtNummer?: string;
  finanzamtOrt?: string;
  steuerpflichtig?: boolean;
  steuerbefreit?: boolean;
  gemeinnuetzigAnerkannt?: boolean;
  gemeinnuetzigkeitBis?: string;
  steuererklaerungPfad?: string;
  steuererklaerungJahr?: number;
  steuerbefreiungPfad?: string;
  gemeinnuetzigkeitsbescheidPfad?: string;
  registerauszugPfad?: string;
  bemerkung?: string;
}

export interface UpdateRechtlicheDatenDto {
  registergerichtName?: string;
  registergerichtNummer?: string;
  registergerichtOrt?: string;
  registergerichtEintragungsdatum?: string;
  finanzamtName?: string;
  finanzamtNummer?: string;
  finanzamtOrt?: string;
  steuerpflichtig?: boolean;
  steuerbefreit?: boolean;
  gemeinnuetzigAnerkannt?: boolean;
  gemeinnuetzigkeitBis?: string;
  steuererklaerungPfad?: string;
  steuererklaerungJahr?: number;
  steuerbefreiungPfad?: string;
  gemeinnuetzigkeitsbescheidPfad?: string;
  registerauszugPfad?: string;
  bemerkung?: string;
}

