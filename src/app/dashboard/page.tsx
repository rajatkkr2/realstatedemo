"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Eye,
  Building2,
  MessageSquare,
  TrendingUp,
  Shield,
  FileText,
  Users,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import PropertyCard from "@/components/PropertyCard";
import { useAuthStore } from "@/store/authStore";
import { usePropertyStore } from "@/store/propertyStore";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { properties, fetchProperties, wishlist } = usePropertyStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  if (!isAuthenticated) return null;

  const role = user?.role || "buyer";
  const wishlisted = properties.filter((p) => wishlist.includes(p._id));

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] text-xl font-bold text-black">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {user?.name || "User"}</h1>
              <p className="text-sm text-white/40">
                {role === "admin" ? "System administration panel" : "Your personal property dashboard"}
              </p>
            </div>
            <div className="ml-auto">
              <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background: role === "admin" ? "rgba(255,0,170,0.1)" : "rgba(0,240,255,0.1)",
                  color: role === "admin" ? "var(--neon-pink)" : "var(--neon-cyan)",
                  border: `1px solid ${role === "admin" ? "rgba(255,0,170,0.3)" : "rgba(0,240,255,0.3)"}`,
                }}>
                {role}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <GlassCard className="p-5">
              <Heart size={20} className="mb-2 text-[var(--neon-pink)]" />
              <p className="text-2xl font-bold text-white">{wishlist.length}</p>
              <p className="text-xs text-white/40">Wishlisted</p>
            </GlassCard>
            <GlassCard className="p-5">
              <Eye size={20} className="mb-2 text-[var(--neon-cyan)]" />
              <p className="text-2xl font-bold text-white">{properties.length}</p>
              <p className="text-xs text-white/40">Properties Available</p>
            </GlassCard>
            <GlassCard className="p-5">
              <MessageSquare size={20} className="mb-2 text-[var(--neon-purple)]" />
              <p className="text-2xl font-bold text-white">—</p>
              <p className="text-xs text-white/40">Inquiries Sent</p>
            </GlassCard>
            <GlassCard className="p-5">
              <TrendingUp size={20} className="mb-2 text-[var(--neon-green)]" />
              <p className="text-2xl font-bold text-white">{properties.filter((p) => p.featured).length}</p>
              <p className="text-xs text-white/40">Featured Listings</p>
            </GlassCard>
          </div>
        </motion.div>

        {role === "admin" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-white">Admin Quick Links</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer transition-all hover:scale-[1.02]" glowColor="pink">
                  <FileText size={24} className="mb-3 text-[var(--neon-pink)]" />
                  <h3 className="font-semibold text-white">Manage Listings</h3>
                  <p className="mt-1 text-xs text-white/40">Add, edit, delete property listings</p>
                </GlassCard>
              </Link>
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer transition-all hover:scale-[1.02]" glowColor="cyan">
                  <Users size={24} className="mb-3 text-[var(--neon-cyan)]" />
                  <h3 className="font-semibold text-white">Manage Users</h3>
                  <p className="mt-1 text-xs text-white/40">View registered users and roles</p>
                </GlassCard>
              </Link>
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer transition-all hover:scale-[1.02]" glowColor="purple">
                  <Shield size={24} className="mb-3 text-[var(--neon-purple)]" />
                  <h3 className="font-semibold text-white">Inquiries</h3>
                  <p className="mt-1 text-xs text-white/40">View and reply to user inquiries</p>
                </GlassCard>
              </Link>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Wishlist</h2>
            <Link href="/properties">
              <NeonButton variant="ghost" size="sm">Browse More</NeonButton>
            </Link>
          </div>
          {wishlisted.length === 0 ? (
            <GlassCard className="p-10 text-center">
              <Heart size={40} className="mx-auto mb-3 text-white/10" />
              <p className="text-sm text-white/40">No properties wishlisted yet</p>
              <Link href="/properties" className="mt-3 inline-block">
                <NeonButton variant="cyan" size="sm">Explore Properties</NeonButton>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlisted.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
