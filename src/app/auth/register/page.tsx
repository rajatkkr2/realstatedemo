"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "agent">("buyer");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-light))" }}>
              <UserPlus size={28} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--navy)" }}>Create Account</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--navy-muted)" }}>Join NEXUS Realty</p>
          </div>

          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>FULL NAME</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                    style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                    style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>PASSWORD</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                    style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>I AM A</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["buyer", "agent"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                      style={role === r
                        ? { background: "var(--royal-gold)", color: "white", border: "1px solid var(--royal-gold)" }
                        : { background: "white", color: "var(--navy-muted)", border: "1px solid var(--card-border)" }
                      }>
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
              <Link href="/auth/login" className="text-xs transition-colors hover:text-[var(--royal-gold)]" style={{ color: "var(--navy-muted)" }}>
                Already have an account? <span style={{ color: "var(--royal-gold)" }}>Sign In</span>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
