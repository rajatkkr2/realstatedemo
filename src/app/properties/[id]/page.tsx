"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Building,
  Calendar,
  Eye,
  ThumbsUp,
  Send,
  CheckCircle,
} from "lucide-react";
import GyroscopeImage from "@/components/GyroscopeImage";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePropertyStore, Property } from "@/store/propertyStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { properties, fetchProperties, wishlist, toggleWishlist } = usePropertyStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuthStore();
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) { setInquiryName(user.name || ""); setInquiryEmail(user.email || ""); }
  }, [user]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  useEffect(() => {
    const found = properties.find((p) => p._id === id);
    if (found) setProperty(found);
  }, [properties, id]);

  const isWishlisted = property ? wishlist.includes(property._id) : false;

  const handleInquiry = async () => {
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      toast.error("Please fill in name, email, and message"); return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: id, propertyTitle: property?.title || "", userId: user?._id || "guest", userName: inquiryName, userEmail: inquiryEmail, userPhone: inquiryPhone, message: inquiryMessage }),
      });
      if (res.ok) { setInquirySent(true); toast.success("Inquiry sent successfully!"); }
      else { const err = await res.json(); toast.error(err.error || "Failed to send inquiry"); }
    } catch { toast.error("Failed to send inquiry"); }
    setSending(false);
  };

  if (!property) return <LoadingSpinner text="Loading property data..." />;

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/properties"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-[var(--neon-cyan)]"
          >
            <ArrowLeft size={16} />
            Back to Properties
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Images + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <GyroscopeImage
                  src={property.images[activeImage] || property.images[0]}
                  alt={property.title}
                  width={1200}
                  height={600}
                  className="h-[400px] w-full sm:h-[500px]"
                  intensity={15}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(property._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full glass"
                  >
                    <Heart
                      size={18}
                      className={isWishlisted ? "fill-[var(--neon-pink)] text-[var(--neon-pink)]" : "text-white/60"}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied!");
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full glass"
                  >
                    <Share2 size={18} className="text-white/60" />
                  </motion.button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 overflow-hidden rounded-xl transition-all ${
                        i === activeImage ? "ring-2 ring-[var(--neon-cyan)] scale-105" : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <GyroscopeImage src={img} alt={`${property.title} ${i + 1}`} width={120} height={80} className="h-20 w-28" intensity={5} />
                    </button>
                  ))}
                </div>
              )}

              {/* Info */}
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
                    style={{
                      background: property.status === "Available" ? "rgba(0,255,136,0.1)" : property.status === "Sold" ? "rgba(255,0,170,0.1)" : "rgba(180,0,255,0.1)",
                      color: property.status === "Available" ? "var(--neon-green)" : property.status === "Sold" ? "var(--neon-pink)" : "var(--neon-purple)",
                      border: `1px solid ${property.status === "Available" ? "rgba(0,255,136,0.3)" : property.status === "Sold" ? "rgba(255,0,170,0.3)" : "rgba(180,0,255,0.3)"}`,
                    }}
                  >
                    {property.status.toUpperCase()}
                  </span>
                  {property.featured && (
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider" style={{ background: "rgba(0,240,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,240,255,0.3)" }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{property.title}</h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/40">
                  <MapPin size={14} />
                  {property.location}
                </div>
                <p className="mt-2 text-3xl font-bold neon-text-cyan">{formatPrice(property.price)}</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: BedDouble, label: "BHK", value: `${property.bhk} BHK` },
                  { icon: Maximize, label: "Area", value: `${property.sqft.toLocaleString()} sqft` },
                  { icon: Bath, label: "Bathrooms", value: `${property.bathrooms}` },
                  { icon: Building, label: "Floor", value: `${property.floor}/${property.totalFloors}` },
                  { icon: Calendar, label: "Year Built", value: `${property.yearBuilt}` },
                  { icon: Eye, label: "Views", value: property.views.toLocaleString() },
                  { icon: ThumbsUp, label: "Likes", value: property.likes.toLocaleString() },
                  { icon: Building, label: "Type", value: property.propertyType },
                ].map((stat) => (
                  <GlassCard key={stat.label} className="p-4">
                    <stat.icon size={16} className="mb-1 text-[var(--neon-cyan)]" />
                    <p className="text-xs text-white/30">{stat.label}</p>
                    <p className="text-sm font-semibold text-white">{stat.value}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Description */}
              <GlassCard className="p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">About This Property</h3>
                <p className="text-sm leading-relaxed text-white/50">{property.description}</p>
              </GlassCard>

              {/* Amenities */}
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-xl px-3 py-1.5 text-xs font-medium"
                      style={{ background: "rgba(0,240,255,0.08)", color: "var(--neon-cyan)", border: "1px solid rgba(0,240,255,0.15)" }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Map Placeholder */}
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Location</h3>
                <div className="flex h-64 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 text-[var(--neon-cyan)]" />
                    <p className="text-sm text-white/40">{property.location}</p>
                    <p className="mt-1 text-xs text-white/20">
                      {property.coordinates.lat.toFixed(4)}°N, {property.coordinates.lng.toFixed(4)}°E
                    </p>
                    <p className="mt-2 text-[10px] text-white/15">Holographic map integration coming soon</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Agent Card */}
              {property.agentName && (
                <GlassCard className="p-6" glowColor="purple">
                  <h3 className="mb-4 text-sm font-semibold text-white/60">LISTED BY</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] text-lg font-bold text-black">
                      {property.agentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{property.agentName}</p>
                      {property.contactEmail && <p className="text-xs text-white/40">{property.contactEmail}</p>}
                    </div>
                  </div>
                  {property.contactPhone && <p className="text-xs text-white/30">Phone: {property.contactPhone}</p>}
                </GlassCard>
              )}

              {/* Inquiry Form */}
              <GlassCard className="p-6" glowColor="cyan">
                <h3 className="mb-4 text-sm font-semibold text-white/60">SEND INQUIRY</h3>
                {inquirySent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <CheckCircle size={40} className="mx-auto mb-3 text-[var(--neon-green)]" />
                    <p className="text-sm font-semibold text-white">Inquiry Sent!</p>
                    <p className="mt-1 text-xs text-white/40">We will get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <input value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} placeholder="Your Name *" className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30" />
                    <input value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="Your Email *" type="email" className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30" />
                    <input value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} placeholder="Your Phone" type="tel" className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30" />
                    <textarea value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} placeholder="Hi, I'm interested in this property... *" rows={4} className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30 resize-none" />
                    <NeonButton onClick={handleInquiry} variant="cyan" className="w-full">
                      <span className="flex items-center justify-center gap-2"><Send size={14} />{sending ? "Sending..." : "Send Inquiry"}</span>
                    </NeonButton>
                  </div>
                )}
              </GlassCard>

              {/* AI Recommendation */}
              <GlassCard className="p-6" glowColor="pink">
                <h3 className="mb-3 text-sm font-semibold text-white/60">AI RECOMMENDATION</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-green))" }}
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[var(--neon-green)]">92%</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    This property has a <strong className="text-white/70">92% match</strong> with your preferences based on location, price range, and lifestyle indicators.
                  </p>
                </div>
              </GlassCard>

              {/* EMI Quick Calc */}
              <GlassCard className="p-6">
                <h3 className="mb-3 text-sm font-semibold text-white/60">QUICK EMI ESTIMATE</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Property Price</span>
                    <span className="text-white font-medium">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Down Payment (20%)</span>
                    <span className="text-white font-medium">{formatPrice(property.price * 0.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Loan Amount</span>
                    <span className="text-white font-medium">{formatPrice(property.price * 0.8)}</span>
                  </div>
                  <div className="my-2 border-t border-white/5" />
                  <div className="flex justify-between">
                    <span className="text-white/40">Est. Monthly EMI</span>
                    <span className="font-bold neon-text-cyan">
                      {formatPrice(Math.round((property.price * 0.8 * 0.007 * Math.pow(1.007, 240)) / (Math.pow(1.007, 240) - 1)))}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/20">*Based on 8.4% p.a. for 20 years</p>
                </div>
                <Link href="/finance" className="mt-3 block">
                  <NeonButton variant="ghost" size="sm" className="w-full">
                    Detailed EMI Calculator
                  </NeonButton>
                </Link>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
