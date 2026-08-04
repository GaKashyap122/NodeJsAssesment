import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { saveToken, clearToken, loadToken, parseToken, isTokenExpired } from '../utils/token';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = loadToken();
    // Discard expired tokens on startup
    if (stored && isTokenExpired(stored)) {
      clearToken();
      return null;
    }
    return stored;
  });

  const login = useCallback((newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const payload = token ? parseToken(token) : null;
    const role = payload?.role ?? null;
    return {
      token,
      isAuthenticated: !!token,
      role,
      isAdmin: role === 'admin',
      login,
      logout,
    };
  }, [token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
