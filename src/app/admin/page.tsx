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
import toast from "react-hot-toast";

type Tab = "listings" | "users" | "fraud";

const statusMap: Record<string, { bg: string; color: string }> = {
  Available: { bg: "rgba(46,125,91,0.1)", color: "var(--accent-green)" },
  Sold: { bg: "rgba(192,57,43,0.1)", color: "var(--accent-red)" },
  Draft: { bg: "rgba(74,74,106,0.1)", color: "var(--navy-muted)" },
};

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { properties, fetchProperties } = usePropertyStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  const handleApprove = async (id: string) => {
    toast.success(`Property ${id.slice(-6)} approved`);
  };

  const handleReject = async (id: string) => {
    toast.success(`Property ${id.slice(-6)} rejected`);
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
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} style={{ color: "var(--royal-gold)" }} />
            <h1 className="text-3xl font-bold" style={{ color: "var(--navy)" }}>Admin Panel</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--navy-muted)" }}>System administration and moderation tools</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap"
                style={activeTab === tab.id
                  ? { background: "var(--royal-gold)", color: "white", border: "1px solid var(--royal-gold)" }
                  : { background: "white", color: "var(--navy-muted)", border: "1px solid var(--card-border)" }
                }>
                <tab.icon size={16} />
                {tab.label}
                <span className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{ background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "var(--cream)" }}>{tab.count}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "listings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {properties.map((property) => {
              const sc = statusMap[property.status] || statusMap.Draft;
              return (
                <GlassCard key={property._id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-16 w-24 shrink-0 rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.images[0]})` }} />
                      <div className="min-w-0">
                        <p className="font-semibold truncate" style={{ color: "var(--navy)" }}>{property.title}</p>
                        <p className="text-xs" style={{ color: "var(--navy-muted)" }}>{property.location}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                            style={{ background: sc.bg, color: sc.color }}>{property.status}</span>
                          {flaggedIds.includes(property._id) && (
                            <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                              style={{ background: "rgba(192,57,43,0.1)", color: "var(--accent-red)" }}>FLAGGED</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <NeonButton size="sm" variant="cyan" onClick={() => handleApprove(property._id)}><CheckCircle size={14} /></NeonButton>
                      <NeonButton size="sm" variant="pink" onClick={() => handleReject(property._id)}><XCircle size={14} /></NeonButton>
                      <NeonButton size="sm" variant="ghost" onClick={() => handleFlag(property._id)}>
                        <Flag size={14} className={flaggedIds.includes(property._id) ? "text-red-500" : ""} />
                      </NeonButton>
                      <NeonButton size="sm" variant="ghost" onClick={() => router.push(`/properties/${property._id}`)}><Eye size={14} /></NeonButton>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {allUsers.map((u) => (
              <GlassCard key={u._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                      style={{ background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))" }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--navy)" }}>{u.name}</p>
                      <p className="text-xs" style={{ color: "var(--navy-muted)" }}>{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                      style={{ background: "var(--cream)", color: "var(--royal-gold-dark)", border: "1px solid var(--card-border)" }}>
                      {u.role}
                    </span>
                    <NeonButton size="sm" variant="ghost"><Trash2 size={14} /></NeonButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeTab === "fraud" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="mb-3 text-lg font-semibold flex items-center gap-2" style={{ color: "var(--navy)" }}>
                <AlertTriangle size={18} style={{ color: "var(--accent-red)" }} />
                Fraud Detection Rules
              </h3>
              <div className="space-y-2 text-sm" style={{ color: "var(--navy-muted)" }}>
                <p>- <strong style={{ color: "var(--navy)" }}>Price Anomaly:</strong> Properties priced 50% below market average are flagged</p>
                <p>- <strong style={{ color: "var(--navy)" }}>Duplicate Listings:</strong> Identical images or descriptions are flagged</p>
                <p>- <strong style={{ color: "var(--navy)" }}>Unverified Agents:</strong> Listings from unverified agents require manual review</p>
                <p>- <strong style={{ color: "var(--navy)" }}>Rapid Listings:</strong> Agents creating 5+ listings/day are flagged</p>
              </div>
            </GlassCard>

            <h3 className="text-lg font-semibold" style={{ color: "var(--navy)" }}>Flagged Properties ({flaggedIds.length})</h3>
            {flaggedIds.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <CheckCircle size={40} className="mx-auto mb-3" style={{ color: "var(--accent-green)" }} />
                <p className="text-sm" style={{ color: "var(--navy-muted)" }}>No flagged properties. All clear!</p>
              </GlassCard>
            ) : (
              properties.filter((p) => flaggedIds.includes(p._id)).map((property) => (
                <GlassCard key={property._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-20 shrink-0 rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.images[0]})` }} />
                      <div>
                        <p className="font-semibold" style={{ color: "var(--navy)" }}>{property.title}</p>
                        <p className="text-xs" style={{ color: "var(--navy-muted)" }}>{property.location}</p>
                        <p className="mt-1 text-xs" style={{ color: "var(--accent-red)" }}>Reason: Flagged for review</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <NeonButton size="sm" variant="cyan" onClick={() => handleApprove(property._id)}>Approve</NeonButton>
                      <NeonButton size="sm" variant="pink" onClick={() => handleReject(property._id)}>Remove</NeonButton>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}

            <h3 className="text-lg font-semibold mt-8" style={{ color: "var(--navy)" }}>Inquiry Log</h3>
            <div className="space-y-3">
              {mockInquiries.map((inq) => (
                <GlassCard key={inq._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{inq.userName}</p>
                      <p className="text-xs" style={{ color: "var(--navy-muted)" }}>Property: {inq.propertyId}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--navy-muted)" }}>{inq.message}</p>
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
