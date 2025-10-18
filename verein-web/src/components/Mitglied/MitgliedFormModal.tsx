import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mitgliedService } from '../../services/mitgliedService';
import { MitgliedDto, CreateMitgliedDto, UpdateMitgliedDto } from '../../types/mitglied';
import { useAuth } from '../../contexts/AuthContext';
import './MitgliedFormModal.css';

interface MitgliedFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mitglied?: MitgliedDto | null;
  mode: 'create' | 'edit';
}

const MitgliedFormModal: React.FC<MitgliedFormModalProps> = ({
  isOpen,
  onClose,
  mitglied,
  mode
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    // Kişisel Bilgiler
    vorname: '',
    nachname: '',
    geschlechtId: '',
    geburtsdatum: '',
    geburtsort: '',
    staatsangehoerigkeitId: '',

    // İletişim Bilgileri
    email: '',
    telefon: '',
    mobiltelefon: '',

    // Üyelik Bilgileri
    mitgliedStatusId: '1',
    mitgliedTypId: '1',
    eintrittsdatum: '',
    austrittsdatum: '',
    aktiv: true,

    // Aidat Bilgileri
    beitragBetrag: '',
    beitragWaehrungId: '',
    beitragPeriodeCode: '',
    beitragZahlungsTag: '',
    beitragZahlungstagTypCode: '',
    beitragIstPflicht: false,

    // Notlar
    bemerkung: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && mitglied) {
      setFormData({
        // Kişisel Bilgiler
        vorname: mitglied.vorname,
        nachname: mitglied.nachname,
        geschlechtId: mitglied.geschlechtId?.toString() || '',
        geburtsdatum: mitglied.geburtsdatum ? mitglied.geburtsdatum.split('T')[0] : '',
        geburtsort: mitglied.geburtsort || '',
        staatsangehoerigkeitId: mitglied.staatsangehoerigkeitId?.toString() || '',

        // İletişim Bilgileri
        email: mitglied.email || '',
        telefon: mitglied.telefon || '',
        mobiltelefon: mitglied.mobiltelefon || '',

        // Üyelik Bilgileri
        mitgliedStatusId: mitglied.mitgliedStatusId.toString(),
        mitgliedTypId: mitglied.mitgliedTypId.toString(),
        eintrittsdatum: mitglied.eintrittsdatum ? mitglied.eintrittsdatum.split('T')[0] : '',
        austrittsdatum: mitglied.austrittsdatum ? mitglied.austrittsdatum.split('T')[0] : '',
        aktiv: mitglied.aktiv !== false,

        // Aidat Bilgileri
        beitragBetrag: mitglied.beitragBetrag?.toString() || '',
        beitragWaehrungId: mitglied.beitragWaehrungId?.toString() || '',
        beitragPeriodeCode: mitglied.beitragPeriodeCode || '',
        beitragZahlungsTag: mitglied.beitragZahlungsTag?.toString() || '',
        beitragZahlungstagTypCode: mitglied.beitragZahlungstagTypCode || '',
        beitragIstPflicht: mitglied.beitragIstPflicht || false,

        // Notlar
        bemerkung: mitglied.bemerkung || ''
      });
    } else {
      // Reset form for create mode
      setFormData({
        vorname: '',
        nachname: '',
        geschlechtId: '',
        geburtsdatum: '',
        geburtsort: '',
        staatsangehoerigkeitId: '',
        email: '',
        telefon: '',
        mobiltelefon: '',
        mitgliedStatusId: '1',
        mitgliedTypId: '1',
        eintrittsdatum: new Date().toISOString().split('T')[0],
        austrittsdatum: '',
        aktiv: true,
        beitragBetrag: '',
        beitragWaehrungId: '',
        beitragPeriodeCode: '',
        beitragZahlungsTag: '',
        beitragZahlungstagTypCode: '',
        beitragIstPflicht: false,
        bemerkung: ''
      });
    }
    setErrors({});
  }, [mode, mitglied, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateMitgliedDto) => mitgliedService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglieder'] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      setErrors({ submit: 'Üye oluşturulurken bir hata oluştu.' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMitgliedDto }) => 
      mitgliedService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglieder'] });
      queryClient.invalidateQueries({ queryKey: ['mitglied', mitglied?.id] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      setErrors({ submit: 'Üye güncellenirken bir hata oluştu.' });
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vorname.trim()) {
      newErrors.vorname = 'Ad zorunludur';
    }
    if (!formData.nachname.trim()) {
      newErrors.nachname = 'Soyad zorunludur';
    }
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

    if (!user?.vereinId) {
      setErrors({ submit: 'Dernek bilgisi bulunamadı' });
      return;
    }

    if (mode === 'create') {
      // Generate member number
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      const mitgliedsnummer = `M${year}${random}`;

      const createData: CreateMitgliedDto = {
        vereinId: user.vereinId,
        mitgliedsnummer,
        mitgliedStatusId: 1, // Default: Active
        mitgliedTypId: 1, // Default: Normal member
        vorname: formData.vorname,
        nachname: formData.nachname,
        email: formData.email || undefined,
        telefon: formData.telefon || undefined,
        mobiltelefon: formData.mobiltelefon || undefined,
        geburtsdatum: formData.geburtsdatum || undefined,
        geburtsort: formData.geburtsort || undefined,
        eintrittsdatum: formData.eintrittsdatum || undefined,
        beitragBetrag: formData.beitragBetrag ? parseFloat(formData.beitragBetrag) : undefined,
        bemerkung: formData.bemerkung || undefined,
        aktiv: formData.aktiv
      };

      createMutation.mutate(createData);
    } else if (mitglied) {
      const updateData: UpdateMitgliedDto = {
        id: mitglied.id,
        vereinId: mitglied.vereinId,
        mitgliedsnummer: mitglied.mitgliedsnummer,
        mitgliedStatusId: parseInt(formData.mitgliedStatusId),
        mitgliedTypId: parseInt(formData.mitgliedTypId),
        vorname: formData.vorname,
        nachname: formData.nachname,
        geschlechtId: formData.geschlechtId ? parseInt(formData.geschlechtId) : undefined,
        geburtsdatum: formData.geburtsdatum || undefined,
        geburtsort: formData.geburtsort || undefined,
        staatsangehoerigkeitId: formData.staatsangehoerigkeitId ? parseInt(formData.staatsangehoerigkeitId) : undefined,
        email: formData.email || undefined,
        telefon: formData.telefon || undefined,
        mobiltelefon: formData.mobiltelefon || undefined,
        eintrittsdatum: formData.eintrittsdatum || undefined,
        austrittsdatum: formData.austrittsdatum || undefined,
        beitragBetrag: formData.beitragBetrag ? parseFloat(formData.beitragBetrag) : undefined,
        beitragWaehrungId: formData.beitragWaehrungId ? parseInt(formData.beitragWaehrungId) : undefined,
        beitragPeriodeCode: formData.beitragPeriodeCode || undefined,
        beitragZahlungsTag: formData.beitragZahlungsTag ? parseInt(formData.beitragZahlungsTag) : undefined,
        beitragZahlungstagTypCode: formData.beitragZahlungstagTypCode || undefined,
        beitragIstPflicht: formData.beitragIstPflicht,
        bemerkung: formData.bemerkung || undefined,
        aktiv: formData.aktiv
      };

      updateMutation.mutate({ id: mitglied.id, data: updateData });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mitglied-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Yeni Üye Ekle' : 'Üye Bilgilerini Düzenle'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Kişisel Bilgiler */}
          <div className="form-section">
            <h3 className="section-title">Kişisel Bilgiler</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="vorname">Ad *</label>
                <input
                  type="text"
                  id="vorname"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleChange}
                  className={errors.vorname ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.vorname && <span className="error-message">{errors.vorname}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="nachname">Soyad *</label>
                <input
                  type="text"
                  id="nachname"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleChange}
                  className={errors.nachname ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.nachname && <span className="error-message">{errors.nachname}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="geburtsdatum">Doğum Tarihi</label>
                <input
                  type="date"
                  id="geburtsdatum"
                  name="geburtsdatum"
                  value={formData.geburtsdatum}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="geburtsort">Doğum Yeri</label>
                <input
                  type="text"
                  id="geburtsort"
                  name="geburtsort"
                  value={formData.geburtsort}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="form-section">
            <h3 className="section-title">İletişim Bilgileri</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telefon">Telefon</label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobiltelefon">Mobil Telefon</label>
                <input
                  type="tel"
                  id="mobiltelefon"
                  name="mobiltelefon"
                  value={formData.mobiltelefon}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Üyelik Bilgileri - Sadece Dernek Yöneticisi */}
          {user?.type === 'dernek' && (
            <div className="form-section">
              <h3 className="section-title">Üyelik Bilgileri</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="eintrittsdatum">Giriş Tarihi</label>
                  <input
                    type="date"
                    id="eintrittsdatum"
                    name="eintrittsdatum"
                    value={formData.eintrittsdatum}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="austrittsdatum">Çıkış Tarihi</label>
                  <input
                    type="date"
                    id="austrittsdatum"
                    name="austrittsdatum"
                    value={formData.austrittsdatum}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="aktiv"
                      checked={formData.aktiv}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span>Aktif Üye</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Aidat Bilgileri - Sadece Dernek Yöneticisi */}
          {user?.type === 'dernek' && (
            <div className="form-section">
              <h3 className="section-title">Aidat Bilgileri</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="beitragBetrag">Aidat Miktarı (€)</label>
                  <input
                    type="number"
                    id="beitragBetrag"
                    name="beitragBetrag"
                    value={formData.beitragBetrag}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="beitragPeriodeCode">Ödeme Periyodu</label>
                  <select
                    id="beitragPeriodeCode"
                    name="beitragPeriodeCode"
                    value={formData.beitragPeriodeCode}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Seçiniz</option>
                    <option value="MONTHLY">Aylık</option>
                    <option value="QUARTERLY">3 Aylık</option>
                    <option value="YEARLY">Yıllık</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="beitragZahlungsTag">Ödeme Günü</label>
                  <input
                    type="number"
                    id="beitragZahlungsTag"
                    name="beitragZahlungsTag"
                    value={formData.beitragZahlungsTag}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="beitragIstPflicht"
                      checked={formData.beitragIstPflicht}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span>Aidat Zorunlu</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notlar */}
          <div className="form-section">
            <h3 className="section-title">Notlar</h3>
            <div className="form-group">
              <textarea
                id="bemerkung"
                name="bemerkung"
                value={formData.bemerkung}
                onChange={handleChange}
                rows={3}
                disabled={isLoading}
                placeholder="Üye hakkında notlar..."
              />
            </div>
          </div>

          {errors.submit && (
            <div className="error-message-box">{errors.submit}</div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Kaydediliyor...' : mode === 'create' ? 'Üye Ekle' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MitgliedFormModal;

