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

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { properties, fetchProperties, wishlist } = usePropertyStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  if (!isAuthenticated) return null;

  const role = user?.role || "buyer";
  const wishlisted = properties.filter((p) => wishlist.includes(p._id));
  const myListings = properties.filter((p) => p.agent === user?._id);
  const agent = mockAgents[0];

  const statColors = ["var(--accent-red)", "var(--royal-gold)", "var(--accent-blue)", "var(--accent-green)"];

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))" }}>
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--navy)" }}>Welcome, {user?.name || "Explorer"}</h1>
              <p className="text-sm" style={{ color: "var(--navy-muted)" }}>
                {role === "buyer" && "Your personal property dashboard"}
                {role === "agent" && "Manage your listings and leads"}
                {role === "admin" && "System administration panel"}
              </p>
            </div>
            <div className="ml-auto">
              <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                style={{ background: "var(--cream)", color: "var(--royal-gold-dark)", border: "1px solid var(--card-border)" }}>
                {role}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {role === "buyer" && (
              <>
                <GlassCard className="p-5">
                  <Heart size={20} className="mb-2" style={{ color: statColors[0] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{wishlist.length}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Wishlisted</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Eye size={20} className="mb-2" style={{ color: statColors[1] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{properties.length}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Properties Viewed</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <MessageSquare size={20} className="mb-2" style={{ color: statColors[2] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{mockInquiries.length}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Inquiries Sent</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <TrendingUp size={20} className="mb-2" style={{ color: statColors[3] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>92%</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Match Score</p>
                </GlassCard>
              </>
            )}
            {role === "agent" && (
              <>
                <GlassCard className="p-5">
                  <Building2 size={20} className="mb-2" style={{ color: statColors[1] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{agent.totalListings}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>My Listings</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Users size={20} className="mb-2" style={{ color: statColors[2] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{mockInquiries.length}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Leads</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Star size={20} className="mb-2" style={{ color: statColors[1] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{agent.rating}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Rating</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Eye size={20} className="mb-2" style={{ color: statColors[3] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>12.4K</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Total Views</p>
                </GlassCard>
              </>
            )}
            {role === "admin" && (
              <>
                <GlassCard className="p-5">
                  <Building2 size={20} className="mb-2" style={{ color: statColors[1] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{properties.length}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Total Properties</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <Users size={20} className="mb-2" style={{ color: statColors[2] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>3</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Active Users</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <FileText size={20} className="mb-2" style={{ color: statColors[3] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{mockInquiries.length}</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Pending Reviews</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <AlertTriangle size={20} className="mb-2" style={{ color: statColors[0] }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>1</p>
                  <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Fraud Flags</p>
                </GlassCard>
              </>
            )}
          </div>
        </motion.div>

        {role === "buyer" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: "var(--navy)" }}>Your Wishlist</h2>
              <Link href="/properties"><NeonButton variant="ghost" size="sm">Browse More</NeonButton></Link>
            </div>
            {wishlisted.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <Heart size={40} className="mx-auto mb-3" style={{ color: "var(--card-border)" }} />
                <p className="text-sm" style={{ color: "var(--navy-muted)" }}>No properties wishlisted yet</p>
                <Link href="/properties" className="mt-3 inline-block">
                  <NeonButton variant="cyan" size="sm">Explore Properties</NeonButton>
                </Link>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlisted.map((p, i) => (<PropertyCard key={p._id} property={p} index={i} />))}
              </div>
            )}
          </motion.div>
        )}

        {role === "agent" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: "var(--navy)" }}>My Listings</h2>
              <NeonButton variant="cyan" size="sm">
                <span className="flex items-center gap-2"><Plus size={14} /> Add Listing</span>
              </NeonButton>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.slice(0, 6).map((p, i) => (<PropertyCard key={p._id} property={p} index={i} />))}
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--navy)" }}>Recent Leads</h2>
              <div className="space-y-3">
                {mockInquiries.map((inq) => (
                  <GlassCard key={inq._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{inq.userName}</p>
                        <p className="mt-0.5 text-xs" style={{ color: "var(--navy-muted)" }}>{inq.userEmail}</p>
                        <p className="mt-2 text-sm" style={{ color: "var(--navy-muted)" }}>{inq.message}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: inq.status === "pending" ? "rgba(200,164,92,0.1)" : "rgba(46,125,91,0.1)",
                          color: inq.status === "pending" ? "var(--royal-gold-dark)" : "var(--accent-green)",
                        }}>
                        {inq.status}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {role === "admin" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--navy)" }}>Administration</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer">
                  <FileText size={24} className="mb-3" style={{ color: "var(--royal-gold)" }} />
                  <h3 className="font-semibold" style={{ color: "var(--navy)" }}>Manage Listings</h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)" }}>Approve, reject, or flag property listings</p>
                </GlassCard>
              </Link>
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer">
                  <Users size={24} className="mb-3" style={{ color: "var(--accent-blue)" }} />
                  <h3 className="font-semibold" style={{ color: "var(--navy)" }}>Manage Users</h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)" }}>View and manage user accounts and roles</p>
                </GlassCard>
              </Link>
              <Link href="/admin">
                <GlassCard className="p-6 cursor-pointer">
                  <AlertTriangle size={24} className="mb-3" style={{ color: "var(--accent-red)" }} />
                  <h3 className="font-semibold" style={{ color: "var(--navy)" }}>Fraud Detection</h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)" }}>Review flagged listings and suspicious activity</p>
                </GlassCard>
              </Link>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--navy)" }}>All Properties</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.slice(0, 8).map((p, i) => (<PropertyCard key={p._id} property={p} index={i} />))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
