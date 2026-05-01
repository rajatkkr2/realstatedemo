"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Users,
  MessageSquare,
  Plus,
  Eye,
  Trash2,
  Edit,
  X,
  Save,
  ChevronDown,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

type Tab = "listings" | "add" | "inquiries" | "users";

interface PropertyForm {
  title: string;
  description: string;
  price: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
  propertyType: string;
  bhk: string;
  sqft: string;
  bathrooms: string;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  status: string;
  amenities: string;
  images: string;
  featured: boolean;
  contactPhone: string;
  contactEmail: string;
}

const emptyForm: PropertyForm = {
  title: "", description: "", price: "", location: "", address: "",
  city: "", state: "", pincode: "", area: "", propertyType: "Apartment",
  bhk: "2", sqft: "", bathrooms: "1", floor: "0", totalFloors: "1",
  yearBuilt: "2024", status: "Available", amenities: "", images: "",
  featured: false, contactPhone: "", contactEmail: "",
};

const statesOfIndia = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Studio", "Plot", "Commercial", "Independent House", "Builder Floor"];

interface Inquiry {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  status: string;
  adminReply: string;
  createdAt: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
}

interface PropertyItem {
  _id: string;
  title: string;
  city: string;
  state: string;
  price: number;
  status: string;
  images: string[];
  location: string;
  featured: boolean;
  views: number;
  createdAt: string;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user && user.role !== "admin") { router.push("/dashboard"); return; }
  }, [isAuthenticated, user, router]);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchInquiries();
    fetchUsers();
  }, [fetchProperties, fetchInquiries, fetchUsers]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmitProperty = async () => {
    if (!form.title || !form.city || !form.state || !form.price || !form.sqft) {
      toast.error("Please fill all required fields: title, city, state, price, sqft");
      return;
    }
    setLoading(true);
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      location: `${form.area ? form.area + ", " : ""}${form.city}, ${form.state}`,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      area: form.area,
      propertyType: form.propertyType,
      bhk: Number(form.bhk),
      sqft: Number(form.sqft),
      bathrooms: Number(form.bathrooms),
      floor: Number(form.floor),
      totalFloors: Number(form.totalFloors),
      yearBuilt: Number(form.yearBuilt),
      status: form.status,
      amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      images: form.images.split(",").map((u) => u.trim()).filter(Boolean),
      featured: form.featured,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      agent: user?._id || "",
      agentName: user?.name || "",
    };

    try {
      const url = editingId ? `/api/properties/${editingId}` : "/api/properties";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editingId ? "Property updated!" : "Property added!");
        setForm(emptyForm);
        setEditingId(null);
        setActiveTab("listings");
        fetchProperties();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save property");
      }
    } catch {
      toast.error("Failed to save property");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Property deleted"); fetchProperties(); }
      else toast.error("Failed to delete");
    } catch { toast.error("Failed to delete"); }
  };

  const handleEditProperty = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`);
      const p = await res.json();
      setForm({
        title: p.title || "", description: p.description || "", price: String(p.price || ""),
        location: p.location || "", address: p.address || "", city: p.city || "",
        state: p.state || "", pincode: p.pincode || "", area: p.area || "",
        propertyType: p.propertyType || "Apartment", bhk: String(p.bhk || "2"),
        sqft: String(p.sqft || ""), bathrooms: String(p.bathrooms || "1"),
        floor: String(p.floor || "0"), totalFloors: String(p.totalFloors || "1"),
        yearBuilt: String(p.yearBuilt || "2024"), status: p.status || "Available",
        amenities: (p.amenities || []).join(", "), images: (p.images || []).join(", "),
        featured: p.featured || false, contactPhone: p.contactPhone || "", contactEmail: p.contactEmail || "",
      });
      setEditingId(id);
      setActiveTab("add");
    } catch { toast.error("Failed to load property data"); }
  };

  const handleReplyInquiry = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "replied", adminReply: replyText }),
      });
      if (res.ok) { toast.success("Reply sent"); setReplyingId(null); setReplyText(""); fetchInquiries(); }
      else toast.error("Failed to reply");
    } catch { toast.error("Failed to reply"); }
  };

  const handleCloseInquiry = async (id: string) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "closed" }),
      });
      if (res.ok) { toast.success("Inquiry closed"); fetchInquiries(); }
    } catch { toast.error("Failed"); }
  };

  const formatPrice = (p: number) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
    return `₹${p.toLocaleString("en-IN")}`;
  };

  const tabs = [
    { id: "listings" as Tab, label: "Listings", icon: Building2, count: properties.length },
    { id: "add" as Tab, label: editingId ? "Edit Property" : "Add Property", icon: Plus },
    { id: "inquiries" as Tab, label: "Inquiries", icon: MessageSquare, count: inquiries.length },
    { id: "users" as Tab, label: "Users", icon: Users, count: users.length },
  ];

  const inputClass = "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30";
  const labelClass = "mb-1.5 block text-[10px] font-medium tracking-wider text-white/40";

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-[var(--neon-pink)]" />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-sm text-white/40">Manage properties, inquiries, and users</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id !== "add") { setEditingId(null); setForm(emptyForm); } }}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "text-white" : "text-white/40 hover:bg-white/5"}`}
              style={activeTab === tab.id ? { background: "rgba(255,0,170,0.1)", border: "1px solid rgba(255,0,170,0.3)" } : { border: "1px solid rgba(255,255,255,0.05)" }}>
              <tab.icon size={16} />
              {tab.label}
              {"count" in tab && tab.count !== undefined && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* ===== LISTINGS TAB ===== */}
        {activeTab === "listings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {properties.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <Building2 size={40} className="mx-auto mb-3 text-white/10" />
                <p className="text-sm text-white/40">No properties yet. Click "Add Property" to create one.</p>
              </GlassCard>
            ) : properties.map((p) => (
              <GlassCard key={p._id} className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-16 w-24 shrink-0 rounded-xl bg-cover bg-center bg-white/5"
                      style={p.images[0] ? { backgroundImage: `url(${p.images[0]})` } : {}} />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{p.title}</p>
                      <p className="text-xs text-white/40">{p.city}, {p.state} • {formatPrice(p.price)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{ background: p.status === "Available" ? "rgba(0,255,136,0.1)" : p.status === "Sold" ? "rgba(255,0,170,0.1)" : "rgba(180,0,255,0.1)",
                            color: p.status === "Available" ? "var(--neon-green)" : p.status === "Sold" ? "var(--neon-pink)" : "var(--neon-purple)" }}>
                          {p.status}
                        </span>
                        {p.featured && <span className="rounded-full bg-[rgba(0,240,255,0.1)] px-2 py-0.5 text-[9px] font-bold text-[var(--neon-cyan)]">FEATURED</span>}
                        <span className="text-[9px] text-white/20">{p.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <NeonButton size="sm" variant="cyan" onClick={() => handleEditProperty(p._id)}><Edit size={14} /></NeonButton>
                    <NeonButton size="sm" variant="ghost" onClick={() => router.push(`/properties/${p._id}`)}><Eye size={14} /></NeonButton>
                    <NeonButton size="sm" variant="pink" onClick={() => handleDelete(p._id)}><Trash2 size={14} /></NeonButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* ===== ADD / EDIT PROPERTY TAB ===== */}
        {activeTab === "add" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard className="p-6" glowColor="cyan">
              <h2 className="mb-6 text-xl font-bold text-white">{editingId ? "Edit Property" : "Add New Property"}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClass}>TITLE *</label>
                  <input name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Luxury 3BHK Apartment in Bandra" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>DESCRIPTION</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={4} placeholder="Detailed description of the property..." className={inputClass + " resize-none"} />
                </div>

                <div><label className={labelClass}>PRICE (₹) *</label><input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="e.g. 15000000" className={inputClass} /></div>
                <div><label className={labelClass}>PROPERTY TYPE *</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleFormChange} className={inputClass}>
                    {propertyTypes.map((t) => <option key={t} value={t} className="bg-[#0a0a2e]">{t}</option>)}
                  </select>
                </div>

                <div><label className={labelClass}>BHK *</label><input name="bhk" type="number" value={form.bhk} onChange={handleFormChange} className={inputClass} /></div>
                <div><label className={labelClass}>AREA (SQFT) *</label><input name="sqft" type="number" value={form.sqft} onChange={handleFormChange} placeholder="e.g. 1500" className={inputClass} /></div>
                <div><label className={labelClass}>BATHROOMS</label><input name="bathrooms" type="number" value={form.bathrooms} onChange={handleFormChange} className={inputClass} /></div>
                <div><label className={labelClass}>FLOOR</label><input name="floor" type="number" value={form.floor} onChange={handleFormChange} className={inputClass} /></div>
                <div><label className={labelClass}>TOTAL FLOORS</label><input name="totalFloors" type="number" value={form.totalFloors} onChange={handleFormChange} className={inputClass} /></div>
                <div><label className={labelClass}>YEAR BUILT</label><input name="yearBuilt" type="number" value={form.yearBuilt} onChange={handleFormChange} className={inputClass} /></div>

                <div className="md:col-span-2"><hr className="border-white/5 my-2" /><h3 className="text-sm font-semibold text-white/60 flex items-center gap-2 mb-2"><ChevronDown size={14} /> Location Details</h3></div>
                <div><label className={labelClass}>ADDRESS</label><input name="address" value={form.address} onChange={handleFormChange} placeholder="House/Building No., Street" className={inputClass} /></div>
                <div><label className={labelClass}>AREA / LOCALITY</label><input name="area" value={form.area} onChange={handleFormChange} placeholder="e.g. Bandra West" className={inputClass} /></div>
                <div><label className={labelClass}>CITY *</label><input name="city" value={form.city} onChange={handleFormChange} placeholder="e.g. Mumbai" className={inputClass} /></div>
                <div><label className={labelClass}>STATE *</label>
                  <select name="state" value={form.state} onChange={handleFormChange} className={inputClass}>
                    <option value="" className="bg-[#0a0a2e]">Select State</option>
                    {statesOfIndia.map((s) => <option key={s} value={s} className="bg-[#0a0a2e]">{s}</option>)}
                  </select>
                </div>
                <div><label className={labelClass}>PINCODE</label><input name="pincode" value={form.pincode} onChange={handleFormChange} placeholder="e.g. 400050" className={inputClass} /></div>

                <div className="md:col-span-2"><hr className="border-white/5 my-2" /><h3 className="text-sm font-semibold text-white/60 flex items-center gap-2 mb-2"><ChevronDown size={14} /> Extras</h3></div>
                <div><label className={labelClass}>STATUS</label>
                  <select name="status" value={form.status} onChange={handleFormChange} className={inputClass}>
                    <option value="Available" className="bg-[#0a0a2e]">Available</option>
                    <option value="Sold" className="bg-[#0a0a2e]">Sold</option>
                    <option value="Draft" className="bg-[#0a0a2e]">Draft</option>
                  </select>
                </div>
                <div><label className={labelClass}>CONTACT PHONE</label><input name="contactPhone" value={form.contactPhone} onChange={handleFormChange} placeholder="+91 9876543210" className={inputClass} /></div>
                <div><label className={labelClass}>CONTACT EMAIL</label><input name="contactEmail" value={form.contactEmail} onChange={handleFormChange} placeholder="agent@example.com" className={inputClass} /></div>
                <div className="flex items-center gap-3 pt-5">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleFormChange} className="accent-[var(--neon-cyan)] h-4 w-4" />
                  <label className="text-sm text-white/60">Mark as Featured</label>
                </div>

                <div className="md:col-span-2"><label className={labelClass}>AMENITIES (comma separated)</label><input name="amenities" value={form.amenities} onChange={handleFormChange} placeholder="e.g. Parking, Swimming Pool, Gym, Garden, Security" className={inputClass} /></div>
                <div className="md:col-span-2"><label className={labelClass}>IMAGE URLS (comma separated)</label><textarea name="images" value={form.images} onChange={handleFormChange} rows={2} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" className={inputClass + " resize-none"} /></div>

                <div className="md:col-span-2 flex gap-3 pt-4">
                  <NeonButton variant="cyan" onClick={handleSubmitProperty} className="flex-1">
                    <span className="flex items-center justify-center gap-2"><Save size={16} />{loading ? "Saving..." : editingId ? "Update Property" : "Add Property"}</span>
                  </NeonButton>
                  {editingId && (
                    <NeonButton variant="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                      <span className="flex items-center gap-2"><X size={16} /> Cancel</span>
                    </NeonButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ===== INQUIRIES TAB ===== */}
        {activeTab === "inquiries" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {inquiries.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <MessageSquare size={40} className="mx-auto mb-3 text-white/10" />
                <p className="text-sm text-white/40">No inquiries yet</p>
              </GlassCard>
            ) : inquiries.map((inq) => (
              <GlassCard key={inq._id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{inq.userName} <span className="text-white/30 font-normal">({inq.userEmail})</span></p>
                    {inq.userPhone && <p className="text-xs text-white/30">Phone: {inq.userPhone}</p>}
                    <p className="text-xs text-white/40 mt-0.5">Property: {inq.propertyTitle || inq.propertyId}</p>
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: inq.status === "pending" ? "rgba(255,170,0,0.1)" : inq.status === "replied" ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
                      color: inq.status === "pending" ? "#ffaa00" : inq.status === "replied" ? "var(--neon-green)" : "white/40" }}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-2">{inq.message}</p>
                {inq.adminReply && <p className="text-xs text-[var(--neon-cyan)] bg-[rgba(0,240,255,0.05)] rounded-lg p-2 mb-2">Admin Reply: {inq.adminReply}</p>}
                <div className="flex gap-2">
                  {inq.status !== "closed" && (
                    <>
                      {replyingId === inq._id ? (
                        <div className="flex-1 flex gap-2">
                          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..."
                            className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30" />
                          <NeonButton size="sm" variant="cyan" onClick={() => handleReplyInquiry(inq._id)}>Send</NeonButton>
                          <NeonButton size="sm" variant="ghost" onClick={() => { setReplyingId(null); setReplyText(""); }}><X size={14} /></NeonButton>
                        </div>
                      ) : (
                        <>
                          <NeonButton size="sm" variant="cyan" onClick={() => setReplyingId(inq._id)}>Reply</NeonButton>
                          <NeonButton size="sm" variant="ghost" onClick={() => handleCloseInquiry(inq._id)}>Close</NeonButton>
                        </>
                      )}
                    </>
                  )}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* ===== USERS TAB ===== */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {users.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <Users size={40} className="mx-auto mb-3 text-white/10" />
                <p className="text-sm text-white/40">No users registered yet</p>
              </GlassCard>
            ) : users.map((u) => (
              <GlassCard key={u._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] font-bold text-black">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{u.name}</p>
                      <p className="text-xs text-white/40">{u.email}{u.phone ? ` • ${u.phone}` : ""}</p>
                    </div>
                  </div>
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                    style={{ background: u.role === "admin" ? "rgba(255,0,170,0.1)" : u.role === "agent" ? "rgba(180,0,255,0.1)" : "rgba(0,240,255,0.1)",
                      color: u.role === "admin" ? "var(--neon-pink)" : u.role === "agent" ? "var(--neon-purple)" : "var(--neon-cyan)" }}>
                    {u.role}
                  </span>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
