import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { veranstaltungBildService } from '../../services/veranstaltungService';
import { VeranstaltungBildDto } from '../../types/veranstaltung';
import { useToast } from '../../contexts/ToastContext';
import ImageUploadModal from './ImageUploadModal';
import './ImageGallery.css';

// API Base URL for images
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5103';

interface ImageGalleryProps {
  veranstaltungId: number;
  canManage: boolean;
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
}

// SVG Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
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

const ImageGallery: React.FC<ImageGalleryProps> = ({
  veranstaltungId,
  canManage,
  viewMode = 'grid',
  onViewModeChange
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<VeranstaltungBildDto | null>(null);

  // Fetch images
  const {
    data: images,
    isLoading,
    error
  } = useQuery<VeranstaltungBildDto[]>({
    queryKey: ['veranstaltung-bilder', veranstaltungId],
    queryFn: () => veranstaltungBildService.getByVeranstaltungId(veranstaltungId),
    enabled: !!veranstaltungId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (bildId: number) => veranstaltungBildService.delete(bildId),
    onSuccess: () => {
      showToast('Resim başarıyla silindi', 'success');
      queryClient.invalidateQueries({ queryKey: ['veranstaltung-bilder', veranstaltungId] });
    },
    onError: (error: any) => {
      showToast(error?.message || 'Resim silinirken hata oluştu', 'error');
    },
  });

  const handleDelete = (bildId: number, titel?: string) => {
    if (window.confirm(`"${titel || 'Bu resmi'}" silmek istediğinize emin misiniz?`)) {
      deleteMutation.mutate(bildId);
    }
  };

  const handleImageClick = (image: VeranstaltungBildDto) => {
    setSelectedImage(image);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="image-gallery-loading">
        <div className="spinner"></div>
        <p>Resimler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-gallery-error">
        <p>Resimler yüklenirken hata oluştu</p>
      </div>
    );
  }

  const sortedImages = images?.sort((a: VeranstaltungBildDto, b: VeranstaltungBildDto) => (a.reihenfolge || 0) - (b.reihenfolge || 0)) || [];

  // Helper function to get full image URL
  const getImageUrl = (bildPfad: string) => {
    if (bildPfad.startsWith('http')) {
      return bildPfad;
    }
    return `${API_BASE_URL}${bildPfad}`;
  };

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h3>📸 {t('veranstaltungen:detailPage.imageGallery.title')} ({sortedImages.length})</h3>
        <div className="gallery-header-actions">
          {/* View Mode Toggle */}
          {sortedImages.length > 0 && onViewModeChange && (
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => onViewModeChange('grid')}
                title={t('veranstaltungen:detailPage.viewMode.grid')}
              >
                <GridIcon />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => onViewModeChange('table')}
                title={t('veranstaltungen:detailPage.viewMode.table')}
              >
                <TableIcon />
              </button>
            </div>
          )}
          {canManage && (
            <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
              <PlusIcon />
              <span>{t('veranstaltungen:detailPage.imageGallery.addImage')}</span>
            </button>
          )}
        </div>
      </div>

      {sortedImages.length === 0 ? (
        <div className="gallery-empty">
          <div className="empty-icon">
            <ImageIcon />
          </div>
          <h4>{t('veranstaltungen:detailPage.imageGallery.noImagesYet')}</h4>
          <p>{t('veranstaltungen:detailPage.imageGallery.noImagesForEvent')}</p>
          {canManage && (
            <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
              <PlusIcon />
              <span>{t('veranstaltungen:detailPage.imageGallery.addFirstImage')}</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="gallery-grid">
          {sortedImages.map((image: VeranstaltungBildDto) => (
            <div key={image.id} className="gallery-item">
              <div className="image-wrapper" onClick={() => handleImageClick(image)}>
                <img
                  src={getImageUrl(image.bildPfad)}
                  alt={image.titel || 'Etkinlik resmi'}
                  className="gallery-image"
                  onError={(e) => {
                    // Fallback for broken images
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EResim yüklenemedi%3C/text%3E%3C/svg%3E';
                  }}
                />
                {image.titel && (
                  <div className="image-overlay">
                    <p className="image-title">{image.titel}</p>
                  </div>
                )}
              </div>
              {canManage && (
                <div className="image-actions">
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id, image.titel);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="images-table-container">
          <table className="images-table">
            <thead>
              <tr>
                <th>{t('veranstaltungen:detailPage.imageTable.preview')}</th>
                <th>{t('veranstaltungen:detailPage.imageTable.title')}</th>
                <th>{t('veranstaltungen:detailPage.imageTable.uploadedOn')}</th>
                {canManage && <th>{t('veranstaltungen:detailPage.imageTable.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {sortedImages.map((image: VeranstaltungBildDto) => {
                const formatDate = (dateString?: string) => {
                  if (!dateString) return '-';
                  return new Date(dateString).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                };

                return (
                  <tr key={image.id}>
                    <td>
                      <div className="table-image-preview" onClick={() => handleImageClick(image)}>
                        <img
                          src={getImageUrl(image.bildPfad)}
                          alt={image.titel || 'Etkinlik resmi'}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect fill="%23ddd" width="80" height="60"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10"%3EX%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </td>
                    <td>{image.titel || '-'}</td>
                    <td>{formatDate(image.created)}</td>
                    {canManage && (
                      <td>
                        <button
                          className="btn-delete-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.id, image.titel);
                          }}
                          disabled={deleteMutation.isPending}
                          title={t('common:delete')}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {canManage && (
        <ImageUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          veranstaltungId={veranstaltungId}
        />
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="image-preview-modal" onClick={closeImagePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close" onClick={closeImagePreview}>×</button>
            <img
              src={getImageUrl(selectedImage.bildPfad)}
              alt={selectedImage.titel || 'Etkinlik resmi'}
              className="preview-image"
            />
            {selectedImage.titel && (
              <div className="preview-info">
                <h3>{selectedImage.titel}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

