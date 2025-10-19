import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { veranstaltungAnmeldungService } from '../../services/veranstaltungService';
import { mitgliedService } from '../../services/mitgliedService';
import { CreateVeranstaltungAnmeldungDto } from '../../types/veranstaltung';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './AddParticipantModal.css';

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  veranstaltungId: number;
  vereinId?: number;
  veranstaltungPreis?: number;
  veranstaltungWaehrungId?: number;
}

const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  veranstaltungId,
  vereinId,
  veranstaltungPreis,
  veranstaltungWaehrungId
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [registrationType, setRegistrationType] = useState<'member' | 'manual'>('member');
  const [selectedMitgliedId, setSelectedMitgliedId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefon: '',
    bemerkung: '',
    preis: veranstaltungPreis?.toString() || '',
    status: 'Confirmed'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch members for dropdown
  // Use vereinId from props (for admin) or user's vereinId (for dernek)
  const targetVereinId = vereinId || user?.vereinId;

  const { data: mitglieder } = useQuery({
    queryKey: ['mitglieder', targetVereinId],
    queryFn: () => mitgliedService.getByVereinId(targetVereinId || 0, true),
    enabled: !!targetVereinId && isOpen,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRegistrationType('member');
      setSelectedMitgliedId('');
      setFormData({
        name: '',
        email: '',
        telefon: '',
        bemerkung: '',
        preis: veranstaltungPreis?.toString() || '',
        status: 'Confirmed'
      });
      setErrors({});
    }
  }, [isOpen, veranstaltungPreis]);

  // Auto-fill when member is selected
  useEffect(() => {
    if (selectedMitgliedId && mitglieder) {
      const mitglied = mitglieder.find(m => m.id === parseInt(selectedMitgliedId));
      if (mitglied) {
        setFormData(prev => ({
          ...prev,
          name: `${mitglied.vorname} ${mitglied.nachname}`,
          email: mitglied.email || '',
          telefon: mitglied.telefon || mitglied.mobiltelefon || ''
        }));
      }
    }
  }, [selectedMitgliedId, mitglieder]);

  const createMutation = useMutation({
    mutationFn: (data: CreateVeranstaltungAnmeldungDto) =>
      veranstaltungAnmeldungService.create(data),
    onSuccess: () => {
      showToast('Katılımcı başarıyla eklendi', 'success');
      queryClient.invalidateQueries({ queryKey: ['veranstaltung-anmeldungen', veranstaltungId] });
      onClose();
    },
    onError: (error: any) => {
      showToast(error?.message || 'Katılımcı eklenirken hata oluştu', 'error');
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (registrationType === 'member') {
      if (!selectedMitgliedId) {
        newErrors.mitgliedId = 'Lütfen bir üye seçin';
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = 'Ad Soyad zorunludur';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Geçerli bir e-posta adresi girin';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData: CreateVeranstaltungAnmeldungDto = {
      veranstaltungId,
      mitgliedId: registrationType === 'member' ? parseInt(selectedMitgliedId) : undefined,
      name: formData.name || undefined,
      email: formData.email || undefined,
      telefon: formData.telefon || undefined,
      bemerkung: formData.bemerkung || undefined,
      preis: formData.preis ? parseFloat(formData.preis) : undefined,
      waehrungId: veranstaltungWaehrungId,
      status: formData.status
    };

    createMutation.mutate(submitData);
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-participant-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Katılımcı Ekle</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Section 1: Registration Type */}
          <div className="form-section">
            <h3 className="section-title">Kayıt Türü</h3>
            <div className="registration-type-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="registrationType"
                  value="member"
                  checked={registrationType === 'member'}
                  onChange={(e) => setRegistrationType(e.target.value as 'member' | 'manual')}
                />
                <span>Mevcut Üyeden Seç</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="registrationType"
                  value="manual"
                  checked={registrationType === 'manual'}
                  onChange={(e) => setRegistrationType(e.target.value as 'member' | 'manual')}
                />
                <span>Manuel Bilgi Gir</span>
              </label>
            </div>
          </div>

          {/* Section 2: Participant Information */}
          <div className="form-section">
            <h3 className="section-title">Katılımcı Bilgileri</h3>

            {registrationType === 'member' ? (
              <div className="form-group">
                <label htmlFor="mitgliedId">Üye Seçin *</label>
                <select
                  id="mitgliedId"
                  value={selectedMitgliedId}
                  onChange={(e) => setSelectedMitgliedId(e.target.value)}
                  className={errors.mitgliedId ? 'error' : ''}
                >
                  <option value="">-- Üye Seçin --</option>
                  {mitglieder?.map(mitglied => (
                    <option key={mitglied.id} value={mitglied.id}>
                      {mitglied.vorname} {mitglied.nachname} ({mitglied.mitgliedsnummer})
                    </option>
                  ))}
                </select>
                {errors.mitgliedId && <span className="error-message">{errors.mitgliedId}</span>}
              </div>
            ) : (
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="name">Ad Soyad *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'error' : ''}
                    placeholder="Katılımcının adı ve soyadı"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-posta</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'error' : ''}
                    placeholder="ornek@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefon">Telefon</label>
                  <input
                    type="tel"
                    id="telefon"
                    value={formData.telefon}
                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Additional Information */}
          <div className="form-section">
            <h3 className="section-title">Ek Bilgiler</h3>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="bemerkung">Not</label>
                <textarea
                  id="bemerkung"
                  value={formData.bemerkung}
                  onChange={(e) => setFormData({ ...formData, bemerkung: e.target.value })}
                  rows={3}
                  placeholder="Ek bilgiler veya notlar"
                />
              </div>

              <div className="form-group">
                <label htmlFor="preis">Fiyat</label>
                <input
                  type="number"
                  id="preis"
                  value={formData.preis}
                  onChange={(e) => setFormData({ ...formData, preis: e.target.value })}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Durum</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Confirmed">Onaylandı</option>
                  <option value="Pending">Beklemede</option>
                  <option value="Waitlist">Bekleme Listesi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
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
              {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParticipantModal;

