import { create } from 'zustand';

interface BookingDraft {
  designId: string;
  designName?: string;
  designPrice?: number;
  measurementMethod: string;
  deliveryMethod: string;
  addressId?: string;
  addressText?: string;
  specialInstructions?: string;
  appointmentDate: string;
}

interface BookingState {
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
