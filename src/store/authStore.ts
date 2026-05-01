import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "agent" | "admin";
  avatar: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone: string; role: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("nexus_auth");
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored);
        if (user && token) {
          set({ user, token, isAuthenticated: true });
        }
      } catch { /* ignore */ }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("nexus_auth", JSON.stringify({ user: data.user, token: data.token }));
        set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false, error: data.error || "Login failed" });
        throw new Error(data.error || "Login failed");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("nexus_auth", JSON.stringify({ user: result.user, token: result.token }));
        set({ user: result.user, token: result.token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false, error: result.error || "Registration failed" });
        throw new Error(result.error || "Registration failed");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem("nexus_auth");
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user: User) => set({ user, isAuthenticated: true }),
}));
