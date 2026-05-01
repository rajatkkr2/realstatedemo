"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { useAuthStore } from "@/store/authStore";
import { isDemo } from "@/utils/isDemo";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "agent">("buyer");
  const { loginAs } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 800));
      loginAs(role);
      toast.success("Demo: Account simulated!");
      router.push("/dashboard");
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });
        if (res.ok) {
          toast.success("Account created!");
          router.push("/auth/login");
        } else {
          const data = await res.json();
          toast.error(data.error || "Registration failed");
        }
      } catch {
        toast.error("Registration failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20" style={{ marginTop: isDemo ? "36px" : "0" }}>
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(180,0,255,0.2), rgba(255,0,170,0.2))", border: "1px solid rgba(180,0,255,0.3)" }}
              animate={{ boxShadow: ["0 0 20px rgba(180,0,255,0.2)", "0 0 40px rgba(180,0,255,0.3)", "0 0 20px rgba(180,0,255,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <UserPlus size={28} className="text-[var(--neon-purple)]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="mt-1 text-sm text-white/40">Join the NEXUS network</p>
          </div>

          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">FULL NAME</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-purple)]/30"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-purple)]/30"
                    required
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
                    className="w-full rounded-xl bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-purple)]/30"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">I AM A</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["buyer", "agent"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                        role === r ? "text-white" : "text-white/40 hover:bg-white/5"
                      }`}
                      style={role === r ? { background: "rgba(180,0,255,0.15)", border: "1px solid rgba(180,0,255,0.3)" } : { border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <NeonButton type="submit" variant="purple" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </NeonButton>
            </form>
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-xs text-white/30 hover:text-[var(--neon-purple)] transition-colors">
                Already have an account? <span className="text-[var(--neon-purple)]">Sign In</span>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
