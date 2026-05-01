"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: "var(--accent-blue)",
  success: "var(--accent-green)",
  warning: "var(--royal-gold-dark)",
  error: "var(--accent-red)",
};

export default function NotificationPanel() {
  const { notificationsOpen, toggleNotifications, notifications, markRead, markAllRead } = useUIStore();

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/20"
            onClick={toggleNotifications}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-16 right-4 z-[85] w-[380px] max-h-[70vh] overflow-hidden rounded-2xl"
            style={{
              background: "var(--warm-white)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 8px 40px rgba(26,26,46,0.12)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--card-border)", background: "var(--cream)" }}>
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: "var(--royal-gold)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={markAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] transition-colors hover:bg-white"
                  style={{ color: "var(--navy-muted)" }}>
                  <CheckCheck size={12} /> Mark all read
                </button>
                <button onClick={toggleNotifications} className="rounded-lg p-1 transition-colors hover:bg-white" style={{ color: "var(--navy-muted)" }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm" style={{ color: "var(--navy-muted)" }}>No notifications</div>
              ) : (
                notifications.map((n) => {
                  const Icon = typeIcons[n.type];
                  return (
                    <motion.div key={n.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      onClick={() => markRead(n.id)}
                      className="cursor-pointer rounded-xl p-3 mb-1 transition-all hover:bg-[var(--cream)]"
                      style={{ background: !n.read ? "rgba(200,164,92,0.04)" : "transparent" }}>
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: `${typeColors[n.type]}15`, color: typeColors[n.type] }}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate" style={{ color: "var(--navy)" }}>{n.title}</p>
                            {!n.read && <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--royal-gold)" }} />}
                          </div>
                          <p className="mt-0.5 text-xs line-clamp-2" style={{ color: "var(--navy-muted)" }}>{n.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
