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
  Plus,
  Users,
  Star,
  FileText,
  AlertTriangle,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import PropertyCard from "@/components/PropertyCard";
import { useAuthStore } from "@/store/authStore";
import { usePropertyStore } from "@/store/propertyStore";
import { mockInquiries, mockAgents } from "@/utils/mockData";
import { isDemo } from "@/utils/isDemo";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { properties, fetchProperties, wishlist } = usePropertyStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isDemo) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  if (!isAuthenticated && !isDemo) return null;

  const role = user?.role || "buyer";
  const wishlisted = properties.filter((p) => wishlist.includes(p._id));
  const myListings = properties.filter((p) => p.agent === user?._id || p.agent === "demo-agent-001");
  const agent = mockAgents[0];

  return (
    <div className="min-h-screen px-4 pt-24 pb-12" style={{ marginTop: isDemo ? "36px" : "0" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] text-xl font-bold text-black">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome, {user?.name || "Explorer"}
              </h1>
              <p className="text-sm text-white/40">
                {role === "buyer" && "Your personal property dashboard"}
                {role === "agent" && "Manage your listings and leads"}
                {role === "admin" && "System administration panel"}
              </p>
            </div>
            <div className="ml-auto">
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background: role === "admin" ? "rgba(255,0,170,0.1)" : role === "agent" ? "rgba(180,0,255,0.1)" : "rgba(0,240,255,0.1)",
                  color: role === "admin" ? "var(--neon-pink)" : role === "agent" ? "var(--neon-purple)" : "var(--neon-cyan)",
                  border: `1px solid ${role === "admin" ? "rgba(255,0,170,0.3)" : role === "agent" ? "rgba(180,0,255,0.3)" : "rgba(0,240,255,0.3)"}`,
                }}
              >
                {role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {role === "buyer" && (
              <>
                <GlassCard className="p-5">
                  <Heart size={20} className="mb-2 text-[var(--neon-pink)]" />
                  <p className="text-2xl font-bold text-white">{wishlist.length}</p>
                  <p className="text-xs text-white/40">Wishlisted</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Eye size={20} className="mb-2 text-[var(--neon-cyan)]" />
                  <p className="text-2xl font-bold text-white">{properties.length}</p>
                  <p className="text-xs text-white/40">Properties Viewed</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <MessageSquare size={20} className="mb-2 text-[var(--neon-purple)]" />
                  <p className="text-2xl font-bold text-white">{mockInquiries.length}</p>
                  <p className="text-xs text-white/40">Inquiries Sent</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <TrendingUp size={20} className="mb-2 text-[var(--neon-green)]" />
                  <p className="text-2xl font-bold text-white">92%</p>
                  <p className="text-xs text-white/40">AI Match Score</p>
                </GlassCard>
              </>
            )}
            {role === "agent" && (
              <>
                <GlassCard className="p-5">
                  <Building2 size={20} className="mb-2 text-[var(--neon-cyan)]" />
                  <p className="text-2xl font-bold text-white">{agent.totalListings}</p>
                  <p className="text-xs text-white/40">My Listings</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Users size={20} className="mb-2 text-[var(--neon-purple)]" />
                  <p className="text-2xl font-bold text-white">{mockInquiries.length}</p>
                  <p className="text-xs text-white/40">Leads</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Star size={20} className="mb-2 text-[var(--neon-pink)]" />
                  <p className="text-2xl font-bold text-white">{agent.rating}</p>
                  <p className="text-xs text-white/40">Rating</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Eye size={20} className="mb-2 text-[var(--neon-green)]" />
                  <p className="text-2xl font-bold text-white">12.4K</p>
                  <p className="text-xs text-white/40">Total Views</p>
                </GlassCard>
              </>
            )}
            {role === "admin" && (
              <>
                <GlassCard className="p-5">
                  <Building2 size={20} className="mb-2 text-[var(--neon-cyan)]" />
                  <p className="text-2xl font-bold text-white">{properties.length}</p>
                  <p className="text-xs text-white/40">Total Properties</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Users size={20} className="mb-2 text-[var(--neon-purple)]" />
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-white/40">Active Users</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <FileText size={20} className="mb-2 text-[var(--neon-green)]" />
                  <p className="text-2xl font-bold text-white">{mockInquiries.length}</p>
                  <p className="text-xs text-white/40">Pending Reviews</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <AlertTriangle size={20} className="mb-2 text-[var(--neon-pink)]" />
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-xs text-white/40">Fraud Flags</p>
                </GlassCard>
              </>
            )}
          </div>
        </motion.div>

        {/* Buyer: Wishlist Section */}
        {role === "buyer" && (
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
        )}

        {/* Agent: My Listings */}
        {role === "agent" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">My Listings</h2>
              <NeonButton variant="cyan" size="sm" disableInDemo>
                <span className="flex items-center gap-2"><Plus size={14} /> Add Listing</span>
              </NeonButton>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.slice(0, 6).map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>

            {/* Leads */}
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-white">Recent Leads</h2>
              <div className="space-y-3">
                {mockInquiries.map((inq) => (
                  <GlassCard key={inq._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{inq.userName}</p>
                        <p className="mt-0.5 text-xs text-white/40">{inq.userEmail}</p>
                        <p className="mt-2 text-sm text-white/50">{inq.message}</p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: inq.status === "pending" ? "rgba(255,170,0,0.1)" : "rgba(0,255,136,0.1)",
                          color: inq.status === "pending" ? "#ffaa00" : "var(--neon-green)",
                        }}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Admin: Quick Links */}
        {role === "admin" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="mb-4 text-xl font-bold text-white">Administration</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer transition-all hover:scale-[1.02]" glowColor="pink">
                  <FileText size={24} className="mb-3 text-[var(--neon-pink)]" />
                  <h3 className="font-semibold text-white">Manage Listings</h3>
                  <p className="mt-1 text-xs text-white/40">Approve, reject, or flag property listings</p>
                </GlassCard>
              </Link>
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer transition-all hover:scale-[1.02]" glowColor="cyan">
                  <Users size={24} className="mb-3 text-[var(--neon-cyan)]" />
                  <h3 className="font-semibold text-white">Manage Users</h3>
                  <p className="mt-1 text-xs text-white/40">View and manage user accounts and roles</p>
                </GlassCard>
              </Link>
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer transition-all hover:scale-[1.02]" glowColor="purple">
                  <AlertTriangle size={24} className="mb-3 text-[var(--neon-purple)]" />
                  <h3 className="font-semibold text-white">Fraud Detection</h3>
                  <p className="mt-1 text-xs text-white/40">Review flagged listings and suspicious activity</p>
                </GlassCard>
              </Link>
            </div>

            {/* All Properties */}
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-white">All Properties</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.slice(0, 8).map((p, i) => (
                  <PropertyCard key={p._id} property={p} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
