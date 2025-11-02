/**
 * Bankkonto IBAN Search Page
 * Example page showing how to use IBAN search and validation
 */

import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import BankkontoIbanSearch from '../../components/Bankkonto/BankkontoIbanSearch';
import { BankkontoDto } from '../../types/verein';
import './BankkontoIbanSearchPage.css';

export const BankkontoIbanSearchPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedBankkonto, setSelectedBankkonto] = useState<BankkontoDto | null>(null);
  const [isValidIban, setIsValidIban] = useState(false);

  const handleBankkontoSelect = (bankkonto: BankkontoDto) => {
    setSelectedBankkonto(bankkonto);
    showToast(`Banka hesabı seçildi: ${bankkonto.kontoinhaber}`, 'success');
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsValidIban(isValid);
  };

  const handleClear = () => {
    setSelectedBankkonto(null);
    setIsValidIban(false);
  };

  return (
    <div className="bankkonto-iban-search-page">
      <div className="page-header">
        <h1>IBAN ile Banka Hesabı Arama</h1>
        <p>IBAN numarasını girerek banka hesabınızı arayın ve seçin</p>
      </div>

      <div className="page-content">
        <div className="search-section">
          <BankkontoIbanSearch
            onSelect={handleBankkontoSelect}
            onValidationChange={handleValidationChange}
          />
        </div>

        {selectedBankkonto && (
          <div className="selected-section">
            <h2>Seçilen Banka Hesabı</h2>
            <div className="selected-info">
              <div className="info-item">
                <label>Hesap Sahibi:</label>
                <span>{selectedBankkonto.kontoinhaber}</span>
              </div>
              <div className="info-item">
                <label>IBAN:</label>
                <span className="monospace">{selectedBankkonto.iban}</span>
              </div>
              {selectedBankkonto.bic && (
                <div className="info-item">
                  <label>BIC:</label>
                  <span className="monospace">{selectedBankkonto.bic}</span>
                </div>
              )}
              {selectedBankkonto.bankname && (
                <div className="info-item">
                  <label>Banka Adı:</label>
                  <span>{selectedBankkonto.bankname}</span>
                </div>
              )}
              {selectedBankkonto.verwendungszweck && (
                <div className="info-item">
                  <label>Kullanım Amacı:</label>
                  <span>{selectedBankkonto.verwendungszweck}</span>
                </div>
              )}
              <div className="info-item">
                <label>Durum:</label>
                <span className={selectedBankkonto.aktiv ? 'status-active' : 'status-inactive'}>
                  {selectedBankkonto.aktiv ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
            <button className="btn-clear" onClick={handleClear}>
              Temizle
            </button>
          </div>
        )}

        <div className="info-section">
          <h2>IBAN Hakkında Bilgi</h2>
          <div className="info-content">
            <h3>IBAN Nedir?</h3>
            <p>
              IBAN (International Bank Account Number), uluslararası banka transferleri için
              kullanılan standart bir hesap numarası formatıdır.
            </p>

            <h3>IBAN Yapısı</h3>
            <ul>
              <li>
                <strong>2 Harf:</strong> Ülke kodu (örn: DE = Almanya, TR = Türkiye)
              </li>
              <li>
                <strong>2 Rakam:</strong> Kontrol rakamları (mod-97 algoritması ile hesaplanır)
              </li>
              <li>
                <strong>Geri Kalan:</strong> Banka ve hesap numarası (ülkeye göre değişir)
              </li>
            </ul>

            <h3>Örnek IBAN'lar</h3>
            <ul>
              <li>
                <code>DE89 3704 0044 0532 0130 00</code> - Almanya
              </li>
              <li>
                <code>AT61 1904 3002 3457 3201</code> - Avusturya
              </li>
              <li>
                <code>CH93 0076 2011 6238 5295 7</code> - İsviçre
              </li>
              <li>
                <code>TR33 0006 1005 1978 6457 8001</code> - Türkiye
              </li>
            </ul>

            <h3>Doğrulama</h3>
            <p>
              Bu sayfa, IBAN'ı iki aşamada doğrular:
            </p>
            <ol>
              <li>
                <strong>İstemci Tarafı:</strong> Format ve kontrol rakamları kontrol edilir
              </li>
              <li>
                <strong>Sunucu Tarafı:</strong> Ek doğrulama ve banka hesabı araması yapılır
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankkontoIbanSearchPage;

