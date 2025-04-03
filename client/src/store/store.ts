import type { UserPayload } from '@/types';
import { create } from 'zustand';

interface AppState {
    user: UserPayload | null;
    setUser: (userData: UserPayload | null) => void;
}

const useStore = create<AppState>()((set) => ({
    user: null as UserPayload | null,
    setUser: (userData: UserPayload | null) => set({ user: userData }),
}));

export { useStore };