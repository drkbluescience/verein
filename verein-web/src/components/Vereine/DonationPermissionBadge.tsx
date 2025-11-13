import React from 'react';
import { useTranslation } from 'react-i18next';
import { RechtlicheDatenDto } from '../../types/rechtlicheDaten';
import { differenceInDays, format, parseISO } from 'date-fns';

interface DonationPermissionBadgeProps {
  rechtlicheDaten?: RechtlicheDatenDto;
  showDate?: boolean;
}

const DonationPermissionBadge: React.FC<DonationPermissionBadgeProps> = ({
  rechtlicheDaten,
  showDate = true
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine']);

  if (!rechtlicheDaten) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        -
      </span>
    );
  }

  // No permission
  if (!rechtlicheDaten.gemeinnuetzigAnerkannt) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        ❌ {t('legal.noPermission')}
      </span>
    );
  }

  // Has permission but no expiry date
  if (!rechtlicheDaten.gemeinnuetzigkeitBis) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✅ {t('legal.active')}
      </span>
    );
  }

  // Calculate days until expiry
  const expiryDate = parseISO(rechtlicheDaten.gemeinnuetzigkeitBis);
  const daysLeft = differenceInDays(expiryDate, new Date());

  // Expired
  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        ⚠️ {t('legal.expired')}
        {showDate && ` (${format(expiryDate, 'dd.MM.yyyy')})`}
      </span>
    );
  }

  // Expiring soon (within 30 days)
  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ⚠️ {daysLeft} {t('legal.daysLeft')}
        {showDate && ` (${format(expiryDate, 'dd.MM.yyyy')})`}
      </span>
    );
  }

  // Active with valid date
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      ✅ {showDate ? format(expiryDate, 'dd.MM.yyyy') : t('legal.active')}
    </span>
  );
};

export default DonationPermissionBadge;

