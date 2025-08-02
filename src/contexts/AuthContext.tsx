import type {ReactNode} from 'react';
import React, {createContext, useContext, useState} from 'react';
import type {User} from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  'tenant@example.com': {
    id: '1',
    email: 'tenant@example.com',
    name: 'John Tenant',
    role: 'tenant',
    isActive: true,
  },
  'homeowner@example.com': {
    id: '2',
    email: 'homeowner@example.com',
    name: 'Jane Owner',
    role: 'homeowner',
    isActive: true,
  },
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    isActive: true,
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const mockUser = mockUsers[email];
    if (mockUser && password === 'password') {
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};