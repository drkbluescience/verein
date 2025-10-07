import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mitgliedService } from '../../services/mitgliedService';
import { MitgliedDto } from '../../types/mitglied';
import './DeleteConfirmDialog.css';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mitglied: MitgliedDto | null;
  onSuccess?: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  mitglied,
  onSuccess
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mitgliedService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglieder'] });
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      alert('Üye silinirken bir hata oluştu.');
    }
  });

  const handleDelete = () => {
    if (mitglied) {
      deleteMutation.mutate(mitglied.id);
    }
  };

  if (!isOpen || !mitglied) return null;

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

        <h2 className="dialog-title">Üyeyi Sil</h2>
        
        <p className="dialog-message">
          <strong>{mitglied.vorname} {mitglied.nachname}</strong> adlı üyeyi silmek istediğinizden emin misiniz?
        </p>

        <p className="dialog-warning">
          Bu işlem geri alınamaz ve üyenin tüm bilgileri silinecektir.
        </p>

        <div className="dialog-footer">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            İptal
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Siliniyor...' : 'Evet, Sil'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;

