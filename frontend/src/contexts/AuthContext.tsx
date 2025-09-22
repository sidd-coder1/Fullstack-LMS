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
    if (token) {
      // Persist session across refreshes
      if (token.startsWith('dev_')) {
        // Dev mode: mock user so pages can use mock data gates
        setUser({ id: 1, username: 'devuser', email: 'dev@example.com', role: 'admin' });
      } else {
        // Real token but no /me endpoint yet: set a minimal placeholder user
        // This enables app routes and API Authorization header to function
        setUser({ id: 0, username: 'user', email: '', role: 'technician' });
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authAPI.login(credentials);
      setTokens(response.access, response.refresh);
      
      // TODO: Fetch user data after login
      // For now, we'll create a mock user
      const mockUser: User = {
        id: 1,
        username: credentials.username,
        email: '',
        role: 'admin' // This should come from the actual user data
      };
      setUser(mockUser);
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
    isAuthenticated: !!user && !!getToken(),
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
