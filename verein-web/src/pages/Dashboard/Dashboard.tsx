import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { healthService, vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService } from '../../services/veranstaltungService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './Dashboard.css';

interface HealthStatus {
  status: string;
  timestamp: string;
  version?: string;
  environment?: string;
  database?: string;
  uptime?: string;
}

interface DashboardStats {
  totalVereine: number;
  activeVereine: number;
  totalMitglieder: number;
  totalVeranstaltungen: number;
}

const Dashboard: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVereine: 0,
    activeVereine: 0,
    totalMitglieder: 0,
    totalVeranstaltungen: 0,
  });

  // Health check query
  const {
    data: healthStatus,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth
  } = useQuery<HealthStatus>({
    queryKey: ['health'],
    queryFn: healthService.check,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Vereine query for stats - filtered by user role
  const {
    data: vereine,
    isLoading: vereineLoading
  } = useQuery({
    queryKey: ['vereine', user?.vereinId],
    queryFn: async () => {
      // If user is Mitglied (member), only show their Verein
      if (user?.type === 'mitglied' && user?.vereinId) {
        const verein = await vereinService.getById(user.vereinId);
        return [verein];
      }
      // Admin and Dernek can see all Vereine
      return vereinService.getAll();
    },
    enabled: !!healthStatus && !!user, // Only fetch if health check passes and user is loaded
  });

  // Mitglieder query for stats - filtered by user role
  const {
    data: mitgliederData
  } = useQuery({
    queryKey: ['mitglieder', user?.vereinId],
    queryFn: async () => {
      // If user is Mitglied, only show members from their Verein
      if (user?.type === 'mitglied' && user?.vereinId) {
        return mitgliedService.getByVereinId(user.vereinId, true);
      }
      // Admin and Dernek can see all members
      return mitgliedService.getAll({ pageNumber: 1, pageSize: 1000 });
    },
    enabled: !!healthStatus && !!user,
  });

  // Veranstaltungen query for stats - filtered by user role
  const {
    data: veranstaltungen
  } = useQuery({
    queryKey: ['veranstaltungen', user?.vereinId],
    queryFn: async () => {
      // If user is Mitglied, only show events from their Verein
      if (user?.type === 'mitglied' && user?.vereinId) {
        return veranstaltungService.getByVereinId(user.vereinId);
      }
      // Admin and Dernek can see all events
      return veranstaltungService.getAll();
    },
    enabled: !!healthStatus && !!user,
  });

  // Update stats when data changes
  useEffect(() => {
    if (vereine || mitgliederData || veranstaltungen) {
      // Handle mitgliederData which can be PagedResult or array
      const mitgliederCount = Array.isArray(mitgliederData)
        ? mitgliederData.length
        : mitgliederData?.items?.length || 0;

      setStats({
        totalVereine: vereine?.length || 0,
        activeVereine: vereine?.filter(v => v.aktiv).length || 0,
        totalMitglieder: mitgliederCount,
        totalVeranstaltungen: veranstaltungen?.length || 0,
      });
    }
  }, [vereine, mitgliederData, veranstaltungen]);

  const isConnected = healthStatus?.status === 'Healthy';

  if (healthLoading) {
    return <Loading text={t('dashboard:systemStatus.checking')} />;
  }

  if (healthError) {
    return (
      <ErrorMessage
        title={t('dashboard:errors.connectionError')}
        message={t('dashboard:errors.apiError')}
        onRetry={() => refetchHealth()}
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">{t('dashboard:title')}</h1>
      </div>

      {/* System Status */}
      <div className="status-section">
        <div className={`status-card ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
          <div className="status-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <div className="status-info">
            <h3>{t('dashboard:systemStatus.title')}</h3>
            <p className="status-text">
              {isConnected ? t('dashboard:systemStatus.connected') : t('dashboard:systemStatus.disconnected')}
            </p>
            {healthStatus && (
              <div className="status-details">
                <span>{t('dashboard:systemStatus.version')}: {healthStatus.version || 'N/A'}</span>
                <span>{t('dashboard:systemStatus.environment')}: {healthStatus.environment || 'N/A'}</span>
                <span>{t('dashboard:systemStatus.database')}: {healthStatus.database || 'N/A'}</span>
                {healthStatus.uptime && <span>{t('dashboard:systemStatus.uptime')}: {healthStatus.uptime}</span>}
              </div>
            )}
          </div>
          <div className="status-timestamp">
            {healthStatus && new Date(healthStatus.timestamp).toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <h2>{t('dashboard:statistics.title')}</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{t('dashboard:statistics.totalVereine')}</h3>
              <div className="stat-number">
                {vereineLoading ? <Loading size="small" /> : stats.totalVereine}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{t('dashboard:statistics.activeVereine')}</h3>
              <div className="stat-number">
                {vereineLoading ? <Loading size="small" /> : stats.activeVereine}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{t('dashboard:statistics.totalMitglieder')}</h3>
              <div className="stat-number">{stats.totalMitglieder}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{t('dashboard:statistics.totalVeranstaltungen')}</h3>
              <div className="stat-number">{stats.totalVeranstaltungen}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h2>{t('dashboard:quickActions.title')}</h2>
        <div className="actions-grid">
          <Link to="/vereine" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="action-info">
              <h3>{t('dashboard:quickActions.manageVereine.title')}</h3>
              <p>{t('dashboard:quickActions.manageVereine.description')}</p>
            </div>
          </Link>

          <Link to="/mitglieder" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="action-info">
              <h3>{t('dashboard:quickActions.manageMitglieder.title')}</h3>
              <p>{t('dashboard:quickActions.manageMitglieder.description')}</p>
            </div>
          </Link>

          <Link to="/veranstaltungen" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="action-info">
              <h3>{t('dashboard:quickActions.manageVeranstaltungen.title')}</h3>
              <p>{t('dashboard:quickActions.manageVeranstaltungen.description')}</p>
            </div>
          </Link>

          <Link to="/berichte" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div className="action-info">
              <h3>{t('dashboard:quickActions.viewReports.title')}</h3>
              <p>{t('dashboard:quickActions.viewReports.description')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
