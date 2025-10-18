import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminRaporlar from './AdminRaporlar';
import DernekRaporlar from './DernekRaporlar';

const Reports: React.FC = () => {
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
      <h1>Raporlar</h1>
      <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
    </div>
  );
};

export default Reports;

