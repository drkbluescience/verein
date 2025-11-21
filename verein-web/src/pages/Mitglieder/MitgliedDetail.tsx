import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { mitgliedService, mitgliedAdresseService, mitgliedFamilieService, mitgliedUtils } from '../../services/mitgliedService';
import { vereinService } from '../../services/vereinService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import MitgliedFormModal from '../../components/Mitglied/MitgliedFormModal';
import DeleteConfirmDialog from '../../components/Mitglied/DeleteConfirmDialog';
import ProfileEditModal from '../../components/Mitglied/ProfileEditModal';
import './MitgliedDetail.css';

// SVG Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MitgliedDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mitgliedId = parseInt(id || '0');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch member details
  const {
    data: mitglied,
    isLoading: mitgliedLoading,
    error: mitgliedError
  } = useQuery({
    queryKey: ['mitglied', mitgliedId],
    queryFn: () => mitgliedService.getById(mitgliedId),
    enabled: !!mitgliedId,
  });

  // Fetch verein details
  const {
    data: verein,
    isLoading: vereinLoading
  } = useQuery({
    queryKey: ['verein', mitglied?.vereinId],
    queryFn: () => vereinService.getById(mitglied!.vereinId),
    enabled: !!mitglied?.vereinId,
  });

  // Fetch addresses
  const {
    data: adressen
  } = useQuery({
    queryKey: ['mitglied-adressen', mitgliedId],
    queryFn: () => mitgliedAdresseService.getByMitgliedId(mitgliedId, false),
    enabled: !!mitgliedId,
  });

  // Fetch family members
  const {
    data: familie
  } = useQuery({
    queryKey: ['mitglied-familie', mitgliedId],
    queryFn: () => mitgliedFamilieService.getByMitgliedId(mitgliedId, false),
    enabled: !!mitgliedId,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('mitglieder:detailPage.fields.notSpecified');
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (mitgliedLoading) {
    return <Loading text={t('mitglieder:detailPage.loading')} />;
  }

  if (mitgliedError || !mitglied) {
    return <ErrorMessage message={t('mitglieder:detailPage.error')} />;
  }

  const fullName = mitgliedUtils.getFullName(mitglied);
  const age = mitgliedUtils.calculateAge(mitglied.geburtsdatum);
  const membershipDuration = mitgliedUtils.getMembershipDuration(mitglied.eintrittsdatum);
  const statusText = mitgliedUtils.getStatusText(mitglied);
  const statusColor = mitgliedUtils.getStatusColor(mitglied);

  // Format membership duration with i18n
  const formatMembershipDuration = () => {
    if (membershipDuration.unit === 'unknown') {
      return t('common:duration.unknown');
    }
    if (membershipDuration.unit === 'new') {
      return t('common:duration.newMember');
    }
    const unitKey = membershipDuration.value === 1
      ? membershipDuration.unit.slice(0, -1) // 'years' -> 'year', 'months' -> 'month'
      : membershipDuration.unit;
    return `${membershipDuration.value} ${t(`common:duration.${unitKey}`)}`;
  };

  return (
    <div className="mitglied-detail">
      {/* Header */}
      <div className="page-header">
        <div className="member-title-section">
          <div className="member-avatar-large">
            {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="member-title-info">
            <h1 className="page-title">{fullName}</h1>
            <p className="member-subtitle">{t('mitglieder:detailPage.memberNumber')}: #{mitglied.mitgliedsnummer}</p>
          </div>
        </div>
        <div className={`status-badge status-${statusColor}`}>
          {statusText}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/mitglieder')}
          title={t('mitglieder:detailPage.back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>

        {/* Dernek Yöneticisi Butonları */}
        {user?.type === 'dernek' && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => setIsFormModalOpen(true)}
            >
              <EditIcon />
              <span>{t('mitglieder:detailPage.actions.edit')}</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon />
              <span>{t('mitglieder:detailPage.actions.delete')}</span>
            </button>
          </>
        )}

        {/* Normal Üye Butonu - Sadece kendi profilinde */}
        {user?.type === 'mitglied' && user?.mitgliedId === mitglied.id && (
          <button
            className="btn btn-primary"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <EditIcon />
            <span>{t('mitglieder:detailPage.actions.editProfile')}</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Personal Information */}
        <div className="info-section">
          <div className="section-header">
            <UserIcon />
            <h2>{t('mitglieder:detailPage.sections.personalInfo')}</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('mitglieder:detailPage.fields.firstName')}</label>
              <p>{mitglied.vorname}</p>
            </div>
            <div className="info-item">
              <label>{t('mitglieder:detailPage.fields.lastName')}</label>
              <p>{mitglied.nachname}</p>
            </div>
            {mitglied.geburtsdatum && (
              <>
                <div className="info-item">
                  <label>{t('mitglieder:detailPage.fields.birthDate')}</label>
                  <p>{formatDate(mitglied.geburtsdatum)}</p>
                </div>
                {age && (
                  <div className="info-item">
                    <label>{t('mitglieder:detailPage.fields.age')}</label>
                    <p>{age} {t('mitglieder:listPage.card.age')}</p>
                  </div>
                )}
              </>
            )}
            {mitglied.geburtsort && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.birthPlace')}</label>
                <p>{mitglied.geburtsort}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-section">
          <div className="section-header">
            <MailIcon />
            <h2>{t('mitglieder:detailPage.sections.contactInfo')}</h2>
          </div>
          <div className="info-grid">
            {mitglied.email && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.email')}</label>
                <p>{mitglied.email}</p>
              </div>
            )}
            {mitglied.telefon && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.phone')}</label>
                <p>{mitglied.telefon}</p>
              </div>
            )}
            {mitglied.mobiltelefon && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.mobile')}</label>
                <p>{mitglied.mobiltelefon}</p>
              </div>
            )}
          </div>
        </div>

        {/* Membership Information */}
        <div className="info-section">
          <div className="section-header">
            <CalendarIcon />
            <h2>{t('mitglieder:detailPage.sections.membershipInfo')}</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('mitglieder:detailPage.fields.verein')}</label>
              <p>{vereinLoading ? t('mitglieder:detailPage.fields.loading') : verein?.name || t('mitglieder:detailPage.fields.unknown')}</p>
            </div>
            <div className="info-item">
              <label>{t('mitglieder:detailPage.fields.memberNumber')}</label>
              <p>{mitglied.mitgliedsnummer}</p>
            </div>
            {mitglied.eintrittsdatum && (
              <>
                <div className="info-item">
                  <label>{t('mitglieder:detailPage.fields.joinDate')}</label>
                  <p>{formatDate(mitglied.eintrittsdatum)}</p>
                </div>
                <div className="info-item">
                  <label>{t('mitglieder:detailPage.fields.membershipDuration')}</label>
                  <p>{formatMembershipDuration()}</p>
                </div>
              </>
            )}
            {mitglied.austrittsdatum && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.exitDate')}</label>
                <p>{formatDate(mitglied.austrittsdatum)}</p>
              </div>
            )}
            {mitglied.beitragBetrag && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.feeAmount')}</label>
                <p>{mitglied.beitragBetrag} {mitglied.beitragWaehrungId === 1 ? '€' : 'TL'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Addresses */}
        {adressen && adressen.length > 0 && (
          <div className="info-section">
            <div className="section-header">
              <MapPinIcon />
              <h2>{t('mitglieder:detailPage.sections.addressInfo')}</h2>
            </div>
            <div className="address-list">
              {adressen.map((adresse) => (
                <div key={adresse.id} className="address-card">
                  <div className="address-header">
                    <h4>{t('mitglieder:detailPage.address.title')}</h4>
                    {adresse.istStandard && <span className="badge-default">{t('mitglieder:detailPage.address.default')}</span>}
                  </div>
                  <p className="address-text">
                    {adresse.strasse} {adresse.hausnummer}
                    {adresse.adresszusatz && <><br />{adresse.adresszusatz}</>}
                    <br />
                    {adresse.plz} {adresse.ort}
                    {adresse.land && <><br />{adresse.land}</>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Members */}
        {familie && familie.length > 0 && (
          <div className="info-section">
            <div className="section-header">
              <UsersIcon />
              <h2>{t('mitglieder:detailPage.sections.familyMembers')}</h2>
            </div>
            <div className="family-list">
              {familie.map((relation) => (
                <div key={relation.id} className="family-card">
                  <div className="family-info">
                    <h4>{t('mitglieder:detailPage.family.relation')}</h4>
                    <p>{t('mitglieder:detailPage.family.relationId')}: {relation.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {mitglied.bemerkung && (
          <div className="info-section">
            <div className="section-header">
              <h2>{t('mitglieder:detailPage.sections.notes')}</h2>
            </div>
            <div className="notes-content">
              <p>{mitglied.bemerkung}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Dernek Yöneticisi Modal */}
      <MitgliedFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mitglied={mitglied}
        mode="edit"
      />

      {/* Silme Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        mitglied={mitglied}
        onSuccess={() => navigate('/mitglieder')}
      />

      {/* Normal Üye Profil Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        mitglied={mitglied}
      />
    </div>
  );
};

export default MitgliedDetail;

