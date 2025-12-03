import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VereinSatzungDto } from '../../types/vereinSatzung';
import { vereinSatzungService } from '../../services/vereinSatzungService';
import { useTranslation } from 'react-i18next';
import './SatzungDeleteDialog.css';

interface SatzungDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  satzung: VereinSatzungDto | null;
  onSuccess?: () => void;
}

const SatzungDeleteDialog: React.FC<SatzungDeleteDialogProps> = ({
  isOpen,
  onClose,
  satzung,
  onSuccess
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'common']);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vereinSatzungService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereinSatzungen'] });
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      // Hata ToastContext üzerinden gösterilecek
    }
  });

  const handleDelete = () => {
    if (satzung) {
      deleteMutation.mutate(satzung.id);
    }
  };

  if (!isOpen || !satzung) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon-warning">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h2 className="dialog-title">{t('vereine:satzung.deleteTitle')}</h2>
        
        <p className="dialog-message">
          <strong>{satzung.dosyaAdi || `Tüzük ${satzung.id}`}</strong> adlı tüzüğü silmek istediğinizden emin misiniz?
        </p>

        <p className="dialog-warning">
          {t('vereine:satzung.deleteWarning')}
        </p>

        <div className="dialog-footer">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            {t('common:actions.cancel')}
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? t('common:processing') : t('common:actions.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SatzungDeleteDialog;