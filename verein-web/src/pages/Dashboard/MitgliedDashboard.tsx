import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { vereinService } from '../../services/vereinService';
import { mitgliedService, mitgliedFamilieService } from '../../services/mitgliedService';
import { veranstaltungService, veranstaltungUtils } from '../../services/veranstaltungService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import { getCurrencySymbol } from '../../utils/currencyUtils';
import './MitgliedDashboard.css';

// Icon Components
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

interface MitgliedInfo {
  id: number;
  mitgliedsnummer: string;
  vorname: string;
  nachname: string;
  email?: string;
  telefon?: string;
  eintrittsdatum?: string;
  vereinName: string;
  mitgliedStatus: string;
  beitragBetrag?: number;
  beitragWaehrungId?: number;
}

interface MitgliedStats {
  registeredEvents: number;
  upcomingEvents: number;
  familyMembers: number;
  membershipYears: number;
}

interface RecentActivity {
  id: number;
  type: 'event' | 'profile' | 'family';
  title: string;
  description: string;
  date: string;
  icon: string;
}

const MitgliedDashboard: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['dashboard', 'common']);
  const { user, selectedVereinId, setSelectedVereinId } = useAuth();

  // Fetch member details
  const { data: mitgliedData, isLoading: mitgliedLoading } = useQuery({
    queryKey: ['mitglied', user?.mitgliedId],
    queryFn: () => mitgliedService.getById(user!.mitgliedId!),
    enabled: !!user?.mitgliedId,
  });

  // Fetch member's vereine
  const { data: memberVereine, isLoading: vereineLoading } = useQuery({
    queryKey: ['member-vereine', user?.mitgliedId, user?.vereinId],
    queryFn: async () => {
      // Mitglied users should only see their own Verein
      if (user?.vereinId) {
        const verein = await vereinService.getById(user.vereinId);
        return [verein];
      }
      return [];
    },
    enabled: !!user?.mitgliedId && !!user?.vereinId,
  });

  // Fetch selected verein details
  const { data: selectedVerein } = useQuery({
    queryKey: ['verein', selectedVereinId],
    queryFn: () => vereinService.getById(selectedVereinId!),
    enabled: !!selectedVereinId,
  });

  // Fetch veranstaltungen for selected verein
  const { data: veranstaltungen } = useQuery({
    queryKey: ['veranstaltungen', selectedVereinId],
    queryFn: () => veranstaltungService.getByVereinId(selectedVereinId!),
    enabled: !!selectedVereinId,
  });

  // Fetch family members
  const { data: familyMembers } = useQuery({
    queryKey: ['family-members', user?.mitgliedId],
    queryFn: () => mitgliedFamilieService.getByMitgliedId(user!.mitgliedId!),
    enabled: !!user?.mitgliedId,
  });

  const [stats, setStats] = useState<MitgliedStats>({
    registeredEvents: 0,
    upcomingEvents: 0,
    familyMembers: 0,
    membershipYears: 0
  });

  // Auto-select user's Verein if not already selected
  useEffect(() => {
    if (user?.vereinId && !selectedVereinId && memberVereine && memberVereine.length > 0) {
      setSelectedVereinId(user.vereinId);
    }
  }, [user?.vereinId, selectedVereinId, memberVereine, setSelectedVereinId]);

  // Calculate stats from real data
  useEffect(() => {
    if (mitgliedData && veranstaltungen && familyMembers) {
      // Calculate membership years
      let membershipYears = 0;
      if (mitgliedData.eintrittsdatum) {
        const joinDate = new Date(mitgliedData.eintrittsdatum);
        const now = new Date();
        membershipYears = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      }

      // Calculate event stats
      const upcomingEvents = veranstaltungen.filter(v =>
        veranstaltungUtils.isUpcoming(v.startdatum)
      ).length;

      setStats({
        registeredEvents: veranstaltungen.length, // TODO: Filter by member's registrations
        upcomingEvents,
        familyMembers: familyMembers.length,
        membershipYears
      });
    }
  }, [mitgliedData, veranstaltungen, familyMembers]);

  // Generate recent activities from real data
  const generateRecentActivities = (): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    if (mitgliedData) {
      // Add membership anniversary
      if (mitgliedData.eintrittsdatum) {
        const joinDate = new Date(mitgliedData.eintrittsdatum);
        const daysAgo = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        const dateText = daysAgo === 0 ? t('dashboard:mitglied.recentActivities.today') :
                        daysAgo === 1 ? t('dashboard:mitglied.recentActivities.oneDayAgo') :
                        `${daysAgo} ${t('dashboard:mitglied.recentActivities.daysAgo')}`;

        activities.push({
          id: 1,
          type: 'profile',
          title: t('dashboard:mitglied.recentActivities.membershipStart'),
          description: `${t('dashboard:mitglied.recentActivities.joinedOn')} ${joinDate.toLocaleDateString('tr-TR')}`,
          date: dateText,
          icon: '📅'
        });
      }

      // Add recent events
      if (veranstaltungen && veranstaltungen.length > 0) {
        const recentEvents = veranstaltungen
          .sort((a, b) => new Date(b.startdatum).getTime() - new Date(a.startdatum).getTime())
          .slice(0, 2);

        recentEvents.forEach((event, index) => {
          const eventDate = new Date(event.startdatum);
          const daysAgo = Math.floor((Date.now() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
          const dateText = daysAgo === 0 ? t('dashboard:mitglied.recentActivities.today') :
                          daysAgo === 1 ? t('dashboard:mitglied.recentActivities.oneDayAgo') :
                          `${daysAgo} ${t('dashboard:mitglied.recentActivities.daysAgo')}`;

          activities.push({
            id: 100 + index,
            type: 'event',
            title: t('dashboard:mitglied.recentActivities.eventParticipation'),
            description: event.titel,
            date: dateText,
            icon: '🎉'
          });
        });
      }

      // Add family members
      if (familyMembers && familyMembers.length > 0) {
        activities.push({
          id: 200,
          type: 'family',
          title: t('dashboard:mitglied.recentActivities.familyMembers'),
          description: `${familyMembers.length} ${t('dashboard:mitglied.recentActivities.familyMembersCount')}`,
          date: t('dashboard:mitglied.recentActivities.today'),
          icon: '👨‍👩‍👧‍👦'
        });
      }
    }

    return activities;
  };

  const recentActivities = generateRecentActivities();

  if (mitgliedLoading || vereineLoading) {
    return <Loading text={t('dashboard:mitglied.loading')} />;
  }

  if (!mitgliedData) {
    return <div>{t('dashboard:mitglied.noData')}</div>;
  }

  const mitgliedInfo: MitgliedInfo = {
    id: mitgliedData.id,
    mitgliedsnummer: mitgliedData.mitgliedsnummer,
    vorname: mitgliedData.vorname,
    nachname: mitgliedData.nachname,
    email: mitgliedData.email || '',
    telefon: mitgliedData.telefon || '',
    eintrittsdatum: mitgliedData.eintrittsdatum,
    vereinName: selectedVerein?.name || t('dashboard:mitglied.vereinSelector.placeholder'),
    mitgliedStatus: mitgliedData.aktiv ? t('dashboard:mitglied.status.active') : t('dashboard:mitglied.status.inactive'),
    beitragBetrag: mitgliedData.beitragBetrag,
    beitragWaehrungId: mitgliedData.beitragWaehrungId
  };

  return (
    <div className="mitglied-dashboard">
      {/* Dernek Selector Banner - Compact */}
      {!selectedVereinId && (
        <div className="verein-selector-banner">
          <div className="banner-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
            </svg>
            <div className="banner-text">
              <h3>{t('dashboard:mitglied.vereinSelector.title')}</h3>
              <p>{t('dashboard:mitglied.vereinSelector.subtitle')}</p>
            </div>
            <select
              className="verein-select-dropdown"
              value=""
              onChange={(e) => e.target.value && setSelectedVereinId(parseInt(e.target.value))}
              disabled={vereineLoading}
            >
              <option value="">{t('dashboard:mitglied.vereinSelector.placeholder')}</option>
              {memberVereine && memberVereine.map((verein: any) => (
                <option key={verein.id} value={verein.id}>
                  {verein.name} {verein.aktiv ? `● ${t('dashboard:mitglied.vereinSelector.active')}` : `○ ${t('dashboard:mitglied.vereinSelector.inactive')}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {selectedVereinId && (
        <>
          {/* Header */}
          <div className="mitglied-dashboard-header">
            <div className="header-content">
              <div className="mitglied-info">
                <h1>{t('dashboard:mitglied.header.welcome')}, {mitgliedInfo.vorname}!</h1>
              </div>
              <div className="header-status">
                <select
                  className="verein-select-compact"
                  value={selectedVereinId}
                  onChange={(e) => setSelectedVereinId(parseInt(e.target.value))}
                >
                  {memberVereine && memberVereine.map((verein: any) => (
                    <option key={verein.id} value={verein.id}>
                      {verein.name}
                    </option>
                  ))}
                </select>
                <div className={`status-badge ${mitgliedData.aktiv ? 'status-active' : 'status-inactive'}`}>
                  {mitgliedInfo.mitgliedStatus}
                </div>
              </div>
            </div>
        
        <div className="mitglied-contact">
          {mitgliedInfo.email && (
            <span className="contact-item">
              📧 {mitgliedInfo.email}
            </span>
          )}
          {mitgliedInfo.telefon && (
            <span className="contact-item">
              📞 {mitgliedInfo.telefon}
            </span>
          )}
          {mitgliedInfo.eintrittsdatum && (
            <span className="contact-item">
              📅 {t('dashboard:mitglied.header.membershipDate')}: {new Date(mitgliedInfo.eintrittsdatum).toLocaleDateString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <h2>{t('dashboard:mitglied.overview.title')}</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:mitglied.overview.myEvents')}</h3>
              <p className="stat-number">{stats.registeredEvents}</p>
              <p className="stat-detail">
                {stats.upcomingEvents} {t('dashboard:mitglied.overview.upcoming')}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:mitglied.overview.familyMembers')}</h3>
              <p className="stat-number">{stats.familyMembers}</p>
              <p className="stat-detail">
                {t('dashboard:mitglied.overview.registeredFamily')}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:mitglied.overview.membershipDuration')}</h3>
              <p className="stat-number">{stats.membershipYears}</p>
              <p className="stat-detail">
                {t('dashboard:mitglied.overview.years')}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{t('dashboard:mitglied.overview.monthlyFee')}</h3>
              <p className="stat-number">
                {mitgliedInfo.beitragBetrag || 0}{getCurrencySymbol(mitgliedInfo.beitragWaehrungId)}
              </p>
              <p className="stat-detail">
                {t('dashboard:mitglied.overview.currentFee')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h2>{t('dashboard:mitglied.quickActions.title')}</h2>
        <div className="actions-grid">
          <Link to="/profil" className="action-card">
            <div className="action-icon">
              <UserIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:mitglied.quickActions.myProfile.title')}</h3>
              <p>{t('dashboard:mitglied.quickActions.myProfile.description')}</p>
            </div>
          </Link>

          <Link to="/meine-veranstaltungen" className="action-card">
            <div className="action-icon">
              <CalendarIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:mitglied.quickActions.events.title')}</h3>
              <p>{t('dashboard:mitglied.quickActions.events.description')}</p>
            </div>
          </Link>

          <Link to="/meine-familie" className="action-card">
            <div className="action-icon">
              <UsersIcon />
            </div>
            <div className="action-info">
              <h3>{t('dashboard:mitglied.quickActions.myFamily.title')}</h3>
              <p>{t('dashboard:mitglied.quickActions.myFamily.description')}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2>{t('dashboard:mitglied.recentActivities.title')}</h2>
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'event' ? <CalendarIcon /> : activity.type === 'family' ? <UsersIcon /> : <UserIcon />}
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
        </>
      )}
    </div>
  );
};

export default MitgliedDashboard;
