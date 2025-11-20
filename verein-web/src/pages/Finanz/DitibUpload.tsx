/**
 * DITIB Upload Page
 * Upload Excel file with DITIB payments
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { bankkontoService } from '../../services/vereinService';
import { vereinDitibZahlungService } from '../../services/finanzService';
import { DitibUploadResponseDto } from '../../types/finanz.types';
import { BankkontoDto } from '../../types/verein';
import Loading from '../../components/Common/Loading';
import './BankUpload.css';

// Icons
const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const DitibUpload: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBankKonto, setSelectedBankKonto] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<DitibUploadResponseDto | null>(null);

  const vereinId = user?.vereinId || 0;

  // Fetch bank accounts
  const { data: bankkonten = [], isLoading: bankkontenLoading } = useQuery({
    queryKey: ['bankkonten', vereinId],
    queryFn: async () => {
      if (vereinId) {
        return await bankkontoService.getByVereinId(vereinId);
      }
      return await bankkontoService.getAll();
    },
    enabled: !!user,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert('Geçersiz dosya türü. Lütfen Excel (.xlsx, .xls) veya CSV dosyası seçin.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya çok büyük. Maksimum dosya boyutu 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedBankKonto) {
      alert(t('ditibPayments.selectFileAndBankError', { ns: 'finanz' }));
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await vereinDitibZahlungService.uploadExcel(vereinId, selectedBankKonto, selectedFile);
      setUploadResult(result);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (result.success) {
        showToast(t('ditibPayments.uploadSuccess', { ns: 'finanz' }), 'success');
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || t('bankUpload.uploadFailed', { ns: 'finanz' }),
        totalRows: 0,
        successCount: 0,
        failedCount: 0,
        skippedCount: 0,
        details: [],
        errors: [error.message || t('common:error.unknown')],
      });
      showToast(t('bankUpload.uploadFailed', { ns: 'finanz' }), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['Tarih', 'Tutar', 'Referans', 'Açıklama'];
    const example = ['2024-01-15', '500.00', 'DITIB-2024-01', 'DITIB Ödeme Ocak 2024'];

    const csv = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ditib-yukleme-sablonu.csv';
    link.click();
  };

  if (bankkontenLoading) {
    return <Loading />;
  }

  return (
    <div className="bank-upload-container">
      <div className="page-header">
        <h1>DITIB Ödemeleri Yükle</h1>
        <p className="page-description">{t('ditibPayments.excelUploadDescription', { ns: 'finanz' })}</p>
      </div>

      {/* Actions Bar with Back Button */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen/ditib-zahlungen')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
      </div>

      {/* Bank Account Selection */}
      <div className="upload-section">
        <label className="form-label">{t('ditibPayments.selectBankAccount', { ns: 'finanz' })}</label>
        <select
          className="form-select"
          value={selectedBankKonto || ''}
          onChange={(e) => setSelectedBankKonto(Number(e.target.value))}
        >
          <option value="">{t('ditibPayments.chooseBankAccount', { ns: 'finanz' })}</option>
          {bankkonten.map((konto: BankkontoDto) => (
            <option key={konto.id} value={konto.id}>
              {konto.kontoinhaber} - {konto.iban}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Area */}
      <div
        className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div className="file-selected">
            <CheckIcon />
            <p className="file-name">{selectedFile.name}</p>
            <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <UploadIcon />
            <p className="upload-text">{t('ditibPayments.dragDrop', { ns: 'finanz' })}</p>
            <p className="upload-subtext">{t('ditibPayments.orClickToSelect', { ns: 'finanz' })}</p>
            <p className="upload-formats">{t('ditibPayments.excelFormats', { ns: 'finanz' })}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="upload-actions">
        <button
          className="btn btn-secondary"
          onClick={handleDownloadTemplate}
        >
          <DownloadIcon />
          {t('bankUpload.downloadTemplate', { ns: 'finanz' })}
        </button>

        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!selectedFile || !selectedBankKonto || isUploading}
        >
          {isUploading ? t('ditibPayments.uploading', { ns: 'finanz' }) : t('ditibPayments.upload', { ns: 'finanz' })}
        </button>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`upload-result ${uploadResult.success ? 'success' : 'error'}`}>
          <div className="result-header">
            {uploadResult.success ? <CheckIcon /> : <XIcon />}
            <h3>{uploadResult.message}</h3>
          </div>

          <div className="result-stats">
            <div className="stat success">
              <span className="stat-label">Başarılı</span>
              <span className="stat-value">{uploadResult.successCount}</span>
            </div>
            <div className="stat error">
              <span className="stat-label">Başarısız</span>
              <span className="stat-value">{uploadResult.failedCount}</span>
            </div>
            <div className="stat warning">
              <span className="stat-label">Atlandı</span>
              <span className="stat-value">{uploadResult.skippedCount}</span>
            </div>
          </div>

          {uploadResult.details.length > 0 && (
            <div className="result-details">
              <h4>Detaylar</h4>
              <div className="details-table">
                {uploadResult.details.map((detail, index) => (
                  <div key={index} className={`detail-row ${detail.status.toLowerCase()}`}>
                    <span className="detail-icon">
                      {detail.status === 'Success' && <CheckIcon />}
                      {detail.status === 'Failed' && <XIcon />}
                      {detail.status === 'Skipped' && <AlertIcon />}
                    </span>
                    <span className="detail-row-number">#{detail.rowNumber}</span>
                    <span className="detail-info">
                      {detail.zahlungsdatum} - €{detail.betrag?.toFixed(2)} - {detail.zahlungsperiode}
                    </span>
                    <span className="detail-message">{detail.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DitibUpload;

