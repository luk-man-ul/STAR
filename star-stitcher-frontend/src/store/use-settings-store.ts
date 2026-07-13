import { create } from 'zustand';
import apiClient from '@/lib/api-client';

interface ShopSettings {
  status: 'OPEN' | 'CLOSED';
  shopName: string;
  logoUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  heroHeading: string;
  heroSubheading: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
}

interface SettingsState {
  settings: ShopSettings | null;
  loading: boolean;
  fetchSettings: () => Promise<ShopSettings | null>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const response = await apiClient.get('/settings');
      set({ settings: response.data, loading: false });
      return response.data;
    } catch (err) {
      set({ loading: false });
      return null;
    }
  },
}));
