import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { mitgliedService, mitgliedFamilieService } from '../../services/mitgliedService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { MitgliedFamilieDto, MitgliedDto } from '../../types/mitglied';
import './MitgliedAilem.css';

// SVG Icons
const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

interface FamilyMemberCardProps {
  member: MitgliedDto;
  relationship: string;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member, relationship }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);

  const getAge = (birthdate?: string) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(member.geburtsdatum);

  return (
    <div className="family-member-card">
      <div className="member-avatar">
        <UserIcon />
      </div>
      <div className="member-info">
        <h3 className="member-name">{member.vorname} {member.nachname}</h3>
        <span className="member-relationship">{relationship}</span>
        {age !== null && (
          <span className="member-age">{age} {t('mitglieder:familyPage.yearsOld')}</span>
        )}
        {member.email && (
          <div className="member-contact">
            <MailIcon />
            <span className="contact-text">{member.email}</span>
          </div>
        )}
        {(member.telefon || member.mobiltelefon) && (
          <div className="member-contact">
            <PhoneIcon />
            <span className="contact-text">{member.telefon || member.mobiltelefon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MitgliedAilem: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const { user } = useAuth();
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('table');

  // Fetch family relationships
  const {
    data: familyRelationships,
    isLoading: familyLoading,
    error: familyError
  } = useQuery({
    queryKey: ['mitglied-familie', user?.mitgliedId],
    queryFn: async () => {
      console.log('🔍 DEBUG: Fetching family for mitgliedId:', user?.mitgliedId);
      if (!user?.mitgliedId) {
        console.log('⚠️ DEBUG: No mitgliedId found!');
        return [];
      }
      const result = await mitgliedFamilieService.getByMitgliedId(user.mitgliedId);
      console.log('✅ DEBUG: Family relationships result:', result);
      return result || [];
    },
    enabled: !!user?.mitgliedId,
  });

  // Fetch all family member details
  const {
    data: familyMembers,
    isLoading: membersLoading
  } = useQuery({
    queryKey: ['family-members', familyRelationships],
    queryFn: async () => {
      console.log('🔍 DEBUG: Family relationships:', familyRelationships);
      if (!familyRelationships || familyRelationships.length === 0) {
        console.log('⚠️ DEBUG: No family relationships found!');
        return [];
      }

      const memberIds = new Set<number>();
      familyRelationships.forEach((rel: MitgliedFamilieDto) => {
        memberIds.add(rel.parentMitgliedId);
        if (rel.mitgliedId !== user?.mitgliedId) {
          memberIds.add(rel.mitgliedId);
        }
      });

      console.log('🔍 DEBUG: Member IDs to fetch:', Array.from(memberIds));

      const members = await Promise.all(
        Array.from(memberIds).map(id => mitgliedService.getById(id))
      );

      console.log('✅ DEBUG: Fetched members:', members);
      return members.filter(m => m !== null);
    },
    enabled: !!familyRelationships && familyRelationships.length > 0,
  });

  const getRelationshipName = (typId: number): string => {
    const relationships: { [key: number]: string } = {
      1: t('mitglieder:familyPage.relationships.parent'),
      2: t('mitglieder:familyPage.relationships.child'),
      3: t('mitglieder:familyPage.relationships.spouse'),
      4: t('mitglieder:familyPage.relationships.sibling'),
      5: t('mitglieder:familyPage.relationships.other'),
    };
    return relationships[typId] || t('mitglieder:familyPage.relationships.other');
  };

  if (familyLoading || membersLoading) {
    return <Loading text={t('mitglieder:familyPage.loading')} />;
  }

  if (familyError) {
    return (
      <ErrorMessage
        title={t('mitglieder:familyPage.error.title')}
        message={t('mitglieder:familyPage.error.message')}
      />
    );
  }

  return (
    <div className="mitglied-ailem">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('mitglieder:familyPage.title')}</h1>
      </div>

      {/* View Mode Toggle */}
      {familyMembers && familyMembers.length > 0 && (
        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title={t('mitglieder:familyPage.gridView') || 'Kart Görünümü'}
          >
            ⊞
          </button>
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title={t('mitglieder:familyPage.tableView') || 'Tablo Görünümü'}
          >
            ≡
          </button>
        </div>
      )}

      {/* Family Members Grid or Table */}
      {!familyMembers || familyMembers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <UsersIcon />
          </div>
          <h3>{t('mitglieder:familyPage.empty.title')}</h3>
          <p>{t('mitglieder:familyPage.empty.message')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="family-grid">
          {familyRelationships?.map((rel: MitgliedFamilieDto) => {
            const memberId = rel.mitgliedId === user?.mitgliedId
              ? rel.parentMitgliedId
              : rel.mitgliedId;
            const member = familyMembers.find((m: MitgliedDto) => m.id === memberId);

            if (!member) return null;

            return (
              <FamilyMemberCard
                key={rel.id}
                member={member}
                relationship={getRelationshipName(rel.familienbeziehungTypId)}
              />
            );
          })}
        </div>
      ) : (
        <div className="family-table-container">
          <table className="family-table">
            <thead>
              <tr>
                <th>{t('mitglieder:familyPage.table.fullName')}</th>
                <th>{t('mitglieder:familyPage.table.relationship')}</th>
                <th>{t('mitglieder:familyPage.table.age')}</th>
                <th>{t('mitglieder:familyPage.table.email')}</th>
                <th>{t('mitglieder:familyPage.table.phone')}</th>
              </tr>
            </thead>
            <tbody>
              {familyRelationships?.map((rel: MitgliedFamilieDto) => {
                const memberId = rel.mitgliedId === user?.mitgliedId
                  ? rel.parentMitgliedId
                  : rel.mitgliedId;
                const member = familyMembers.find((m: MitgliedDto) => m.id === memberId);

                if (!member) return null;

                const getAge = (birthdate?: string) => {
                  if (!birthdate) return '-';
                  const today = new Date();
                  const birth = new Date(birthdate);
                  let age = today.getFullYear() - birth.getFullYear();
                  const monthDiff = today.getMonth() - birth.getMonth();
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                  }
                  return age;
                };

                return (
                  <tr key={rel.id}>
                    <td className="name-cell">
                      <strong>{member.vorname} {member.nachname}</strong>
                    </td>
                    <td>{getRelationshipName(rel.familienbeziehungTypId)}</td>
                    <td>{getAge(member.geburtsdatum)}</td>
                    <td>{member.email || '-'}</td>
                    <td>{member.telefon || member.mobiltelefon || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default MitgliedAilem;

