import { create } from "zustand";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  notificationsOpen: boolean;
  notifications: Notification[];
  theme: "dark";
  toggleSidebar: () => void;
  toggleChat: () => void;
  toggleNotifications: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  chatOpen: false,
  notificationsOpen: false,
  notifications: [],
  theme: "dark",

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: `notif-${Date.now()}`, read: false, createdAt: new Date().toISOString() },
        ...s.notifications,
      ],
    })),

  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
