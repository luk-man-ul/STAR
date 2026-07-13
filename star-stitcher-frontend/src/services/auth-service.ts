import apiClient from '@/lib/api-client';

export const authService = {
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};
