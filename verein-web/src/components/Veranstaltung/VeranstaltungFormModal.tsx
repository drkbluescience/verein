import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { veranstaltungService } from '../../services/veranstaltungService';
import { VeranstaltungDto, CreateVeranstaltungDto, UpdateVeranstaltungDto } from '../../types/veranstaltung';
import { useAuth } from '../../contexts/AuthContext';
import './VeranstaltungFormModal.css';

interface VeranstaltungFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  veranstaltung?: VeranstaltungDto | null;
  mode: 'create' | 'edit';
}

const VeranstaltungFormModal: React.FC<VeranstaltungFormModalProps> = ({
  isOpen,
  onClose,
  veranstaltung,
  mode
}) => {
  // @ts-ignore - i18next type definitions
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    titel: '',
    beschreibung: '',
    startdatum: '',
    enddatum: '',
    ort: '',
    maxTeilnehmer: '',
    preis: '',
    waehrungId: '',
    nurFuerMitglieder: false,
    anmeldeErforderlich: true,
    aktiv: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing veranstaltung data when editing
  useEffect(() => {
    if (mode === 'edit' && veranstaltung) {
      setFormData({
        titel: veranstaltung.titel || '',
        beschreibung: veranstaltung.beschreibung || '',
        startdatum: veranstaltung.startdatum ? veranstaltung.startdatum.split('T')[0] : '',
        enddatum: veranstaltung.enddatum ? veranstaltung.enddatum.split('T')[0] : '',
        ort: veranstaltung.ort || '',
        maxTeilnehmer: veranstaltung.maxTeilnehmer?.toString() || '',
        preis: veranstaltung.preis?.toString() || '',
        waehrungId: veranstaltung.waehrungId?.toString() || '',
        nurFuerMitglieder: veranstaltung.nurFuerMitglieder || false,
        anmeldeErforderlich: veranstaltung.anmeldeErforderlich !== false,
        aktiv: veranstaltung.aktiv !== false
      });
    } else {
      // Reset form for create mode
      setFormData({
        titel: '',
        beschreibung: '',
        startdatum: new Date().toISOString().split('T')[0],
        enddatum: '',
        ort: '',
        maxTeilnehmer: '',
        preis: '',
        waehrungId: '1',
        nurFuerMitglieder: false,
        anmeldeErforderlich: true,
        aktiv: true
      });
    }
    setErrors({});
  }, [mode, veranstaltung, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateVeranstaltungDto) => veranstaltungService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veranstaltungen'] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      setErrors({ submit: 'Etkinlik oluşturulurken bir hata oluştu.' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVeranstaltungDto }) => 
      veranstaltungService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veranstaltungen'] });
      queryClient.invalidateQueries({ queryKey: ['veranstaltung', veranstaltung?.id] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      setErrors({ submit: 'Etkinlik güncellenirken bir hata oluştu.' });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titel.trim()) {
      newErrors.titel = 'Başlık gereklidir';
    }

    if (!formData.startdatum) {
      newErrors.startdatum = 'Başlangıç tarihi gereklidir';
    }

    if (formData.enddatum && formData.startdatum) {
      const start = new Date(formData.startdatum);
      const end = new Date(formData.enddatum);
      if (end < start) {
        newErrors.enddatum = 'Bitiş tarihi başlangıç tarihinden önce olamaz';
      }
    }

    if (formData.maxTeilnehmer && parseInt(formData.maxTeilnehmer) < 0) {
      newErrors.maxTeilnehmer = 'Maksimum katılımcı sayısı negatif olamaz';
    }

    if (formData.preis && parseFloat(formData.preis) < 0) {
      newErrors.preis = 'Fiyat negatif olamaz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.vereinId) {
      setErrors({ submit: 'Dernek bilgisi bulunamadı' });
      return;
    }

    const submitData: CreateVeranstaltungDto | UpdateVeranstaltungDto = {
      vereinId: user.vereinId,
      titel: formData.titel.trim(),
      beschreibung: formData.beschreibung.trim() || undefined,
      startdatum: formData.startdatum,
      enddatum: formData.enddatum || undefined,
      ort: formData.ort.trim() || undefined,
      maxTeilnehmer: formData.maxTeilnehmer ? parseInt(formData.maxTeilnehmer) : undefined,
      preis: formData.preis ? parseFloat(formData.preis) : undefined,
      waehrungId: formData.waehrungId ? parseInt(formData.waehrungId) : undefined,
      nurFuerMitglieder: formData.nurFuerMitglieder,
      anmeldeErforderlich: formData.anmeldeErforderlich,
      aktiv: formData.aktiv
    };

    if (mode === 'create') {
      createMutation.mutate(submitData as CreateVeranstaltungDto);
    } else if (veranstaltung) {
      updateMutation.mutate({ id: veranstaltung.id, data: submitData });
    }
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const getModalTitle = () => {
    if (mode === 'create') return 'Yeni Etkinlik Ekle';
    return 'Etkinlik Bilgilerini Düzenle';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content veranstaltung-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message-box">{errors.submit}</div>
          )}

          {/* Temel Bilgiler */}
          <div className="form-section">
            <h3 className="section-title">Temel Bilgiler</h3>
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Başlık *</label>
                <input
                  type="text"
                  name="titel"
                  value={formData.titel}
                  onChange={handleChange}
                  className={errors.titel ? 'error' : ''}
                  placeholder="Etkinlik başlığı"
                />
                {errors.titel && <span className="error-message">{errors.titel}</span>}
              </div>

              <div className="form-group form-group-full">
                <label>Açıklama</label>
                <textarea
                  name="beschreibung"
                  value={formData.beschreibung}
                  onChange={handleChange}
                  placeholder="Etkinlik açıklaması"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Başlangıç Tarihi *</label>
                <input
                  type="date"
                  name="startdatum"
                  value={formData.startdatum}
                  onChange={handleChange}
                  className={errors.startdatum ? 'error' : ''}
                  lang={i18n.language}
                />
                {errors.startdatum && <span className="error-message">{errors.startdatum}</span>}
              </div>

              <div className="form-group">
                <label>Bitiş Tarihi</label>
                <input
                  type="date"
                  name="enddatum"
                  value={formData.enddatum}
                  onChange={handleChange}
                  className={errors.enddatum ? 'error' : ''}
                  lang={i18n.language}
                />
                {errors.enddatum && <span className="error-message">{errors.enddatum}</span>}
              </div>

              <div className="form-group form-group-full">
                <label>Yer</label>
                <input
                  type="text"
                  name="ort"
                  value={formData.ort}
                  onChange={handleChange}
                  placeholder="Etkinlik yeri"
                />
              </div>
            </div>
          </div>

          {/* Katılım Bilgileri */}
          <div className="form-section">
            <h3 className="section-title">Katılım Bilgileri</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Maksimum Katılımcı</label>
                <input
                  type="number"
                  name="maxTeilnehmer"
                  value={formData.maxTeilnehmer}
                  onChange={handleChange}
                  className={errors.maxTeilnehmer ? 'error' : ''}
                  placeholder="Sınırsız"
                  min="0"
                />
                {errors.maxTeilnehmer && <span className="error-message">{errors.maxTeilnehmer}</span>}
              </div>

              <div className="form-group">
                <label>Fiyat (€)</label>
                <input
                  type="number"
                  name="preis"
                  value={formData.preis}
                  onChange={handleChange}
                  className={errors.preis ? 'error' : ''}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.preis && <span className="error-message">{errors.preis}</span>}
              </div>
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="nurFuerMitglieder"
                  checked={formData.nurFuerMitglieder}
                  onChange={handleChange}
                />
                <span>Sadece Üyeler İçin</span>
              </label>
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="anmeldeErforderlich"
                  checked={formData.anmeldeErforderlich}
                  onChange={handleChange}
                />
                <span>Kayıt Gerekli</span>
              </label>
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="aktiv"
                  checked={formData.aktiv}
                  onChange={handleChange}
                />
                <span>Aktif</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : mode === 'create' ? 'Oluştur' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VeranstaltungFormModal;

