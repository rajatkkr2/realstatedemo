"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Eye,
  Trash2,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { useAuthStore } from "@/store/authStore";
import { usePropertyStore } from "@/store/propertyStore";
import { mockUsers, mockAgents, mockInquiries } from "@/utils/mockData";
import { isDemo } from "@/utils/isDemo";
import toast from "react-hot-toast";

type Tab = "listings" | "users" | "fraud";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { properties, fetchProperties } = usePropertyStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [flaggedIds, setFlaggedIds] = useState<string[]>(["demo-prop-007"]);

  useEffect(() => {
    if (!isAuthenticated && !isDemo) {
      router.push("/auth/login");
      return;
    }
    if (user && user.role !== "admin" && !isDemo) {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  const handleApprove = async (id: string) => {
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 500));
      toast.success(`Demo: Property ${id} approved`);
    } else {
      toast.success(`Property ${id} approved`);
    }
  };

  const handleReject = async (id: string) => {
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 500));
      toast.success(`Demo: Property ${id} rejected`);
    } else {
      toast.success(`Property ${id} rejected`);
    }
  };

  const handleFlag = (id: string) => {
    if (flaggedIds.includes(id)) {
      setFlaggedIds(flaggedIds.filter((f) => f !== id));
      toast.success("Flag removed");
    } else {
      setFlaggedIds([...flaggedIds, id]);
      toast.success("Property flagged for review");
    }
  };

  const tabs = [
    { id: "listings" as Tab, label: "Listings", icon: Building2, count: properties.length },
    { id: "users" as Tab, label: "Users", icon: Users, count: mockUsers.length + mockAgents.length },
    { id: "fraud" as Tab, label: "Fraud Detection", icon: AlertTriangle, count: flaggedIds.length },
  ];

  const allUsers = [...mockUsers, ...mockAgents];

  return (
    <div className="min-h-screen px-4 pt-24 pb-12" style={{ marginTop: isDemo ? "36px" : "0" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-[var(--neon-pink)]" />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-sm text-white/40">System administration and moderation tools</p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "text-white" : "text-white/40 hover:bg-white/5"
                }`}
                style={
                  activeTab === tab.id
                    ? {
                        background: "rgba(255,0,170,0.1)",
                        border: "1px solid rgba(255,0,170,0.3)",
                      }
                    : { border: "1px solid rgba(255,255,255,0.05)" }
                }
              >
                <tab.icon size={16} />
                {tab.label}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{tab.count}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {properties.map((property) => (
              <GlassCard key={property._id} className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="h-16 w-24 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${property.images[0]})` }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{property.title}</p>
                      <p className="text-xs text-white/40">{property.location}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{
                            background:
                              property.status === "Available"
                                ? "rgba(0,255,136,0.1)"
                                : property.status === "Sold"
                                ? "rgba(255,0,170,0.1)"
                                : "rgba(180,0,255,0.1)",
                            color:
                              property.status === "Available"
                                ? "var(--neon-green)"
                                : property.status === "Sold"
                                ? "var(--neon-pink)"
                                : "var(--neon-purple)",
                          }}
                        >
                          {property.status}
                        </span>
                        {flaggedIds.includes(property._id) && (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold text-red-400">
                            FLAGGED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <NeonButton size="sm" variant="cyan" onClick={() => handleApprove(property._id)} disableInDemo>
                      <CheckCircle size={14} />
                    </NeonButton>
                    <NeonButton size="sm" variant="pink" onClick={() => handleReject(property._id)} disableInDemo>
                      <XCircle size={14} />
                    </NeonButton>
                    <NeonButton size="sm" variant="ghost" onClick={() => handleFlag(property._id)}>
                      <Flag size={14} className={flaggedIds.includes(property._id) ? "text-red-400" : ""} />
                    </NeonButton>
                    <NeonButton size="sm" variant="ghost" onClick={() => router.push(`/properties/${property._id}`)}>
                      <Eye size={14} />
                    </NeonButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {allUsers.map((u) => (
              <GlassCard key={u._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] font-bold text-black">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{u.name}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        background: u.role === "admin" ? "rgba(255,0,170,0.1)" : u.role === "agent" ? "rgba(180,0,255,0.1)" : "rgba(0,240,255,0.1)",
                        color: u.role === "admin" ? "var(--neon-pink)" : u.role === "agent" ? "var(--neon-purple)" : "var(--neon-cyan)",
                      }}
                    >
                      {u.role}
                    </span>
                    <NeonButton size="sm" variant="ghost" disableInDemo>
                      <Trash2 size={14} />
                    </NeonButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Fraud Detection Tab */}
        {activeTab === "fraud" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <GlassCard className="p-6" glowColor="pink">
              <h3 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-[var(--neon-pink)]" />
                Fraud Detection Rules
              </h3>
              <div className="space-y-2 text-sm text-white/50">
                <p>• <strong className="text-white/70">Price Anomaly:</strong> Properties priced 50% below market average are flagged</p>
                <p>• <strong className="text-white/70">Duplicate Listings:</strong> Identical images or descriptions are flagged</p>
                <p>• <strong className="text-white/70">Unverified Agents:</strong> Listings from unverified agents require manual review</p>
                <p>• <strong className="text-white/70">Rapid Listings:</strong> Agents creating 5+ listings/day are flagged</p>
              </div>
            </GlassCard>

            <h3 className="text-lg font-semibold text-white">Flagged Properties ({flaggedIds.length})</h3>
            {flaggedIds.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <CheckCircle size={40} className="mx-auto mb-3 text-[var(--neon-green)]" />
                <p className="text-sm text-white/40">No flagged properties. All clear!</p>
              </GlassCard>
            ) : (
              properties
                .filter((p) => flaggedIds.includes(p._id))
                .map((property) => (
                  <GlassCard key={property._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-14 w-20 shrink-0 rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${property.images[0]})` }}
                        />
                        <div>
                          <p className="font-semibold text-white">{property.title}</p>
                          <p className="text-xs text-white/40">{property.location}</p>
                          <p className="mt-1 text-xs text-red-400">Reason: Draft status, unverified listing</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <NeonButton size="sm" variant="cyan" onClick={() => handleApprove(property._id)} disableInDemo>
                          Approve
                        </NeonButton>
                        <NeonButton size="sm" variant="pink" onClick={() => handleReject(property._id)} disableInDemo>
                          Remove
                        </NeonButton>
                      </div>
                    </div>
                  </GlassCard>
                ))
            )}

            {/* Recent Inquiries for Review */}
            <h3 className="text-lg font-semibold text-white mt-8">Inquiry Log</h3>
            <div className="space-y-3">
              {mockInquiries.map((inq) => (
                <GlassCard key={inq._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{inq.userName}</p>
                      <p className="text-xs text-white/40">Property: {inq.propertyId}</p>
                      <p className="mt-1 text-sm text-white/50">{inq.message}</p>
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
