/**
 * Verein DITIB Zahlung Form Modal
 * Create/Edit DITIB payment
 */

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { vereinDitibZahlungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import { CreateVereinDitibZahlungDto, UpdateVereinDitibZahlungDto, VereinDitibZahlungDto } from '../../types/finanz.types';
import styles from './FinanzFormModal.module.css';

interface VereinDitibZahlungFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  zahlung?: VereinDitibZahlungDto | null;
}

const VereinDitibZahlungFormModal: React.FC<VereinDitibZahlungFormModalProps> = ({
  isOpen,
  onClose,
  zahlung,
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateVereinDitibZahlungDto>({
    vereinId: user?.type === 'dernek' ? user.vereinId! : 0,
    betrag: 0,
    waehrungId: 1, // EUR
    zahlungsdatum: new Date().toISOString().split('T')[0],
    zahlungsperiode: new Date().toISOString().slice(0, 7), // YYYY-MM
    statusId: 2, // OFFEN
  });

  // Fetch Vereine (for Admin)
  const { data: vereine = [] } = useQuery({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  useEffect(() => {
    if (zahlung) {
      setFormData({
        vereinId: zahlung.vereinId,
        betrag: zahlung.betrag,
        waehrungId: zahlung.waehrungId,
        zahlungsdatum: zahlung.zahlungsdatum.split('T')[0],
        zahlungsperiode: zahlung.zahlungsperiode,
        zahlungsweg: zahlung.zahlungsweg,
        bankkontoId: zahlung.bankkontoId,
        referenz: zahlung.referenz,
        bemerkung: zahlung.bemerkung,
        statusId: zahlung.statusId,
        bankBuchungId: zahlung.bankBuchungId,
      });
    }
  }, [zahlung]);

  const createMutation = useMutation({
    mutationFn: (data: CreateVereinDitibZahlungDto) => vereinDitibZahlungService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ditibZahlungen'] });
      onClose();
      alert('DITIB ödemesi başarıyla oluşturuldu');
    },
    onError: (error: any) => {
      alert(`Hata: ${error.message || 'Ödeme oluşturulamadı'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateVereinDitibZahlungDto) => {
      if (!zahlung?.id) throw new Error('ID not found');
      return vereinDitibZahlungService.update(zahlung.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ditibZahlungen'] });
      queryClient.invalidateQueries({ queryKey: ['ditibZahlung', zahlung?.id] });
      onClose();
      alert('DITIB ödemesi başarıyla güncellendi');
    },
    onError: (error: any) => {
      alert(`Hata: ${error.message || 'Ödeme güncellenemedi'}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.vereinId === 0) {
      alert('Lütfen bir dernek seçin');
      return;
    }

    if (formData.betrag <= 0) {
      alert('Lütfen geçerli bir tutar girin');
      return;
    }

    if (zahlung) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{zahlung ? 'DITIB Ödemesi Düzenle' : 'Yeni DITIB Ödemesi'}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Verein Selection (Admin only) */}
            {user?.type === 'admin' && (
              <div className={styles.formGroup}>
                <label>Dernek *</label>
                <select
                  value={formData.vereinId}
                  onChange={(e) => setFormData({ ...formData, vereinId: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Dernek Seçin</option>
                  {vereine.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount */}
            <div className={styles.formGroup}>
              <label>Tutar (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.betrag}
                onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) })}
                required
              />
            </div>

            {/* Payment Date */}
            <div className={styles.formGroup}>
              <label>Ödeme Tarihi *</label>
              <input
                type="date"
                value={formData.zahlungsdatum}
                onChange={(e) => setFormData({ ...formData, zahlungsdatum: e.target.value })}
                required
              />
            </div>

            {/* Payment Period */}
            <div className={styles.formGroup}>
              <label>Ödeme Dönemi *</label>
              <input
                type="month"
                value={formData.zahlungsperiode}
                onChange={(e) => setFormData({ ...formData, zahlungsperiode: e.target.value })}
                required
              />
            </div>

            {/* Payment Method */}
            <div className={styles.formGroup}>
              <label>Ödeme Yolu</label>
              <select
                value={formData.zahlungsweg || ''}
                onChange={(e) => setFormData({ ...formData, zahlungsweg: e.target.value || undefined })}
              >
                <option value="">Seçin</option>
                <option value="Überweisung">Überweisung (Havale)</option>
                <option value="Lastschrift">Lastschrift (Otomatik Ödeme)</option>
                <option value="Bar">Bar (Nakit)</option>
                <option value="Scheck">Scheck (Çek)</option>
              </select>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label>Durum *</label>
              <select
                value={formData.statusId}
                onChange={(e) => setFormData({ ...formData, statusId: Number(e.target.value) })}
                required
              >
                <option value={1}>Ödendi</option>
                <option value={2}>Bekliyor</option>
              </select>
            </div>

            {/* Reference */}
            <div className={styles.formGroup}>
              <label>Referans No</label>
              <input
                type="text"
                value={formData.referenz || ''}
                onChange={(e) => setFormData({ ...formData, referenz: e.target.value || undefined })}
                maxLength={100}
              />
            </div>

            {/* Notes */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Not</label>
              <textarea
                value={formData.bemerkung || ''}
                onChange={(e) => setFormData({ ...formData, bemerkung: e.target.value || undefined })}
                rows={3}
                maxLength={250}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              İptal
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VereinDitibZahlungFormModal;

