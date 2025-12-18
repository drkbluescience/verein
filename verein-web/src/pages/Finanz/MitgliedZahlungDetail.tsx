/**
 * Mitglied Zahlung (Payment) Detail Page
 * Display payment details with allocated claims
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedZahlungService, mitgliedForderungZahlungService, mitgliedForderungService, bankBuchungService, bankkontoService, veranstaltungZahlungService } from '../../services/finanzService';
import { mitgliedService } from '../../services/mitgliedService';
import { vereinService } from '../../services/vereinService';
import keytableService from '../../services/keytableService';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './FinanzDetail.css';

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const MitgliedZahlungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  // Animation effects
  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Copy to clipboard function with feedback
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Animate item on click
  const animateItem = (itemId: string) => {
    setAnimatingItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 600);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Export to PDF function
  const handleExportPDF = () => {
    // Create a simple text representation for now
    const paymentData = {
      referenz: zahlung?.referenz || '',
      betrag: zahlung?.betrag || 0,
      waehrung: waehrungen.find(w => w.id === zahlung?.waehrungId)?.code || '€',
      zahlungsdatum: zahlung?.zahlungsdatum || '',
      zahlungsweg: zahlung?.zahlungsweg || '',
      bemerkung: zahlung?.bemerkung || '',
      mitglied: mitglied ? `${mitglied.vorname} ${mitglied.nachname}` : '',
      mitgliedsnummer: mitglied?.mitgliedsnummer || '',
      allocations: allocations.map(a => ({
        forderungsnummer: a.forderungsnummer || `F-${a.forderungId}`,
        betrag: a.betrag,
        created: a.created
      })),
      totalAllocated,
      unallocatedAmount,
      allocationPercentage
    };

    // Create a formatted text content
    const content = `
ÖDEME DETAY RAPORU
===================

Ödeme Bilgileri:
----------------
Referans: ${paymentData.referenz}
Tutar: ${paymentData.waehrung} ${paymentData.betrag.toFixed(2)}
Tarih: ${new Date(paymentData.zahlungsdatum).toLocaleDateString('tr-TR')}
Ödeme Yöntemi: ${paymentData.zahlungsweg}
Açıklama: ${paymentData.bemerkung || '-'}

Üye Bilgileri:
--------------
Ad: ${paymentData.mitglied}
Üye No: ${paymentData.mitgliedsnummer}

Tahsis Bilgileri:
----------------
Toplam Ödeme: ${paymentData.waehrung} ${paymentData.betrag.toFixed(2)}
Tahsis Edilen: ${paymentData.waehrung} ${paymentData.totalAllocated.toFixed(2)}
Tahsis Edilmemiş: ${paymentData.waehrung} ${paymentData.unallocatedAmount.toFixed(2)}
Tahsis Oranı: %${paymentData.allocationPercentage.toFixed(1)}

Tahsis Detayları:
${paymentData.allocations.map(a => `
- ${a.forderungsnummer}: ${paymentData.waehrung} ${a.betrag.toFixed(2)} (${a.created ? new Date(a.created).toLocaleDateString('tr-TR') : '-'}
`).join('')}

Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}
    `.trim();

    // Create and download text file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `odeme-detay-${zahlung?.referenz || zahlung?.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to CSV function
  const handleExportCSV = () => {
    const csvContent = [
      ['Ödeme Detayları'],
      ['Referans', zahlung?.referenz || ''],
      ['Tutar', `${waehrungen.find(w => w.id === zahlung?.waehrungId)?.code || '€'} ${zahlung?.betrag.toFixed(2)}`],
      ['Tarih', zahlung?.zahlungsdatum ? new Date(zahlung.zahlungsdatum).toLocaleDateString('tr-TR') : ''],
      ['Ödeme Yöntemi', zahlung?.zahlungsweg || ''],
      ['Açıklama', zahlung?.bemerkung || ''],
      ['Üye', mitglied ? `${mitglied.vorname} ${mitglied.nachname}` : ''],
      ['Üye No', mitglied?.mitgliedsnummer || ''],
      [''],
      ['Tahsis Özeti'],
      ['Toplam Ödeme', `${waehrungen.find(w => w.id === zahlung?.waehrungId)?.code || '€'} ${zahlung?.betrag.toFixed(2)}`],
      ['Tahsis Edilen', `${waehrungen.find(w => w.id === zahlung?.waehrungId)?.code || '€'} ${totalAllocated.toFixed(2)}`],
      ['Tahsis Edilmemiş', `${waehrungen.find(w => w.id === zahlung?.waehrungId)?.code || '€'} ${unallocatedAmount.toFixed(2)}`],
      ['Tahsis Oranı', `%${allocationPercentage.toFixed(1)}`],
      [''],
      ['Tahsis Detayları'],
      ['Alacak No', 'Tutar', 'Tarih'],
      ...allocations.map(a => [
        a.forderungsnummer || `F-${a.forderungId}`,
        `${waehrungen.find(w => w.id === zahlung?.waehrungId)?.code || '€'} ${a.betrag.toFixed(2)}`,
        a.created ? new Date(a.created).toLocaleDateString('tr-TR') : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `odeme-detay-${zahlung?.referenz || zahlung?.id}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine back URL based on user type
  const backUrl = user?.type === 'mitglied' ? '/meine-finanzen' : '/finanzen/zahlungen';
  const editUrl = user?.type === 'mitglied'
    ? `/meine-finanzen/zahlungen/${id}/edit`
    : `/finanzen/zahlungen/${id}/edit`;

  // Check if user can edit/delete (only admin and dernek)
  const canEdit = user?.type === 'admin' || user?.type === 'dernek';

  // Fetch payment details
  const { data: zahlung, isLoading, error } = useQuery({
    queryKey: ['zahlung', id],
    queryFn: async () => {
      if (!id) throw new Error('ID not found');
      return await mitgliedZahlungService.getById(parseInt(id));
    },
    enabled: !!id,
  });

  // Fetch member details
  const { data: mitglied } = useQuery({
    queryKey: ['mitglied', zahlung?.mitgliedId],
    queryFn: async () => {
      if (!zahlung?.mitgliedId) return null;
      return await mitgliedService.getById(zahlung.mitgliedId);
    },
    enabled: !!zahlung?.mitgliedId,
  });

  // Fetch payment allocations (which claims this payment was allocated to)
  const { data: allocations = [] } = useQuery({
    queryKey: ['zahlung-allocations', id],
    queryFn: async () => {
      if (!id) return [];
      const allocs = await mitgliedForderungZahlungService.getByZahlungId(parseInt(id));

      // Fetch forderung details for each allocation
      const allocsWithDetails = await Promise.all(
        allocs.map(async (alloc) => {
          const forderung = await mitgliedForderungService.getById(alloc.forderungId);
          return {
            ...alloc,
            forderungsnummer: forderung.forderungsnummer,
          };
        })
      );

      return allocsWithDetails;
    },
    enabled: !!id,
  });

  // Fetch keytable data
  const { data: zahlungTypen = [] } = useQuery({
    queryKey: ['keytable', 'zahlungtypen'],
    queryFn: () => keytableService.getZahlungTypen(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const { data: waehrungen = [] } = useQuery({
    queryKey: ['keytable', 'waehrungen'],
    queryFn: () => keytableService.getWaehrungen(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Fetch bank account details if payment has bank account ID
  const { data: bankkonto } = useQuery({
    queryKey: ['bankkonto', zahlung?.bankkontoId],
    queryFn: async () => {
      if (!zahlung?.bankkontoId) return null;
      return await bankkontoService.getById(zahlung.bankkontoId);
    },
    enabled: !!zahlung?.bankkontoId,
  });

  // Fetch bank transaction details if payment has bank buchung ID
  const { data: bankBuchung } = useQuery({
    queryKey: ['bankBuchung', zahlung?.bankBuchungId],
    queryFn: async () => {
      if (!zahlung?.bankBuchungId) return null;
      return await bankBuchungService.getById(zahlung.bankBuchungId);
    },
    enabled: !!zahlung?.bankBuchungId,
  });

  // Fetch related event payment if this payment is related to an event
  const { data: eventPayment } = useQuery({
    queryKey: ['eventPayment', zahlung?.id],
    queryFn: async () => {
      if (!zahlung?.id) return null;
      // This would need a new endpoint to find event payments by member payment ID
      // For now, we'll use a placeholder
      return null;
    },
    enabled: !!zahlung?.id,
  });

  // Fetch verein details for additional context
  const { data: verein } = useQuery({
    queryKey: ['verein', zahlung?.vereinId],
    queryFn: async () => {
      if (!zahlung?.vereinId) return null;
      return await vereinService.getById(zahlung.vereinId);
    },
    enabled: !!zahlung?.vereinId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('ID not found');
      await mitgliedZahlungService.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahlungen'] });
      navigate(backUrl);
    },
  });

  if (isLoading) return <Loading />;
  if (error || !zahlung) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  // Check authorization
  if (user?.type === 'dernek' && user.vereinId !== zahlung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  // Calculate allocation totals
  const totalAllocated = allocations.reduce((sum, a) => sum + a.betrag, 0);
  const unallocatedAmount = zahlung.betrag - totalAllocated;
  
  // Calculate payment status
  const allocationPercentage = zahlung.betrag > 0 ? (totalAllocated / zahlung.betrag) * 100 : 0;
  const paymentStatus = allocationPercentage >= 100 ? 'completed' : allocationPercentage > 0 ? 'partial' : 'pending';

  return (
    <div className={`finanz-detail ${isLoaded ? 'loaded' : 'loading'}`}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1 className="page-title">{zahlung.referenz || t('finanz:payments.title')}</h1>
            <p className="page-subtitle">{t('finanz:payments.detail')}</p>
          </div>
          
          {/* Payment Status Badge */}
          <div className="payment-status-section">
            <div className={`payment-status-badge status-${paymentStatus}`}>
              {paymentStatus === 'completed' && '✓ ' + t('finanz:paymentStatus.completed')}
              {paymentStatus === 'partial' && '◐ ' + t('finanz:paymentStatus.partial')}
              {paymentStatus === 'pending' && '◑ ' + t('finanz:paymentStatus.pending')}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button
          className="btn-icon"
          onClick={() => navigate(backUrl)}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div className="actions-spacer"></div>
        
        {/* Export Actions */}
        <button
          className="btn btn-secondary"
          onClick={handlePrint}
          title="Yazdır"
        >
          🖨️ Yazdır
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleExportPDF}
          title="Metin Olarak İndir"
        >
          📄 Metin
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleExportCSV}
          title="CSV Olarak İndir"
        >
          📊 CSV
        </button>
        
        {canEdit && (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(editUrl)}
            >
              <EditIcon />
              {t('common:common.edit')}
            </button>
            <button
              className="btn btn-error"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
            >
              <TrashIcon />
              {deleteMutation.isPending ? t('common:common.deleting') : t('common:common.delete')}
            </button>
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-container">
        <div
          className={`summary-card payment-total ${hoveredCard === 'total' ? 'hovered' : ''} ${animatingItems.has('total') ? 'animating' : ''}`}
          onMouseEnter={() => setHoveredCard('total')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            animateItem('total');
            copyToClipboard(`${waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} ${zahlung.betrag.toFixed(2)}`, 'total');
          }}
        >
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-label">{t('finanz:summary.totalPayment')}</div>
            <div className="summary-value">
              {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {zahlung.betrag.toFixed(2)}
            </div>
            {copiedText === 'total' && <div className="copy-feedback">✓ Kopyalandı</div>}
          </div>
        </div>
        
        <div
          className={`summary-card allocated ${hoveredCard === 'allocated' ? 'hovered' : ''} ${animatingItems.has('allocated') ? 'animating' : ''}`}
          onMouseEnter={() => setHoveredCard('allocated')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            animateItem('allocated');
            copyToClipboard(`${waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} ${totalAllocated.toFixed(2)}`, 'allocated');
          }}
        >
          <div className="summary-icon">📋</div>
          <div className="summary-content">
            <div className="summary-label">{t('finanz:summary.allocated')}</div>
            <div className="summary-value">
              {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {totalAllocated.toFixed(2)}
            </div>
            <div className="summary-percentage">{allocationPercentage.toFixed(1)}%</div>
            {copiedText === 'allocated' && <div className="copy-feedback">✓ Kopyalandı</div>}
          </div>
        </div>
        
        <div
          className={`summary-card unallocated ${hoveredCard === 'unallocated' ? 'hovered' : ''} ${animatingItems.has('unallocated') ? 'animating' : ''}`}
          onMouseEnter={() => setHoveredCard('unallocated')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            animateItem('unallocated');
            copyToClipboard(`${waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {unallocatedAmount.toFixed(2)}`, 'unallocated');
          }}
        >
          <div className="summary-icon">💸</div>
          <div className="summary-content">
            <div className="summary-label">{t('finanz:summary.unallocated')}</div>
            <div className="summary-value">
              {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {unallocatedAmount.toFixed(2)}
            </div>
            <div className="summary-percentage">{(100 - allocationPercentage).toFixed(1)}%</div>
            {copiedText === 'unallocated' && <div className="copy-feedback">✓ Kopyalandı</div>}
          </div>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="payment-progress-section">
        <div className="progress-header">
          <span className="progress-label">{t('finanz:progress.allocationStatus')}</span>
          <span className="progress-percentage">{allocationPercentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-wrapper">
          <div
            className={`progress-bar-fill ${paymentStatus}`}
            style={{ width: `${allocationPercentage}%` }}
          ></div>
        </div>
        <div className="progress-amounts">
          <div className="progress-allocated">
            <span className="amount-label">{t('finanz:progress.allocated')}</span>
            <span className="amount-value">
              {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {totalAllocated.toFixed(2)}
            </span>
          </div>
          <div className="progress-remaining">
            <span className="amount-label">{t('finanz:progress.remaining')}</span>
            <span className="amount-value">
              {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {unallocatedAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Payment Information - Enhanced */}
        <div className="detail-section">
          <div className="section-header">
            <h2>{t('finanz:payments.information')}</h2>
            <div className="payment-method-indicator">
              {zahlung.zahlungsweg === 'UEBERWEISUNG' && '🏦'}
              {zahlung.zahlungsweg === 'BAR' && '💵'}
              {zahlung.zahlungsweg === 'LASTSCHRIFT' && '🔄'}
              {zahlung.zahlungsweg === 'KREDITKARTE' && '💳'}
              {zahlung.zahlungsweg === 'PAYPAL' && '🅿️'}
              {zahlung.zahlungsweg === 'SCHECK' && '📄'}
              {zahlung.zahlungsweg === 'SONSTIGE' && '📋'}
            </div>
          </div>
          <div className="detail-grid-compact">
            {mitglied && (
              <>
                <div className="detail-item member-info">
                  <label>{t('finanz:member.number')}</label>
                  <div className="detail-value member-number">{mitglied.mitgliedsnummer}</div>
                </div>
                <div className="detail-item member-info">
                  <label>{t('finanz:member.name')}</label>
                  <div className="detail-value member-name">
                    <Link to={`/mitglieder/${mitglied.id}`} className="link-primary">
                      {mitglied.vorname} {mitglied.nachname}
                    </Link>
                  </div>
                </div>
              </>
            )}
            <div className="detail-item payment-reference">
              <label>{t('finanz:payments.number')}</label>
              <div className="detail-value reference-number">{zahlung.referenz || '-'}</div>
            </div>
            <div className="detail-item payment-amount">
              <label>{t('finanz:payments.amount')}</label>
              <div className="detail-value amount-highlight">
                <span className="currency-symbol">{waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'}</span>
                <span className="amount-figures">{zahlung.betrag.toFixed(2)}</span>
              </div>
            </div>
            <div className="detail-item">
              <label>{t('finanz:payments.currency')}</label>
              <div className="detail-value currency-badge">{waehrungen.find(w => w.id === zahlung.waehrungId)?.name || '-'}</div>
            </div>
            <div className="detail-item payment-type">
              <label>{t('finanz:payments.type')}</label>
              <div className="detail-value type-badge">{zahlungTypen.find(zt => zt.id === zahlung.zahlungTypId)?.name || '-'}</div>
            </div>
            <div className="detail-item payment-date">
              <label>{t('finanz:payments.date')}</label>
              <div className="detail-value date-highlight">
                <div className="date-day">{new Date(zahlung.zahlungsdatum).getDate()}</div>
                <div className="date-month-year">
                  <div className="date-month">{new Date(zahlung.zahlungsdatum).toLocaleDateString('tr-TR', { month: 'short' })}</div>
                  <div className="date-year">{new Date(zahlung.zahlungsdatum).getFullYear()}</div>
                </div>
              </div>
            </div>
            <div className="detail-item payment-method">
              <label>{t('finanz:payments.method')}</label>
              <div className="detail-value method-badge">
                <span className="method-icon">
                  {zahlung.zahlungsweg === 'UEBERWEISUNG' && '🏦'}
                  {zahlung.zahlungsweg === 'BAR' && '💵'}
                  {zahlung.zahlungsweg === 'LASTSCHRIFT' && '🔄'}
                  {zahlung.zahlungsweg === 'KREDITKARTE' && '💳'}
                  {zahlung.zahlungsweg === 'PAYPAL' && '🅿️'}
                  {zahlung.zahlungsweg === 'SCHECK' && '📄'}
                  {zahlung.zahlungsweg === 'SONSTIGE' && '📋'}
                </span>
                <span className="method-text">{zahlung.zahlungsweg || '-'}</span>
              </div>
            </div>
            <div className="detail-item full-width payment-description">
              <label>{t('finanz:payments.description')}</label>
              <div className="detail-value description-box">{zahlung.bemerkung || '-'}</div>
            </div>
          </div>
        </div>

        {/* Payment Allocations */}
        <div className="detail-section">
          <h2>📋 {t('finanz:allocations.title')}</h2>
          {allocations.length > 0 ? (
            <>
              <div className="payment-summary" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'var(--color-background-secondary)',
                borderRadius: '8px'
              }}>
                <div className="summary-item">
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {t('finanz:allocations.totalPayment')}
                  </label>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>
                    € {zahlung.betrag.toFixed(2)}
                  </strong>
                </div>
                <div className="summary-item">
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {t('finanz:allocations.allocated')}
                  </label>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--color-success)' }}>
                    € {totalAllocated.toFixed(2)}
                  </strong>
                </div>
                <div className="summary-item">
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {t('finanz:allocations.unallocated')}
                  </label>
                  <strong style={{
                    fontSize: '1.25rem',
                    color: unallocatedAmount > 0 ? 'var(--color-warning)' : 'var(--color-text)'
                  }}>
                    € {unallocatedAmount.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('finanz:claims.number')}</th>
                      <th>{t('finanz:allocations.amount')}</th>
                      <th>{t('finanz:allocations.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => (
                      <tr key={allocation.id}>
                        <td>
                          <Link
                            to={`/meine-finanzen/forderungen/${allocation.forderungId}`}
                            className="link-primary"
                          >
                            {allocation.forderungsnummer || `F-${allocation.forderungId}`}
                          </Link>
                        </td>
                        <td>€ {allocation.betrag.toFixed(2)}</td>
                        <td>{allocation.created ? new Date(allocation.created).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {unallocatedAmount > 0 && (
                <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                  <p>⚠️ {t('finanz:allocations.unallocatedWarning', { amount: unallocatedAmount.toFixed(2) })}</p>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <p>ℹ️ {t('finanz:allocations.noAllocations')}</p>
            </div>
          )}
        </div>

        {/* Bank Account Information */}
        {bankkonto && (
          <div className="detail-section">
            <h2>🏦 {t('finanz:bankAccount.title')}</h2>
            <div className="detail-grid-compact">
              <div className="detail-item">
                <label>{t('finanz:bankAccount.iban')}</label>
                <div className="detail-value">{bankkonto.iban}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankAccount.bankName')}</label>
                <div className="detail-value">{bankkonto.bankname || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankAccount.accountHolder')}</label>
                <div className="detail-value">{bankkonto.kontoinhaber || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankAccount.bic')}</label>
                <div className="detail-value">{bankkonto.bic || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankAccount.description')}</label>
                <div className="detail-value">{bankkonto.beschreibung || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankAccount.type')}</label>
                <div className="detail-value">{bankkonto.kontotypId ? `ID: ${bankkonto.kontotypId}` : '-'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transaction Information */}
        {bankBuchung && (
          <div className="detail-section">
            <h2>📊 {t('finanz:bankTransaction.title')}</h2>
            <div className="detail-grid-compact">
              <div className="detail-item">
                <label>{t('finanz:bankTransaction.date')}</label>
                <div className="detail-value">{new Date(bankBuchung.buchungsdatum).toLocaleDateString()}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankTransaction.amount')}</label>
                <div className="detail-value amount">
                  {waehrungen.find(w => w.id === bankBuchung.waehrungId)?.code || '€'} {bankBuchung.betrag.toFixed(2)}
                </div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankTransaction.recipient')}</label>
                <div className="detail-value">{bankBuchung.empfaenger || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankTransaction.reference')}</label>
                <div className="detail-value">{bankBuchung.referenz || '-'}</div>
              </div>
              <div className="detail-item full-width">
                <label>{t('finanz:bankTransaction.purpose')}</label>
                <div className="detail-value">{bankBuchung.verwendungszweck || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:bankTransaction.bookingDate')}</label>
                <div className="detail-value">{bankBuchung.angelegtAm ? new Date(bankBuchung.angelegtAm).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Related Event Information */}
        {eventPayment && (
          <div className="detail-section">
            <h2>🎫 {t('finanz:event.title')}</h2>
            <div className="detail-grid-compact">
              <div className="detail-item">
                <label>{t('finanz:event.name')}</label>
                <div className="detail-value">{(eventPayment as any)?.veranstaltungTitel || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:event.date')}</label>
                <div className="detail-value">{(eventPayment as any)?.veranstaltungDatum ? new Date((eventPayment as any).veranstaltungDatum).toLocaleDateString() : '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:event.location')}</label>
                <div className="detail-value">{(eventPayment as any)?.veranstaltungOrt || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:event.participantName')}</label>
                <div className="detail-value">{(eventPayment as any)?.name || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:event.participantEmail')}</label>
                <div className="detail-value">{(eventPayment as any)?.email || '-'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Organization Information */}
        {verein && (
          <div className="detail-section">
            <h2>🏢 {t('finanz:organization.title')}</h2>
            <div className="detail-grid-compact">
              <div className="detail-item">
                <label>{t('finanz:organization.name')}</label>
                <div className="detail-value">{verein.name || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:organization.vereinNumber')}</label>
                <div className="detail-value">{verein.vereinsnummer || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:organization.email')}</label>
                <div className="detail-value">{verein.email || '-'}</div>
              </div>
              <div className="detail-item">
                <label>{t('finanz:organization.phone')}</label>
                <div className="detail-value">{verein.telefon || '-'}</div>
              </div>
              {verein.hauptBankkontoId && (
                <div className="detail-item">
                  <label>{t('finanz:organization.mainBankAccount')}</label>
                  <div className="detail-value">ID: {verein.hauptBankkontoId}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Timeline */}
        <div className="detail-section">
          <div className="section-header">
            <h2>📅 {t('finanz:paymentTimeline.title')}</h2>
          </div>
          <div className="payment-timeline">
            <div className="timeline-container">
              {/* Payment Created */}
              <div className="timeline-item completed">
                <div className="timeline-marker">
                  <div className="marker-dot completed"></div>
                  <div className="marker-line"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    {new Date(zahlung.created || zahlung.zahlungsdatum).toLocaleDateString()}
                  </div>
                  <div className="timeline-details">
                    <div className="timeline-amount">
                      {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {zahlung.betrag.toFixed(2)}
                    </div>
                    <div className="timeline-id">#{zahlung.id}</div>
                    <div className="timeline-status">
                      {t('finanz:paymentTimeline.status.created')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Allocations */}
              {allocations.length > 0 && (
                <div className="timeline-item completed">
                  <div className="timeline-marker">
                    <div className="marker-dot completed"></div>
                    <div className="marker-line"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-date">
                      {allocations[0].created ? new Date(allocations[0].created).toLocaleDateString() : '-'}
                    </div>
                    <div className="timeline-details">
                      <div className="timeline-amount">
                        {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {totalAllocated.toFixed(2)}
                      </div>
                      <div className="timeline-id">
                        {allocations.length} {t('finanz:paymentTimeline.allocations')}
                      </div>
                      <div className="timeline-status">
                        {t('finanz:paymentTimeline.status.allocated')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Unallocated Amount */}
              {unallocatedAmount > 0 && (
                <div className="timeline-item pending">
                  <div className="timeline-marker">
                    <div className="marker-dot pending"></div>
                    <div className="marker-line"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-date">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="timeline-details">
                      <div className="timeline-amount pending">
                        {waehrungen.find(w => w.id === zahlung.waehrungId)?.code || '€'} {unallocatedAmount.toFixed(2)}
                      </div>
                      <div className="timeline-id">
                        {t('finanz:paymentTimeline.unallocated')}
                      </div>
                      <div className="timeline-status pending">
                        {t('finanz:paymentTimeline.status.pending')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t('common:confirmDelete')}</h2>
            <p>{t('finanz:payments.deleteConfirm')}</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t('common:cancel')}
              </button>
              <button
                className="btn btn-error"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? t('common:common.deleting') : t('common:common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitgliedZahlungDetail;
