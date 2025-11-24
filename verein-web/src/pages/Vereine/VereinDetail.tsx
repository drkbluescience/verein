import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { vereinService } from '../../services/vereinService';
import { VereinDto, UpdateVereinDto } from '../../types/verein';
import { mitgliedService } from '../../services/mitgliedService';
import { MitgliedDto } from '../../types/mitglied';
import { rechtlicheDatenService } from '../../services/rechtlicheDatenService';
import { UpdateRechtlicheDatenDto } from '../../types/rechtlicheDaten';
import VereinFormModal from '../../components/Vereine/VereinFormModal';
import RechtlicheDatenDetails from '../../components/Vereine/RechtlicheDatenDetails';
import SocialMediaLinks from '../../components/Vereine/SocialMediaLinks';
import VereinSatzungTab from '../../components/Vereine/VereinSatzungTab';
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

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const TableIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
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
  const [activeTab, setActiveTab] = useState<'info' | 'adresse' | 'mitglieder' | 'satzung'>('info');
  const [mitgliederViewMode, setMitgliederViewMode] = useState<'grid' | 'table'>('grid');
  const [isVereinModalOpen, setIsVereinModalOpen] = useState(false);

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

  // Update Donation Permission Mutation
  const updateDonationPermissionMutation = useMutation({
    mutationFn: (enabled: boolean) => {
      if (!verein?.rechtlicheDaten?.id) {
        throw new Error('RechtlicheDaten not found');
      }
      const updateData: UpdateRechtlicheDatenDto = {
        gemeinnuetzigAnerkannt: enabled
      };
      return rechtlicheDatenService.update(verein.rechtlicheDaten.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verein', id] });
      showSuccess(t('vereine:messages.donationPermissionUpdated'));
    },
    onError: () => {
      showError(t('vereine:errors.donationPermissionUpdateFailed'));
    },
  });

  // Determine back navigation based on user type
  const handleBack = () => {
    if (user?.type === 'admin') {
      navigate('/vereine');
    } else {
      navigate('/startseite');
    }
  };

  const handleToggleDonationPermission = (enabled: boolean) => {
    updateDonationPermissionMutation.mutate(enabled);
  };

  const handleEditVerein = () => {
    setIsVereinModalOpen(true);
  };

  const handleVereinModalSubmit = async (data: UpdateVereinDto) => {
    await updateVereinMutation.mutateAsync(data);
  };

  const handleVereinModalClose = () => {
    setIsVereinModalOpen(false);
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
      <div className="page-header">
        <h1 className="page-title">
          {verein.name}
          {verein.kurzname && <span className="verein-kurzname"> ({verein.kurzname})</span>}
        </h1>
        <div className="verein-status">
          <span className={`status-badge ${verein.aktiv ? 'active' : 'inactive'}`}>
            {verein.aktiv ? t('common:status.active') : t('common:status.inactive')}
          </span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user?.type !== 'dernek' && (
          <button
            className="btn-icon"
            onClick={handleBack}
            title={t('common:actions.back')}
          >
            <BackIcon />
          </button>
        )}
        <div style={{ flex: 1 }}></div>
        {canEditVerein() && activeTab === 'info' && (
          <button className="btn btn-primary" onClick={handleEditVerein}>
            <EditIcon />
            <span>{t('common:actions.edit')}</span>
          </button>
        )}
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
          className={`tab-button ${activeTab === 'adresse' ? 'active' : ''}`}
          onClick={() => setActiveTab('adresse')}
        >
          {t('vereine:tabs.adresse')}
        </button>
        <button
          className={`tab-button ${activeTab === 'mitglieder' ? 'active' : ''}`}
          onClick={() => setActiveTab('mitglieder')}
        >
          {t('vereine:tabs.mitglieder')} ({mitglieder.length})
        </button>
        {(user?.type === 'admin' || (user?.type === 'dernek' && user.vereinId === Number(id))) && (
          <button
            className={`tab-button ${activeTab === 'satzung' ? 'active' : ''}`}
            onClick={() => setActiveTab('satzung')}
          >
            {t('vereine:tabs.satzung')}
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="info-section">
            <div className="section-header">
              <h2>{t('vereine:tabs.info')}</h2>
            </div>

            {/* Amaç - En Üstte */}
            {verein.zweck && (
              <div className="info-item full-width" style={{ marginBottom: '2rem' }}>
                <label>{t('vereine:fields.zweck')}</label>
                <p>{verein.zweck}</p>
              </div>
            )}

            <div className="info-grid">
              <div className="info-item">
                <label>{t('vereine:fields.email')}</label>
                {verein.email ? (
                  <a href={`mailto:${verein.email}`}>{verein.email}</a>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.telefon')}</label>
                {verein.telefon ? (
                  <a href={`tel:${verein.telefon}`}>{verein.telefon}</a>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.fax')}</label>
                <span>{verein.fax || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.webseite')}</label>
                {verein.webseite ? (
                  <a href={verein.webseite} target="_blank" rel="noopener noreferrer">
                    {verein.webseite}
                  </a>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.vorstandsvorsitzender')}</label>
                <span>{verein.vorstandsvorsitzender || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.geschaeftsfuehrer')}</label>
                <span>{verein.geschaeftsfuehrer || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.kontaktperson')}</label>
                <span>{verein.kontaktperson || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.vertreterEmail')}</label>
                {verein.vertreterEmail ? (
                  <a href={`mailto:${verein.vertreterEmail}`}>{verein.vertreterEmail}</a>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.gruendungsdatum')}</label>
                <span>
                  {verein.gruendungsdatum
                    ? new Date(verein.gruendungsdatum).toLocaleDateString()
                    : '-'}
                </span>
              </div>
            </div>

            {/* Sosyal Medya Linkleri */}
            <div className="info-item full-width">
              <label>{t('vereine:fields.socialMedia')}</label>
              {verein.socialMediaLinks ? (
                <SocialMediaLinks socialMediaLinks={verein.socialMediaLinks} />
              ) : (
                <span className="text-muted">-</span>
              )}
            </div>

            {/* Yasal Bilgiler - Admin ve Dernek Yöneticisi için */}
            {(user?.type === 'admin' || (user?.type === 'dernek' && user.vereinId === Number(id))) && (
              <div className="legal-info-section">
                <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {t('vereine:legal.title')}
                </h2>
                {verein.rechtlicheDaten ? (
                  <RechtlicheDatenDetails
                    rechtlicheDaten={verein.rechtlicheDaten}
                    editable={user?.type === 'dernek' && user.vereinId === Number(id)}
                    onToggleDonationPermission={handleToggleDonationPermission}
                  />
                ) : (
                  <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    <p>{t('vereine:legal.noData')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Adresse Tab */}
        {activeTab === 'adresse' && (
          <div className="info-section">
            <div className="section-header">
              <h2>{t('vereine:tabs.adresse')}</h2>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>{t('vereine:fields.strasse')}</label>
                <span>{verein.hauptAdresse?.strasse || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.hausnummer')}</label>
                <span>{verein.hauptAdresse?.hausnummer || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.plz')}</label>
                <span>{verein.hauptAdresse?.plz || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.ort')}</label>
                <span>{verein.hauptAdresse?.ort || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.bundesland')}</label>
                <span>{verein.hauptAdresse?.bundesland || '-'}</span>
              </div>

              <div className="info-item">
                <label>{t('vereine:fields.land')}</label>
                <span>{verein.hauptAdresse?.land || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Mitglieder Tab */}
        {activeTab === 'mitglieder' && (
          <div className="mitglieder-section">
            <div className="section-header">
              <h2>{t('vereine:tabs.mitglieder')} ({mitglieder.length})</h2>
              {mitglieder.length > 0 && (
                <div className="view-toggle">
                  <button
                    className={`view-toggle-btn ${mitgliederViewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setMitgliederViewMode('grid')}
                    title={t('vereine:mitglieder.gridView')}
                  >
                    <GridIcon />
                  </button>
                  <button
                    className={`view-toggle-btn ${mitgliederViewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setMitgliederViewMode('table')}
                    title={t('vereine:mitglieder.tableView')}
                  >
                    <TableIcon />
                  </button>
                </div>
              )}
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
              mitgliederViewMode === 'grid' ? (
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
              ) : (
                <div className="mitglieder-table-container">
                  <table className="mitglieder-table">
                    <thead>
                      <tr>
                        <th>Ad Soyad</th>
                        <th>Üye No</th>
                        <th>E-posta</th>
                        <th>Telefon</th>
                        <th>Giriş Tarihi</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mitglieder.map((mitglied) => (
                        <tr key={mitglied.id} onClick={() => navigate(`/mitglieder/${mitglied.id}`)}>
                          <td>
                            <div className="table-name-cell">
                              <strong>{mitglied.vorname} {mitglied.nachname}</strong>
                            </div>
                          </td>
                          <td>{mitglied.mitgliedsnummer || '-'}</td>
                          <td>{mitglied.email || '-'}</td>
                          <td>{mitglied.telefon || '-'}</td>
                          <td>{mitglied.eintrittsdatum ? new Date(mitglied.eintrittsdatum).toLocaleDateString('de-DE') : '-'}</td>
                          <td>
                            <span className={`status-badge ${mitglied.aktiv ? 'status-active' : 'status-inactive'}`}>
                              {mitglied.aktiv ? t('vereine:mitglieder.statusActive') : t('vereine:mitglieder.statusInactive')}
                            </span>
                          </td>
                          <td>
                            <button
                              className="table-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/mitglieder/${mitglied.id}`);
                              }}
                              title="Detayları Görüntüle"
                            >
                              <EyeIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

        {/* Satzung Tab */}
        {activeTab === 'satzung' && (
          <VereinSatzungTab vereinId={Number(id)} />
        )}
      </div>

      {/* Verein Form Modal */}
      {verein && (
        <VereinFormModal
          isOpen={isVereinModalOpen}
          onClose={handleVereinModalClose}
          onSubmit={handleVereinModalSubmit}
          verein={verein}
          mode="edit"
        />
      )}
    </div>
  );
};

export default VereinDetail;