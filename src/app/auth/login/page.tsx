"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))" }}>
              <LogIn size={28} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--navy)" }}>Welcome Back</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--navy-muted)" }}>Sign in to your NEXUS Realty account</p>
          </div>

          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                    style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>PASSWORD</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                    style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>
              <NeonButton type="submit" variant="cyan" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </NeonButton>
            </form>
            <div className="mt-4 text-center">
              <Link href="/auth/register" className="text-xs transition-colors hover:text-[var(--royal-gold)]" style={{ color: "var(--navy-muted)" }}>
                Don&apos;t have an account? <span style={{ color: "var(--royal-gold)" }}>Register</span>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
