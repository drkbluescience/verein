import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import { mitgliedService, mitgliedAdresseService, mitgliedFamilieService, mitgliedUtils } from '../../services/mitgliedService';
import { vereinService } from '../../services/vereinService';
import keytableService, { BeitragPeriode } from '../../services/keytableService';
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

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
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

  // Fetch family relationships
  const {
    data: familieRelationships
  } = useQuery({
    queryKey: ['mitglied-familie', mitgliedId],
    queryFn: () => mitgliedFamilieService.getByMitgliedId(mitgliedId, false),
    enabled: !!mitgliedId,
  });

  // Fetch family member details
  const {
    data: familieMembers
  } = useQuery({
    queryKey: ['familie-members', familieRelationships],
    queryFn: async () => {
      if (!familieRelationships || familieRelationships.length === 0) {
        return [];
      }

      const memberIds = new Set<number>();
      familieRelationships.forEach((rel: any) => {
        memberIds.add(rel.parentMitgliedId);
        if (rel.mitgliedId !== mitgliedId) {
          memberIds.add(rel.mitgliedId);
        }
      });

      const members = await Promise.all(
        Array.from(memberIds).map(id => mitgliedService.getById(id))
      );

      return members;
    },
    enabled: !!familieRelationships && familieRelationships.length > 0,
  });

  // Fetch keytable data for display
  const { data: geschlechter } = useQuery({
    queryKey: ['geschlechter'],
    queryFn: () => keytableService.getGeschlechter(),
  });

  const { data: staatsangehoerigkeiten } = useQuery({
    queryKey: ['staatsangehoerigkeiten'],
    queryFn: () => keytableService.getStaatsangehoerigkeiten(),
  });

  const { data: mitgliedTypen } = useQuery({
    queryKey: ['mitgliedTypen'],
    queryFn: () => keytableService.getMitgliedTypen(),
  });

  const { data: beitragPerioden } = useQuery({
    queryKey: ['beitragPerioden'],
    queryFn: () => keytableService.getBeitragPerioden(),
  });

  // Helper function to get keytable name by id
  const getKeytableName = (items: any[] | undefined, id: number | undefined): string => {
    if (!items || !id) return t('mitglieder:detailPage.fields.notSpecified');
    const item = items.find(i => i.id === id);
    if (!item) return t('mitglieder:detailPage.fields.notSpecified');

    const currentLang = i18n.language?.substring(0, 2) || 'tr';
    const translation = item.uebersetzungen?.find((u: any) => u.sprache === currentLang);
    return translation?.name || item.name || item.code || t('mitglieder:detailPage.fields.notSpecified');
  };

  // Helper function to get period name by code
  const getPeriodName = (code: string | undefined): string => {
    if (!code || !beitragPerioden) return t('mitglieder:detailPage.fields.notSpecified');
    const period = beitragPerioden.find((p: BeitragPeriode) => p.code === code);
    if (!period) return t('mitglieder:detailPage.fields.notSpecified');

    const currentLang = i18n.language?.substring(0, 2) || 'tr';
    const translation = period.uebersetzungen?.find((u: any) => u.sprache === currentLang);
    return translation?.name || period.name || period.code || t('mitglieder:detailPage.fields.notSpecified');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('mitglieder:detailPage.fields.notSpecified');
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper function to get relationship name
  const getRelationshipName = (typeId: number): string => {
    const relationships: { [key: number]: string } = {
      1: t('mitglieder:familyPage.relationships.parent'),
      2: t('mitglieder:familyPage.relationships.child'),
      3: t('mitglieder:familyPage.relationships.spouse'),
      4: t('mitglieder:familyPage.relationships.sibling'),
      5: t('mitglieder:familyPage.relationships.other')
    };
    return relationships[typeId] || t('mitglieder:familyPage.relationships.unknown');
  };

  // Helper function to calculate age
  const getAge = (birthdate?: string) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
            {mitglied.geschlechtId && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.gender')}</label>
                <p>{getKeytableName(geschlechter, mitglied.geschlechtId)}</p>
              </div>
            )}
            {mitglied.staatsangehoerigkeitId && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.nationality')}</label>
                <p>{getKeytableName(staatsangehoerigkeiten, mitglied.staatsangehoerigkeitId)}</p>
              </div>
            )}
            {mitglied.mitgliedTypId && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.memberType')}</label>
                <p>{getKeytableName(mitgliedTypen, mitglied.mitgliedTypId)}</p>
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
            {mitglied.beitragBetrag !== undefined && mitglied.beitragBetrag !== null && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.feeAmount')}</label>
                <p>{mitglied.beitragBetrag} {mitglied.beitragWaehrungId === 1 ? '€' : 'TL'}</p>
              </div>
            )}
            {mitglied.beitragPeriodeCode && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.feePeriod')}</label>
                <p>{getPeriodName(mitglied.beitragPeriodeCode)}</p>
              </div>
            )}
            {mitglied.beitragZahlungsTag && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.paymentDay')}</label>
                <p>{mitglied.beitragZahlungsTag}</p>
              </div>
            )}
            {mitglied.beitragIstPflicht !== undefined && mitglied.beitragIstPflicht !== null && (
              <div className="info-item">
                <label>{t('mitglieder:detailPage.fields.feeRequired')}</label>
                <p>{mitglied.beitragIstPflicht ? t('mitglieder:detailPage.fields.yes') : t('mitglieder:detailPage.fields.no')}</p>
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
        {familieRelationships && familieRelationships.length > 0 && (
          <div className="info-section">
            <div className="section-header">
              <UsersIcon />
              <h2>{t('mitglieder:detailPage.sections.familyMembers')}</h2>
            </div>
            <div className="family-list">
              {familieRelationships.map((relation: any) => {
                const memberId = relation.mitgliedId === mitgliedId
                  ? relation.parentMitgliedId
                  : relation.mitgliedId;
                const member = familieMembers?.find((m: any) => m.id === memberId);

                if (!member) return null;

                const age = getAge(member.geburtsdatum);

                return (
                  <div key={relation.id} className="family-card">
                    <div className="family-avatar">
                      {member.vorname?.[0]}{member.nachname?.[0]}
                    </div>
                    <div className="family-info">
                      <h4>{member.vorname} {member.nachname}</h4>
                      <span className="family-relationship">
                        {getRelationshipName(relation.familienbeziehungTypId)}
                      </span>
                      {age !== null && (
                        <p className="family-age">{age} {t('mitglieder:detailPage.fields.yearsOld', { defaultValue: 'yaşında' })}</p>
                      )}
                      {member.email && (
                        <p className="family-contact">
                          <MailIcon />
                          <span>{member.email}</span>
                        </p>
                      )}
                      {(member.telefon || member.mobiltelefon) && (
                        <p className="family-contact">
                          <PhoneIcon />
                          <span>{member.telefon || member.mobiltelefon}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
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

