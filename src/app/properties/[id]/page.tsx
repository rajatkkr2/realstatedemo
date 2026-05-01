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
import { mockAgents } from "@/utils/mockData";
import toast from "react-hot-toast";

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};

const statusMap: Record<string, { bg: string; color: string }> = {
  Available: { bg: "rgba(46,125,91,0.1)", color: "var(--accent-green)" },
  Sold: { bg: "rgba(192,57,43,0.1)", color: "var(--accent-red)" },
  Draft: { bg: "rgba(74,74,106,0.1)", color: "var(--navy-muted)" },
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { properties, fetchProperties, wishlist, toggleWishlist } = usePropertyStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  useEffect(() => {
    const found = properties.find((p) => p._id === id);
    if (found) setProperty(found);
  }, [properties, id]);

  const agent = mockAgents.find((a) => a._id === property?.agent) || mockAgents[0];
  const isWishlisted = property ? wishlist.includes(property._id) : false;

  const handleInquiry = async () => {
    if (!inquiryMessage.trim()) return;
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: id, message: inquiryMessage }),
      });
      setInquirySent(true);
      toast.success("Inquiry sent successfully!");
    } catch {
      toast.error("Failed to send inquiry");
    }
  };

  if (!property) return <LoadingSpinner text="Loading property..." />;

  const sc = statusMap[property.status] || statusMap.Draft;

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/properties" className="mb-6 inline-flex items-center gap-2 text-sm transition-colors duration-200 hover:text-[var(--royal-gold)]" style={{ color: "var(--navy-muted)" }}>
            <ArrowLeft size={16} /> Back to Properties
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative overflow-hidden rounded-2xl" style={{ boxShadow: "0 8px 32px rgba(26,26,46,0.1)" }}>
                <GyroscopeImage src={property.images[activeImage] || property.images[0]} alt={property.title} width={1200} height={600} className="h-[400px] w-full sm:h-[500px]" intensity={8} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleWishlist(property._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md" style={{ background: "rgba(255,255,255,0.85)", boxShadow: "var(--card-shadow)" }}>
                    <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} style={isWishlisted ? {} : { color: "var(--navy-muted)" }} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                    className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md" style={{ background: "rgba(255,255,255,0.85)", boxShadow: "var(--card-shadow)" }}>
                    <Share2 size={18} style={{ color: "var(--navy-muted)" }} />
                  </motion.button>
                </div>
              </div>

              {property.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {property.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`shrink-0 overflow-hidden rounded-xl transition-all ${i === activeImage ? "ring-2 ring-[var(--royal-gold)] scale-105" : "opacity-50 hover:opacity-80"}`}>
                      <GyroscopeImage src={img} alt={`${property.title} ${i + 1}`} width={120} height={80} className="h-20 w-28" intensity={3} />
                    </button>
                  ))}
                </div>
              )}

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                    {property.status.toUpperCase()}
                  </span>
                  {property.featured && (
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
                      style={{ background: "rgba(200,164,92,0.12)", color: "var(--royal-gold-dark)", border: "1px solid rgba(200,164,92,0.3)" }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--navy)" }}>{property.title}</h1>
                <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: "var(--navy-muted)" }}>
                  <MapPin size={14} style={{ color: "var(--royal-gold)" }} /> {property.location}
                </div>
                <p className="mt-2 text-3xl font-bold" style={{ color: "var(--royal-gold-dark)" }}>{formatPrice(property.price)}</p>
              </div>

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
                    <stat.icon size={16} className="mb-1" style={{ color: "var(--royal-gold)" }} />
                    <p className="text-xs" style={{ color: "var(--navy-muted)" }}>{stat.label}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{stat.value}</p>
                  </GlassCard>
                ))}
              </div>

              <GlassCard className="p-6">
                <h3 className="mb-3 text-lg font-semibold" style={{ color: "var(--navy)" }}>About This Property</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--navy-muted)" }}>{property.description}</p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--navy)" }}>Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-xl px-3 py-1.5 text-xs font-medium"
                      style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--navy)" }}>Location</h3>
                <div className="flex h-64 items-center justify-center rounded-xl" style={{ background: "var(--cream)", border: "1px solid var(--card-border)" }}>
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2" style={{ color: "var(--royal-gold)" }} />
                    <p className="text-sm" style={{ color: "var(--navy-muted)" }}>{property.location}</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)", opacity: 0.6 }}>
                      {property.coordinates.lat.toFixed(4)}°N, {property.coordinates.lng.toFixed(4)}°E
                    </p>
                    <p className="mt-2 text-[10px]" style={{ color: "var(--navy-muted)", opacity: 0.4 }}>Map integration coming soon</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="mb-4 text-xs font-semibold tracking-wider" style={{ color: "var(--royal-gold)" }}>LISTING AGENT</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))" }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--navy)" }}>{agent.name}</p>
                    <p className="text-xs" style={{ color: "var(--navy-muted)" }}>{agent.agency}</p>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-4 text-xs" style={{ color: "var(--navy-muted)" }}>
                  <span>⭐ {agent.rating}</span>
                  <span>{agent.totalListings} listings</span>
                  {agent.verified && <span style={{ color: "var(--accent-green)" }}>✓ Verified</span>}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--navy-muted)" }}>{agent.bio}</p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="mb-4 text-xs font-semibold tracking-wider" style={{ color: "var(--royal-gold)" }}>SEND INQUIRY</h3>
                {inquirySent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <CheckCircle size={40} className="mx-auto mb-3" style={{ color: "var(--accent-green)" }} />
                    <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Inquiry Sent!</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)" }}>The agent will respond shortly.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <textarea value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Hi, I'm interested in this property..." rows={4}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
                      style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }} />
                    <NeonButton onClick={handleInquiry} variant="cyan" className="w-full">
                      <span className="flex items-center justify-center gap-2"><Send size={14} /> Send Inquiry</span>
                    </NeonButton>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="mb-3 text-xs font-semibold tracking-wider" style={{ color: "var(--royal-gold)" }}>MATCH SCORE</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: "var(--cream)" }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--royal-gold), var(--accent-green))" }}
                        initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1, delay: 0.5 }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "var(--accent-green)" }}>92%</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--navy-muted)" }}>
                    This property has a <strong style={{ color: "var(--navy)" }}>92% match</strong> with your preferences based on location, price range, and lifestyle.
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="mb-3 text-xs font-semibold tracking-wider" style={{ color: "var(--royal-gold)" }}>QUICK EMI ESTIMATE</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--navy-muted)" }}>Property Price</span>
                    <span className="font-medium" style={{ color: "var(--navy)" }}>{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--navy-muted)" }}>Down Payment (20%)</span>
                    <span className="font-medium" style={{ color: "var(--navy)" }}>{formatPrice(property.price * 0.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--navy-muted)" }}>Loan Amount</span>
                    <span className="font-medium" style={{ color: "var(--navy)" }}>{formatPrice(property.price * 0.8)}</span>
                  </div>
                  <div className="my-2" style={{ borderTop: "1px solid var(--card-border)" }} />
                  <div className="flex justify-between">
                    <span style={{ color: "var(--navy-muted)" }}>Est. Monthly EMI</span>
                    <span className="font-bold" style={{ color: "var(--royal-gold-dark)" }}>
                      {formatPrice(Math.round((property.price * 0.8 * 0.007 * Math.pow(1.007, 240)) / (Math.pow(1.007, 240) - 1)))}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--navy-muted)", opacity: 0.5 }}>*Based on 8.4% p.a. for 20 years</p>
                </div>
                <Link href="/finance" className="mt-3 block">
                  <NeonButton variant="ghost" size="sm" className="w-full">Detailed EMI Calculator</NeonButton>
                </Link>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
