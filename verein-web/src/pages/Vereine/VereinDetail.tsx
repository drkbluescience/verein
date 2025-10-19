import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { vereinService } from '../../services/vereinService';
import { VereinDto, UpdateVereinDto } from '../../types/verein';
import adresseService, { Adresse, CreateAdresseDto, UpdateAdresseDto } from '../../services/adresseService';
import { mitgliedService } from '../../services/mitgliedService';
import { MitgliedDto } from '../../types/mitglied';
import AdresseFormModal from '../../components/Adressen/AdresseFormModal';
import VereinFormModal from '../../components/Vereine/VereinFormModal';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './VereinDetail.css';

// SVG Icons
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const VereinDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'adressen', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'adressen' | 'mitglieder'>('info');
  const [isAdresseModalOpen, setIsAdresseModalOpen] = useState(false);
  const [isVereinModalOpen, setIsVereinModalOpen] = useState(false);
  const [editingAdresse, setEditingAdresse] = useState<Adresse | null>(null);

  // Fetch Verein data
  const {
    data: verein,
    isLoading: vereinLoading,
    error: vereinError,
    refetch: refetchVerein
  } = useQuery<VereinDto>({
    queryKey: ['verein', id],
    queryFn: () => vereinService.getById(Number(id)),
    enabled: !!id,
  });

  // Fetch Adressen data
  const {
    data: adressen = [],
    isLoading: adressenLoading,
    error: adressenError,
    refetch: refetchAdressen
  } = useQuery<Adresse[]>({
    queryKey: ['adressen', 'verein', id],
    queryFn: () => adresseService.getByVereinId(Number(id)),
    enabled: !!id,
  });

  // Fetch Mitglieder data
  const {
    data: mitglieder = [],
    isLoading: mitgliederLoading,
    error: mitgliederError,
  } = useQuery<MitgliedDto[]>({
    queryKey: ['mitglieder', 'verein', id],
    queryFn: () => mitgliedService.getByVereinId(Number(id), true),
    enabled: !!id,
  });

  // Update Verein Mutation
  const updateVereinMutation = useMutation({
    mutationFn: (data: UpdateVereinDto) => vereinService.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verein', id] });
      showSuccess(t('vereine:messages.updateSuccess'));
      setIsVereinModalOpen(false);
    },
    onError: () => {
      showError(t('vereine:errors.updateFailed'));
    },
  });

  // Create Adresse Mutation
  const createAdresseMutation = useMutation({
    mutationFn: (data: CreateAdresseDto) => adresseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adressen', 'verein', id] });
      showSuccess(t('adressen:messages.createSuccess'));
      setIsAdresseModalOpen(false);
    },
    onError: () => {
      showError(t('adressen:errors.createFailed'));
    },
  });

  // Update Adresse Mutation
  const updateAdresseMutation = useMutation({
    mutationFn: ({ id: adresseId, data }: { id: number; data: UpdateAdresseDto }) =>
      adresseService.update(adresseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adressen', 'verein', id] });
      showSuccess(t('adressen:messages.updateSuccess'));
      setIsAdresseModalOpen(false);
      setEditingAdresse(null);
    },
    onError: () => {
      showError(t('adressen:errors.updateFailed'));
    },
  });

  // Delete Adresse Mutation
  const deleteAdresseMutation = useMutation({
    mutationFn: (adresseId: number) => adresseService.delete(adresseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adressen', 'verein', id] });
      showSuccess(t('adressen:messages.deleteSuccess'));
    },
    onError: () => {
      showError(t('adressen:errors.deleteFailed'));
    },
  });

  const handleBack = () => {
    navigate('/vereine');
  };

  const handleEditVerein = () => {
    setIsVereinModalOpen(true);
  };

  const handleAddAdresse = () => {
    setEditingAdresse(null);
    setIsAdresseModalOpen(true);
  };

  const handleEditAdresse = (adresse: Adresse) => {
    setEditingAdresse(adresse);
    setIsAdresseModalOpen(true);
  };

  const handleDeleteAdresse = async (adresse: Adresse) => {
    if (window.confirm(t('adressen:confirmations.deleteMessage'))) {
      deleteAdresseMutation.mutate(adresse.id);
    }
  };

  const handleVereinModalSubmit = async (data: UpdateVereinDto) => {
    await updateVereinMutation.mutateAsync(data);
  };

  const handleAdresseModalSubmit = async (data: CreateAdresseDto | UpdateAdresseDto) => {
    if (editingAdresse) {
      // Update existing adresse
      await updateAdresseMutation.mutateAsync({ id: editingAdresse.id, data });
    } else {
      // Create new adresse
      await createAdresseMutation.mutateAsync(data as CreateAdresseDto);
    }
  };

  const handleAdresseModalClose = () => {
    setIsAdresseModalOpen(false);
    setEditingAdresse(null);
  };

  const handleVereinModalClose = () => {
    setIsVereinModalOpen(false);
  };

  // Yetkilendirme kontrolü - Adres
  const canEditAddress = (): boolean => {
    if (!user) return false;

    // Admin her şeyi yapabilir
    if (user.type === 'admin') return true;

    // Dernek yöneticisi sadece kendi derneğinin adreslerini düzenleyebilir
    if (user.type === 'dernek' && user.vereinId === Number(id)) return true;

    // Üyeler düzenleyemez
    return false;
  };

  // Yetkilendirme kontrolü - Dernek Bilgileri
  const canEditVerein = (): boolean => {
    if (!user) return false;

    // Admin her şeyi yapabilir
    if (user.type === 'admin') return true;

    // Dernek yöneticisi sadece kendi derneğini düzenleyebilir
    if (user.type === 'dernek' && user.vereinId === Number(id)) return true;

    // Üyeler düzenleyemez
    return false;
  };

  if (vereinLoading) {
    return <Loading text={t('common:status.loading')} />;
  }

  if (vereinError || !verein) {
    return (
      <ErrorMessage
        title={t('vereine:errors.loadFailed')}
        message={t('vereine:errors.vereinNotFound')}
        onRetry={() => refetchVerein()}
      />
    );
  }

  return (
    <div className="verein-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-button" onClick={handleBack}>
          ← {t('common:actions.back')}
        </button>
        <div className="header-content">
          <h1 className="verein-name">{verein.name}</h1>
          {verein.kurzname && (
            <span className="verein-kurzname">({verein.kurzname})</span>
          )}
          <div className="verein-status">
            <span className={`status-badge ${verein.aktiv ? 'active' : 'inactive'}`}>
              {verein.aktiv ? t('common:status.active') : t('common:status.inactive')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          {t('vereine:tabs.info')}
        </button>
        <button
          className={`tab-button ${activeTab === 'adressen' ? 'active' : ''}`}
          onClick={() => setActiveTab('adressen')}
        >
          {t('vereine:tabs.adressen')} ({adressen.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'mitglieder' ? 'active' : ''}`}
          onClick={() => setActiveTab('mitglieder')}
        >
          {t('vereine:tabs.mitglieder')} ({mitglieder.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="info-section">
            <div className="section-header">
              <h2>{t('vereine:tabs.info')}</h2>
              {canEditVerein() && (
                <button className="btn btn-primary" onClick={handleEditVerein}>
                  <EditIcon />
                  <span>{t('common:actions.edit')}</span>
                </button>
              )}
            </div>
            <div className="info-grid">
              {verein.email && (
                <div className="info-item">
                  <label>{t('vereine:fields.email')}</label>
                  <a href={`mailto:${verein.email}`}>{verein.email}</a>
                </div>
              )}
              {verein.telefon && (
                <div className="info-item">
                  <label>{t('vereine:fields.telefon')}</label>
                  <a href={`tel:${verein.telefon}`}>{verein.telefon}</a>
                </div>
              )}
              {verein.webseite && (
                <div className="info-item">
                  <label>{t('vereine:fields.webseite')}</label>
                  <a href={verein.webseite} target="_blank" rel="noopener noreferrer">
                    {verein.webseite}
                  </a>
                </div>
              )}
              {verein.vorstandsvorsitzender && (
                <div className="info-item">
                  <label>{t('vereine:fields.vorstandsvorsitzender')}</label>
                  <span>{verein.vorstandsvorsitzender}</span>
                </div>
              )}
              {verein.kontaktperson && (
                <div className="info-item">
                  <label>{t('vereine:fields.kontaktperson')}</label>
                  <span>{verein.kontaktperson}</span>
                </div>
              )}
              {verein.gruendungsdatum && (
                <div className="info-item">
                  <label>{t('vereine:fields.gruendungsdatum')}</label>
                  <span>{new Date(verein.gruendungsdatum).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            {verein.zweck && (
              <div className="info-item full-width">
                <label>{t('vereine:fields.zweck')}</label>
                <p>{verein.zweck}</p>
              </div>
            )}
          </div>
        )}

        {/* Adressen Tab */}
        {activeTab === 'adressen' && (
          <div className="adressen-section">
            <div className="section-header">
              <h2>{t('adressen:title')}</h2>
              {canEditAddress() && (
                <button className="btn btn-primary" onClick={handleAddAdresse}>
                  <PlusIcon />
                  <span>{t('adressen:addAddress')}</span>
                </button>
              )}
            </div>

            {adressenLoading ? (
              <Loading text={t('common:status.loading')} />
            ) : adressenError ? (
              <ErrorMessage
                message={t('adressen:errors.loadFailed')}
                onRetry={() => refetchAdressen()}
              />
            ) : adressen.length === 0 ? (
              <div className="empty-state">
                <p>{t('adressen:noAddresses')}</p>
              </div>
            ) : (
              <div className="adressen-list">
                {adressen.map((adresse) => (
                  <div key={adresse.id} className="adresse-card">
                    {adresse.istStandard && (
                      <span className="default-badge">{t('adressen:defaultAddress')}</span>
                    )}
                    <div className="adresse-content">
                      {adresseService.formatAddressMultiLine(adresse).map((line, index) => (
                        <div key={index} className="address-line">{line}</div>
                      ))}
                    </div>
                    {(adresse.telefonnummer || adresse.email) && (
                      <div className="adresse-contact">
                        {adresse.telefonnummer && (
                          <a href={`tel:${adresse.telefonnummer}`}>
                            📞 {adresse.telefonnummer}
                          </a>
                        )}
                        {adresse.email && (
                          <a href={`mailto:${adresse.email}`}>
                            ✉️ {adresse.email}
                          </a>
                        )}
                      </div>
                    )}
                    <div className="adresse-actions">
                      <a
                        href={adresseService.getGoogleMapsUrl(adresse)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        🗺️ {t('adressen:viewOnMap')}
                      </a>
                      {canEditAddress() && (
                        <>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditAdresse(adresse)}
                          >
                            {t('common:actions.edit')}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAdresse(adresse)}
                          >
                            {t('common:actions.delete')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mitglieder Tab */}
        {activeTab === 'mitglieder' && (
          <div className="mitglieder-section">
            <div className="section-header">
              <h2>{t('vereine:tabs.mitglieder')} ({mitglieder.length})</h2>
            </div>

            {mitgliederLoading && <Loading />}
            {mitgliederError && <ErrorMessage message={t('common:errors.loadFailed')} />}

            {!mitgliederLoading && !mitgliederError && mitglieder.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <UsersIcon />
                </div>
                <h3>{t('vereine:mitglieder.empty.title')}</h3>
                <p>{t('vereine:mitglieder.empty.message')}</p>
              </div>
            )}

            {!mitgliederLoading && !mitgliederError && mitglieder.length > 0 && (
              <div className="mitglieder-list">
                {mitglieder.map((mitglied) => (
                  <div key={mitglied.id} className="mitglied-card">
                    <div className="mitglied-card-header">
                      <div className="mitglied-avatar">
                        {mitglied.vorname?.[0]}{mitglied.nachname?.[0]}
                      </div>
                      <div className="mitglied-info">
                        <h3>{mitglied.vorname} {mitglied.nachname}</h3>
                        <p className="mitglied-number">#{mitglied.mitgliedsnummer}</p>
                      </div>
                    </div>
                    <div className="mitglied-card-body">
                      {mitglied.email && (
                        <div className="info-row">
                          <span className="info-label">{t('vereine:mitglieder.email')}:</span>
                          <span className="info-value">{mitglied.email}</span>
                        </div>
                      )}
                      {mitglied.telefon && (
                        <div className="info-row">
                          <span className="info-label">{t('vereine:mitglieder.telefon')}:</span>
                          <span className="info-value">{mitglied.telefon}</span>
                        </div>
                      )}
                    </div>
                    <div className="mitglied-card-footer">
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => navigate(`/mitglieder/${mitglied.id}`)}
                      >
                        <EyeIcon />
                        <span>{t('common:actions.view')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verein Form Modal */}
      {verein && (
        <VereinFormModal
          isOpen={isVereinModalOpen}
          onClose={handleVereinModalClose}
          onSubmit={handleVereinModalSubmit}
          verein={verein}
        />
      )}

      {/* Adresse Form Modal */}
      <AdresseFormModal
        isOpen={isAdresseModalOpen}
        onClose={handleAdresseModalClose}
        onSubmit={handleAdresseModalSubmit}
        adresse={editingAdresse}
        vereinId={Number(id)}
      />
    </div>
  );
};

export default VereinDetail;

