/**
 * Mitglied Finanz Page
 * Member's personal finance overview: claims, payments, balance
 * Accessible by: Mitglied (member) only
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  mitgliedForderungService,
  mitgliedZahlungService,
} from '../../services/finanzService';
import Loading from '../../components/Common/Loading';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './MitgliedFinanz.css';

// Icons
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);



const MitgliedFinanz: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const mitgliedId = user?.mitgliedId;

  // Fetch member's claims
  const { data: forderungen = [], isLoading: forderungenLoading } = useQuery({
    queryKey: ['mitglied-forderungen', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return [];
      const allForderungen = await mitgliedForderungService.getAll();
      return allForderungen.filter(f => f.mitgliedId === mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Fetch member's payments
  const { data: zahlungen = [], isLoading: zahlungenLoading } = useQuery({
    queryKey: ['mitglied-zahlungen', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return [];
      const allZahlungen = await mitgliedZahlungService.getAll();
      return allZahlungen.filter(z => z.mitgliedId === mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalClaims = forderungen.length;
    const paidClaims = forderungen.filter(f => f.statusId === 1).length; // Status 1 = Paid
    const unpaidClaims = forderungen.filter(f => f.statusId === 2).length; // Status 2 = Unpaid
    
    const totalClaimsAmount = forderungen.reduce((sum, f) => sum + f.betrag, 0);
    const paidClaimsAmount = forderungen.filter(f => f.statusId === 1).reduce((sum, f) => sum + f.betrag, 0);
    const unpaidClaimsAmount = forderungen.filter(f => f.statusId === 2).reduce((sum, f) => sum + f.betrag, 0);
    
    const totalPayments = zahlungen.length;
    const totalPaymentsAmount = zahlungen.reduce((sum, z) => sum + z.betrag, 0);

    // Overdue claims (vade geçmiş)
    const today = new Date();
    const overdueClaims = forderungen.filter(f => 
      f.statusId === 2 && new Date(f.faelligkeit) < today
    );
    const overdueClaimsAmount = overdueClaims.reduce((sum, f) => sum + f.betrag, 0);

    return {
      totalClaims,
      paidClaims,
      unpaidClaims,
      totalClaimsAmount,
      paidClaimsAmount,
      unpaidClaimsAmount,
      totalPayments,
      totalPaymentsAmount,
      overdueClaims: overdueClaims.length,
      overdueClaimsAmount,
    };
  }, [forderungen, zahlungen]);

  const isLoading = forderungenLoading || zahlungenLoading;

  // Redirect if not a member
  if (user?.type !== 'mitglied') {
    navigate('/startseite');
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Format date - Dynamic locale based on current language
  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (statusId: number) => {
    if (statusId === 1) {
      return <span className="status-badge status-paid">{t('finanz:status.paid')}</span>;
    }
    return <span className="status-badge status-unpaid">{t('finanz:status.unpaid')}</span>;
  };

  // Check if claim is overdue
  const isOverdue = (faelligkeit: string, statusId: number) => {
    if (statusId === 1) return false; // Already paid
    return new Date(faelligkeit) < new Date();
  };

  // Export payment history to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper function to convert Turkish characters to ASCII for PDF compatibility
    const toAscii = (text: string): string => {
      if (!text) return '';
      return text
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ı/g, 'i').replace(/İ/g, 'I')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C');
    };

    // Header - Blue background
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(toAscii(t('finanz:mitgliedFinanz.pdfTitle')), 14, 20);

    // Member info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(toAscii(`${t('finanz:mitgliedFinanz.pdfMember')} ${user?.firstName || ''} ${user?.lastName || ''}`), 14, 30);
    doc.text(toAscii(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`), 14, 37);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Summary section
    let yPos = 55;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(toAscii('Mali Özet'), 14, yPos);

    // Summary boxes
    yPos += 10;
    const boxWidth = (pageWidth - 40) / 3;
    const boxHeight = 25;
    const boxSpacing = 3;

    // Box 1: Total Debt
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(14, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 15);
    doc.text(toAscii(t('finanz:mitgliedFinanz.pdfTotalClaims')), 14 + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(stats.unpaidClaimsAmount), 14 + boxWidth / 2, yPos + 18, { align: 'center' });

    // Box 2: Total Paid
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(14 + boxWidth + boxSpacing, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(toAscii(t('finanz:mitgliedFinanz.pdfTotalPaid')), 14 + boxWidth + boxSpacing + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(stats.paidClaimsAmount), 14 + boxWidth + boxSpacing + boxWidth / 2, yPos + 18, { align: 'center' });

    // Box 3: Total Payments
    doc.setFillColor(219, 234, 254);
    doc.roundedRect(14 + (boxWidth + boxSpacing) * 2, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(toAscii(t('finanz:mitgliedFinanz.pdfTotalPayments')), 14 + (boxWidth + boxSpacing) * 2 + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(stats.totalPaymentsAmount), 14 + (boxWidth + boxSpacing) * 2 + boxWidth / 2, yPos + 18, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Payments table
    yPos += 35;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(toAscii(t('finanz:mitgliedFinanz.pdfPaymentDetails')), 14, yPos);

    const tableData = zahlungen
      .sort((a, b) => new Date(b.zahlungsdatum).getTime() - new Date(a.zahlungsdatum).getTime())
      .map(zahlung => [
        formatDate(zahlung.zahlungsdatum),
        formatCurrency(zahlung.betrag),
        toAscii(zahlung.zahlungsweg || '-'),
        toAscii(zahlung.referenz || '-'),
      ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [[
        toAscii(t('finanz:mitgliedFinanz.pdfDate')),
        toAscii(t('finanz:mitgliedFinanz.pdfAmount')),
        toAscii(t('finanz:mitgliedFinanz.pdfPaymentMethod')),
        toAscii(t('finanz:mitgliedFinanz.pdfReference')),
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 35 },
        1: { halign: 'right', cellWidth: 35, fontStyle: 'bold' },
        2: { halign: 'center', cellWidth: 50 },
        3: { halign: 'left', cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;
    if (finalY < pageHeight - 30) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text(
        toAscii(`Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}`),
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      );
      doc.text(
        toAscii('Bu belge elektronik olarak oluşturulmuştur.'),
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const fileName = `${t('finanz:export.paymentHistoryFileName')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    showToast(t('finanz:mitgliedFinanz.exportSuccess'), 'success');
  };

  return (
    <div className="mitglied-finanz">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:mitgliedFinanz.title')}</h1>
      </div>

      {/* Summary Section */}
      <div className="finance-summary">
        <div className="summary-card balance-card">
          <div className="summary-header">
            <h3>{t('finanz:mitgliedFinanz.currentBalance')}</h3>
          </div>
          <div className="summary-amount">
            <span className={stats.unpaidClaimsAmount > 0 ? 'negative' : 'positive'}>
              {formatCurrency(stats.unpaidClaimsAmount)}
            </span>
          </div>
        </div>

        <div className="summary-stats">
          <div className="summary-stat">
            <div className="stat-label">{t('finanz:mitgliedFinanz.totalPaid')}</div>
            <div className="stat-amount success">{formatCurrency(stats.paidClaimsAmount)}</div>
          </div>
          <div className="summary-stat">
            <div className="stat-label">{t('finanz:mitgliedFinanz.totalPayments')}</div>
            <div className="stat-amount">{stats.totalPayments} {t('finanz:mitgliedFinanz.payments')}</div>
          </div>
          {stats.overdueClaims > 0 && (
            <div className="summary-stat alert">
              <div className="stat-label">{t('finanz:mitgliedFinanz.overdueClaims')}</div>
              <div className="stat-amount error">{formatCurrency(stats.overdueClaimsAmount)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Unpaid Claims Section */}
      {stats.unpaidClaims > 0 && (
        <div className="finance-section">
          <div className="section-header">
            <h2>{t('finanz:mitgliedFinanz.unpaidClaimsTitle')}</h2>
            <span className="badge badge-warning">{stats.unpaidClaims}</span>
          </div>
          <div className="claims-grid">
            {forderungen
              .filter(f => f.statusId === 2)
              .sort((a, b) => new Date(a.faelligkeit).getTime() - new Date(b.faelligkeit).getTime())
              .map(forderung => (
                <div
                  key={forderung.id}
                  className={`claim-item ${isOverdue(forderung.faelligkeit, forderung.statusId) ? 'overdue' : ''}`}
                >
                  <div className="claim-content">
                    <div className="claim-main">
                      <h4>{forderung.beschreibung || t('finanz:claims.title')}</h4>
                      <span className="claim-id">#{forderung.forderungsnummer || forderung.id}</span>
                    </div>
                    <div className="claim-details">
                      <div className="claim-date">
                        <CalendarIcon />
                        <span>{formatDate(forderung.faelligkeit)}</span>
                      </div>
                      <div className="claim-amount">{formatCurrency(forderung.betrag)}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Payment History Section */}
      <div className="finance-section">
        <div className="section-header">
          <h2>{t('finanz:mitgliedFinanz.paymentHistory')}</h2>
          <div className="section-actions">
            <span className="badge badge-primary">{stats.totalPayments}</span>
            {zahlungen.length > 0 && (
              <button className="btn-secondary btn-sm" onClick={handleExportPDF}>
                <DownloadIcon />
                PDF
              </button>
            )}
          </div>
        </div>
        {zahlungen.length === 0 ? (
          <div className="empty-message">
            <p>{t('finanz:mitgliedFinanz.noPayments')}</p>
          </div>
        ) : (
          <div className="simple-table">
            <table>
              <thead>
                <tr>
                  <th>{t('finanz:payments.date')}</th>
                  <th>{t('finanz:payments.amount')}</th>
                  <th>{t('finanz:payments.method')}</th>
                </tr>
              </thead>
              <tbody>
                {zahlungen
                  .sort((a, b) => new Date(b.zahlungsdatum).getTime() - new Date(a.zahlungsdatum).getTime())
                  .slice(0, 5)
                  .map(zahlung => (
                    <tr key={zahlung.id}>
                      <td>{formatDate(zahlung.zahlungsdatum)}</td>
                      <td><strong>{formatCurrency(zahlung.betrag)}</strong></td>
                      <td>{zahlung.zahlungsweg || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Claims Section */}
      <div className="finance-section">
        <div className="section-header">
          <h2>{t('finanz:mitgliedFinanz.allClaims')}</h2>
          <span className="badge badge-secondary">{stats.totalClaims}</span>
        </div>
        {forderungen.length === 0 ? (
          <div className="empty-message">
            <p>{t('finanz:mitgliedFinanz.noClaims')}</p>
          </div>
        ) : (
          <div className="simple-table">
            <table>
              <thead>
                <tr>
                  <th>{t('finanz:claims.description')}</th>
                  <th>{t('finanz:claims.dueDate')}</th>
                  <th>{t('finanz:claims.amount')}</th>
                  <th>{t('finanz:claims.status')}</th>
                </tr>
              </thead>
              <tbody>
                {forderungen
                  .sort((a, b) => new Date(b.faelligkeit).getTime() - new Date(a.faelligkeit).getTime())
                  .map(forderung => (
                    <tr key={forderung.id}>
                      <td>{forderung.beschreibung || t('finanz:claims.title')}</td>
                      <td>{formatDate(forderung.faelligkeit)}</td>
                      <td><strong>{formatCurrency(forderung.betrag)}</strong></td>
                      <td>{getStatusBadge(forderung.statusId)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MitgliedFinanz;

