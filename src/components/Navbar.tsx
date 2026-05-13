"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  LayoutDashboard,
  Calculator,
  MessageCircle,
  Bell,
  LogIn,
  LogOut,
  Menu,
  X,
  Shield,
  Phone,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/finance", label: "Finance", icon: Calculator },
];

interface NavbarProps {
  onOpenLeadForm?: () => void;
}

export default function Navbar({ onOpenLeadForm }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleNotifications, toggleChat, notifications } = useUIStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-scrolled" : "glass-strong"}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Building2 size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-wider" style={{ color: "var(--navy)" }}>NEXUS</h1>
            <p className="text-[10px] tracking-[0.25em]" style={{ color: "var(--royal-gold)" }}>PREMIUM REALTY</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-200 hover:bg-[var(--cream)]"
              style={{ color: "var(--navy-muted)" }}
            >
              <link.icon size={16} className="transition-colors group-hover:text-[var(--royal-gold)]" />
              <span className="group-hover:text-[var(--navy)]">{link.label}</span>
            </Link>
          ))}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-200 hover:bg-[var(--cream)]"
              style={{ color: "var(--royal-gold-dark)" }}
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenLeadForm && (
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenLeadForm}
              className="hidden sm:flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all duration-200 btn-shine"
              style={{
                background: "linear-gradient(135deg, #2E7D5B, #236B4A)",
                boxShadow: "0 2px 10px rgba(46,125,91,0.25)",
              }}
            >
              <Phone size={13} />
              Get a Callback
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="relative rounded-xl p-2.5 transition-all duration-200 hover:bg-[var(--cream)]"
            style={{ color: "var(--navy-muted)" }}
          >
            <MessageCircle size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleNotifications}
            className="relative rounded-xl p-2.5 transition-all duration-200 hover:bg-[var(--cream)]"
            style={{ color: "var(--navy-muted)" }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "var(--accent-red)" }}>
                {unreadCount}
              </span>
            )}
          </motion.button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:bg-[var(--cream)]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))" }}>
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden lg:inline" style={{ color: "var(--navy)" }}>{user?.name}</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="rounded-xl p-2.5 transition-all duration-200 hover:bg-red-50"
                style={{ color: "var(--navy-muted)" }}
              >
                <LogOut size={18} />
              </motion.button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all duration-200"
              style={{ background: "var(--royal-gold)", boxShadow: "0 2px 8px rgba(200,164,92,0.25)" }}
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2.5 transition-all hover:bg-[var(--cream)] md:hidden"
            style={{ color: "var(--navy-muted)" }}
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
            className="overflow-hidden md:hidden"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:bg-[var(--cream)]"
                  style={{ color: "var(--navy-muted)" }}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:bg-[var(--cream)]"
                  style={{ color: "var(--royal-gold-dark)" }}
                >
                  <Shield size={18} />
                  Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
