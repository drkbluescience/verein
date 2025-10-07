import 'react-i18next';

// Import all translation resources
import common from './locales/tr/common.json';
import dashboard from './locales/tr/dashboard.json';
import settings from './locales/tr/settings.json';
import auth from './locales/tr/auth.json';
import profile from './locales/tr/profile.json';
import vereine from './locales/tr/vereine.json';
import mitglieder from './locales/tr/mitglieder.json';
import veranstaltungen from './locales/tr/veranstaltungen.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      dashboard: typeof dashboard;
      settings: typeof settings;
      auth: typeof auth;
      profile: typeof profile;
      vereine: typeof vereine;
      mitglieder: typeof mitglieder;
      veranstaltungen: typeof veranstaltungen;
    };
  }
}

