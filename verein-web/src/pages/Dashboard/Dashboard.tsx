import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService } from '../../services/veranstaltungService';
import { vereinSatzungService } from '../../services/vereinSatzungService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import './Dashboard.css';

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
    enabled: !!user, // Only fetch if user is loaded
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
    enabled: !!user,
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
    enabled: !!user,
  });

  // Debug: Log user info immediately - Force console to work
  setTimeout(() => {
    console.log('=== DASHBOARD DEBUG ===');
    console.log('Dashboard - User:', user);
    console.log('Dashboard - User type:', user?.type, 'typeof:', typeof user?.type);
    console.log('Dashboard - VereinId:', user?.vereinId);
    console.log('Dashboard - Permissions:', user?.permissions);
    console.log('=== END DEBUG ===');
  }, 100);

  // Get latest statute for Dernek Yöneticisi - Always try to fetch
  const {
    data: latestSatzung,
    isLoading: satzungLoading
  } = useQuery({
    queryKey: ['latestSatzung', user?.vereinId],
    queryFn: async () => {
      // Debug: Log user type and vereinId
      console.log('=== SATZUNG QUERY START ===');
      console.log('Dashboard Query - User:', user);
      console.log('Dashboard Query - User type:', user?.type);
      console.log('Dashboard Query - VereinId:', user?.vereinId);
      
      // Check for multiple possible user type values
      const userTypeStr = (user?.type as string)?.toString().toLowerCase();
      const isDernekUser = userTypeStr === 'dernek' ||
                         userTypeStr === 'vorstand' || // German for association board
                         user?.permissions?.includes('verein_management') ||
                         user?.permissions?.includes('dernek_yonetimi');
      
      console.log('Dashboard Query - userTypeStr:', userTypeStr, 'isDernekUser:', isDernekUser);
      
      // Always try to fetch if we have a vereinId
      if (user?.vereinId) {
        console.log('Dashboard Query - Fetching satzung for vereinId:', user.vereinId);
        try {
          const result = await vereinSatzungService.getActiveByVereinId(user.vereinId);
          console.log('Dashboard Query - Satzung result:', result);
          console.log('=== SATZUNG QUERY END ===');
          return result;
        } catch (error) {
          console.error('Dashboard Query - Error fetching satzung:', error);
          console.log('=== SATZUNG QUERY ERROR ===');
          return null;
        }
      }
      console.log('Dashboard Query - No vereinId, not fetching');
      console.log('=== SATZUNG QUERY END ===');
      return null;
    },
    enabled: !!user?.vereinId, // Only need vereinId, not user type check
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

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">{t('dashboard:title')}</h1>
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

      {/* Latest Statute Info - Show for users with vereinId */}
      {user?.vereinId && (
        <div className="satzung-section">
          <h2>{t('dashboard:latestStatute.title')}</h2>
          <div className="satzung-info-card">
            <div className="satzung-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div className="satzung-info">
              <h3>{t('dashboard:latestStatute.lastUploadDate')}</h3>
              <div className="satzung-date">
                {satzungLoading ? (
                  <Loading size="small" />
                ) : latestSatzung?.created ? (
                  <>
                    {new Date(latestSatzung.created).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    <span className={`satzung-status-badge ${latestSatzung.aktiv ? 'active' : 'inactive'}`}>
                      {latestSatzung.aktiv ? t('dashboard:latestStatute.active') : t('dashboard:latestStatute.inactive')}
                    </span>
                  </>
                ) : (
                  <span className="no-satzung">{t('dashboard:latestStatute.noStatute')}</span>
                )}
              </div>
              {latestSatzung?.dosyaAdi && (
                <div className="satzung-filename">
                  {t('dashboard:latestStatute.fileName')}: {latestSatzung.dosyaAdi}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
