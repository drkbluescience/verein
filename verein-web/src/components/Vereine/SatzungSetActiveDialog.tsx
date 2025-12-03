import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VereinSatzungDto } from '../../types/vereinSatzung';
import { vereinSatzungService } from '../../services/vereinSatzungService';
import { useTranslation } from 'react-i18next';
import './SatzungSetActiveDialog.css';

interface SatzungSetActiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  satzung: VereinSatzungDto | null;
  onSuccess?: () => void;
}

const SatzungSetActiveDialog: React.FC<SatzungSetActiveDialogProps> = ({
  isOpen,
  onClose,
  satzung,
  onSuccess
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'common']);
  const queryClient = useQueryClient();

  const setActiveMutation = useMutation({
    mutationFn: (id: number) => vereinSatzungService.setActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereinSatzungen'] });
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      // Hata ToastContext üzerinden gösterilecek
    }
  });

  const handleSetActive = () => {
    if (satzung) {
      setActiveMutation.mutate(satzung.id);
    }
  };

  if (!isOpen || !satzung) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h2 className="dialog-title">{t('vereine:satzung.setActiveTitle')}</h2>
        
        <p className="dialog-message">
          <strong>{satzung.dosyaAdi || `Tüzük ${satzung.id}`}</strong> adlı tüzüğü aktif yapmak istediğinizden emin misiniz?
        </p>

        <p className="dialog-info">
          {t('vereine:satzung.setActiveInfo')}
        </p>

        <div className="dialog-footer">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={setActiveMutation.isPending}
          >
            {t('common:actions.cancel')}
          </button>
          <button
            className="btn-confirm"
            onClick={handleSetActive}
            disabled={setActiveMutation.isPending}
          >
            {setActiveMutation.isPending ? t('common:processing') : t('vereine:satzung.setActiveConfirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SatzungSetActiveDialog;