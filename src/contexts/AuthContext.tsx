import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for authentication
const mockUsers: User[] = [
  {
    id: 'customer-1',
    email: 'customer@example.com',
    name: 'Jane Customer',
    phone: '+1234567890',
    role: 'customer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '+1234567891',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    userRole: 'public'
  });

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const user: User = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          userRole: user.role
        });
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') { // Simple mock password
      const newAuthState = {
        user,
        isAuthenticated: true,
        userRole: user.role as UserRole
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      userRole: 'public'
    });
    localStorage.removeItem('auth_user');
  };

  const setUser = (user: User | null) => {
    if (user) {
      const newAuthState = {
        user,
        isAuthenticated: true,
        userRole: user.role as UserRole
      };
      setAuthState(newAuthState);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      logout();
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};