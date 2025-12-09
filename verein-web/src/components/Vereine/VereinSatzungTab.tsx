import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { vereinSatzungService } from '../../services/vereinSatzungService';
import { VereinSatzungDto } from '../../types/vereinSatzung';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import SatzungSetActiveDialog from './SatzungSetActiveDialog';
import SatzungDeleteDialog from './SatzungDeleteDialog';
import SatzungViewerModal from './SatzungViewerModal';
import './VereinSatzungTab.css';

// Register locales for date picker
registerLocale('de', de);
registerLocale('tr', tr);

interface VereinSatzungTabProps {
  vereinId: number;
}

const VereinSatzungTab: React.FC<VereinSatzungTabProps> = ({ vereinId }) => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['vereine', 'common']);
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [satzungVom, setSatzungVom] = useState<Date | null>(null);
  const [setAsActive, setSetAsActive] = useState(true);
  const [bemerkung, setBemerkung] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSetActiveDialogOpen, setIsSetActiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [selectedSatzung, setSelectedSatzung] = useState<VereinSatzungDto | null>(null);

  // Fetch statute versions
  const { data: satzungen = [], isLoading } = useQuery({
    queryKey: ['vereinSatzungen', vereinId],
    queryFn: () => vereinSatzungService.getByVereinId(vereinId),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !satzungVom) {
        throw new Error('Dosya ve tarih gerekli');
      }
      const dateStr = satzungVom.toISOString().split('T')[0];
      return vereinSatzungService.uploadSatzung(
        vereinId,
        selectedFile,
        dateStr,
        setAsActive,
        bemerkung || undefined
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereinSatzungen', vereinId] });
      showSuccess(t('vereine:satzung.uploadSuccess'));
      setIsUploadModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      showError(error.message || t('vereine:satzung.uploadError'));
    },
  });

  // Set active mutation
  useMutation({
    mutationFn: (id: number) => vereinSatzungService.setActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereinSatzungen', vereinId] });
      showSuccess(t('vereine:satzung.setActiveSuccess'));
    },
    onError: () => {
      showError(t('vereine:satzung.setActiveError'));
    },
  });

  // Delete mutation
  useMutation({
    mutationFn: (id: number) => vereinSatzungService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereinSatzungen', vereinId] });
      showSuccess(t('vereine:satzung.deleteSuccess'));
    },
    onError: () => {
      showError(t('vereine:satzung.deleteError'));
    },
  });

  const resetForm = () => {
    setSelectedFile(null);
    setSatzungVom(null);
    setSetAsActive(true);
    setBemerkung('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedExtensions = ['.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        showError(t('vereine:satzung.invalidFileType'));
        return;
      }

      // Validate file size (max 10 MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showError(t('vereine:satzung.fileTooLarge'));
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (satzung: VereinSatzungDto) => {
    try {
      await vereinSatzungService.downloadSatzung(satzung.id, satzung.dosyaAdi);
      showSuccess(t('vereine:satzung.downloadSuccess'));
    } catch (error) {
      showError(t('vereine:satzung.downloadError'));
    }
  };

  const handleViewSatzung = (satzung: VereinSatzungDto) => {
    setSelectedSatzung(satzung);
    setIsViewerModalOpen(true);
  };

  const handleSetActive = (satzung: VereinSatzungDto) => {
    setSelectedSatzung(satzung);
    setIsSetActiveDialogOpen(true);
  };

  const handleDelete = (satzung: VereinSatzungDto) => {
    setSelectedSatzung(satzung);
    setIsDeleteDialogOpen(true);
  };

  const canEdit = user?.type === 'admin' || (user?.type === 'dernek' && user.vereinId === vereinId);

  if (isLoading) {
    return <div className="loading">{t('common:loading')}</div>;
  }

  return (
    <div className="satzung-tab">
      <div className="satzung-header">
        <h2>{t('vereine:satzung.title')}</h2>
        {canEdit && (
          <button className="btn-primary" onClick={() => setIsUploadModalOpen(true)}>
            + {t('vereine:satzung.uploadNew')}
          </button>
        )}
      </div>

      {satzungen.length === 0 ? (
        <div className="empty-state">
          <p>{t('vereine:satzung.noSatzungen')}</p>
        </div>
      ) : (
        <div className="satzung-list">
          {satzungen.map((satzung) => (
            <div key={satzung.id} className={`satzung-card ${satzung.aktiv ? 'active' : ''}`}>
              <div className="satzung-info" onClick={() => handleViewSatzung(satzung)} style={{ cursor: 'pointer' }}>
                <div className="satzung-header-row">
                  <h3>{satzung.dosyaAdi || `Tüzük ${satzung.id}`}</h3>
                  {satzung.aktiv && <span className="badge-active">{t('vereine:satzung.active')}</span>}
                </div>
                <p className="satzung-date">
                  {t('vereine:satzung.effectiveDate')}: {new Date(satzung.satzungVom).toLocaleDateString('tr-TR')}
                </p>
                {satzung.bemerkung && <p className="satzung-note">{satzung.bemerkung}</p>}
                {satzung.dosyaBoyutu && (
                  <p className="satzung-size">
                    {t('vereine:satzung.fileSize')}: {(satzung.dosyaBoyutu / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
              <div className="satzung-actions">
                <button className="btn-secondary" onClick={() => handleDownload(satzung)}>
                  {t('vereine:satzung.download')}
                </button>
                {canEdit && !satzung.aktiv && (
                  <button className="btn-secondary" onClick={() => handleSetActive(satzung)}>
                    {t('vereine:satzung.setActive')}
                  </button>
                )}
                {canEdit && (
                  <button className="btn-danger" onClick={() => handleDelete(satzung)}>
                    {t('common:actions.delete')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('vereine:satzung.uploadNew')}</h2>
              <button className="close-button" onClick={() => setIsUploadModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('vereine:satzung.selectFile')} *</label>
                <input type="file" accept=".doc,.docx" onChange={handleFileSelect} />
                {selectedFile && <p className="file-name">{selectedFile.name}</p>}
              </div>
              <div className="form-group">
                <label>{t('vereine:satzung.effectiveDate')} *</label>
                <DatePicker
                  selected={satzungVom}
                  onChange={(date) => setSatzungVom(date)}
                  locale={i18n.language}
                  dateFormat="dd.MM.yyyy"
                  placeholderText={t('vereine:satzung.effectiveDate')}
                  className="date-picker-input"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  maxDate={new Date()}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={setAsActive}
                    onChange={(e) => setSetAsActive(e.target.checked)}
                  />
                  {t('vereine:satzung.setAsActiveOnUpload')}
                </label>
              </div>
              <div className="form-group">
                <label>{t('vereine:satzung.notes')}</label>
                <textarea
                  value={bemerkung}
                  onChange={(e) => setBemerkung(e.target.value)}
                  rows={3}
                  placeholder={t('vereine:satzung.notesPlaceholder')}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsUploadModalOpen(false)}>
                {t('common:actions.cancel')}
              </button>
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={!selectedFile || !satzungVom || isUploading}
              >
                {isUploading ? t('common:uploading') : t('common:actions.upload')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Active Dialog */}
      <SatzungSetActiveDialog
        isOpen={isSetActiveDialogOpen}
        onClose={() => {
          setIsSetActiveDialogOpen(false);
          setSelectedSatzung(null);
        }}
        satzung={selectedSatzung}
        onSuccess={() => {
          setIsSetActiveDialogOpen(false);
          setSelectedSatzung(null);
          showSuccess(t('vereine:satzung.setActiveSuccess'));
        }}
      />

      {/* Delete Dialog */}
      <SatzungDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSatzung(null);
        }}
        satzung={selectedSatzung}
        onSuccess={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSatzung(null);
          showSuccess(t('vereine:satzung.deleteSuccess'));
        }}
      />

      {/* Satzung Viewer Modal */}
      <SatzungViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => {
          setIsViewerModalOpen(false);
          setSelectedSatzung(null);
        }}
        satzung={selectedSatzung}
      />
    </div>
  );
};

export default VereinSatzungTab;

