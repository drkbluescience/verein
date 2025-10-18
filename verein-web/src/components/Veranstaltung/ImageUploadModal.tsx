import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { veranstaltungBildService } from '../../services/veranstaltungService';
import { useToast } from '../../contexts/ToastContext';
import './ImageUploadModal.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  veranstaltungId: number;
}

// SVG Icons
const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, veranstaltungId }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titel, setTitel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (data: { file: File; titel?: string }) =>
      veranstaltungBildService.uploadImage(veranstaltungId, data.file, data.titel),
    onSuccess: () => {
      showToast('Resim başarıyla yüklendi', 'success');
      queryClient.invalidateQueries({ queryKey: ['veranstaltung-bilder', veranstaltungId] });
      handleClose();
    },
    onError: (error: any) => {
      showToast(error?.message || 'Resim yüklenirken hata oluştu', 'error');
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({ file: 'Sadece resim dosyaları yüklenebilir (JPEG, PNG, GIF, WebP)' });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors({ file: 'Dosya boyutu en fazla 5MB olabilir' });
      return;
    }

    setErrors({});
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: fileInputRef.current } as any);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrors({ file: 'Lütfen bir resim seçin' });
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      titel: titel.trim() || undefined,
    });
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitel('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="image-upload-modal modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📸 Resim Yükle</h2>
          <button className="modal-close" onClick={handleClose} disabled={uploadMutation.isPending}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* File Upload Area */}
            <div
              className={`upload-area ${selectedFile ? 'has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Önizleme" className="preview-image" />
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Resmi Değiştir
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <UploadIcon />
                  <p className="upload-text">Resim yüklemek için tıklayın veya sürükleyin</p>
                  <p className="upload-hint">JPEG, PNG, GIF, WebP (Max 5MB)</p>
                </div>
              )}
            </div>

            {errors.file && <p className="error-message">{errors.file}</p>}

            {/* Title Input */}
            <div className="form-group">
              <label htmlFor="titel">
                <ImageIcon />
                <span>Resim Başlığı (Opsiyonel)</span>
              </label>
              <input
                id="titel"
                type="text"
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                placeholder="Örn: Etkinlik açılış töreni"
                maxLength={100}
                disabled={uploadMutation.isPending}
              />
              <small className="form-hint">Resim için açıklayıcı bir başlık girin</small>
            </div>

            {/* File Info */}
            {selectedFile && (
              <div className="file-info">
                <p><strong>Dosya:</strong> {selectedFile.name}</p>
                <p><strong>Boyut:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                <p><strong>Tip:</strong> {selectedFile.type}</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Yükleniyor...' : 'Resmi Yükle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;

