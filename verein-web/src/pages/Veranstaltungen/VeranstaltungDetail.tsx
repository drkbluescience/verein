import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { veranstaltungService, veranstaltungAnmeldungService, veranstaltungUtils } from '../../services/veranstaltungService';
import { mitgliedService } from '../../services/mitgliedService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { VeranstaltungAnmeldungDto, CreateVeranstaltungAnmeldungDto } from '../../types/veranstaltung';
import VeranstaltungFormModal from '../../components/Veranstaltung/VeranstaltungFormModal';
import AddParticipantModal from '../../components/Veranstaltung/AddParticipantModal';
import ImageGallery from '../../components/Veranstaltung/ImageGallery';
import './VeranstaltungDetail.css';

// SVG Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

interface AnmeldungCardProps {
  anmeldung: VeranstaltungAnmeldungDto;
}

const AnmeldungCard: React.FC<AnmeldungCardProps> = ({ anmeldung }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('common:notSpecified');
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="anmeldung-card">
      <div className="anmeldung-header">
        <div className="participant-info">
          <h4 className="participant-name">
            {anmeldung.name || 'İsimsiz Katılımcı'}
          </h4>
          {anmeldung.email && (
            <p className="participant-email">{anmeldung.email}</p>
          )}
        </div>
        <div className="anmeldung-status">
          <span className="status-badge active">Kayıtlı</span>
        </div>
      </div>
      
      <div className="anmeldung-details">
        {anmeldung.telefon && (
          <div className="detail-item">
            <span className="detail-icon">📞</span>
            <span className="detail-text">{anmeldung.telefon}</span>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">
            {t('veranstaltungen:detailPage.anmeldung.registeredOn')}: {formatDate(anmeldung.created)}
          </span>
        </div>
        
        {anmeldung.bemerkung && (
          <div className="detail-item">
            <span className="detail-icon">💬</span>
            <span className="detail-text">{anmeldung.bemerkung}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const VeranstaltungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const eventId = parseInt(id || '0');

  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationNote, setRegistrationNote] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // Add participant modal state
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  // Fetch event details
  const {
    data: veranstaltung,
    isLoading: eventLoading,
    error: eventError
  } = useQuery({
    queryKey: ['veranstaltung', eventId],
    queryFn: () => veranstaltungService.getById(eventId),
    enabled: !!eventId,
  });

  // Fetch event registrations
  const {
    data: anmeldungen,
    isLoading: anmeldungenLoading,
    error: anmeldungenError
  } = useQuery({
    queryKey: ['veranstaltung-anmeldungen', eventId],
    queryFn: () => veranstaltungAnmeldungService.getByVeranstaltungId(eventId),
    enabled: !!eventId,
  });

  // Fetch user's registrations to check if already registered
  const {
    data: userRegistrations
  } = useQuery({
    queryKey: ['mitglied-anmeldungen', user?.mitgliedId],
    queryFn: async () => {
      if (!user?.mitgliedId) return [];
      const result = await veranstaltungAnmeldungService.getByMitgliedId(user.mitgliedId);
      return result || [];
    },
    enabled: !!user?.mitgliedId,
  });

  // Check if user is already registered
  const isUserRegistered = userRegistrations?.some(reg => reg.veranstaltungId === eventId) || false;

  // Fetch mitglied details for auto-fill
  const {
    data: mitgliedData
  } = useQuery({
    queryKey: ['mitglied', user?.mitgliedId],
    queryFn: async () => {
      if (!user?.mitgliedId) return null;
      return await mitgliedService.getById(user.mitgliedId);
    },
    enabled: !!user?.mitgliedId && user?.type === 'mitglied',
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: (data: CreateVeranstaltungAnmeldungDto) =>
      veranstaltungAnmeldungService.create(data),
    onSuccess: () => {
      showToast(t('veranstaltungen:detailPage.registration.success'), 'success');
      setShowRegistrationModal(false);
      setRegistrationNote('');
      // Refresh registrations
      queryClient.invalidateQueries({ queryKey: ['veranstaltung-anmeldungen', eventId] });
      queryClient.invalidateQueries({ queryKey: ['mitglied-anmeldungen', user?.mitgliedId] });
    },
    onError: (error: any) => {
      showToast(
        error?.message || t('veranstaltungen:detailPage.registration.error'),
        'error'
      );
    },
  });

  // Handle registration
  const handleRegister = () => {
    if (!user?.mitgliedId || !mitgliedData) return;

    const registrationData: CreateVeranstaltungAnmeldungDto = {
      veranstaltungId: eventId,
      mitgliedId: user.mitgliedId,
      name: `${mitgliedData.vorname} ${mitgliedData.nachname}`,
      email: mitgliedData.email,
      telefon: mitgliedData.telefon || mitgliedData.mobiltelefon,
      bemerkung: registrationNote || undefined,
      preis: veranstaltung?.preis,
      waehrungId: veranstaltung?.waehrungId,
      status: 'Confirmed',
    };

    registerMutation.mutate(registrationData);
  };

  // Check permissions - Mitglied users can view events
  const hasAccess = () => {
    if (!user) return false;

    // Admin can see everything
    if (user.type === 'admin') return true;

    // Dernek can see their own events
    if (user.type === 'dernek' && user.vereinId === veranstaltung?.vereinId) return true;

    // Mitglied can see:
    // 1. Events from their own Verein
    // 2. Events that are not restricted to members only (nurFuerMitglieder = false)
    if (user.type === 'mitglied') {
      const isSameVerein = user.vereinId === veranstaltung?.vereinId;
      const isPublicEvent = veranstaltung?.nurFuerMitglieder === false;
      return isSameVerein || isPublicEvent;
    }

    return false;
  };

  // Check if user can manage event (edit, delete, see participants)
  const canManageEvent = () => {
    if (!user) return false;
    if (user.type === 'admin') return true;
    if (user.type === 'dernek' && user.vereinId === veranstaltung?.vereinId) return true;
    return false;
  };

  // Copy event details to clipboard
  const handleCopyToClipboard = async () => {
    if (!veranstaltung) return;

    const formatDate = (dateString?: string) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatBoolean = (value?: boolean) => {
      return value ? 'Evet' : 'Hayır';
    };

    const text = `
ETKİNLİK BİLGİLERİ
==================

Başlık: ${veranstaltung.titel}
Açıklama: ${veranstaltung.beschreibung || '-'}

TARİH VE YER
------------
Başlangıç: ${formatDate(veranstaltung.startdatum)}
Bitiş: ${formatDate(veranstaltung.enddatum)}
Yer: ${veranstaltung.ort || '-'}

KATILIM BİLGİLERİ
-----------------
Maksimum Katılımcı: ${veranstaltung.maxTeilnehmer || 'Sınırsız'}
Kayıt Gerekli: ${formatBoolean(veranstaltung.anmeldeErforderlich)}
Sadece Üyeler: ${formatBoolean(veranstaltung.nurFuerMitglieder)}

FİYAT BİLGİLERİ
---------------
Fiyat: ${veranstaltung.preis ? `${veranstaltung.preis} ${veranstaltung.waehrungId === 1 ? 'EUR' : veranstaltung.waehrungId === 2 ? 'USD' : veranstaltung.waehrungId === 3 ? 'TRY' : ''}` : 'Ücretsiz'}

DURUM
-----
Aktif: ${formatBoolean(veranstaltung.aktiv)}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      showToast('Etkinlik bilgileri panoya kopyalandı', 'success');
    } catch (error) {
      console.error('Clipboard error:', error);
      showToast('Panoya kopyalama başarısız oldu', 'error');
    }
  };

  // Export participants report as CSV
  const handleExportReport = () => {
    if (!veranstaltung || !anmeldungen || anmeldungen.length === 0) {
      showToast('Rapor oluşturmak için katılımcı bulunmuyor', 'warning');
      return;
    }

    try {
      // CSV Header
      const headers = [
        'Sıra No',
        'Ad Soyad',
        'E-posta',
        'Telefon',
        'Kayıt Tarihi',
        'Durum',
        'Fiyat',
        'Para Birimi',
        'Ödeme Durumu',
        'Not'
      ];

      // CSV Rows
      const rows = anmeldungen.map((anmeldung, index) => {
        const formatDate = (dateString?: string) => {
          if (!dateString) return '-';
          return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        };

        const getCurrencySymbol = (currencyId?: number) => {
          switch (currencyId) {
            case 1: return 'EUR';
            case 2: return 'USD';
            case 3: return 'TRY';
            default: return 'EUR';
          }
        };

        const getStatusText = (status?: string) => {
          switch (status) {
            case 'Confirmed': return 'Onaylandı';
            case 'Pending': return 'Beklemede';
            case 'Waitlist': return 'Bekleme Listesi';
            case 'Cancelled': return 'İptal Edildi';
            default: return status || '-';
          }
        };

        const getPaymentStatusText = (statusId?: number) => {
          switch (statusId) {
            case 1: return 'Ödendi';
            case 2: return 'Beklemede';
            case 3: return 'İptal Edildi';
            default: return '-';
          }
        };

        return [
          index + 1,
          anmeldung.name || '-',
          anmeldung.email || '-',
          anmeldung.telefon || '-',
          formatDate(anmeldung.created),
          getStatusText(anmeldung.status),
          anmeldung.preis || '0',
          getCurrencySymbol(anmeldung.waehrungId),
          getPaymentStatusText(anmeldung.zahlungStatusId),
          anmeldung.bemerkung || '-'
        ];
      });

      // Create CSV content
      const csvContent = [
        // Event info header
        `Etkinlik: ${veranstaltung.titel}`,
        `Tarih: ${new Date(veranstaltung.startdatum || '').toLocaleDateString('tr-TR')}`,
        `Toplam Katılımcı: ${anmeldungen.length}`,
        '', // Empty line
        // Table headers
        headers.join(','),
        // Table rows
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${veranstaltung.titel}_Katilimci_Raporu_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Rapor başarıyla indirildi', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Rapor oluşturulurken hata oluştu', 'error');
    }
  };

  if (eventLoading || anmeldungenLoading) {
    return <Loading text={t('veranstaltungen:detailPage.loading')} />;
  }

  if (eventError || !veranstaltung) {
    return (
      <ErrorMessage
        title={t('veranstaltungen:detailPage.error.title')}
        message={t('veranstaltungen:detailPage.error.message')}
      />
    );
  }

  if (!hasAccess()) {
    return (
      <div className="veranstaltung-detail">
        <div className="access-denied">
          <h2>{t('veranstaltungen:detailPage.accessDenied.title')}</h2>
          <p>{t('veranstaltungen:detailPage.accessDenied.message')}</p>
          <Link to="/veranstaltungen" className="btn-primary">
            {t('veranstaltungen:detailPage.accessDenied.backButton')}
          </Link>
        </div>
      </div>
    );
  }

  const status = veranstaltungUtils.getEventStatus(veranstaltung.startdatum, veranstaltung.enddatum);
  const isUpcoming = veranstaltungUtils.isUpcoming(veranstaltung.startdatum);
  const daysUntil = isUpcoming ? veranstaltungUtils.getDaysUntilEvent(veranstaltung.startdatum) : null;

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return <span className="status-badge upcoming">{t('veranstaltungen:listPage.status.upcoming')}</span>;
      case 'ongoing':
        return <span className="status-badge ongoing">{t('veranstaltungen:listPage.status.ongoing')}</span>;
      case 'past':
        return <span className="status-badge past">{t('veranstaltungen:listPage.status.past')}</span>;
      default:
        return null;
    }
  };

  // Each registration represents 1 participant
  const totalParticipants = anmeldungen?.length || 0;

  // Determine back navigation based on user type
  const getBackPath = () => {
    if (user?.type === 'mitglied') {
      return '/etkinlikler';
    }
    return '/veranstaltungen';
  };

  return (
    <div className="veranstaltung-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="header-navigation">
          <button
            onClick={() => navigate(getBackPath())}
            className="back-button"
          >
            ← {t('veranstaltungen:detailPage.back')}
          </button>
        </div>

        <div className="header-content">
          <div className="event-title-section">
            <h1 className="event-title">{veranstaltung.titel}</h1>
            {getStatusBadge()}
          </div>

          {isUpcoming && daysUntil !== null && (
            <div className="countdown-section">
              {daysUntil === 0 ? (
                <span className="countdown-today">{t('veranstaltungen:detailPage.countdown.today')}</span>
              ) : daysUntil === 1 ? (
                <span className="countdown-soon">{t('veranstaltungen:detailPage.countdown.tomorrow')}</span>
              ) : (
                <span className="countdown-days">{t('veranstaltungen:detailPage.countdown.daysLeft', { days: daysUntil }).replace('{days}', daysUntil.toString())}</span>
              )}
            </div>
          )}

          {/* Registration Button for Mitglied users */}
          {user?.type === 'mitglied' && isUpcoming && veranstaltung.anmeldeErforderlich && (
            <div className="registration-action">
              {isUserRegistered ? (
                <div className="registered-badge" style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}>
                  <CheckIcon />
                  {t('veranstaltungen:detailPage.registration.registered')}
                </div>
              ) : (
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="register-button"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  <CheckIcon />
                  {t('veranstaltungen:detailPage.registration.register')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Event Information */}
        <div className="event-info-section">
          <div className="info-card">
            <h2 className="section-title">{t('veranstaltungen:detailPage.sections.eventInfo')}</h2>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.date')}</span>
                  <span className="info-value">
                    {veranstaltungUtils.formatEventDate(veranstaltung.startdatum, veranstaltung.enddatum)}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🕐</span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.time')}</span>
                  <span className="info-value">
                    {veranstaltungUtils.formatEventTime(veranstaltung.startdatum, veranstaltung.enddatum)}
                  </span>
                </div>
              </div>

              {veranstaltung.ort && (
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div className="info-content">
                    <span className="info-label">{t('veranstaltungen:detailPage.fields.location')}</span>
                    <span className="info-value">{veranstaltung.ort}</span>
                  </div>
                </div>
              )}

              <div className="info-item">
                <span className="info-icon">👥</span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.participants')}</span>
                  <span className="info-value">
                    {totalParticipants}
                    {veranstaltung.maxTeilnehmer && ` / ${veranstaltung.maxTeilnehmer}`}
                  </span>
                </div>
              </div>

              {veranstaltung.preis && veranstaltung.preis > 0 && (
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <div className="info-content">
                    <span className="info-label">{t('veranstaltungen:detailPage.fields.fee')}</span>
                    <span className="info-value">{veranstaltung.preis}€</span>
                  </div>
                </div>
              )}
            </div>
            
            {veranstaltung.beschreibung && (
              <div className="description-section">
                <h3>{t('veranstaltungen:detailPage.sections.description')}</h3>
                <p className="event-description">{veranstaltung.beschreibung}</p>
              </div>
            )}
          </div>
        </div>

        {/* Participants Section - Only for Admin and Dernek */}
        {canManageEvent() && (
          <div className="participants-section">
            <div className="participants-card">
              <div className="section-header">
                <h2 className="section-title">
                  {t('veranstaltungen:detailPage.sections.participants')} ({anmeldungen?.length || 0})
                </h2>
                <div className="section-actions">
                  <button className="btn-secondary" onClick={handleExportReport}>
                    <ChartIcon />
                    <span>{t('veranstaltungen:detailPage.actions.getReport')}</span>
                  </button>
                  <button className="btn-primary" onClick={() => setShowAddParticipantModal(true)}>
                    <PlusIcon />
                    <span>{t('veranstaltungen:detailPage.actions.addParticipant')}</span>
                  </button>
                </div>
              </div>

              {anmeldungenError ? (
                <ErrorMessage
                  title={t('veranstaltungen:detailPage.participantsError.title')}
                  message={t('veranstaltungen:detailPage.participantsError.message')}
                />
              ) : anmeldungen && anmeldungen.length > 0 ? (
                <div className="anmeldungen-grid">
                  {anmeldungen.map(anmeldung => (
                    <AnmeldungCard
                      key={anmeldung.id}
                      anmeldung={anmeldung}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-participants">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h3>{t('veranstaltungen:detailPage.emptyParticipants.title')}</h3>
                  <p>{t('veranstaltungen:detailPage.emptyParticipants.message')}</p>
                  <button className="btn-primary" onClick={() => setShowAddParticipantModal(true)}>
                    <PlusIcon />
                    <span>{t('veranstaltungen:detailPage.emptyParticipants.addButton')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Gallery Section */}
        <ImageGallery
          veranstaltungId={eventId}
          canManage={canManageEvent()}
        />
      </div>

      {/* Action Bar - Only for Admin and Dernek */}
      {canManageEvent() && (
        <div className="action-bar">
          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => setShowEditModal(true)}>
              <EditIcon />
              <span>{t('veranstaltungen:detailPage.actions.edit')}</span>
            </button>
            <button className="btn-secondary" onClick={handleCopyToClipboard}>
              <CopyIcon />
              <span>{t('veranstaltungen:detailPage.actions.copy')}</span>
            </button>
            <button className="btn-danger">
              <DeleteIcon />
              <span>{t('veranstaltungen:detailPage.actions.delete')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('veranstaltungen:detailPage.registration.title')}</h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="modal-close"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <XIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="registration-info">
                <h3>{veranstaltung?.titel}</h3>
                <p>{veranstaltungUtils.formatEventDate(veranstaltung?.startdatum || '', veranstaltung?.enddatum)}</p>
              </div>

              <div className="form-group">
                <label>{t('veranstaltungen:detailPage.registration.name')}</label>
                <input
                  type="text"
                  value={mitgliedData ? `${mitgliedData.vorname} ${mitgliedData.nachname}` : ''}
                  disabled
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>{t('veranstaltungen:detailPage.registration.email')}</label>
                <input
                  type="email"
                  value={mitgliedData?.email || ''}
                  disabled
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>{t('veranstaltungen:detailPage.registration.phone')}</label>
                <input
                  type="tel"
                  value={mitgliedData?.telefon || mitgliedData?.mobiltelefon || ''}
                  disabled
                  className="form-input"
                />
              </div>

              {veranstaltung?.preis && veranstaltung.preis > 0 && (
                <div className="form-group">
                  <label>{t('veranstaltungen:detailPage.registration.fee')}</label>
                  <input
                    type="text"
                    value={`${veranstaltung.preis}€`}
                    disabled
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label>{t('veranstaltungen:detailPage.registration.note')}</label>
                <textarea
                  value={registrationNote}
                  onChange={(e) => setRegistrationNote(e.target.value)}
                  placeholder={t('veranstaltungen:detailPage.registration.notePlaceholder')}
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="btn-secondary"
              >
                {t('common:actions.cancel')}
              </button>
              <button
                onClick={handleRegister}
                disabled={registerMutation.isPending}
                className="btn-primary"
              >
                {registerMutation.isPending ? (
                  t('veranstaltungen:detailPage.registration.registering')
                ) : (
                  t('veranstaltungen:detailPage.registration.confirm')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <VeranstaltungFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        veranstaltung={veranstaltung}
        mode="edit"
      />

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={showAddParticipantModal}
        onClose={() => setShowAddParticipantModal(false)}
        veranstaltungId={eventId}
        veranstaltungPreis={veranstaltung?.preis}
        veranstaltungWaehrungId={veranstaltung?.waehrungId}
      />
    </div>
  );
};

export default VeranstaltungDetail;
