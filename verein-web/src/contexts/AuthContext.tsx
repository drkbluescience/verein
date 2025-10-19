import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

export type UserType = 'admin' | 'dernek' | 'mitglied';

export interface User {
  type: UserType;
  id?: number; // User ID for user-specific settings
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  vereinId?: number; // For dernek users
  mitgliedId?: number; // For mitglied users
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
  selectedVereinId: number | null;
  setSelectedVereinId: (vereinId: number | null) => void;
  getUserSettingsKey: () => string; // Helper to get user-specific settings key
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);

  // Helper function to get user-specific settings key
  const getUserSettingsKey = (): string => {
    if (!user) {
      return 'app-settings-guest';
    }
    // Use vereinId or mitgliedId as the unique identifier
    const userId = user.vereinId || user.mitgliedId || user.id || 'unknown';
    return `app-settings-user-${userId}-${user.type}`;
  };

  // Load user and selected verein from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedVereinId = localStorage.getItem('selectedVereinId');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedVereinId) {
      setSelectedVereinId(parseInt(savedVereinId));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });

      const userData: User = {
        type: response.userType as UserType,
        id: response.vereinId || response.mitgliedId, // Use vereinId or mitgliedId as user ID
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        permissions: response.permissions,
        vereinId: response.vereinId,
        mitgliedId: response.mitgliedId
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Store JWT token
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      // Load user-specific language settings after login
      loadUserLanguageSettings(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load user-specific language settings
  const loadUserLanguageSettings = (userData: User) => {
    const userId = userData.vereinId || userData.mitgliedId || userData.id || 'unknown';
    const userSettingsKey = `app-settings-user-${userId}-${userData.type}`;
    const savedSettings = localStorage.getItem(userSettingsKey);

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.language) {
          // Dynamically import i18n to change language
          import('../i18n/config').then((i18nModule) => {
            i18nModule.default.changeLanguage(parsed.language);
          });
        }
      } catch (error) {
        console.error('Error loading user language settings:', error);
      }
    }
  };

  const logout = () => {
    // Note: We keep user-specific settings in localStorage
    // so they can be restored when the user logs in again
    setUser(null);
    setSelectedVereinId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedVereinId');
    localStorage.removeItem('auth_token'); // Remove JWT token

    // Switch back to guest settings
    const guestSettings = localStorage.getItem('app-settings-guest');
    if (guestSettings) {
      try {
        const parsed = JSON.parse(guestSettings);
        if (parsed.language) {
          import('../i18n/config').then((i18nModule) => {
            i18nModule.default.changeLanguage(parsed.language);
          });
        }
      } catch (error) {
        console.error('Error loading guest language settings:', error);
      }
    }
  };

  const handleSetSelectedVereinId = (vereinId: number | null) => {
    setSelectedVereinId(vereinId);
    if (vereinId) {
      localStorage.setItem('selectedVereinId', vereinId.toString());
    } else {
      localStorage.removeItem('selectedVereinId');
    }
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    loading,
    selectedVereinId,
    setSelectedVereinId: handleSetSelectedVereinId,
    getUserSettingsKey
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
