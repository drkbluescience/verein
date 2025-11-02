import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService, veranstaltungUtils } from '../../services/veranstaltungService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import './VereinDashboard.css';

// Icon Components
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

interface VereinStats {
  totalMitglieder: number;
  activeMitglieder: number;
  totalVeranstaltungen: number;
  upcomingVeranstaltungen: number;
  thisMonthRegistrations: number;
  thisMonthEvents: number;
}

interface RecentActivity {
  id: number;
  type: 'member' | 'event' | 'registration';
  title: string;
  description: string;
  date: string;
  icon: string;
}

const VereinDashboard: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const vereinId = user?.vereinId || 1; // Get from user context
  const [stats, setStats] = useState<VereinStats>({
    totalMitglieder: 0,
    activeMitglieder: 0,
    totalVeranstaltungen: 0,
    upcomingVeranstaltungen: 0,
    thisMonthRegistrations: 0,
    thisMonthEvents: 0,
  });

  // Note: Verein details are now shown only in sidebar

  // Fetch mitglieder for this verein
  const {
    data: mitglieder,
    isLoading: mitgliederLoading
  } = useQuery({
    queryKey: ['mitglieder', vereinId],
    queryFn: () => mitgliedService.getByVereinId(vereinId, false), // Get all members
    enabled: !!vereinId,
  });

  // Fetch veranstaltungen for this verein
  const {
    data: veranstaltungen,
    isLoading: veranstaltungenLoading
  } = useQuery({
    queryKey: ['veranstaltungen', vereinId],
    queryFn: () => veranstaltungService.getByVereinId(vereinId),
    enabled: !!vereinId,
  });



  // Generate recent activities from real data
  const generateRecentActivities = (): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    // Add recent members (last 30 days)
    if (mitglieder) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentMembers = mitglieder
        .filter(m => m.eintrittsdatum && new Date(m.eintrittsdatum) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.eintrittsdatum!).getTime() - new Date(a.eintrittsdatum!).getTime())
        .slice(0, 3);

      recentMembers.forEach(member => {
        const joinDate = new Date(member.eintrittsdatum!);
        const daysAgo = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        const dateText = daysAgo === 0 ? t('dashboard:verein.recentActivities.today') :
                        daysAgo === 1 ? t('dashboard:verein.recentActivities.oneDayAgo') :
                        `${daysAgo} ${t('dashboard:verein.recentActivities.daysAgo')}`;
        activities.push({
          id: member.id,
          type: 'member',
          title: t('dashboard:verein.recentActivities.newMember'),
          description: `${member.vorname} ${member.nachname} ${t('dashboard:verein.recentActivities.memberJoined')}`,
          date: dateText,
          icon: 'user'
        });
      });
    }

    // Add recent events (last 30 days)
    if (veranstaltungen) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentEvents = veranstaltungen
        .filter(v => v.created && new Date(v.created) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.created!).getTime() - new Date(a.created!).getTime())
        .slice(0, 3);

      recentEvents.forEach(event => {
        const createDate = new Date(event.created!);
        const daysAgo = Math.floor((Date.now() - createDate.getTime()) / (1000 * 60 * 60 * 24));
        const dateText = daysAgo === 0 ? t('dashboard:verein.recentActivities.today') :
                        daysAgo === 1 ? t('dashboard:verein.recentActivities.oneDayAgo') :
                        `${daysAgo} ${t('dashboard:verein.recentActivities.daysAgo')}`;
        activities.push({
          id: event.id,
          type: 'event',
          title: t('dashboard:verein.recentActivities.eventCreated'),
          description: `${event.titel} ${t('dashboard:verein.recentActivities.eventAdded')}`,
          date: dateText,
          icon: 'calendar'
        });
      });
    }

    // Sort all activities by date and return top 5
    return activities
      .sort((a, b) => {
        // Simple sorting by date string - could be improved
        const todayText = t('dashboard:verein.recentActivities.today');
        if (a.date === todayText) return -1;
        if (b.date === todayText) return 1;
        return 0;
      })
      .slice(0, 5);
  };

  const recentActivities = generateRecentActivities();

  // Calculate real stats from API data
  useEffect(() => {
    if (mitglieder && veranstaltungen) {
      const activeMitglieder = mitglieder.filter(m => m.aktiv !== false && !m.austrittsdatum).length;
      const totalMitglieder = mitglieder.length;

      // Calculate new members this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const newThisMonth = mitglieder.filter(m => {
        if (!m.eintrittsdatum) return false;
        const joinDate = new Date(m.eintrittsdatum);
        return joinDate >= thisMonth;
      }).length;

      // Calculate event stats
      const totalVeranstaltungen = veranstaltungen.length;
      const upcomingVeranstaltungen = veranstaltungen.filter(v =>
        veranstaltungUtils.isUpcoming(v.startdatum)
      ).length;

      // Calculate events created this month
      const thisMonthEvents = veranstaltungen.filter(v => {
        if (!v.created) return false;
        const createDate = new Date(v.created);
        return createDate >= thisMonth;
      }).length;

      setStats({
        totalMitglieder,
        activeMitglieder,
        totalVeranstaltungen,
        upcomingVeranstaltungen,
        thisMonthRegistrations: newThisMonth,
        thisMonthEvents,
      });
    }
  }, [mitglieder, veranstaltungen]);

  if (mitgliederLoading || veranstaltungenLoading) {
    return <Loading text={t('dashboard:verein.loading')} />;
  }

  return (
    <div className="verein-dashboard">
      {/* Welcome Header */}
      <div className="page-header">
        <h1 className="page-title">{t('dashboard:verein.header.title')}</h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <h2>{t('dashboard:verein.overview.title')}</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:verein.overview.totalMembers')}</h3>
              <div className="stat-number">{stats.totalMitglieder}</div>
              <span className="stat-detail">{stats.activeMitglieder} {t('dashboard:verein.overview.activeMembers')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:verein.overview.events')}</h3>
              <div className="stat-number">{stats.totalVeranstaltungen}</div>
              <span className="stat-detail">{stats.upcomingVeranstaltungen} {t('dashboard:verein.overview.upcomingEvents')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:verein.overview.thisMonth')}</h3>
              <div className="stat-number">{stats.thisMonthRegistrations}</div>
              <span className="stat-detail">{t('dashboard:verein.overview.newRegistrations')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:verein.overview.eventActivity')}</h3>
              <div className="stat-number">{stats.thisMonthEvents}</div>
              <span className="stat-detail">{t('dashboard:verein.overview.createdThisMonth')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h2>{t('dashboard:verein.quickActions.title')}</h2>
        <div className="actions-grid">
          <Link to="/mitglieder" className="action-card">
            <div className="action-icon">
              <UsersIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:verein.quickActions.memberManagement.title')}</h3>
              <p>{t('dashboard:verein.quickActions.memberManagement.description')}</p>
            </div>
          </Link>

          <Link to="/veranstaltungen" className="action-card">
            <div className="action-icon">
              <CalendarIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:verein.quickActions.eventManagement.title')}</h3>
              <p>{t('dashboard:verein.quickActions.eventManagement.description')}</p>
            </div>
          </Link>

          <Link to={`/vereine/${user?.vereinId}`} className="action-card">
            <div className="action-icon">
              <SettingsIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:verein.quickActions.vereinSettings.title')}</h3>
              <p>{t('dashboard:verein.quickActions.vereinSettings.description')}</p>
            </div>
          </Link>

          <Link to="/reports" className="action-card">
            <div className="action-icon">
              <BarChartIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:verein.quickActions.reports.title')}</h3>
              <p>{t('dashboard:verein.quickActions.reports.description')}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2>{t('dashboard:verein.recentActivities.title')}</h2>
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.icon === 'user' ? <UsersIcon /> : <CalendarIcon />}
              </div>
              <div className="activity-content">
                <h4 className="activity-title">{activity.title}</h4>
                <p className="activity-description">{activity.description}</p>
                <span className="activity-date">{activity.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VereinDashboard;
