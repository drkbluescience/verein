import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VereinSatzungDto } from '../../types/vereinSatzung';
import './SatzungViewerModal.css';

interface SatzungViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  satzung: VereinSatzungDto | null;
}

const SatzungViewerModal: React.FC<SatzungViewerModalProps> = ({
  isOpen,
  onClose,
  satzung,
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'common']);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const loadDocument = useCallback(async () => {
    if (!satzung) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5103';
      const response = await fetch(`${API_URL}/api/VereinSatzung/${satzung.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(t('vereine:satzung.fileNotFound'));
        } else if (response.status === 401) {
          throw new Error(t('common:unauthorized'));
        }
        throw new Error(t('vereine:satzung.loadError'));
      }

      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (err: any) {
      console.error('Error loading document:', err);
      setError(err.message || t('vereine:satzung.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [satzung, t]);

  useEffect(() => {
    if (isOpen && satzung) {
      loadDocument();
    } else {
      setHtmlContent('');
      setError(null);
    }
  }, [isOpen, satzung, loadDocument]);

  const handleExportPdf = async () => {
    if (!contentRef.current || !satzung) return;

    setIsExporting(true);

    try {
      const content = contentRef.current;
      const canvas = await html2canvas(content, {
        useCORS: true,
        backgroundColor: '#ffffff',
      } as any);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Calculate pages needed
      const pageHeight = pdfHeight * (imgWidth / pdfWidth);
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position * ratio, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pageHeight;
      }

      const fileName = satzung.dosyaAdi?.replace(/\.(doc|docx)$/i, '.pdf') || `tuzuk_${satzung.id}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="satzung-viewer-overlay" onClick={onClose}>
      <div className="satzung-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="satzung-viewer-header">
          <h2>{satzung?.dosyaAdi || t('vereine:satzung.title')}</h2>
          <div className="satzung-viewer-actions">
            <button
              className="btn-pdf-export"
              onClick={handleExportPdf}
              disabled={isLoading || isExporting || !!error}
            >
              {isExporting ? t('common:processing') : t('vereine:satzung.exportPdf')}
            </button>
            <button className="btn-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="satzung-viewer-content">
          {isLoading && (
            <div className="satzung-viewer-loading">
              <div className="spinner"></div>
              <p>{t('common:loading')}</p>
            </div>
          )}

          {error && (
            <div className="satzung-viewer-error">
              <p>{error}</p>
              <button onClick={loadDocument}>{t('common:retry')}</button>
            </div>
          )}

          {!isLoading && !error && (
            <div
              ref={contentRef}
              className="satzung-document-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SatzungViewerModal;

