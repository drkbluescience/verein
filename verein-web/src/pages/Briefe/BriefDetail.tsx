import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefService } from '../../services';
import { BriefStatus, StatusLabels } from '../../types/brief.types';
import { useToast } from '../../contexts/ToastContext';
import './BriefDetail.css';

const BriefDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: brief, isLoading } = useQuery({
    queryKey: ['brief', id],
    queryFn: () => briefService.getById(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => briefService.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.deleted'));
      navigate('/briefe');
    },
    onError: () => showError(t('briefe:messages.deleteError')),
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (brief && window.confirm(t('briefe:confirmDelete', { name: brief.name }))) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!brief) {
    return (
      <div className="brief-detail-page">
        <div className="error-state">
          <h2>{t('briefe:errors.notFound')}</h2>
          <button className="btn-secondary" onClick={() => navigate('/briefe')}>
            ← {t('common:back')}
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = StatusLabels[brief.status]?.[i18n.language as 'de' | 'tr'] || brief.status;

  return (
    <div className="brief-detail-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/briefe')}>
          ← {t('common:back')}
        </button>
        <div className="header-actions">
          {brief.status === BriefStatus.Entwurf && (
            <>
              <button className="btn-secondary" onClick={() => navigate(`/briefe/${id}/bearbeiten`)}>
                ✏️ {t('common:edit')}
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                🗑️ {t('common:delete')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="brief-detail-content">
        <div className="brief-header">
          <h1>{brief.name}</h1>
          <span className={`status-badge ${brief.status.toLowerCase()}`}>{statusLabel}</span>
        </div>

        <div className="brief-meta">
          <div className="meta-item">
            <span className="label">{t('briefe:form.subject')}:</span>
            <span className="value">{brief.betreff}</span>
          </div>
          {brief.vorlageName && (
            <div className="meta-item">
              <span className="label">{t('briefe:form.template')}:</span>
              <span className="value">📋 {brief.vorlageName}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="label">{t('briefe:table.recipients')}:</span>
            <span className="value">{brief.empfaengerAnzahl || 0}</span>
          </div>
          {brief.gesendetDatum && (
            <div className="meta-item">
              <span className="label">{t('briefe:detail.sentAt')}:</span>
              <span className="value">{formatDate(brief.gesendetDatum)}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="label">{t('common:created')}:</span>
            <span className="value">{formatDate(brief.created)}</span>
          </div>
        </div>

        <div className="brief-body">
          <h3>{t('briefe:detail.content')}</h3>
          <div className="content-preview" dangerouslySetInnerHTML={{ __html: brief.inhalt }} />
        </div>
      </div>
    </div>
  );
};

export default BriefDetail;

