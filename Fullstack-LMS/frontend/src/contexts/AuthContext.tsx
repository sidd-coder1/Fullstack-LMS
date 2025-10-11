import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, setTokens, clearTokens, getToken } from '../services/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  devSignIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && token.startsWith('dev_')) {
      // Only auto-sign-in for explicit dev tokens
      setUser({ id: 1, username: 'devuser', email: 'dev@example.com', role: 'admin' });
    }
    // For real tokens, we do not auto-set user without validation (/me) to avoid accidental auto-login
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authAPI.login(credentials);
      setTokens(response.access, response.refresh);

      // Set user from backend response (username, role)
      const loggedInUser: User = {
        id: 0, // backend login doesn't return id; optional enhancement: provide /me endpoint
        username: response.username || credentials.username,
        email: '',
        role: (response.role as User['role']) || 'student',
      };
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const user = await authAPI.register(userData);
      // After registration, user needs to login
      await login({ username: userData.username, password: userData.password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    devSignIn: () => {
      // Temporary mock sign-in for frontend development without backend
      setTokens('dev_access_token', 'dev_refresh_token');
      const mockUser: User = {
        id: 1,
        username: 'devuser',
        email: 'dev@example.com',
        role: 'admin',
      };
      setUser(mockUser);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
