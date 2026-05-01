"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
      const stored = localStorage.getItem("nexus_auth");
      if (stored) {
        const { user } = JSON.parse(stored);
        router.push(user?.role === "admin" ? "/admin" : "/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8" glowColor="cyan">
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(180,0,255,0.2))",
                border: "1px solid rgba(0,240,255,0.3)",
              }}
            >
              <LogIn size={28} className="text-[var(--neon-cyan)]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="mt-1 text-sm text-white/40">Sign in to your NEXUS account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <NeonButton type="submit" variant="cyan" className="w-full">
              {isLoading ? "Signing In..." : "Sign In"}
            </NeonButton>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[var(--neon-cyan)] hover:underline">
              Create Account
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
