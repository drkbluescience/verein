import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import Turkish translations
import commonTr from '../locales/tr/common.json';
import dashboardTr from '../locales/tr/dashboard.json';
import settingsTr from '../locales/tr/settings.json';
import authTr from '../locales/tr/auth.json';
import profileTr from '../locales/tr/profile.json';
import vereineTr from '../locales/tr/vereine.json';
import mitgliederTr from '../locales/tr/mitglieder.json';
import veranstaltungenTr from '../locales/tr/veranstaltungen.json';
import landingTr from '../locales/tr/landing.json';
import adressenTr from '../locales/tr/adressen.json';
import reportsTr from '../locales/tr/reports.json';
import finanzTr from '../locales/tr/finanz.json';

// Import German translations
import commonDe from '../locales/de/common.json';
import dashboardDe from '../locales/de/dashboard.json';
import settingsDe from '../locales/de/settings.json';
import authDe from '../locales/de/auth.json';
import profileDe from '../locales/de/profile.json';
import vereineDe from '../locales/de/vereine.json';
import mitgliederDe from '../locales/de/mitglieder.json';
import veranstaltungenDe from '../locales/de/veranstaltungen.json';
import landingDe from '../locales/de/landing.json';
import adressenDe from '../locales/de/adressen.json';
import reportsDe from '../locales/de/reports.json';
import finanzDe from '../locales/de/finanz.json';

// Define resources
const resources = {
  tr: {
    common: commonTr,
    dashboard: dashboardTr,
    settings: settingsTr,
    auth: authTr,
    profile: profileTr,
    vereine: vereineTr,
    mitglieder: mitgliederTr,
    veranstaltungen: veranstaltungenTr,
    landing: landingTr,
    adressen: adressenTr,
    reports: reportsTr,
    finanz: finanzTr,
  },
  de: {
    common: commonDe,
    dashboard: dashboardDe,
    settings: settingsDe,
    auth: authDe,
    profile: profileDe,
    vereine: vereineDe,
    mitglieder: mitgliederDe,
    veranstaltungen: veranstaltungenDe,
    landing: landingDe,
    adressen: adressenDe,
    reports: reportsDe,
    finanz: finanzDe,
  },
};

// Get saved language from localStorage or use default
const getSavedLanguage = (): string => {
  try {
    // First, check if user is logged in
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      // User is logged in - get user-specific settings
      const user = JSON.parse(savedUser);
      const userId = user.vereinId || user.mitgliedId || user.id || 'unknown';
      const userSettingsKey = `app-settings-user-${userId}-${user.type}`;
      const userSettings = localStorage.getItem(userSettingsKey);

      if (userSettings) {
        const parsed = JSON.parse(userSettings);
        return parsed.language || 'tr';
      }
    } else {
      // User is not logged in - get guest settings
      const guestSettings = localStorage.getItem('app-settings-guest');
      if (guestSettings) {
        const parsed = JSON.parse(guestSettings);
        return parsed.language || 'tr';
      }
    }
  } catch (error) {
    console.error('Error loading saved language:', error);
  }
  return 'tr';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'tr',
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'settings', 'auth', 'profile', 'vereine', 'mitglieder', 'veranstaltungen', 'landing', 'adressen', 'reports', 'finanz'],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: false,
    },
  });

// Update HTML lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

// Set initial lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export default i18n;

