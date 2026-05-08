import { create } from "zustand";
import type { User } from "@/types";
import { api } from "@/services/api";
import { getSession } from "@/mocks/fakeApi";

type AuthState = {
  user: User | null;
  initialized: boolean;
  loadMe: () => Promise<void>;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  async loadMe() {
    const session = getSession();
    if (!session) {
      set({ user: null, initialized: true });
      return;
    }
    const u = await api.getMe();
    set({ user: u, initialized: true });
  },
  setUser(u) {
    set({ user: u });
  },
  logout() {
    api.logout();
    set({ user: null });
  },
}));
