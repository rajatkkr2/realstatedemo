"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, User, Shield, Building2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { useAuthStore } from "@/store/authStore";
import { isDemo } from "@/utils/isDemo";
import toast from "react-hot-toast";

const demoRoles = [
  { role: "buyer" as const, label: "Buyer", icon: User, color: "var(--neon-cyan)", desc: "Browse & wishlist properties" },
  { role: "agent" as const, label: "Agent", icon: Building2, color: "var(--neon-purple)", desc: "Manage property listings" },
  { role: "admin" as const, label: "Admin", icon: Shield, color: "var(--neon-pink)", desc: "Full admin access" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginAs, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Login failed. Check credentials.");
    }
  };

  const handleDemoLogin = (role: "buyer" | "agent" | "admin") => {
    loginAs(role);
    toast.success(`Logged in as demo ${role}`);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20" style={{ marginTop: isDemo ? "36px" : "0" }}>
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(180,0,255,0.2))", border: "1px solid rgba(0,240,255,0.3)" }}
              animate={{ boxShadow: ["0 0 20px rgba(0,240,255,0.2)", "0 0 40px rgba(0,240,255,0.3)", "0 0 20px rgba(0,240,255,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <LogIn size={28} className="text-[var(--neon-cyan)]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="mt-1 text-sm text-white/40">Sign in to your NEXUS account</p>
          </div>

          {isDemo && (
            <GlassCard className="mb-6 p-5" glowColor="cyan">
              <p className="mb-3 text-xs font-semibold tracking-wider text-[var(--neon-cyan)]">DEMO QUICK LOGIN</p>
              <div className="grid grid-cols-3 gap-2">
                {demoRoles.map((r) => (
                  <motion.button
                    key={r.role}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDemoLogin(r.role)}
                    className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-white/5"
                    style={{ border: `1px solid ${r.color}30` }}
                  >
                    <r.icon size={20} style={{ color: r.color }} />
                    <span className="text-xs font-semibold text-white">{r.label}</span>
                    <span className="text-[9px] text-white/30">{r.desc}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30"
                    required={!isDemo}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">PASSWORD</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30"
                    required={!isDemo}
                  />
                </div>
              </div>
              <NeonButton type="submit" variant="cyan" className="w-full" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Sign In"}
              </NeonButton>
            </form>
            <div className="mt-4 text-center">
              <Link href="/auth/register" className="text-xs text-white/30 hover:text-[var(--neon-cyan)] transition-colors">
                Don&apos;t have an account? <span className="text-[var(--neon-cyan)]">Register</span>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
