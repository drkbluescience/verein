import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import Loading from '../../components/Common/Loading';
import html2pdf from 'html2pdf.js';
import MemberAnalytics from './MemberAnalytics';
import FinanceAnalytics from './FinanceAnalytics';
import './Reports.css';

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const AdminRaporlar: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation('reports');
  const [activeTab, setActiveTab] = useState<'members' | 'finance'>('members');
  const [dateRange, setDateRange] = useState<'30days' | '3months' | '6months' | '1year'>('30days');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);

  // Fetch all vereine
  const { data: vereine, isLoading: vereineLoading } = useQuery({
    queryKey: ['vereine'],
    queryFn: vereinService.getAll,
  });

  // Fetch all mitglieder (using large page size to get all)
  const { data: mitgliederData, isLoading: mitgliederLoading } = useQuery({
    queryKey: ['all-mitglieder'],
    queryFn: () => mitgliedService.getAll({ pageNumber: 1, pageSize: 10000 }),
  });

  // Wrap allMitglieder in useMemo to prevent exhaustive-deps warning
  const allMitglieder = useMemo(() => mitgliederData?.items || [], [mitgliederData?.items]);

  // PDF Export function with html2pdf.js (prevents element splitting)
  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById('reports-content');
    if (!element) {
      setIsExporting(false);
      return;
    }

    try {
      // Add PDF export mode class to scale down content
      element.classList.add('pdf-export-mode');

      // Wait for CSS transform to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number],
        filename: `${t('export.adminReportsFileName')}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape' as const
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF export error:', error);
      alert(t('export.pdfExportError'));
    } finally {
      // Remove PDF export mode class
      element.classList.remove('pdf-export-mode');
      setIsExporting(false);
    }
  };

  if (vereineLoading || mitgliederLoading) {
    return <Loading text={t('loading')} />;
  }

  const selectedVerein = vereine?.find(v => v.id === selectedVereinId);

  return (
    <div className="reports-container">
      <div className="page-header">
        <h1 className="page-title">{selectedVerein ? `${selectedVerein.name} - Raporlar` : t('admin.title')}</h1>
      </div>

      {/* Tabs */}
      <div className="reports-tabs">
        <button
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {t('tabs.memberAnalytics')}
        </button>
        <button
          className={`tab-button ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          {t('tabs.financeAnalytics')}
        </button>
      </div>

      {/* Toolbar */}
      <div className="reports-toolbar">
        <div className="toolbar-left">
          <div className="date-range-selector">
            <label>{t('toolbar.verein')}</label>
            <select
              value={selectedVereinId || ''}
              onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">{t('toolbar.allVereine')}</option>
              {vereine?.map(verein => (
                <option key={verein.id} value={verein.id}>
                  {verein.name}
                </option>
              ))}
            </select>
          </div>
          {activeTab === 'members' && (
            <div className="date-range-selector">
              <label>{t('toolbar.period')}</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)}>
                <option value="30days">{t('toolbar.last30Days')}</option>
                <option value="3months">{t('toolbar.last3Months')}</option>
                <option value="6months">{t('toolbar.last6Months')}</option>
                <option value="1year">{t('toolbar.last1Year')}</option>
              </select>
            </div>
          )}
        </div>
        <div className="toolbar-right">
          <button
            className="export-button"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <DownloadIcon />
            {isExporting ? t('toolbar.exportingPDF') : t('toolbar.downloadPDF')}
          </button>
        </div>
      </div>

      <div id="reports-content">
        {activeTab === 'members' && (
          <MemberAnalytics
            vereine={vereine || []}
            allMitglieder={allMitglieder}
            dateRange={dateRange}
            selectedVereinId={selectedVereinId}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceAnalytics
            vereine={vereine || []}
            allMitglieder={allMitglieder}
            selectedVereinId={selectedVereinId}
          />
        )}
      </div>
    </div>
  );
};

export default AdminRaporlar;

