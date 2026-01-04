/**
 * KontenTab - FiBu Kontenplan (Chart of Accounts)
 * Manage FiBu accounts according to SKR49
 */

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fiBuKontoService } from '../../../services/easyFiBuService';
import { FiBuKontoDto } from '../../../types/easyFiBu.types';
import Loading from '../../../components/Common/Loading';
import KontenModal from './KontenModal';
import { getKategorieLabelByValue, getKategorieOptions, getLocalizedKontoName } from './kontenUtils';
import './easyFiBu.css';

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

interface KontenTabProps {
  vereinId?: number;
}

const KontenTab: React.FC<KontenTabProps> = ({ vereinId }) => {
  const { t, i18n } = useTranslation();
  const kategorienOptions = useMemo(() => getKategorieOptions(t), [t]);
  const [searchTerm, setSearchTerm] = useState('');
  const [kategorieFilter, setKategorieFilter] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKonto, setSelectedKonto] = useState<FiBuKontoDto | null>(null);
  const hasVerein = !!vereinId;

  // Fetch FiBu accounts
  const { data: konten = [], isLoading } = useQuery({
    queryKey: ['fibu-konten', showInactive, hasVerein ? vereinId : 'none'],
    queryFn: () => fiBuKontoService.getAll(showInactive),
    enabled: hasVerein,
  });

  // Filter accounts
  const filteredKonten = useMemo(() => {
    return konten.filter(konto => {
      const localizedName = getLocalizedKontoName(konto, i18n.language).toLowerCase();
      const matchesSearch = searchTerm === '' ||
        konto.nummer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        konto.bezeichnung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        localizedName.includes(searchTerm.toLowerCase());
      const matchesKategorie = kategorieFilter === 'all' || konto.kategorie === kategorieFilter;
      return matchesSearch && matchesKategorie;
    });
  }, [konten, searchTerm, kategorieFilter]);

  // Group by category
  const groupedKonten = useMemo(() => {
    const groups: Record<string, FiBuKontoDto[]> = {};
    filteredKonten.forEach(konto => {
      if (!groups[konto.kategorie]) {
        groups[konto.kategorie] = [];
      }
      groups[konto.kategorie].push(konto);
    });
    return groups;
  }, [filteredKonten]);

  const handleEdit = (konto: FiBuKontoDto) => {
    setSelectedKonto(konto);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedKonto(null);
    setIsModalOpen(true);
  };

  if (!hasVerein) {
    return (
      <div className="easyfibu-tab konten-tab">
        <div className="empty-state">
          {t('common:filter.selectVerein')}
        </div>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className="easyfibu-tab konten-tab">
      <div className="tab-header">
        <div className="tab-title">
          <h2>{t('finanz:easyFiBu.konten.title')}</h2>
          <p>{t('finanz:easyFiBu.konten.subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <PlusIcon /> {t('finanz:easyFiBu.konten.newKonto')}
        </button>
      </div>

      <div className="tab-filters">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('finanz:easyFiBu.common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={kategorieFilter}
          onChange={(e) => setKategorieFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">{t('finanz:easyFiBu.common.all')}</option>
          {kategorienOptions.map((option) => (
            <option key={option.key} value={option.value}>{option.label}</option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          {t('finanz:easyFiBu.konten.inaktiv')}
        </label>
      </div>

      <div className="konten-list">
          {Object.entries(groupedKonten).map(([kategorie, kontenList]) => (
            <div key={kategorie} className="kategorie-group">
            <h3 className="kategorie-title">{getKategorieLabelByValue(t, kategorie)}</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('finanz:easyFiBu.konten.nummer')}</th>
                  <th>{t('finanz:easyFiBu.konten.bezeichnung')}</th>
                  <th>{t('finanz:easyFiBu.konten.kontoTyp')}</th>
                  <th>{t('finanz:easyFiBu.konten.aktiv')}</th>
                  <th>{t('finanz:easyFiBu.common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {kontenList.map(konto => (
                  <tr key={konto.id} className={!konto.aktiv ? 'inactive-row' : ''}>
                    <td className="konto-nummer">{konto.nummer}</td>
                    <td>{getLocalizedKontoName(konto, i18n.language)}</td>
                    <td>
                      <span className={`type-badge ${konto.istEinnahme ? 'einnahme' : konto.istAusgabe ? 'ausgabe' : 'durchlaufend'}`}>
                        {konto.istEinnahme ? 'E' : konto.istAusgabe ? 'A' : 'D'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${konto.aktiv ? 'active' : 'inactive'}`}>
                        {konto.aktiv ? t('finanz:easyFiBu.konten.aktiv') : t('finanz:easyFiBu.konten.inaktiv')}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => handleEdit(konto)} title={t('finanz:easyFiBu.common.edit')}>
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {filteredKonten.length === 0 && (
          <div className="empty-state">{t('finanz:easyFiBu.konten.noKonten')}</div>
        )}
      </div>

      <KontenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        konto={selectedKonto}
      />
    </div>
  );
};

export default KontenTab;

