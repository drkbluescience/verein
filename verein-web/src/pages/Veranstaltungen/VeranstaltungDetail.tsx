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
import { calculateNextOccurrences, getRecurrenceDescription } from '../../utils/recurringEventUtils';
import { getCurrencySymbol } from '../../utils/currencyUtils';
import './VeranstaltungDetail.css';

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

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const CalendarDaysIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const TableIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
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
            {anmeldung.name || t('veranstaltungen:detail.anonymousParticipant')}
          </h4>
          {anmeldung.email && (
            <p className="participant-email">{anmeldung.email}</p>
          )}
        </div>
        <div className="anmeldung-status">
          <span className="status-badge active">{t('veranstaltungen:detail.registered')}</span>
        </div>
      </div>
      
      <div className="anmeldung-details">
        {anmeldung.telefon && (
          <div className="detail-item">
            <span className="detail-icon"><PhoneIcon /></span>
            <span className="detail-text">{anmeldung.telefon}</span>
          </div>
        )}

        <div className="detail-item">
          <span className="detail-icon"><CalendarIcon /></span>
          <span className="detail-text">
            {t('veranstaltungen:detailPage.anmeldung.registeredOn')}: {formatDate(anmeldung.created)}
          </span>
        </div>

        {anmeldung.bemerkung && (
          <div className="detail-item">
            <span className="detail-icon"><MessageIcon /></span>
            <span className="detail-text">{anmeldung.bemerkung}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const VeranstaltungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['veranstaltungen', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const eventId = parseInt(id || '0');

  // Tab state
  const [activeTab, setActiveTab] = useState<'info' | 'teilnehmer' | 'bilder'>('info');

  // View mode states for tabs
  const [participantsViewMode, setParticipantsViewMode] = useState<'grid' | 'table'>('grid');
  const [imagesViewMode, setImagesViewMode] = useState<'grid' | 'table'>('grid');

  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationNote, setRegistrationNote] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // Add participant modal state
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  // Delete confirmation modal state
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

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

  // Check if user can manage event (edit, delete, see participants)
  const canManageEvent = () => {
    if (!user) return false;
    if (user.type === 'admin') return true;
    if (user.type === 'dernek' && user.vereinId === veranstaltung?.vereinId) return true;
    return false;
  };

  // Fetch event registrations (only for admin/dernek)
  const {
    data: anmeldungen,
    isLoading: anmeldungenLoading,
    error: anmeldungenError
  } = useQuery({
    queryKey: ['veranstaltung-anmeldungen', eventId],
    queryFn: () => veranstaltungAnmeldungService.getByVeranstaltungId(eventId),
    enabled: !!eventId && canManageEvent(), // Only admin/dernek can see participant list
    retry: false, // Don't retry on error
  });

  // Fetch participant count (for all users)
  const {
    data: participantCount,
    isLoading: participantCountLoading
  } = useQuery({
    queryKey: ['veranstaltung-participant-count', eventId],
    queryFn: () => veranstaltungAnmeldungService.getParticipantCount(eventId),
    enabled: !!eventId,
    retry: false,
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

  // Check if user is already registered (only confirmed/pending registrations)
  const isUserRegistered = React.useMemo(() => {
    if (!userRegistrations || userRegistrations.length === 0) {
      return false;
    }

    const registered = userRegistrations.some(reg => {
      // Check both English and German status values
      const isValidStatus =
        reg.status === 'Confirmed' ||
        reg.status === 'Pending' ||
        reg.status === 'BESTAETIGT' ||
        reg.status === 'WARTEND';

      return reg.veranstaltungId === eventId && isValidStatus;
    });

    return registered;
  }, [userRegistrations, eventId]);

  // Auto-redirect mitglied users to 'info' tab if they try to access restricted tabs
  React.useEffect(() => {
    if (user?.type === 'mitglied') {
      // If on participants tab (not allowed for mitglied)
      if (activeTab === 'teilnehmer') {
        setActiveTab('info');
      }
      // If on images tab but not registered (not allowed)
      if (activeTab === 'bilder' && !isUserRegistered) {
        setActiveTab('info');
      }
    }
  }, [activeTab, user?.type, isUserRegistered]);

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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => veranstaltungService.delete(eventId),
    onSuccess: () => {
      showToast(t('veranstaltungen:detailPage.actions.deleteSuccess'), 'success');
      // Refresh events list and navigate back
      queryClient.invalidateQueries({ queryKey: ['veranstaltungen'] });
      navigate('/veranstaltungen');
    },
    onError: (error: any) => {
      showToast(
        error?.message || t('veranstaltungen:detailPage.actions.deleteError'),
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

  // Handle delete event
  const handleDelete = () => {
    if (!veranstaltung) return;
    setShowDeleteConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setShowDeleteConfirmModal(false);
    deleteMutation.mutate();
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
Maksimum Katılımcı: ${veranstaltung.maxTeilnehmer || t('veranstaltungen:detail.unlimited')}
Kayıt Gerekli: ${formatBoolean(veranstaltung.anmeldeErforderlich)}
Sadece Üyeler: ${formatBoolean(veranstaltung.nurFuerMitglieder)}

FİYAT BİLGİLERİ
---------------
Fiyat: ${veranstaltung.preis && veranstaltung.preis > 0 ? `${veranstaltung.preis} ${getCurrencySymbol(veranstaltung.waehrungId)}` : 'Ücretsiz'}

DURUM
-----
Aktif: ${formatBoolean(veranstaltung.aktiv)}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      showToast(t('veranstaltungen:export.copySuccess'), 'success');
    } catch (error) {
      console.error('Clipboard error:', error);
      showToast(t('common:errors.copyFailed'), 'error');
    }
  };

  // Export participants report as CSV
  const handleExportReport = () => {
    if (!veranstaltung || !anmeldungen || anmeldungen.length === 0) {
      showToast(t('veranstaltungen:export.noParticipantsWarning'), 'warning');
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



        const getStatusText = (status?: string) => {
          switch (status) {
            case 'Confirmed': return t('veranstaltungen:detail.registered');
            case 'Pending': return t('veranstaltungen:detail.pending');
            case 'Waitlist': return t('veranstaltungen:detail.waitlist');
            case 'Cancelled': return t('veranstaltungen:detail.cancelled');
            default: return status || '-';
          }
        };

        const getPaymentStatusText = (statusId?: number) => {
          switch (statusId) {
            case 1: return t('veranstaltungen:detail.registered');
            case 2: return t('veranstaltungen:detail.pending');
            case 3: return t('veranstaltungen:detail.cancelled');
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
        `${t('veranstaltungen:detailPage.fields.title')}: ${veranstaltung.titel}`,
        `${t('veranstaltungen:detailPage.fields.date')}: ${new Date(veranstaltung.startdatum || '').toLocaleDateString('tr-TR')}`,
        `${t('veranstaltungen:detail.totalParticipants')}: ${anmeldungen.length}`,
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
      link.setAttribute('download', `${veranstaltung.titel}_${t('veranstaltungen:export.participantReportSuffix')}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(t('veranstaltungen:export.reportDownloadSuccess'), 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast(t('veranstaltungen:export.reportDownloadError'), 'error');
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
  const isUpcoming = veranstaltungUtils.isUpcoming(
    veranstaltung.startdatum,
    veranstaltung.istWiederholend,
    veranstaltung.wiederholungTyp,
    veranstaltung.wiederholungInterval,
    veranstaltung.wiederholungEnde,
    veranstaltung.wiederholungTage,
    veranstaltung.wiederholungMonatTag
  );
  const daysUntil = isUpcoming ? veranstaltungUtils.getDaysUntilEvent(
    veranstaltung.startdatum,
    veranstaltung.istWiederholend,
    veranstaltung.wiederholungTyp,
    veranstaltung.wiederholungInterval,
    veranstaltung.wiederholungEnde,
    veranstaltung.wiederholungTage,
    veranstaltung.wiederholungMonatTag
  ) : null;

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

  // Use participant count from API (available for all users)
  const totalParticipants = participantCount ?? 0;

  // Determine back navigation based on user type
  const getBackPath = () => {
    if (user?.type === 'mitglied') {
      return '/meine-veranstaltungen';
    }
    return '/veranstaltungen';
  };

  return (
    <div className="veranstaltung-detail">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{veranstaltung.titel}</h1>
        {getStatusBadge()}
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate(getBackPath())}
          title={t('veranstaltungen:detailPage.back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>

        {/* Countdown */}
        {isUpcoming && daysUntil !== null && (
          <div className="countdown-section">
            {daysUntil === 0 ? (
              <span className="countdown-today">{t('veranstaltungen:detailPage.countdown.today')}</span>
            ) : daysUntil === 1 ? (
              <span className="countdown-soon">{t('veranstaltungen:detailPage.countdown.tomorrow')}</span>
            ) : (
              <span className="countdown-days">
                <CalendarDaysIcon />
                {t('veranstaltungen:detailPage.countdown.daysLeft', { days: daysUntil }).replace('{days}', daysUntil.toString())}
              </span>
            )}
          </div>
        )}

        {/* Registration Button for Mitglied users */}
        {user?.type === 'mitglied' && isUpcoming && veranstaltung.anmeldeErforderlich && (
          <>
            {isUserRegistered ? (
              <button className="btn-success" disabled>
                <CheckIcon />
                <span>{t('veranstaltungen:detailPage.registration.registered')}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="btn-primary"
              >
                <CheckIcon />
                <span>{t('veranstaltungen:detailPage.registration.register')}</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          {t('veranstaltungen:detailPage.tabs.info')}
        </button>
        {/* Participants tab - Only for admin/dernek */}
        {canManageEvent() && (
          <button
            className={`tab-button ${activeTab === 'teilnehmer' ? 'active' : ''}`}
            onClick={() => setActiveTab('teilnehmer')}
          >
            {t('veranstaltungen:detailPage.tabs.participants')} ({participantCount ?? 0})
          </button>
        )}
        {/* Images tab - Only show if user can manage event OR is registered */}
        {(canManageEvent() || isUserRegistered) && (
          <button
            className={`tab-button ${activeTab === 'bilder' ? 'active' : ''}`}
            onClick={() => setActiveTab('bilder')}
          >
            {t('veranstaltungen:detailPage.tabs.images')}
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="info-card">
            <h2 className="section-title">{t('veranstaltungen:detailPage.sections.eventInfo')}</h2>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon"><CalendarIcon /></span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.date')}</span>
                  <span className="info-value">
                    {veranstaltungUtils.formatEventDate(
                      veranstaltung.startdatum,
                      veranstaltung.enddatum,
                      veranstaltung.istWiederholend,
                      veranstaltung.wiederholungEnde
                    )}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon"><ClockIcon /></span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.time')}</span>
                  <span className="info-value">
                    {veranstaltungUtils.formatEventTime(veranstaltung.startdatum, veranstaltung.enddatum)}
                  </span>
                </div>
              </div>

              {veranstaltung.ort && (
                <div className="info-item">
                  <span className="info-icon"><MapPinIcon /></span>
                  <div className="info-content">
                    <span className="info-label">{t('veranstaltungen:detailPage.fields.location')}</span>
                    <span className="info-value">{veranstaltung.ort}</span>
                  </div>
                </div>
              )}

              <div className="info-item">
                <span className="info-icon"><UsersIcon /></span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.participants')}</span>
                  <span className="info-value">
                    {totalParticipants}
                    {veranstaltung.maxTeilnehmer && ` / ${veranstaltung.maxTeilnehmer}`}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon"><DollarIcon /></span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.fee')}</span>
                  <span className="info-value">
                    {veranstaltung.preis && veranstaltung.preis > 0
                      ? `${veranstaltung.preis}${getCurrencySymbol(veranstaltung.waehrungId)}`
                      : t('veranstaltungen:listPage.card.free')}
                  </span>
                </div>
              </div>
            </div>

            {/* Recurring Event Information */}
            {veranstaltung.istWiederholend && (
              <div className="recurring-section">
                <h3 className="recurring-title">
                  🔁 {t('veranstaltungen:recurrence.title')}
                </h3>
                <p className="recurring-description">
                  {getRecurrenceDescription(veranstaltung, t)}
                </p>

                {/* Next Occurrences */}
                <div className="next-occurrences">
                  <h4>{t('veranstaltungen:recurrence.nextOccurrences')}</h4>
                  <div className="occurrences-list">
                    {calculateNextOccurrences(veranstaltung, 10).map((occurrence, index) => (
                      <div key={index} className="occurrence-item">
                        <span className="occurrence-icon">📅</span>
                        <span className="occurrence-date">
                          {new Date(occurrence.startdatum).toLocaleDateString(i18n.language, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="occurrence-time">
                          {new Date(occurrence.startdatum).toLocaleTimeString(i18n.language, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {veranstaltung.beschreibung && (
              <div className="description-section">
                <h3>{t('veranstaltungen:detailPage.sections.description')}</h3>
                <p className="event-description">{veranstaltung.beschreibung}</p>
              </div>
            )}
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'teilnehmer' && (
          <div className="participants-section">
            <div className="participants-card">
              <div className="section-header">
                <h2 className="section-title">
                  {t('veranstaltungen:detailPage.sections.participants')} ({participantCount ?? 0})
                </h2>
                <div className="section-actions">
                  {/* View Mode Toggle - Only for admin/dernek */}
                  {canManageEvent() && anmeldungen && anmeldungen.length > 0 && (
                    <div className="view-toggle">
                      <button
                        className={`toggle-btn ${participantsViewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setParticipantsViewMode('grid')}
                        title={t('veranstaltungen:detailPage.viewMode.grid')}
                      >
                        <GridIcon />
                      </button>
                      <button
                        className={`toggle-btn ${participantsViewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setParticipantsViewMode('table')}
                        title={t('veranstaltungen:detailPage.viewMode.table')}
                      >
                        <TableIcon />
                      </button>
                    </div>
                  )}
                  {/* Export Report - Only for admin/dernek */}
                  {canManageEvent() && anmeldungen && anmeldungen.length > 0 && (
                    <button className="btn-secondary" onClick={handleExportReport}>
                      <ChartIcon />
                      <span>{t('veranstaltungen:detailPage.actions.getReport')}</span>
                    </button>
                  )}
                  {/* Add Participant - Only for admin/dernek */}
                  {canManageEvent() && veranstaltung && !veranstaltungUtils.isPast(veranstaltung.startdatum, veranstaltung.enddatum) && (
                    <button className="btn-primary" onClick={() => setShowAddParticipantModal(true)}>
                      <PlusIcon />
                      <span>{t('veranstaltungen:detailPage.actions.addParticipant')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Show message for mitglied users who cannot see participant list */}
              {user?.type === 'mitglied' ? (
                <div className="empty-participants">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h3>{t('veranstaltungen:detail.participantListHidden')}</h3>
                  <p>{t('veranstaltungen:detail.noPermissionToView')}</p>
                  <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {t('veranstaltungen:detail.totalParticipants')}: {participantCount ?? 0}
                  </p>
                </div>
              ) : anmeldungenLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>{t('veranstaltungen:detail.loadingParticipants')}</p>
                </div>
              ) : anmeldungenError ? (
                <ErrorMessage
                  title={t('veranstaltungen:detailPage.participantsError.title')}
                  message={t('veranstaltungen:detailPage.participantsError.message')}
                />
              ) : anmeldungen && anmeldungen.length > 0 ? (
                participantsViewMode === 'grid' ? (
                  <div className="anmeldungen-grid">
                    {anmeldungen.map(anmeldung => (
                      <AnmeldungCard
                        key={anmeldung.id}
                        anmeldung={anmeldung}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="participants-table-container">
                    <table className="participants-table">
                      <thead>
                        <tr>
                          <th>{t('veranstaltungen:detailPage.table.name')}</th>
                          <th>{t('veranstaltungen:detailPage.table.email')}</th>
                          <th>{t('veranstaltungen:detailPage.table.phone')}</th>
                          <th>{t('veranstaltungen:detailPage.table.registeredOn')}</th>
                          <th>{t('veranstaltungen:detailPage.table.note')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anmeldungen.map(anmeldung => {
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
                            <tr key={anmeldung.id}>
                              <td>
                                <div className="table-name-cell">
                                  <strong>{anmeldung.name || t('veranstaltungen:detail.anonymousParticipant')}</strong>
                                </div>
                              </td>
                              <td>{anmeldung.email || '-'}</td>
                              <td>{anmeldung.telefon || '-'}</td>
                              <td>{formatDate(anmeldung.created)}</td>
                              <td>{anmeldung.bemerkung || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
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
                  {/* Add Participant Button - Only for admin/dernek */}
                  {canManageEvent() && veranstaltung && !veranstaltungUtils.isPast(veranstaltung.startdatum, veranstaltung.enddatum) && (
                    <button className="btn-primary" onClick={() => setShowAddParticipantModal(true)}>
                      <PlusIcon />
                      <span>{t('veranstaltungen:detailPage.emptyParticipants.addButton')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'bilder' && (
          <ImageGallery
            veranstaltungId={eventId}
            canManage={canManageEvent()}
            viewMode={imagesViewMode}
            onViewModeChange={setImagesViewMode}
          />
        )}
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
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <DeleteIcon />
              <span>
                {deleteMutation.isPending
                  ? t('common:deleting')
                  : t('veranstaltungen:detailPage.actions.delete')
                }
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="registration-modal modal-content" onClick={(e) => e.stopPropagation()}>
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
        vereinId={veranstaltung?.vereinId}
        veranstaltungPreis={veranstaltung?.preis}
        veranstaltungWaehrungId={veranstaltung?.waehrungId}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
          <div className="registration-modal modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('veranstaltungen:detailPage.actions.delete')}</h2>
              <button
                className="close-button"
                onClick={() => setShowDeleteConfirmModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="delete-confirm-message">
                {t('veranstaltungen:detailPage.actions.deleteConfirm', {
                  title: veranstaltung?.titel
                })}
              </p>
              <p className="delete-warning">
                {t('veranstaltungen:detailPage.actions.deleteWarning')}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                {t('common:actions.cancel')}
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending
                  ? t('common:deleting')
                  : t('veranstaltungen:detailPage.actions.delete')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeranstaltungDetail;
