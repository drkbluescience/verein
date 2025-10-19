import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import './Settings.css';

// SVG Icons
const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

interface ThemeSettings {
  theme: 'dark' | 'light';
  language: 'tr' | 'en' | 'de';
  notifications: boolean;
  compactMode: boolean;
}

const Settings: React.FC = () => {
  const { user, getUserSettingsKey } = useAuth();
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['settings', 'common']);
  const [settings, setSettings] = useState<ThemeSettings>({
    theme: 'dark',
    language: 'tr',
    notifications: true,
    compactMode: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Get user-specific settings key
  const getSettingsKey = (): string => {
    return getUserSettingsKey();
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const settingsKey = getSettingsKey();
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applyTheme(parsed.theme);
        // Sync i18n language with saved settings
        if (parsed.language && parsed.language !== i18n.language) {
          i18n.changeLanguage(parsed.language);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    } else {
      // If no saved settings, sync with current i18n language
      setSettings(prev => ({ ...prev, language: i18n.language as 'tr' | 'en' | 'de' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n, user]); // getSettingsKey is stable, no need to include

  const applyTheme = (theme: 'dark' | 'light') => {
    // Use data-theme attribute instead of CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleSettingChange = (key: keyof ThemeSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Apply theme immediately if theme is changed
    if (key === 'theme') {
      applyTheme(value);
    }

    // Change language immediately if language is changed
    if (key === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Save to user-specific localStorage key
      const settingsKey = getSettingsKey();
      localStorage.setItem(settingsKey, JSON.stringify(settings));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setSaveMessage(t('settings:messages.saveSuccess'));
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(t('settings:messages.saveError'));
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    const defaultSettings: ThemeSettings = {
      theme: 'dark',
      language: 'tr',
      notifications: true,
      compactMode: true,
    };
    setSettings(defaultSettings);
    applyTheme(defaultSettings.theme);
    i18n.changeLanguage(defaultSettings.language);

    // Remove user-specific settings
    const settingsKey = getSettingsKey();
    localStorage.removeItem(settingsKey);

    setSaveMessage(t('settings:messages.resetSuccess'));
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="page-title">{t('settings:title')}</h1>
        <p className="page-subtitle">{t('settings:subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="btn-secondary" onClick={resetSettings} disabled={isSaving}>
          <RefreshIcon />
          <span>{t('settings:actions.reset')}</span>
        </button>
        <button className="btn-primary" onClick={saveSettings} disabled={isSaving}>
          <SaveIcon />
          <span>{isSaving ? t('settings:actions.saving') : t('settings:actions.save')}</span>
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('hata') ? 'error' : 'success'}`}>
          {saveMessage}
        </div>
      )}

      <div className="settings-content">
        {/* Theme Settings */}
        <div className="settings-section">
          <h2 className="section-title">{t('settings:sections.appearance.title')}</h2>

          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-name">{t('settings:sections.appearance.theme.label')}</h3>
              <p className="setting-description">{t('settings:sections.appearance.theme.description')}</p>
            </div>
            <div className="setting-control">
              <div className="theme-options">
                <button
                  className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'dark')}
                >
                  <div className="theme-preview dark-preview">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <span>{t('settings:sections.appearance.theme.dark')}</span>
                </button>
                <button
                  className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'light')}
                >
                  <div className="theme-preview light-preview">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <span>{t('settings:sections.appearance.theme.light')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-name">{t('settings:sections.appearance.compactMode.label')}</h3>
              <p className="setting-description">{t('settings:sections.appearance.compactMode.description')}</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="settings-section">
          <h2 className="section-title">{t('settings:sections.language.title')}</h2>

          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-name">{t('settings:sections.language.label')}</h3>
              <p className="setting-description">{t('settings:sections.language.description')}</p>
            </div>
            <div className="setting-control">
              <select
                className="setting-select"
                value={i18n.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="tr">{t('settings:sections.language.options.tr')}</option>
                <option value="de">{t('settings:sections.language.options.de')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h2 className="section-title">{t('settings:sections.notifications.title')}</h2>

          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-name">{t('settings:sections.notifications.label')}</h3>
              <p className="setting-description">{t('settings:sections.notifications.description')}</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
