import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';
import { loginWithEmail, logout as firebaseLogout, onAuthChange } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    userRole: 'public'
  });
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          userRole: user.role as UserRole
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          userRole: 'public'
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await loginWithEmail(email, password);
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          userRole: user.role as UserRole
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        userRole: 'public'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setUser = (user: User | null) => {
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        userRole: user.role as UserRole
      });
    } else {
      logout();
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    setUser,
    loading
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