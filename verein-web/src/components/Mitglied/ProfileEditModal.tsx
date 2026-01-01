import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mitgliedService } from '../../services/mitgliedService';
import keytableService from '../../services/keytableService';
import { MitgliedDto, UpdateMitgliedSelfDto } from '../../types/mitglied';
import Modal from '../Common/Modal';
import styles from './ProfileEditModal.module.css';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mitglied: MitgliedDto;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  mitglied
}) => {
  const queryClient = useQueryClient();

  const { data: beitragPerioden = [] } = useQuery({
    queryKey: ['keytable', 'beitragperioden'],
    queryFn: () => keytableService.getBeitragPerioden(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    email: '',
    telefon: '',
    mobiltelefon: '',
    beitragPeriodeCode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mitglied) {
      setFormData({
        email: mitglied.email || '',
        telefon: mitglied.telefon || '',
        mobiltelefon: mitglied.mobiltelefon || '',
        beitragPeriodeCode: mitglied.beitragPeriodeCode || ''
      });
    }
    setErrors({});
  }, [mitglied, isOpen]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMitgliedSelfDto }) => 
      mitgliedService.updateSelf(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglieder'] });
      queryClient.invalidateQueries({ queryKey: ['mitglied', mitglied.id] });
      queryClient.invalidateQueries({ queryKey: ['mitglied-profile', mitglied.id] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      setErrors({ submit: 'Bilgiler güncellenirken bir hata oluştu.' });
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updateData: UpdateMitgliedSelfDto = {
      email: formData.email || undefined,
      telefon: formData.telefon || undefined,
      mobiltelefon: formData.mobiltelefon || undefined,
      beitragPeriodeCode: formData.beitragPeriodeCode || undefined
    };

    updateMutation.mutate({ id: mitglied.id, data: updateData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isLoading = updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="İletişim Bilgilerini Düzenle"
      size="md"
      closeOnOverlayClick={!isLoading}
      footer={
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={isLoading}
          >
            İptal
          </button>
          <button
            type="submit"
            form="profile-form"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? 'Kaydediliyor...' : 'Güncelle'}
          </button>
        </div>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              Iletisim bilgilerinizi ve odeme periyodunuzu guncelleyebilirsiniz.
              Diger bilgilerinizi degistirmek icin dernek yoneticinizle iletisime geciniz.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
              disabled={isLoading}
              placeholder="ornek@email.com"
            />
            {errors.email && <span className="profile-error-message">{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefon">Telefon</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="+49 123 456789"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mobiltelefon">Mobil Telefon</label>
            <input
              type="tel"
              id="mobiltelefon"
              name="mobiltelefon"
              value={formData.mobiltelefon}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="+49 123 456789"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="beitragPeriodeCode">Ödeme Periyodu</label>
            <select
              id="beitragPeriodeCode"
              name="beitragPeriodeCode"
              value={formData.beitragPeriodeCode}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              {beitragPerioden.map((period) => (
                <option key={period.code} value={period.code}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          {errors.submit && (
            <div className="profile-error-box">{errors.submit}</div>
          )}

        </form>
    </Modal>
  );
};

export default ProfileEditModal;
