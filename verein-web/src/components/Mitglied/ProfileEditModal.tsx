import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mitgliedService } from '../../services/mitgliedService';
import { MitgliedDto, UpdateMitgliedDto } from '../../types/mitglied';
import './ProfileEditModal.css';

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

  const [formData, setFormData] = useState({
    email: '',
    telefon: '',
    mobiltelefon: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mitglied) {
      setFormData({
        email: mitglied.email || '',
        telefon: mitglied.telefon || '',
        mobiltelefon: mitglied.mobiltelefon || ''
      });
    }
    setErrors({});
  }, [mitglied, isOpen]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMitgliedDto }) => 
      mitgliedService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglieder'] });
      queryClient.invalidateQueries({ queryKey: ['mitglied', mitglied.id] });
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

    const updateData: UpdateMitgliedDto = {
      id: mitglied.id,
      vereinId: mitglied.vereinId,
      mitgliedsnummer: mitglied.mitgliedsnummer,
      mitgliedStatusId: mitglied.mitgliedStatusId,
      mitgliedTypId: mitglied.mitgliedTypId,
      vorname: mitglied.vorname,
      nachname: mitglied.nachname,
      email: formData.email || undefined,
      telefon: formData.telefon || undefined,
      mobiltelefon: formData.mobiltelefon || undefined,
      // Keep all other fields unchanged
      geschlechtId: mitglied.geschlechtId,
      geburtsdatum: mitglied.geburtsdatum,
      geburtsort: mitglied.geburtsort,
      staatsangehoerigkeitId: mitglied.staatsangehoerigkeitId,
      eintrittsdatum: mitglied.eintrittsdatum,
      austrittsdatum: mitglied.austrittsdatum,
      bemerkung: mitglied.bemerkung,
      beitragBetrag: mitglied.beitragBetrag,
      beitragWaehrungId: mitglied.beitragWaehrungId,
      beitragPeriodeCode: mitglied.beitragPeriodeCode,
      beitragZahlungsTag: mitglied.beitragZahlungsTag,
      beitragZahlungstagTypCode: mitglied.beitragZahlungstagTypCode,
      beitragIstPflicht: mitglied.beitragIstPflicht,
      aktiv: mitglied.aktiv
    };

    updateMutation.mutate({ id: mitglied.id, data: updateData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (!isOpen) return null;

  const isLoading = updateMutation.isPending;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>İletişim Bilgilerini Düzenle</h2>
          <button className="profile-modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="profile-modal-form">
          <div className="profile-info-box">
            <p className="profile-info-text">
              Sadece iletişim bilgilerinizi güncelleyebilirsiniz. 
              Diğer bilgilerinizi değiştirmek için dernek yöneticinizle iletişime geçiniz.
            </p>
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              placeholder="ornek@email.com"
            />
            {errors.email && <span className="profile-error-message">{errors.email}</span>}
          </div>

          <div className="profile-form-group">
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

          <div className="profile-form-group">
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

          {errors.submit && (
            <div className="profile-error-box">{errors.submit}</div>
          )}

          <div className="profile-modal-footer">
            <button
              type="button"
              className="profile-btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="profile-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

