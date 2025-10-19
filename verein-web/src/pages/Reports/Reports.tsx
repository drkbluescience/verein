import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import AdminRaporlar from './AdminRaporlar';
import DernekRaporlar from './DernekRaporlar';

const Reports: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation('reports');
  const { user } = useAuth();

  // Admin sees all reports, Dernek sees only their verein reports
  if (user?.type === 'admin') {
    return <AdminRaporlar />;
  } else if (user?.type === 'dernek') {
    return <DernekRaporlar />;
  }

  // Mitglied users shouldn't access reports
  return (
    <div className="reports-container">
      <h1>{t('title')}</h1>
      <p>{t('noAccess')}</p>
    </div>
  );
};

export default Reports;

