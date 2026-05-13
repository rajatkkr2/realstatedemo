"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Maximize, BedDouble, Eye } from "lucide-react";
import Link from "next/link";
import GyroscopeImage from "./GyroscopeImage";
import { usePropertyStore, Property } from "@/store/propertyStore";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Available: { bg: "#2E7D5B", text: "#FFFFFF" },
  Sold: { bg: "#C0392B", text: "#FFFFFF" },
  Draft: { bg: "rgba(74,74,106,0.8)", text: "#FFFFFF" },
};

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const { wishlist, toggleWishlist } = usePropertyStore();
  const isWishlisted = wishlist.includes(property._id);
  const sc = statusColors[property.status] || statusColors.Draft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
      whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(26,26,46,0.1)" }}
    >
      <Link href={`/properties/${property._id}`}>
        <div className="relative h-56 overflow-hidden">
          <div className="card-img-zoom">
            <GyroscopeImage
              src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
              alt={property.title}
              className="h-56 w-full"
              intensity={5}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/60" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider shadow-sm"
              style={{ background: sc.bg, color: sc.text }}
            >
              {property.status.toUpperCase()}
            </span>
            {property.featured && (
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider shadow-sm"
                style={{ background: "#C8A45C", color: "#FFFFFF" }}
              >
                ★ FEATURED
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <p className="text-xl font-bold text-white drop-shadow-md">{formatPrice(property.price)}</p>
            <div className="flex items-center gap-1 text-[10px] text-white/70">
              <Eye size={12} />
              {property.views.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/properties/${property._id}`}>
          <h3 className="text-base font-semibold transition-colors duration-200 line-clamp-1 group-hover:text-[var(--royal-gold-dark)]" style={{ color: "var(--navy)" }}>
            {property.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--navy-muted)" }}>
          <MapPin size={12} style={{ color: "var(--royal-gold)" }} />
          {property.location}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: "var(--navy-muted)" }}>
          <span className="flex items-center gap-1">
            <BedDouble size={14} />
            {property.bhk} BHK
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={14} />
            {property.sqft.toLocaleString()} sqft
          </span>
          <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: "var(--cream)", color: "var(--navy-muted)" }}>{property.propertyType}</span>
        </div>

        <div className="mt-3 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--card-border)" }}>
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 2).map((a) => (
              <span key={a} className="rounded-md px-2 py-0.5 text-[10px]" style={{ background: "var(--cream)", color: "var(--navy-muted)" }}>
                {a}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="rounded-md px-2 py-0.5 text-[10px]" style={{ background: "var(--cream)", color: "var(--navy-muted)" }}>
                +{property.amenities.length - 2}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property._id);
            }}
            className="rounded-full p-2 transition-all hover:bg-red-50"
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-red-500 text-red-500" : ""}
              style={isWishlisted ? {} : { color: "var(--navy-muted)" }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
