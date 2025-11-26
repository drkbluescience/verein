import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/authService';
import './Login.css';

// Register locales for date picker
registerLocale('de', de);
registerLocale('tr', tr);

const Login: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['auth', 'common']);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { login, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Force light theme for login/signup pages
  useEffect(() => {
    const originalTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');

    return () => {
      if (originalTheme) {
        document.documentElement.setAttribute('data-theme', originalTheme);
      }
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app-settings', JSON.stringify({ language: lang }));
  };

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup states
  const [selectedRole, setSelectedRole] = useState<'mitglied' | 'dernek'>('mitglied');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  // Member fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [memberTelefon, setMemberTelefon] = useState('');
  const [mobiltelefon, setMobiltelefon] = useState('');
  const [geburtsdatum, setGeburtsdatum] = useState<Date | null>(null);
  const [geburtsort, setGeburtsort] = useState('');

  // Association fields
  const [vereinName, setVereinName] = useState('');
  const [kurzname, setKurzname] = useState('');
  const [telefon, setTelefon] = useState('');
  const [kontaktperson, setKontaktperson] = useState('');
  const [vorstandsvorsitzender, setVorstandsvorsitzender] = useState('');
  const [vorstandsvorsitzenderEmail, setVorstandsvorsitzenderEmail] = useState('');
  const [webseite, setWebseite] = useState('');
  const [gruendungsdatum, setGruendungsdatum] = useState<Date | null>(null);
  const [zweck, setZweck] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail) {
      setLoginError(t('auth:errors.emailRequired'));
      return;
    }

    if (!loginPassword) {
      setLoginError(t('auth:errors.passwordRequired'));
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      showSuccess(t('auth:messages.loginSuccess'));
      navigate('/');
    } catch (error) {
      setLoginError(t('auth:errors.loginFailed'));
      showError(t('auth:errors.loginFailed'));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    try {
      // Validate required fields
      if (!signupEmail) {
        setSignupError(t('auth:errors.emailRequired'));
        return;
      }

      if (!signupPassword) {
        setSignupError(t('auth:errors.passwordRequired'));
        return;
      }

      if (signupPassword.length < 6) {
        setSignupError(t('auth:errors.passwordTooShort'));
        return;
      }

      if (signupPassword !== signupConfirmPassword) {
        setSignupError(t('auth:errors.passwordMismatch'));
        return;
      }

      if (selectedRole === 'mitglied') {
        // Member signup
        if (!firstName || !lastName) {
          setSignupError(t('auth:errors.nameRequired'));
          return;
        }

        const response = await authService.registerMitglied({
          vorname: firstName,
          nachname: lastName,
          email: signupEmail,
          password: signupPassword,
          confirmPassword: signupConfirmPassword,
          telefon: memberTelefon || undefined,
          mobiltelefon: mobiltelefon || undefined,
          geburtsdatum: geburtsdatum ? geburtsdatum.toISOString().split('T')[0] : undefined,
          geburtsort: geburtsort || undefined,
        });

        if (response.success) {
          // Auto-login after successful registration
          await login(signupEmail, signupPassword);
          showSuccess(t('auth:messages.signupSuccess'));
          navigate('/');
        } else {
          setSignupError(response.message);
          showError(response.message);
        }
      } else {
        // Verein signup
        if (!vereinName) {
          setSignupError(t('auth:errors.vereinNameRequired'));
          return;
        }

        const response = await authService.registerVerein({
          name: vereinName,
          kurzname: kurzname || undefined,
          email: signupEmail,
          telefon: telefon || undefined,
          vorstandsvorsitzender: vorstandsvorsitzender || undefined,
          vorstandsvorsitzenderEmail: vorstandsvorsitzenderEmail || undefined,
          password: signupPassword,
          confirmPassword: signupConfirmPassword,
          kontaktperson: kontaktperson || undefined,
          webseite: webseite || undefined,
          gruendungsdatum: gruendungsdatum ? gruendungsdatum.toISOString().split('T')[0] : undefined,
          zweck: zweck || undefined,
        });

        if (response.success) {
          // Auto-login after successful registration
          await login(signupEmail, signupPassword);
          showSuccess(t('auth:messages.signupSuccess'));
          navigate('/');
        } else {
          setSignupError(response.message);
          showError(response.message);
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || t('auth:errors.signupFailed');
      setSignupError(errorMessage);
      showError(errorMessage);
    }
  };

  // Demo login buttons for testing
  const handleDemoLogin = async (demoEmail: string) => {
    try {
      await login(demoEmail, 'demo123'); // Demo password
      showSuccess(t('auth:messages.loginSuccess'));
      navigate('/');
    } catch (error) {
      setLoginError(t('auth:errors.demoLoginFailed'));
      showError(t('auth:errors.demoLoginFailed'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-gradient"></div>
        <div className="background-pattern"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          {/* Language Switcher */}
          <div className="language-switcher">
            <button
              className={`lang-btn ${i18n.language === 'tr' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('tr')}
              title={t('common:language.turkish')}
            >
              🇹🇷 {t('common:language.tr')}
            </button>
            <button
              className={`lang-btn ${i18n.language === 'de' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('de')}
              title={t('common:language.german')}
            >
              🇩🇪 {t('common:language.de')}
            </button>
          </div>

          <div className="login-header">
            <h1 className="login-title">{t('auth:pageTitle')}</h1>
            <p className="login-subtitle">{t('auth:pageSubtitle')}</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              {t('auth:tabs.login')}
            </button>
            <button
              className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              {t('auth:tabs.signup')}
            </button>
          </div>

          {/* Login Tab */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email">{t('auth:login.email')}</label>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder={t('auth:login.emailPlaceholder')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">{t('auth:login.password')}</label>
                <input
                  type="password"
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder={t('auth:login.passwordPlaceholder')}
                  minLength={6}
                />
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? t('auth:login.submitting') : t('auth:login.submit')}
              </button>

              <div className="info-message" style={{ marginTop: '16px' }}>
                <strong>{t('auth:login.infoTitle')}</strong> {t('auth:login.infoMessage')}
              </div>
            </form>
          )}

          {/* Signup Tab */}
          {activeTab === 'signup' && (
            <div className="signup-content">
              {/* Role Selection */}
              <div className="role-selection">
                <h3 className="role-title">{t('auth:signup.roleTitle')}</h3>
                <div className="role-grid">
                  <label
                    className={`role-card ${selectedRole === 'mitglied' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('mitglied')}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="mitglied"
                      checked={selectedRole === 'mitglied'}
                      onChange={() => setSelectedRole('mitglied')}
                      className="role-radio"
                    />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="role-name">{t('auth:signup.roles.member')}</span>
                    <span className="role-desc">{t('auth:signup.roles.memberDesc')}</span>
                  </label>

                  <label
                    className={`role-card ${selectedRole === 'dernek' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('dernek')}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="dernek"
                      checked={selectedRole === 'dernek'}
                      onChange={() => setSelectedRole('dernek')}
                      className="role-radio"
                    />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/>
                    </svg>
                    <span className="role-name">{t('auth:signup.roles.verein')}</span>
                    <span className="role-desc">{t('auth:signup.roles.vereinDesc')}</span>
                  </label>
                </div>
              </div>

              <form onSubmit={handleSignup} className="auth-form">
                {selectedRole === 'mitglied' ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="first-name">{t('auth:fields.firstName')} {t('auth:fields.required')}</label>
                      <input
                        type="text"
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder={t('auth:fields.firstNamePlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last-name">{t('auth:fields.lastName')} {t('auth:fields.required')}</label>
                      <input
                        type="text"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder={t('auth:fields.lastNamePlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="geburtsdatum">{t('auth:fields.birthDate')}</label>
                      <DatePicker
                        selected={geburtsdatum}
                        onChange={(date) => setGeburtsdatum(date)}
                        locale={i18n.language}
                        dateFormat="dd.MM.yyyy"
                        placeholderText={t('auth:fields.birthDatePlaceholder')}
                        className="date-picker-input"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        maxDate={new Date()}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="geburtsort">{t('auth:fields.birthPlace')}</label>
                      <input
                        type="text"
                        id="geburtsort"
                        value={geburtsort}
                        onChange={(e) => setGeburtsort(e.target.value)}
                        placeholder={t('auth:fields.birthPlacePlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="member-telefon">{t('auth:fields.phone')}</label>
                      <input
                        type="tel"
                        id="member-telefon"
                        value={memberTelefon}
                        onChange={(e) => setMemberTelefon(e.target.value)}
                        placeholder={t('auth:fields.phonePlaceholder')}
                        maxLength={30}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobiltelefon">{t('auth:fields.mobile')}</label>
                      <input
                        type="tel"
                        id="mobiltelefon"
                        value={mobiltelefon}
                        onChange={(e) => setMobiltelefon(e.target.value)}
                        placeholder={t('auth:fields.mobilePlaceholder')}
                        maxLength={30}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="verein-name">{t('auth:fields.vereinName')} {t('auth:fields.required')}</label>
                      <input
                        type="text"
                        id="verein-name"
                        value={vereinName}
                        onChange={(e) => setVereinName(e.target.value)}
                        required
                        placeholder={t('auth:fields.vereinNamePlaceholder')}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="kurzname">{t('auth:fields.shortName')}</label>
                      <input
                        type="text"
                        id="kurzname"
                        value={kurzname}
                        onChange={(e) => setKurzname(e.target.value)}
                        placeholder={t('auth:fields.shortNamePlaceholder')}
                        maxLength={50}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefon">{t('auth:fields.phone')}</label>
                      <input
                        type="tel"
                        id="telefon"
                        value={telefon}
                        onChange={(e) => setTelefon(e.target.value)}
                        placeholder={t('auth:fields.phonePlaceholder')}
                        maxLength={30}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vorstandsvorsitzender">{t('auth:fields.president')}</label>
                      <input
                        type="text"
                        id="vorstandsvorsitzender"
                        value={vorstandsvorsitzender}
                        onChange={(e) => setVorstandsvorsitzender(e.target.value)}
                        placeholder={t('auth:fields.presidentPlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vorstandsvorsitzender-email">{t('auth:fields.presidentEmail')}</label>
                      <input
                        type="email"
                        id="vorstandsvorsitzender-email"
                        value={vorstandsvorsitzenderEmail}
                        onChange={(e) => setVorstandsvorsitzenderEmail(e.target.value)}
                        placeholder={t('auth:fields.presidentEmailPlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="kontaktperson">{t('auth:fields.contactPerson')}</label>
                      <input
                        type="text"
                        id="kontaktperson"
                        value={kontaktperson}
                        onChange={(e) => setKontaktperson(e.target.value)}
                        placeholder={t('auth:fields.contactPersonPlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="webseite">{t('auth:fields.website')}</label>
                      <input
                        type="url"
                        id="webseite"
                        value={webseite}
                        onChange={(e) => setWebseite(e.target.value)}
                        placeholder={t('auth:fields.websitePlaceholder')}
                        maxLength={200}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="gruendungsdatum">{t('auth:fields.foundingDate')}</label>
                      <DatePicker
                        selected={gruendungsdatum}
                        onChange={(date) => setGruendungsdatum(date)}
                        locale={i18n.language}
                        dateFormat="dd.MM.yyyy"
                        placeholderText={t('auth:fields.foundingDatePlaceholder')}
                        className="date-picker-input"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        maxDate={new Date()}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zweck">{t('auth:fields.purpose')}</label>
                      <textarea
                        id="zweck"
                        value={zweck}
                        onChange={(e) => setZweck(e.target.value)}
                        placeholder={t('auth:fields.purposePlaceholder')}
                        maxLength={500}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="signup-email">{t('auth:fields.email')} {t('auth:fields.required')}</label>
                  <input
                    type="email"
                    id="signup-email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    placeholder={t('auth:fields.emailPlaceholder')}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">{t('auth:fields.password')} {t('auth:fields.required')}</label>
                  <input
                    type="password"
                    id="signup-password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    placeholder={t('auth:fields.passwordPlaceholder')}
                    minLength={6}
                    maxLength={100}
                  />
                  <small className="field-hint">{t('auth:fields.passwordHint')}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-confirm-password">{t('auth:fields.confirmPassword')} {t('auth:fields.required')}</label>
                  <input
                    type="password"
                    id="signup-confirm-password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                    placeholder={t('auth:fields.confirmPasswordPlaceholder')}
                    minLength={6}
                    maxLength={100}
                  />
                </div>

                {signupError && <div className="error-message">{signupError}</div>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? t('auth:signup.submitting') : t('auth:signup.submit')}
                </button>

                <p className="switch-tab-text">
                  {t('auth:signup.hasAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="switch-tab-btn"
                  >
                    {t('auth:signup.loginLink')}
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Demo Section - Only show on login tab */}
          {activeTab === 'login' && (
            <div className="demo-section">
              <p className="demo-title">{t('auth:demo.title')}</p>
              <div className="demo-buttons">
                <button
                  className="demo-btn demo-dernek"
                  onClick={() => handleDemoLogin('ahmet.yilmaz@email.com')}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/>
                  </svg>
                  {t('auth:demo.verein')}
                </button>
                <button
                  className="demo-btn demo-mitglied"
                  onClick={() => handleDemoLogin('fatma.ozkan@email.com')}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  {t('auth:demo.member')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
