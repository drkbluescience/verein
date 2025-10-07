import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'default' }) => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation('common');

  // Get user-specific settings key
  const getSettingsKey = (): string => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      return 'app-settings-guest';
    }
    try {
      const user = JSON.parse(savedUser);
      const userId = user.vereinId || user.mitgliedId || user.id || 'unknown';
      return `app-settings-user-${userId}-${user.type}`;
    } catch (error) {
      return 'app-settings-guest';
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);

    // Save to user-specific or guest settings
    const settingsKey = getSettingsKey();
    const existingSettings = localStorage.getItem(settingsKey);
    const settings = existingSettings ? JSON.parse(existingSettings) : {};

    localStorage.setItem(settingsKey, JSON.stringify({
      ...settings,
      language: lang
    }));
  };

  return (
    <div className={`language-switcher-component ${variant}`}>
      <button
        className={`lang-btn ${i18n.language === 'tr' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('tr')}
        title={t('language.turkish')}
      >
        🇹🇷 {t('language.tr')}
      </button>
      <button
        className={`lang-btn ${i18n.language === 'de' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('de')}
        title={t('language.german')}
      >
        🇩🇪 {t('language.de')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;

