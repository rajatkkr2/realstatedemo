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

const statusColors: Record<string, string> = {
  Available: "var(--neon-green)",
  Sold: "var(--neon-pink)",
  Draft: "var(--neon-purple)",
};

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const { wishlist, toggleWishlist } = usePropertyStore();
  const isWishlisted = wishlist.includes(property._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <Link href={`/properties/${property._id}`}>
        <div className="relative h-56 overflow-hidden">
          <GyroscopeImage
            src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
            alt={property.title}
            className="h-56 w-full"
            intensity={10}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
              style={{
                background: `${statusColors[property.status]}15`,
                color: statusColors[property.status],
                border: `1px solid ${statusColors[property.status]}40`,
              }}
            >
              {property.status.toUpperCase()}
            </span>
            {property.featured && (
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
                style={{
                  background: "rgba(0,240,255,0.15)",
                  color: "var(--neon-cyan)",
                  border: "1px solid rgba(0,240,255,0.3)",
                }}
              >
                FEATURED
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-xl font-bold neon-text-cyan">{formatPrice(property.price)}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <Eye size={12} />
              {property.views.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/properties/${property._id}`}>
          <h3 className="text-base font-semibold text-white/90 transition-colors group-hover:text-[var(--neon-cyan)] line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/40">
          <MapPin size={12} />
          {property.location}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <BedDouble size={14} />
            {property.bhk} BHK
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={14} />
            {property.sqft.toLocaleString()} sqft
          </span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px]">{property.propertyType}</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 2).map((a) => (
              <span
                key={a}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/40"
              >
                {a}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                +{property.amenities.length - 2}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property._id);
            }}
            className="rounded-full p-2 transition-all hover:bg-white/5"
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-[var(--neon-pink)] text-[var(--neon-pink)]" : "text-white/30"}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
