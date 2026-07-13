import { useAuthStore } from '@/store/use-auth-store';

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
