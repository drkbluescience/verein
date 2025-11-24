import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { veranstaltungService } from '../../services/veranstaltungService';
import keytableService from '../../services/keytableService';
import { VeranstaltungDto, CreateVeranstaltungDto, UpdateVeranstaltungDto } from '../../types/veranstaltung';
import { useAuth } from '../../contexts/AuthContext';
import './VeranstaltungFormModal.css';

// Register locales for date picker
registerLocale('de', de);
registerLocale('tr', tr);

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

  // Fetch Keytable data
  const { data: waehrungen = [] } = useQuery({
    queryKey: ['keytable', 'waehrungen'],
    queryFn: () => keytableService.getWaehrungen(),
    staleTime: 24 * 60 * 60 * 1000,
  });

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
    aktiv: true,
    // Recurring event fields
    istWiederholend: false,
    wiederholungTyp: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    wiederholungInterval: 1,
    wiederholungEnde: '',
    wiederholungTage: '',
    wiederholungMonatTag: undefined as number | undefined
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
        aktiv: veranstaltung.aktiv !== false,
        // Recurring event fields
        istWiederholend: veranstaltung.istWiederholend || false,
        wiederholungTyp: (veranstaltung.wiederholungTyp as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'weekly',
        wiederholungInterval: veranstaltung.wiederholungInterval || 1,
        wiederholungEnde: veranstaltung.wiederholungEnde ? veranstaltung.wiederholungEnde.split('T')[0] : '',
        wiederholungTage: veranstaltung.wiederholungTage || '',
        wiederholungMonatTag: veranstaltung.wiederholungMonatTag
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
        aktiv: true,
        // Recurring event fields
        istWiederholend: false,
        wiederholungTyp: 'weekly',
        wiederholungInterval: 1,
        wiederholungEnde: '',
        wiederholungTage: '',
        wiederholungMonatTag: undefined
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

  // Week days for recurring events
  const weekDays = [
    { value: 'Mon', label: 'Pazartesi' },
    { value: 'Tue', label: 'Salı' },
    { value: 'Wed', label: 'Çarşamba' },
    { value: 'Thu', label: 'Perşembe' },
    { value: 'Fri', label: 'Cuma' },
    { value: 'Sat', label: 'Cumartesi' },
    { value: 'Sun', label: 'Pazar' }
  ];

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

  const handleWeekDayToggle = (day: string) => {
    console.log('🔴 handleWeekDayToggle CALLED! Day:', day);
    console.log('🔴 Current wiederholungTage:', formData.wiederholungTage);

    const currentDays = formData.wiederholungTage
      ? formData.wiederholungTage.split(',').filter(d => d.trim() !== '')
      : [];

    console.log('🔴 currentDays:', currentDays);

    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];

    console.log('🔴 newDays:', newDays);
    console.log('🔴 newDays.join(","):', newDays.join(','));

    setFormData(prev => {
      const updated = { ...prev, wiederholungTage: newDays.join(',') };
      console.log('🔴 UPDATED formData.wiederholungTage:', updated.wiederholungTage);
      return updated;
    });

    console.log('🔴 handleWeekDayToggle FINISHED!');
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
      aktiv: formData.aktiv,
      // Recurring event fields
      istWiederholend: formData.istWiederholend,
      wiederholungTyp: formData.istWiederholend ? formData.wiederholungTyp : undefined,
      wiederholungInterval: formData.istWiederholend ? formData.wiederholungInterval : undefined,
      wiederholungEnde: formData.istWiederholend && formData.wiederholungEnde ? formData.wiederholungEnde : undefined,
      wiederholungTage: formData.istWiederholend && formData.wiederholungTage ? formData.wiederholungTage : undefined,
      wiederholungMonatTag: formData.istWiederholend && formData.wiederholungMonatTag ? formData.wiederholungMonatTag : undefined
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
            <h3>Temel Bilgiler</h3>
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
                <DatePicker
                  selected={formData.startdatum ? new Date(formData.startdatum) : null}
                  onChange={(date) => {
                    const dateStr = date ? date.toISOString().split('T')[0] : '';
                    setFormData(prev => ({ ...prev, startdatum: dateStr }));
                  }}
                  locale={i18n.language}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Başlangıç Tarihi"
                  className={`veranstaltung-date-picker ${errors.startdatum ? 'error' : ''}`}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
                {errors.startdatum && <span className="error-message">{errors.startdatum}</span>}
              </div>

              <div className="form-group">
                <label>Bitiş Tarihi</label>
                <DatePicker
                  selected={formData.enddatum ? new Date(formData.enddatum) : null}
                  onChange={(date) => {
                    const dateStr = date ? date.toISOString().split('T')[0] : '';
                    setFormData(prev => ({ ...prev, enddatum: dateStr }));
                  }}
                  locale={i18n.language}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Bitiş Tarihi"
                  className={`veranstaltung-date-picker ${errors.enddatum ? 'error' : ''}`}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
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
            <h3>Katılım Bilgileri</h3>
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
                <label>Fiyat</label>
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

              <div className="form-group">
                <label>Para Birimi</label>
                <select
                  name="waehrungId"
                  value={formData.waehrungId}
                  onChange={handleChange}
                  className={errors.waehrungId ? 'error' : ''}
                >
                  <option value="">Seçiniz</option>
                  {waehrungen.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
                {errors.waehrungId && <span className="error-message">{errors.waehrungId}</span>}
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

            {/* Recurring Event Section */}
            <div className="form-section">
              <h3>Tekrar Eden Etkinlik</h3>

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="istWiederholend"
                    checked={formData.istWiederholend}
                    onChange={handleChange}
                  />
                  <span>Bu etkinlik tekrar ediyor</span>
                </label>
              </div>

              {formData.istWiederholend && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tekrar Tipi *</label>
                      <select
                        name="wiederholungTyp"
                        value={formData.wiederholungTyp}
                        onChange={handleChange}
                      >
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="monthly">Aylık</option>
                        <option value="yearly">Yıllık</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Aralık</label>
                      <input
                        type="number"
                        name="wiederholungInterval"
                        value={formData.wiederholungInterval}
                        onChange={handleChange}
                        min="1"
                        max="365"
                      />
                      <small className="form-hint">
                        {formData.wiederholungTyp === 'daily' && 'Her kaç günde bir'}
                        {formData.wiederholungTyp === 'weekly' && 'Her kaç haftada bir'}
                        {formData.wiederholungTyp === 'monthly' && 'Her kaç ayda bir'}
                        {formData.wiederholungTyp === 'yearly' && 'Her kaç yılda bir'}
                      </small>
                    </div>
                  </div>

                  {formData.wiederholungTyp === 'weekly' && (
                    <div className="form-group">
                      <label>Hangi Günler</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                        {weekDays.map((day) => {
                          const selectedDays = formData.wiederholungTage
                            ? formData.wiederholungTage.split(',').filter(d => d.trim() !== '')
                            : [];
                          const isSelected = selectedDays.includes(day.value);
                          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

                          return (
                            <div
                              key={day.value}
                              onClick={() => handleWeekDayToggle(day.value)}
                              style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: isSelected
                                  ? '2px solid #3b82f6'
                                  : isDark
                                    ? '2px solid #4b5563'
                                    : '2px solid #d1d5db',
                                backgroundColor: isSelected
                                  ? '#3b82f6'
                                  : isDark
                                    ? '#1f2937'
                                    : '#ffffff',
                                color: isSelected
                                  ? '#ffffff'
                                  : isDark
                                    ? '#e5e7eb'
                                    : '#374151',
                                fontWeight: isSelected ? '600' : '500',
                                fontSize: '14px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                transition: 'all 0.2s ease',
                                minWidth: '100px',
                                textAlign: 'center'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = isDark ? '#6b7280' : '#9ca3af';
                                  e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f9fafb';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = isDark ? '#4b5563' : '#d1d5db';
                                  e.currentTarget.style.backgroundColor = isDark ? '#1f2937' : '#ffffff';
                                }
                              }}
                            >
                              {day.label}
                            </div>
                          );
                        })}
                      </div>
                      <small className="form-hint">
                        Etkinliğin tekrar edeceği günleri seçin
                      </small>
                    </div>
                  )}

                  {formData.wiederholungTyp === 'monthly' && (
                    <div className="form-group">
                      <label>Ayın Hangi Günü</label>
                      <input
                        type="number"
                        name="wiederholungMonatTag"
                        value={formData.wiederholungMonatTag || ''}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        placeholder="1-31"
                      />
                      <small className="form-hint">
                        Ayın kaçıncı günü (1-31)
                      </small>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Bitiş Tarihi (Opsiyonel)</label>
                    <DatePicker
                      selected={formData.wiederholungEnde ? new Date(formData.wiederholungEnde) : null}
                      onChange={(date) => {
                        const dateStr = date ? date.toISOString().split('T')[0] : '';
                        setFormData(prev => ({ ...prev, wiederholungEnde: dateStr }));
                      }}
                      locale={i18n.language}
                      dateFormat="dd.MM.yyyy"
                      placeholderText="Bitiş Tarihi"
                      className="veranstaltung-date-picker"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      minDate={formData.startdatum ? new Date(formData.startdatum) : undefined}
                      isClearable
                    />
                    <small className="form-hint">
                      Tekrarın ne zaman biteceği (boş bırakılırsa süresiz)
                    </small>
                  </div>
                </>
              )}
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

