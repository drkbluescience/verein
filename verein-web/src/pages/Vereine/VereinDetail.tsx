import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { vereinService } from '../../services/vereinService';
import { VereinDto } from '../../types/verein';
import adresseService, { Adresse, CreateAdresseDto, UpdateAdresseDto } from '../../services/adresseService';
import AdresseFormModal from '../../components/Adressen/AdresseFormModal';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './VereinDetail.css';

const VereinDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'adressen', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'adressen' | 'mitglieder'>('info');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Create Adresse Mutation
  const createAdresseMutation = useMutation({
    mutationFn: (data: CreateAdresseDto) => adresseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adressen', 'verein', id] });
      showSuccess(t('adressen:messages.createSuccess'));
      setIsModalOpen(false);
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
      setIsModalOpen(false);
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

  const handleAddAdresse = () => {
    setEditingAdresse(null);
    setIsModalOpen(true);
  };

  const handleEditAdresse = (adresse: Adresse) => {
    setEditingAdresse(adresse);
    setIsModalOpen(true);
  };

  const handleDeleteAdresse = async (adresse: Adresse) => {
    if (window.confirm(t('adressen:confirmations.deleteMessage'))) {
      deleteAdresseMutation.mutate(adresse.id);
    }
  };

  const handleModalSubmit = async (data: CreateAdresseDto | UpdateAdresseDto) => {
    if (editingAdresse) {
      // Update existing adresse
      await updateAdresseMutation.mutateAsync({ id: editingAdresse.id, data });
    } else {
      // Create new adresse
      await createAdresseMutation.mutateAsync(data as CreateAdresseDto);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAdresse(null);
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
          {t('vereine:tabs.mitglieder')}
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="info-section">
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
              <button className="btn btn-primary" onClick={handleAddAdresse}>
                + {t('adressen:addAddress')}
              </button>
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
            <p>{t('common:status.comingSoon')}</p>
          </div>
        )}
      </div>

      {/* Adresse Form Modal */}
      <AdresseFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        adresse={editingAdresse}
        vereinId={Number(id)}
      />
    </div>
  );
};

export default VereinDetail;

