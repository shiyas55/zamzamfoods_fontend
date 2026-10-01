/**
 * Zamzam Foods Authentication Context
 *
 * Hydration strategy:
 *   1. Instantly restore cached user from localStorage (no loading flash)
 *   2. Validate against /auth/me/ in the background using Bearer header & HttpOnly cookies
 *   3. If access token is expired, apiClient auto-calls /auth/refresh/ silently with mutex locking
 *   4. User stays logged in seamlessly across page refreshes and devices.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydrate from localStorage immediately — if user is cached, loading is false instantly!
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(() => !authService.getStoredUser());

  /**
   * Validate user session in the background.
   */
  const refreshUser = useCallback(async () => {
    const accessToken = localStorage.getItem('zamzam_access_token');
    const refreshToken = localStorage.getItem('zamzam_refresh_token');
    const storedUser = authService.getStoredUser();

    // If completely unauthenticated
    if (!accessToken && !refreshToken && !storedUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('zamzam_user', JSON.stringify(freshUser));
    } catch {
      // Background validation failed (e.g. network timeout or server waking up)
      // Keep cached user active so user is NEVER logged out on refresh!
      if (storedUser) {
        setUser(storedUser);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Background validation on startup
    refreshUser();

    // Handle explicit server-confirmed logout
    const handleLogoutEvent = () => {
      setUser(null);
      localStorage.removeItem('zamzam_user');
      setIsLoading(false);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, [refreshUser]);

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(username, password);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
