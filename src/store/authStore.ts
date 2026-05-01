import { create } from "zustand";
import { demoUser, demoAgent, demoAdmin } from "@/utils/mockData";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "agent" | "admin";
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAs: (role: "buyer" | "agent" | "admin") => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 800));
      const user = email.includes("agent")
        ? demoAgent
        : email.includes("admin")
        ? demoAdmin
        : demoUser;
      set({ user, isAuthenticated: true, isLoading: false });
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
        throw new Error(data.error || "Login failed");
      }
    } catch {
      set({ isLoading: false });
      throw new Error("Login failed");
    }
  },

  loginAs: (role: "buyer" | "agent" | "admin") => {
    const userMap = { buyer: demoUser, agent: demoAgent, admin: demoAdmin };
    set({ user: userMap[role], isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (!isDemo) {
      fetch("/api/auth/logout", { method: "POST" });
    }
  },

  setUser: (user: User) => set({ user, isAuthenticated: true }),
}));
