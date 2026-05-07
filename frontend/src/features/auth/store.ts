import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  name: string;
  drfoCode: string;
  setAuthenticated: (value: boolean) => void;
  setUser: (name: string, drfoCode: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  name: "",
  drfoCode: "",
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (name, drfoCode) => set({ isAuthenticated: true, name, drfoCode }),
  logout: () => set({ isAuthenticated: false }),
}));
