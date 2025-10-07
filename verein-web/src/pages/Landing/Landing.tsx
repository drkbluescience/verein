import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';
import './Landing.css';

const Landing: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['landing', 'common']);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-container">
      {/* Language Switcher */}
      <div className="landing-language-switcher">
        <LanguageSwitcher />
      </div>

      {/* Background */}
      <div className="landing-background">
        <div className="background-gradient"></div>
        <div className="background-pattern"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-logo">
              <img
                src="/qubbe-logo.png"
                alt="Qubbe Logo"
                className="logo-image"
              />
            </div>
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('landing:hero.title') }} />
            <p className="hero-subtitle">
              {t('landing:hero.subtitle')}
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={handleGetStarted}>
                <span>{t('landing:hero.getStarted')}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="btn-hero-secondary" onClick={handleLearnMore}>
                {t('landing:hero.learnMore')}
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="hero-card-icon">
                <img
                  src="/modern-yonetim.jpg"
                  alt="Modern Yönetim"
                  className="hero-card-image"
                />
              </div>
              <div className="hero-card-content">
                <h3>{t('landing:hero.modernManagement')}</h3>
                <p>{t('landing:hero.allInOne')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">{t('landing:features.title')}</h2>
            <p className="section-subtitle">
              {t('landing:features.subtitle')}
            </p>
          </div>

          <div className="features-grid">
            {/* Admin Card */}
            <div className="feature-card feature-card-admin">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <polyline points="17 11 19 13 23 9"/>
                </svg>
              </div>
              <h3 className="feature-title">{t('landing:features.admin.title')}</h3>
              <p className="feature-description">
                {t('landing:features.admin.description')}
              </p>
              <ul className="feature-list">
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.admin.features.0')}
                </li>
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.admin.features.1')}
                </li>
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.admin.features.2')}
                </li>
              </ul>
            </div>

            {/* Dernek Card */}
            <div className="feature-card feature-card-dernek">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <h3 className="feature-title">{t('landing:features.verein.title')}</h3>
              <p className="feature-description">
                {t('landing:features.verein.description')}
              </p>
              <ul className="feature-list">
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.verein.features.0')}
                </li>
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.verein.features.1')}
                </li>
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.verein.features.2')}
                </li>
              </ul>
            </div>

            {/* Mitglied Card */}
            <div className="feature-card feature-card-mitglied">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="feature-title">{t('landing:features.member.title')}</h3>
              <p className="feature-description">
                {t('landing:features.member.description')}
              </p>
              <ul className="feature-list">
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.member.features.0')}
                </li>
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.member.features.1')}
                </li>
                <li>
                  <span className="list-dot"></span>
                  {t('landing:features.member.features.2')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">{t('landing:cta.title')}</h2>
            <p className="cta-subtitle">
              {t('landing:cta.subtitle')}
            </p>
            <button className="btn-cta" onClick={handleGetStarted}>
              <span>{t('landing:cta.button')}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img
              src="/qubbe-logo.png"
              alt="Qubbe Logo"
              className="logo-image-footer"
            />
          </div>
          <p className="footer-text">{t('landing:footer.copyright')}</p>
          <p className="footer-version">{t('landing:footer.version')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

