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
import BankBuchungList from './pages/Finanz/BankBuchungList';
import BankBuchungDetail from './pages/Finanz/BankBuchungDetail';
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
  const { isAuthenticated, user, getUserSettingsKey } = useAuth();

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
  const DashboardComponent = user?.type === 'admin' ? Dashboard :
                            user?.type === 'dernek' ? VereinDashboard :
                            MitgliedDashboard;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <>
          <Route path="/dashboard" element={
            <Layout>
              <DashboardComponent />
            </Layout>
          } />

          {/* Vereine List - Sadece Admin */}
          {user?.type === 'admin' && (
            <Route path="/vereine" element={
              <Layout>
                <VereinList />
              </Layout>
            } />
          )}

          {/* Verein Detail - Admin ve Dernek */}
          {(user?.type === 'admin' || user?.type === 'dernek') && (
            <Route path="/vereine/:id" element={
              <Layout>
                <VereinDetail />
              </Layout>
            } />
          )}

          {(user?.type === 'admin' || user?.type === 'dernek') && (
            <>
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
              <Route path="/veranstaltungen" element={
                <Layout>
                  <VeranstaltungList />
                </Layout>
              } />
            </>
          )}

          {/* Veranstaltung Detail - Available for all user types */}
          <Route path="/veranstaltungen/:id" element={
            <Layout>
              <VeranstaltungDetail />
            </Layout>
          } />

          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />

          {/* Finanz Routes - Admin and Dernek only */}
          {(user?.type === 'admin' || user?.type === 'dernek') && (
            <>
              <Route path="/finanz" element={
                <Layout>
                  <FinanzDashboard />
                </Layout>
              } />
              <Route path="/finanz/forderungen" element={
                <Layout>
                  <MitgliedForderungList />
                </Layout>
              } />
              <Route path="/finanz/forderungen/:id" element={
                <Layout>
                  <MitgliedForderungDetail />
                </Layout>
              } />
              <Route path="/finanz/zahlungen" element={
                <Layout>
                  <MitgliedZahlungList />
                </Layout>
              } />
              <Route path="/finanz/zahlungen/:id" element={
                <Layout>
                  <MitgliedZahlungDetail />
                </Layout>
              } />
              <Route path="/finanz/bank" element={
                <Layout>
                  <BankBuchungList />
                </Layout>
              } />
              <Route path="/finanz/bank/:id" element={
                <Layout>
                  <BankBuchungDetail />
                </Layout>
              } />
            </>
          )}

          {/* Settings - Available for all user types */}
          <Route path="/ayarlar" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="/verein/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />

          {/* Profile - Available for all user types */}
          <Route path="/profil" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />

          {/* Mitglied specific routes */}
          <Route path="/etkinlikler" element={
            <Layout>
              <MitgliedEtkinlikler />
            </Layout>
          } />
          <Route path="/ailem" element={
            <Layout>
              <MitgliedAilem />
            </Layout>
          } />

          {/* Mitglied Finanz - Member's personal finance page */}
          {user?.type === 'mitglied' && (
            <Route path="/finanz" element={
              <Layout>
                <MitgliedFinanz />
              </Layout>
            } />
          )}

          {/* Redirect any other route to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
