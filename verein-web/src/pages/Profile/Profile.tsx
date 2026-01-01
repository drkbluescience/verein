import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import i18n from '../../i18n/config';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedService } from '../../services/mitgliedService';
import keytableService, { Waehrung } from '../../services/keytableService';
import Loading from '../../components/Common/Loading';
import ProfileEditModal from '../../components/Mitglied/ProfileEditModal';
import './Profile.css';

// SVG Icons
const UserIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
    <path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const Profile: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['profile', 'common']);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch mitglied data if user is a member
  const { data: mitglied, isLoading: mitgliedLoading } = useQuery({
    queryKey: ['mitglied-profile', user?.mitgliedId],
    queryFn: () => mitgliedService.getById(user!.mitgliedId!),
    enabled: user?.type === 'mitglied' && !!user?.mitgliedId,
  });

  // Fetch keytable data
  const { data: geschlechter } = useQuery({
    queryKey: ['geschlechter'],
    queryFn: () => keytableService.getGeschlechter(),
    enabled: user?.type === 'mitglied',
  });

  const { data: staatsangehoerigkeiten } = useQuery({
    queryKey: ['staatsangehoerigkeiten'],
    queryFn: () => keytableService.getStaatsangehoerigkeiten(),
    enabled: user?.type === 'mitglied',
  });

  const { data: mitgliedTypen } = useQuery({
    queryKey: ['mitgliedTypen'],
    queryFn: () => keytableService.getMitgliedTypen(),
    enabled: user?.type === 'mitglied',
  });

  const { data: mitgliedStatuse } = useQuery({
    queryKey: ['mitgliedStatuse'],
    queryFn: () => keytableService.getMitgliedStatuse(),
    enabled: user?.type === 'mitglied',
  });

  const { data: beitragPerioden } = useQuery({
    queryKey: ['beitragPerioden'],
    queryFn: () => keytableService.getBeitragPerioden(),
    enabled: user?.type === 'mitglied',
  });

  const { data: beitragZahlungstagTypen } = useQuery({
    queryKey: ['beitragZahlungstagTypen'],
    queryFn: () => keytableService.getBeitragZahlungstagTypen(),
    enabled: user?.type === 'mitglied',
  });

  const { data: waehrungen } = useQuery({
    queryKey: ['waehrungen'],
    queryFn: () => keytableService.getWaehrungen(),
    enabled: user?.type === 'mitglied',
  });

  const getUserTypeLabel = () => {
    switch (user?.type) {
      case 'admin':
        return t('profile:userTypes.admin');
      case 'dernek':
        return t('profile:userTypes.dernek');
      case 'mitglied':
        return t('profile:userTypes.mitglied');
      default:
        return t('profile:userTypes.default');
    }
  };

  const getUserTypeColor = () => {
    switch (user?.type) {
      case 'admin':
        return '#ef4444'; // Red
      case 'dernek':
        return '#3b82f6'; // Blue
      case 'mitglied':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  // Helper function to get keytable name by id
  const getKeytableName = (items: any[] | undefined, id: number | undefined): string => {
    if (!items || !id) return t('profile:placeholders.notAvailable');
    const item = items.find(i => i.id === id);
    if (!item) return t('profile:placeholders.notAvailable');

    const currentLang = i18n.language?.substring(0, 2) || 'tr';

    // Önce uebersetzungen dizisinden çeviriyi ara
    if (item.uebersetzungen && item.uebersetzungen.length > 0) {
      const translation = item.uebersetzungen.find((u: any) => u.sprache === currentLang);
      if (translation?.name) return translation.name;

      // Fallback: Almanca çeviriyi ara
      const german = item.uebersetzungen.find((u: any) => u.sprache === 'de');
      if (german?.name) return german.name;

      // Fallback: İlk çeviriyi kullan
      if (item.uebersetzungen[0]?.name) return item.uebersetzungen[0].name;
    }

    // Eğer uebersetzungen yoksa name property'sini kullan (keytableService tarafından eklenen)
    return item.name || item.code || t('profile:placeholders.notAvailable');
  };

  // Helper function to get keytable name by code
  const getKeytableNameByCode = (items: any[] | undefined, code: string | undefined): string => {
    if (!items || !code) return t('profile:placeholders.notAvailable');
    const item = items.find(i => i.code === code);
    if (!item) return t('profile:placeholders.notAvailable');

    const currentLang = i18n.language?.substring(0, 2) || 'tr';

    // Önce uebersetzungen dizisinden çeviriyi ara
    if (item.uebersetzungen && item.uebersetzungen.length > 0) {
      const translation = item.uebersetzungen.find((u: any) => u.sprache === currentLang);
      if (translation?.name) return translation.name;

      // Fallback: Almanca çeviriyi ara
      const german = item.uebersetzungen.find((u: any) => u.sprache === 'de');
      if (german?.name) return german.name;

      // Fallback: İlk çeviriyi kullan
      if (item.uebersetzungen[0]?.name) return item.uebersetzungen[0].name;
    }

    // Eğer uebersetzungen yoksa name property'sini kullan
    return item.name || item.code || t('profile:placeholders.notAvailable');
  };

  // Helper function to get currency symbol
  const getCurrencySymbol = (waehrungId: number | undefined): string => {
    if (!waehrungId || !waehrungen) return '';
    const waehrung = waehrungen.find((w: Waehrung) => w.id === waehrungId);
    return waehrung?.symbol || waehrung?.code || '';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('profile:placeholders.notAvailable');
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (user?.type === 'mitglied' && mitgliedLoading) {
    return <Loading text={t('common:loading')} />;
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1 className="page-title">{t('profile:title')}</h1>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button
          className="btn-primary"
          onClick={() => {
            if (user?.type === 'mitglied') {
              setIsProfileModalOpen(true);
              return;
            }
            setIsEditing(!isEditing);
          }}
        >
          <EditIcon />
          <span>
            {user?.type === 'mitglied'
              ? t('profile:actions.edit')
              : (isEditing ? t('profile:actions.cancel') : t('profile:actions.edit'))}
          </span>
        </button>
      </div>

      <div className="profile-content">
        {/* User Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <UserIcon />
            </div>
            <div className="profile-basic-info">
              <h2 className="profile-name">
                {user ? `${user.firstName} ${user.lastName}` : t('profile:userTypes.default')}
              </h2>
              <p className="profile-email">{user?.email || ''}</p>
              <span
                className="profile-type-badge"
                style={{
                  background: `${getUserTypeColor()}15`,
                  color: getUserTypeColor(),
                  borderColor: `${getUserTypeColor()}30`
                }}
              >
                {getUserTypeLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <div className="section-header">
            <UserIcon />
            <h2>{t('profile:personalInfo.title')}</h2>
          </div>

          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">{t('profile:personalInfo.firstName')}</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={user?.firstName || ''}
                  placeholder={t('profile:personalInfo.firstName')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile:personalInfo.lastName')}</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={user?.lastName || ''}
                  placeholder={t('profile:personalInfo.lastName')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MailIcon />
                  <span>{t('profile:personalInfo.email')}</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  defaultValue={user?.email || ''}
                  placeholder={t('profile:personalInfo.email')}
                  disabled
                />
              </div>
            </div>
          ) : (
            <div className="info-grid">
              {/* 1. KİŞİSEL BİLGİLER - Ad, Soyad, Cinsiyet, Doğum Tarihi, Doğum Yeri, Uyruk */}
              <div className="info-item">
                <label className="info-label">{t('profile:personalInfo.firstName')}</label>
                <div className="info-value">{user?.firstName || mitglied?.vorname || t('profile:placeholders.notAvailable')}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:personalInfo.lastName')}</label>
                <div className="info-value">{user?.lastName || mitglied?.nachname || t('profile:placeholders.notAvailable')}</div>
              </div>

              {user?.type === 'mitglied' && mitglied && (
                <>
                  <div className="info-item">
                    <label className="info-label">{t('profile:personalInfo.gender')}</label>
                    <div className="info-value">{getKeytableName(geschlechter, mitglied.geschlechtId)}</div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">
                      <CalendarIcon />
                      <span>{t('profile:personalInfo.birthDate')}</span>
                    </label>
                    <div className="info-value">{formatDate(mitglied.geburtsdatum)}</div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">{t('profile:personalInfo.birthPlace')}</label>
                    <div className="info-value">{mitglied.geburtsort || t('profile:placeholders.notAvailable')}</div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">{t('profile:personalInfo.nationality')}</label>
                    <div className="info-value">{getKeytableName(staatsangehoerigkeiten, mitglied.staatsangehoerigkeitId)}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 2. İLETİŞİM BİLGİLERİ - E-posta, Telefon, Cep Telefonu */}
        <div className="profile-section">
          <div className="section-header">
            <MailIcon />
            <h2>{t('profile:contactInfo.title')}</h2>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label className="info-label">
                <MailIcon />
                <span>{t('profile:contactInfo.email')}</span>
              </label>
              <div className="info-value">{user?.email || mitglied?.email || t('profile:placeholders.notAvailable')}</div>
            </div>

            {user?.type === 'mitglied' && mitglied && (
              <>
                <div className="info-item">
                  <label className="info-label">
                    <PhoneIcon />
                    <span>{t('profile:contactInfo.phone')}</span>
                  </label>
                  <div className="info-value">{mitglied.telefon || t('profile:placeholders.notAvailable')}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">
                    <PhoneIcon />
                    <span>{t('profile:contactInfo.mobile')}</span>
                  </label>
                  <div className="info-value">{mitglied.mobiltelefon || t('profile:placeholders.notAvailable')}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. ÜYELİK BİLGİLERİ - Üye Numarası, Üyelik Durumu, Üyelik Tipi, Giriş/Çıkış Tarihi, Aktif */}
        {user?.type === 'mitglied' && mitglied && (
          <div className="profile-section">
            <div className="section-header">
              <ShieldIcon />
              <h2>{t('profile:membershipInfo.title')}</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">{t('profile:membershipInfo.memberNumber')}</label>
                <div className="info-value">{mitglied.mitgliedsnummer || t('profile:placeholders.notAvailable')}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:membershipInfo.memberStatus')}</label>
                <div className="info-value">{getKeytableName(mitgliedStatuse, mitglied.mitgliedStatusId)}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:membershipInfo.memberType')}</label>
                <div className="info-value">{getKeytableName(mitgliedTypen, mitglied.mitgliedTypId)}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:membershipInfo.memberSince')}</label>
                <div className="info-value">{formatDate(mitglied.eintrittsdatum)}</div>
              </div>

              {mitglied.austrittsdatum && (
                <div className="info-item">
                  <label className="info-label">{t('profile:membershipInfo.memberUntil')}</label>
                  <div className="info-value">{formatDate(mitglied.austrittsdatum)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. AİDAT / ÖDEME BİLGİLERİ */}
        {user?.type === 'mitglied' && mitglied && (
          <div className="profile-section">
            <div className="section-header">
              <BuildingIcon />
              <h2>{t('profile:feeInfo.title')}</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">{t('profile:feeInfo.feeAmount')}</label>
                <div className="info-value">
                  {mitglied.beitragBetrag !== undefined && mitglied.beitragBetrag !== null
                    ? `${mitglied.beitragBetrag} ${getCurrencySymbol(mitglied.beitragWaehrungId)}`
                    : t('profile:placeholders.notAvailable')}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:feeInfo.feePeriod')}</label>
                <div className="info-value">{getKeytableNameByCode(beitragPerioden, mitglied.beitragPeriodeCode)}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:feeInfo.paymentDay')}</label>
                <div className="info-value">{mitglied.beitragZahlungsTag || t('profile:placeholders.notAvailable')}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:feeInfo.paymentDayType')}</label>
                <div className="info-value">{getKeytableNameByCode(beitragZahlungstagTypen, mitglied.beitragZahlungstagTypCode)}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:feeInfo.feeRequired')}</label>
                <div className="info-value">
                  {mitglied.beitragIstPflicht !== undefined && mitglied.beitragIstPflicht !== null
                    ? (mitglied.beitragIstPflicht ? t('profile:feeInfo.yes') : t('profile:feeInfo.no'))
                    : t('profile:placeholders.notAvailable')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dernek kullanıcıları için hesap bilgileri */}
        {user?.type !== 'mitglied' && (
          <div className="profile-section">
            <div className="section-header">
              <ShieldIcon />
              <h2>{t('profile:accountInfo.title')}</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">{t('profile:accountInfo.userType')}</label>
                <div className="info-value">{getUserTypeLabel()}</div>
              </div>

              <div className="info-item">
                <label className="info-label">{t('profile:accountInfo.accountStatus')}</label>
                <div className="info-value">
                  <span className="status-badge status-active">{t('profile:status.active')}</span>
                </div>
              </div>

              {user?.type === 'dernek' && user?.vereinId && (
                <div className="info-item">
                  <label className="info-label">
                    <BuildingIcon />
                    <span>{t('profile:accountInfo.vereinId')}</span>
                  </label>
                  <div className="info-value">{user.vereinId}</div>
                </div>
              )}

              <div className="info-item">
                <label className="info-label">{t('profile:accountInfo.lastLogin')}</label>
                <div className="info-value">{t('profile:accountInfo.now')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="info-message">
          <p dangerouslySetInnerHTML={{ __html: t('profile:messages.infoMessage') }} />
        </div>
      </div>

      {user?.type === 'mitglied' && mitglied && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          mitglied={mitglied}
        />
      )}
    </div>
  );
};

export default Profile;

