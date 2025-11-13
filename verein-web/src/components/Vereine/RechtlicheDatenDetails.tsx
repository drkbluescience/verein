import React from 'react';
import { useTranslation } from 'react-i18next';
import { RechtlicheDatenDto } from '../../types/rechtlicheDaten';
import { format, parseISO } from 'date-fns';
import './RechtlicheDatenDetails.css';

interface RechtlicheDatenDetailsProps {
  rechtlicheDaten?: RechtlicheDatenDto;
  isTableView?: boolean;
  editable?: boolean;
  onToggleDonationPermission?: (enabled: boolean) => void;
}

// Professional SVG Icons
const CourtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M6 18V9M10 18V9M14 18V9M18 18V9M3 9l9-7 9 7M12 2v7"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>
  </svg>
);

const TaxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const NotesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const RechtlicheDatenDetails: React.FC<RechtlicheDatenDetailsProps> = ({
  rechtlicheDaten,
  isTableView = false,
  editable = false,
  onToggleDonationPermission
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine']);

  // Grid style for table view - inline style to override any CSS specificity issues
  const gridStyle = isTableView ? {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem 1.5rem',
    width: '100%',
    padding: '1rem 0',
    boxSizing: 'border-box' as const
  } : undefined;

  if (!rechtlicheDaten) {
    return (
      <div className="rechtliche-daten-details empty">
        <p>{t('vereine:legal.noData')}</p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd.MM.yyyy');
    } catch {
      return dateString;
    }
  };

  const renderYesNo = (value?: boolean) => {
    if (value === undefined || value === null) return '-';
    return value ? '✅ ' + t('vereine:legal.yes') : '❌ ' + t('vereine:legal.no');
  };

  return (
    <div className="rechtliche-daten-details">
      {/* Court Registration Section */}
      <div className="detail-section">
        <div className="section-title">
          <CourtIcon />
          <span>{t('vereine:legal.courtRegistration')}</span>
        </div>
        <div className="detail-grid" style={gridStyle}>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.courtName')}:</span>
            <span className="detail-value">{rechtlicheDaten.registergerichtName || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.courtNumber')}:</span>
            <span className="detail-value">{rechtlicheDaten.registergerichtNummer || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.courtCity')}:</span>
            <span className="detail-value">{rechtlicheDaten.registergerichtOrt || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.registrationDate')}:</span>
            <span className="detail-value">{formatDate(rechtlicheDaten.registergerichtEintragungsdatum)}</span>
          </div>
        </div>
      </div>

      {/* Tax Office Section */}
      <div className="detail-section">
        <div className="section-title">
          <BuildingIcon />
          <span>{t('vereine:legal.taxOfficeInfo')}</span>
        </div>
        <div className="detail-grid" style={gridStyle}>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.taxOfficeName')}:</span>
            <span className="detail-value">{rechtlicheDaten.finanzamtName || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.taxOfficeNumber')}:</span>
            <span className="detail-value">{rechtlicheDaten.finanzamtNummer || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.taxOfficeCity')}:</span>
            <span className="detail-value">{rechtlicheDaten.finanzamtOrt || '-'}</span>
          </div>
        </div>
      </div>

      {/* Tax Status Section */}
      <div className="detail-section">
        <div className="section-title">
          <TaxIcon />
          <span>{t('vereine:legal.taxStatus')}</span>
        </div>
        <div className="detail-grid" style={gridStyle}>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.taxLiable')}:</span>
            <span className="detail-value">{renderYesNo(rechtlicheDaten.steuerpflichtig)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('vereine:legal.taxExempt')}:</span>
            <span className="detail-value">{renderYesNo(rechtlicheDaten.steuerbefreit)}</span>
          </div>

          {/* Donation Permission Toggle */}
          {editable ? (
            <div className="detail-item donation-toggle-item">
              <span className="detail-label">{t('vereine:legal.donationPermissionActive')}:</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={rechtlicheDaten.gemeinnuetzigAnerkannt || false}
                  onChange={(e) => onToggleDonationPermission?.(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  {rechtlicheDaten.gemeinnuetzigAnerkannt ? t('vereine:legal.active') : t('vereine:legal.inactive')}
                </span>
              </label>
            </div>
          ) : (
            <div className="detail-item">
              <span className="detail-label">{t('vereine:legal.donationPermissionActive')}:</span>
              <span className="detail-value">{renderYesNo(rechtlicheDaten.gemeinnuetzigAnerkannt)}</span>
            </div>
          )}

          {rechtlicheDaten.gemeinnuetzigkeitBis && (
            <div className="detail-item">
              <span className="detail-label">{t('vereine:legal.validUntil')}:</span>
              <span className="detail-value">{formatDate(rechtlicheDaten.gemeinnuetzigkeitBis)}</span>
            </div>
          )}
          {rechtlicheDaten.steuererklaerungJahr && (
            <div className="detail-item">
              <span className="detail-label">{t('vereine:legal.lastDeclaration')}:</span>
              <span className="detail-value">{rechtlicheDaten.steuererklaerungJahr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      {(rechtlicheDaten.registerauszugPfad || rechtlicheDaten.gemeinnuetzigkeitsbescheidPfad ||
        rechtlicheDaten.steuererklaerungPfad || rechtlicheDaten.steuerbefreiungPfad) && (
        <div className="detail-section">
          <div className="section-title">
            <DocumentIcon />
            <span>{t('vereine:legal.documents')}</span>
          </div>
          <div className="detail-grid" style={gridStyle}>
            {rechtlicheDaten.registerauszugPfad && (
              <div className="detail-item">
                <span className="detail-label">{t('vereine:legal.statuteDocument')}:</span>
                <span className="detail-value">{rechtlicheDaten.registerauszugPfad}</span>
              </div>
            )}
            {rechtlicheDaten.gemeinnuetzigkeitsbescheidPfad && (
              <div className="detail-item">
                <span className="detail-label">{t('vereine:legal.donationCertificate')}:</span>
                <span className="detail-value">{rechtlicheDaten.gemeinnuetzigkeitsbescheidPfad}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {rechtlicheDaten.bemerkung && (
        <div className="detail-section">
          <div className="section-title">
            <NotesIcon />
            <span>{t('vereine:legal.notes')}</span>
          </div>
          <p className="notes-text">{rechtlicheDaten.bemerkung}</p>
        </div>
      )}
    </div>
  );
};

export default RechtlicheDatenDetails;

