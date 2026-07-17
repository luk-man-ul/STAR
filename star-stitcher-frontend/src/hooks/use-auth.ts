import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import apiClient from '@/lib/api-client';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login: async () => {
      // Authentication login logic placeholder
    },
    logout: () => {
      clearAuth();
    },
  };
}

export function useSession() {
  const { user, setAuth, clearAuth } = useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    async function restore() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setIsRestoring(false);
        return;
      }

      if (!user) {
        try {
          const response = await apiClient.get('/auth/me');
          setAuth(response.data);
        } catch (err) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
          clearAuth();
        } finally {
          setIsRestoring(false);
        }
      } else {
        setIsRestoring(false);
      }
    }
    restore();
  }, [user, setAuth, clearAuth]);

  return { user, isRestoring, clearAuth, setAuth };
}

