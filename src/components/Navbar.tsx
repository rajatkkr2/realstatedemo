"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  LayoutDashboard,
  Calculator,
  MessageCircle,
  Bell,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { isDemo } from "@/utils/isDemo";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/finance", label: "Finance", icon: Calculator },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleNotifications, toggleChat, notifications } = useUIStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      style={{ marginTop: isDemo ? "36px" : "0" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(180,0,255,0.2))",
              border: "1px solid rgba(0,240,255,0.3)",
            }}
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Building2 size={20} className="text-[var(--neon-cyan)]" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-wider neon-text-cyan">NEXUS</h1>
            <p className="text-[10px] tracking-[0.3em] text-white/30">REAL ESTATE 2050</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-[var(--neon-cyan)]"
            >
              <link.icon size={16} className="transition-colors group-hover:text-[var(--neon-cyan)]" />
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-[var(--neon-pink)]"
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="relative rounded-xl p-2.5 text-white/50 transition-all hover:bg-white/5 hover:text-[var(--neon-cyan)]"
          >
            <MessageCircle size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleNotifications}
            className="relative rounded-xl p-2.5 text-white/50 transition-all hover:bg-white/5 hover:text-[var(--neon-cyan)]"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--neon-pink)] text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 transition-all hover:bg-white/5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] text-xs font-bold text-black">
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden lg:inline">{user?.name}</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="rounded-xl p-2.5 text-white/40 transition-all hover:bg-white/5 hover:text-[var(--neon-pink)]"
              >
                <LogOut size={18} />
              </motion.button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: "rgba(0,240,255,0.1)",
                border: "1px solid rgba(0,240,255,0.3)",
                color: "var(--neon-cyan)",
              }}
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2.5 text-white/50 transition-all hover:bg-white/5 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-[var(--neon-cyan)]"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-[var(--neon-pink)]"
                >
                  <Shield size={18} />
                  Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
