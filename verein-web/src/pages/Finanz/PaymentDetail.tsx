import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
// Icon components - using simple spans for now
const FiArrowLeft = ({ className }: { className?: string }) => <span className={className}>←</span>;
const FiCopy = ({ className }: { className?: string }) => <span className={className}>📋</span>;
const FiDownload = ({ className }: { className?: string }) => <span className={className}>📥</span>;
const FiShare2 = ({ className }: { className?: string }) => <span className={className}>🔗</span>;
const FiCalendar = ({ className }: { className?: string }) => <span className={className}>📅</span>;
const FiDollarSign = ({ className }: { className?: string }) => <span className={className}>💰</span>;
const FiUser = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const FiCreditCard = ({ className }: { className?: string }) => <span className={className}>💳</span>;
const FiAlertCircle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
const FiCheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>;
const FiClock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const FiTrendingUp = ({ className }: { className?: string }) => <span className={className}>📈</span>;
const FiFileText = ({ className }: { className?: string }) => <span className={className}>📄</span>;
const FiMail = ({ className }: { className?: string }) => <span className={className}>📧</span>;
const FiPhone = ({ className }: { className?: string }) => <span className={className}>📞</span>;
const FiMapPin = ({ className }: { className?: string }) => <span className={className}>📍</span>;
const FiInfo = ({ className }: { className?: string }) => <span className={className}>ℹ️</span>;
const FiEdit = ({ className }: { className?: string }) => <span className={className}>✏️</span>;
const FiTrash2 = ({ className }: { className?: string }) => <span className={className}>🗑️</span>;
const FiRefreshCw = ({ className }: { className?: string }) => <span className={className}>🔄</span>;

import { mitgliedForderungService } from '../../services/finanzService';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { useToast } from '../../contexts/ToastContext';
import './PaymentDetail.css';

interface PaymentDetailProps {}

const PaymentDetail: React.FC<PaymentDetailProps> = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'documents'>('overview');
  const [isCopying, setIsCopying] = useState(false);

  const {
    data: payment,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => mitgliedForderungService.getById(Number(id)),
    enabled: !!id
  });

  const handleCopyToClipboard = async (text: string, label: string) => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} ${t('copied_to_clipboard')}`, 'success');
    } catch (err) {
      showToast(t('copy_failed'), 'error');
    } finally {
      setIsCopying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('payment_details'),
          text: `${t('payment_number')}: ${payment?.forderungsnummer}`,
          url: window.location.href
        });
      } catch (err) {
        showToast(t('share_failed'), 'error');
      }
    } else {
      handleCopyToClipboard(window.location.href, t('payment_link'));
    }
  };

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <FiCheckCircle className="status-icon paid" />;
      case 2:
        return <FiClock className="status-icon pending" />;
      case 3:
        return <FiAlertCircle className="status-icon overdue" />;
      default:
        return <FiClock className="status-icon pending" />;
    }
  };

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1:
        return t('paid');
      case 2:
        return t('unpaid');
      case 3:
        return t('overdue');
      default:
        return t('unknown');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !payment) {
    return <ErrorMessage message={t('payment_not_found')} />;
  }

  return (
    <div className="payment-detail-container">
      <div className="payment-detail-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          {t('back')}
        </button>
        
        <div className="header-actions">
          <button
            className="action-button"
            onClick={() => refetch()}
            title={t('refresh')}
          >
            <FiRefreshCw />
          </button>
          <button
            className="action-button"
            onClick={handlePrint}
            title={t('print')}
          >
            <FiDownload />
          </button>
          <button
            className="action-button"
            onClick={handleShare}
            title={t('share')}
          >
            <FiShare2 />
          </button>
        </div>
      </div>

      <div className="payment-detail-content">
        <div className="payment-overview-card">
          <div className="payment-header">
            <div className="payment-number">
              <h2>{payment.forderungsnummer}</h2>
              <div className="payment-status">
                {getStatusIcon(payment.statusId)}
                <span>{getStatusText(payment.statusId)}</span>
              </div>
            </div>
            <div className="payment-amount">
              <h3>{formatCurrency(payment.betrag)}</h3>
              <span className="currency">EUR</span>
            </div>
          </div>

          <div className="payment-info-grid">
            <div className="info-item">
              <FiUser className="info-icon" />
              <div className="info-content">
                <label>{t('member')}</label>
                <span>Üye #{payment.mitgliedId}</span>
              </div>
            </div>

            <div className="info-item">
              <FiCalendar className="info-icon" />
              <div className="info-content">
                <label>{t('issue_date')}</label>
                <span>{formatDate(payment.created || null)}</span>
              </div>
            </div>

            <div className="info-item">
              <FiCalendar className="info-icon" />
              <div className="info-content">
                <label>{t('due_date')}</label>
                <span className={new Date(payment.faelligkeit) < new Date() ? 'overdue' : ''}>
                  {formatDate(payment.faelligkeit)}
                </span>
              </div>
            </div>

            <div className="info-item">
              <FiFileText className="info-icon" />
              <div className="info-content">
                <label>{t('description')}</label>
                <span>{payment.beschreibung || '-'}</span>
              </div>
            </div>

            {payment.bezahltAm && (
              <div className="info-item">
                <FiCheckCircle className="info-icon" />
                <div className="info-content">
                  <label>{t('paid_date')}</label>
                  <span>{formatDate(payment.bezahltAm)}</span>
                </div>
              </div>
            )}

            {payment.paidAmount > 0 && (
              <div className="info-item">
                <FiDollarSign className="info-icon" />
                <div className="info-content">
                  <label>{t('paid_amount')}</label>
                  <span>{formatCurrency(payment.paidAmount)}</span>
                </div>
              </div>
            )}

            {payment.remainingAmount > 0 && (
              <div className="info-item">
                <FiAlertCircle className="info-icon" />
                <div className="info-content">
                  <label>{t('remaining_amount')}</label>
                  <span className="remaining">{formatCurrency(payment.remainingAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="payment-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {t('overview')}
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            {t('payment_history')}
          </button>
          <button
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            {t('documents')}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="payment-details-section">
                <h3>{t('payment_details')}</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>{t('payment_type')}</label>
                    <span>Ödeme Türü</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('period')}</label>
                    <span>
                      {payment.jahr && payment.monat 
                        ? `${payment.jahr}/${payment.monat.toString().padStart(2, '0')}`
                        : '-'
                      }
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>{t('quarter')}</label>
                    <span>{payment.quartal || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('created_by')}</label>
                    <span>-</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('modified_by')}</label>
                    <span>-</span>
                  </div>
                </div>
              </div>

              <div className="member-info-section">
                <h3>{t('member_information')}</h3>
                <div className="member-details">
                  <div className="detail-item">
                    <label>{t('member_number')}</label>
                    <span>#{payment.mitgliedId}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('member_id')}</label>
                    <span>{payment.mitgliedId}</span>
                  </div>
                </div>
              </div>

              <div className="payment-actions">
                <button className="action-button primary">
                  <FiEdit />
                  {t('edit_payment')}
                </button>
                <button className="action-button secondary">
                  <FiCreditCard />
                  {t('record_payment')}
                </button>
                <button className="action-button danger">
                  <FiTrash2 />
                  {t('delete_payment')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <h3>{t('payment_history')}</h3>
              <div className="payment-history-list">
                <div className="no-history">
                  <FiInfo />
                  <p>{t('no_payment_history')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-tab">
              <h3>{t('documents')}</h3>
              <div className="documents-list">
                <div className="no-documents">
                  <FiInfo />
                  <p>{t('no_documents')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;