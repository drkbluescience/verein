import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VereinDashboard from './pages/Dashboard/VereinDashboard';
import MitgliedDashboard from './pages/Dashboard/MitgliedDashboard';
import VereinList from './pages/Vereine/VereinList';
import VereinDetail from './pages/Vereine/VereinDetail';
import MitgliedList from './pages/Mitglieder/MitgliedList';
import MitgliedDetail from './pages/Mitglieder/MitgliedDetail';
import MitgliedEtkinlikler from './pages/Mitglieder/MitgliedEtkinlikler';
import MitgliedAilem from './pages/Mitglieder/MitgliedAilem';
import VeranstaltungList from './pages/Veranstaltungen/VeranstaltungList';
import VeranstaltungDetail from './pages/Veranstaltungen/VeranstaltungDetail';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Landing from './pages/Landing/Landing';
import Reports from './pages/Reports/Reports';
import FinanzDashboard from './pages/Finanz/FinanzDashboard';
import MitgliedFinanz from './pages/Finanz/MitgliedFinanz';
import MitgliedForderungList from './pages/Finanz/MitgliedForderungList';
import MitgliedForderungDetail from './pages/Finanz/MitgliedForderungDetail';
import MitgliedZahlungList from './pages/Finanz/MitgliedZahlungList';
import MitgliedZahlungDetail from './pages/Finanz/MitgliedZahlungDetail';
import MitgliedZahlungHistory from './pages/Finanz/MitgliedZahlungHistory';
import BankBuchungList from './pages/Finanz/BankBuchungList';
import BankBuchungDetail from './pages/Finanz/BankBuchungDetail';
import BankUpload from './pages/Finanz/BankUpload';
import ManualMatching from './pages/Finanz/ManualMatching';
import DitibUpload from './pages/Finanz/DitibUpload';
import VereinDitibZahlungList from './pages/Finanz/VereinDitibZahlungList';
import VereinDitibZahlungDetail from './pages/Finanz/VereinDitibZahlungDetail';
import VereinDitibZahlungForm from './pages/Finanz/VereinDitibZahlungForm';
import { EasyFiBuDashboard } from './pages/Finanz/easyFiBu';
import PageNotesAdmin from './pages/Admin/PageNotesAdmin';
import OrganizationAdmin from './pages/Admin/OrganizationAdmin';
import BriefeList from './pages/Briefe/BriefeList';
import BriefForm from './pages/Briefe/BriefForm';
import BriefDetail from './pages/Briefe/BriefDetail';
import BriefVorlagenList from './pages/Briefe/BriefVorlagenList';
import NachrichtenList from './pages/Nachrichten/NachrichtenList';
import NachrichtDetail from './pages/Nachrichten/NachrichtDetail';
import './i18n/config'; // Initialize i18n
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, user, getUserSettingsKey, initializing } = useAuth();

  // Load saved theme on mount
  useEffect(() => {
    const loadSavedTheme = () => {
      try {
        const settingsKey = getUserSettingsKey();
        const savedSettings = localStorage.getItem(settingsKey);

        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.theme) {
            // Always use light theme as default (migrate from dark if needed)
            const theme = parsed.theme === 'dark' ? 'light' : parsed.theme;
            document.documentElement.setAttribute('data-theme', theme);
            // Update localStorage with light theme if it was dark
            if (parsed.theme === 'dark') {
              localStorage.setItem(settingsKey, JSON.stringify({ ...parsed, theme: 'light' }));
            }
          }
        } else {
          // Default to light theme
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (error) {
        console.error('Error loading saved theme:', error);
        // Default to light theme on error
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    loadSavedTheme();
  }, [user, getUserSettingsKey]);

  // Determine which dashboard to show based on user type

  // Show loading spinner while initializing (loading user from localStorage)
  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/startseite" replace /> : <Login />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <>
          <Route path="/startseite" element={
            <Layout>
              {user?.type === 'admin' ? (
                <Dashboard />
              ) : user?.type === 'dernek' ? (
                <VereinDashboard />
              ) : (
                <MitgliedDashboard />
              )}
            </Layout>
          } />

          {/* Vereine List */}
          <Route path="/vereine" element={
            <Layout>
              <VereinList />
            </Layout>
          } />

          {/* Verein Detail */}
          <Route path="/vereine/:id" element={
            <Layout>
              <VereinDetail />
            </Layout>
          } />

          {/* Mitglieder */}
          <Route path="/mitglieder" element={
            <Layout>
              <MitgliedList />
            </Layout>
          } />
          <Route path="/mitglieder/:id" element={
            <Layout>
              <MitgliedDetail />
            </Layout>
          } />

          {/* Veranstaltungen (Admin/Dernek için) */}
          <Route path="/veranstaltungen" element={
            <Layout>
              <VeranstaltungList />
            </Layout>
          } />

          {/* Veranstaltung Detail - Available for all user types */}
          <Route path="/veranstaltungen/:id" element={
            <Layout>
              <VeranstaltungDetail />
            </Layout>
          } />

          <Route path="/berichte" element={
            <Layout>
              <Reports />
            </Layout>
          } />

          {/* Finanzen Routes - Admin/Dernek */}
          <Route path="/finanzen" element={
            <Layout>
              <FinanzDashboard />
            </Layout>
          } />
          <Route path="/finanzen/easyfibu" element={
            <Layout>
              <EasyFiBuDashboard />
            </Layout>
          } />
          <Route path="/finanzen/forderungen" element={
            <Layout>
              <MitgliedForderungList />
            </Layout>
          } />
          <Route path="/finanzen/forderungen/:id" element={
            <Layout>
              <MitgliedForderungDetail />
            </Layout>
          } />
          <Route path="/finanzen/zahlungen" element={
            <Layout>
              <MitgliedZahlungList />
            </Layout>
          } />
          <Route path="/finanzen/zahlungen/:id" element={
            <Layout>
              <MitgliedZahlungDetail />
            </Layout>
          } />
          <Route path="/finanzen/bank" element={
            <Layout>
              <BankBuchungList />
            </Layout>
          } />
          <Route path="/finanzen/bank/:id" element={
            <Layout>
              <BankBuchungDetail />
            </Layout>
          } />
          <Route path="/finanzen/bank-upload" element={
            <Layout>
              <BankUpload />
            </Layout>
          } />
          <Route path="/finanzen/manual-matching" element={
            <Layout>
              <ManualMatching />
            </Layout>
          } />
          <Route path="/finanzen/ditib-upload" element={
            <Layout>
              <DitibUpload />
            </Layout>
          } />
          <Route path="/finanzen/ditib-zahlungen" element={
            <Layout>
              <VereinDitibZahlungList />
            </Layout>
          } />
          <Route path="/finanzen/ditib-zahlungen/new" element={
            <Layout>
              <VereinDitibZahlungForm />
            </Layout>
          } />
          <Route path="/finanzen/ditib-zahlungen/:id" element={
            <Layout>
              <VereinDitibZahlungDetail />
            </Layout>
          } />
          <Route path="/finanzen/ditib-zahlungen/:id/edit" element={
            <Layout>
              <VereinDitibZahlungForm />
            </Layout>
          } />
          {/* easyFiBu Routes */}
          <Route path="/finanzen/kassenbuch" element={
            <Layout>
              <EasyFiBuDashboard defaultTab="kassenbuch" />
            </Layout>
          } />
          <Route path="/finanzen/konten" element={
            <Layout>
              <EasyFiBuDashboard defaultTab="konten" />
            </Layout>
          } />
          <Route path="/finanzen/spenden" element={
            <Layout>
              <EasyFiBuDashboard defaultTab="spenden" />
            </Layout>
          } />
          <Route path="/finanzen/transit" element={
            <Layout>
              <EasyFiBuDashboard defaultTab="transit" />
            </Layout>
          } />
          <Route path="/finanzen/jahresabschluss" element={
            <Layout>
              <EasyFiBuDashboard defaultTab="jahresabschluss" />
            </Layout>
          } />

          {/* Meine Finanzen Routes - Mitglied */}
          <Route path="/meine-finanzen" element={
            <Layout>
              <MitgliedFinanz />
            </Layout>
          } />
          <Route path="/meine-finanzen/forderungen" element={
            <Layout>
              <MitgliedForderungList />
            </Layout>
          } />
          <Route path="/meine-finanzen/forderungen/:id" element={
            <Layout>
              <MitgliedForderungDetail />
            </Layout>
          } />
          <Route path="/meine-finanzen/zahlungen" element={
            <Layout>
              <MitgliedZahlungHistory />
            </Layout>
          } />
          <Route path="/meine-finanzen/zahlungen/:id" element={
            <Layout>
              <MitgliedZahlungDetail />
            </Layout>
          } />

          {/* Einstellungen - Available for all user types */}
          <Route path="/einstellungen" element={
            <Layout>
              <Settings />
            </Layout>
          } />

          {/* Profil - Available for all user types */}
          <Route path="/profil" element={
            <Layout>
              <Profile />
            </Layout>
          } />

          {/* Admin Page Notes - Only for admin users */}
          {user?.type === 'admin' && (
            <Route path="/admin/page-notes" element={
              <Layout>
                <PageNotesAdmin />
              </Layout>
            } />
          )}

          {/* Admin Organization Management - Only for admin users */}
          {user?.type === 'admin' && (
            <Route path="/admin/organizations" element={
              <Layout>
                <OrganizationAdmin />
              </Layout>
            } />
          )}

          {/* Briefe - Only for dernek users */}
          {user?.type === 'dernek' && (
            <>
              <Route path="/briefe" element={
                <Layout>
                  <BriefeList />
                </Layout>
              } />
              <Route path="/briefe/neu" element={
                <Layout>
                  <BriefForm />
                </Layout>
              } />
              <Route path="/briefe/:id/bearbeiten" element={
                <Layout>
                  <BriefForm />
                </Layout>
              } />
              <Route path="/briefe/:id" element={
                <Layout>
                  <BriefDetail />
                </Layout>
              } />
              <Route path="/briefe/vorlagen" element={
                <Layout>
                  <BriefVorlagenList />
                </Layout>
              } />
            </>
          )}

          {/* Nachrichten - Only for mitglied users */}
          {user?.type === 'mitglied' && (
            <>
              <Route path="/nachrichten" element={
                <Layout>
                  <NachrichtenList />
                </Layout>
              } />
              <Route path="/nachrichten/:id" element={
                <Layout>
                  <NachrichtDetail />
                </Layout>
              } />
            </>
          )}

          {/* Mitglied specific routes */}
          <Route path="/meine-veranstaltungen" element={
            <Layout>
              <MitgliedEtkinlikler />
            </Layout>
          } />
          <Route path="/meine-familie" element={
            <Layout>
              <MitgliedAilem />
            </Layout>
          } />

          {/* Catch-all - show nothing, let React Router handle it */}
        </>
      ) : (
        /* Redirect unauthenticated users to auth page */
        <Route path="*" element={<Navigate to="/auth" replace />} />
      )}
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
