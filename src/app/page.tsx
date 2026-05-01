"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  ArrowRight,
  MapPin,
  BedDouble,
  TrendingUp,
  Shield,
  Search,
  Home as HomeIcon,
  Star,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { usePropertyStore } from "@/store/propertyStore";

const stats = [
  { label: "Properties Listed", value: "12,400+", icon: Building2, color: "var(--royal-gold)" },
  { label: "Cities Covered", value: "50+", icon: MapPin, color: "var(--accent-blue)" },
  { label: "Happy Families", value: "8,200+", icon: HomeIcon, color: "var(--accent-green)" },
  { label: "Growth Rate", value: "340%", icon: TrendingUp, color: "var(--royal-gold-dark)" },
];

const features = [
  { title: "Smart Search", description: "Find your perfect home with intelligent filters — search by city, area, budget, and lifestyle preferences.", icon: Search, color: "var(--royal-gold)" },
  { title: "Virtual Tours", description: "Explore properties from the comfort of your home with immersive visual walkthroughs and detailed galleries.", icon: Star, color: "var(--accent-blue)" },
  { title: "Verified Listings", description: "Every property is verified for authenticity. Transparent pricing with no hidden charges.", icon: Shield, color: "var(--accent-green)" },
  { title: "Quick Finance", description: "Instantly calculate EMIs, compare loan options, and get pre-approved with our finance tools.", icon: BedDouble, color: "var(--royal-gold-dark)" },
];

export default function Home() {
  const { properties, fetchProperties, isLoading } = usePropertyStore();

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  const featured = properties.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2"
              style={{ background: "var(--cream)", border: "1px solid var(--card-border)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Building2 size={14} style={{ color: "var(--royal-gold)" }} />
              <span className="text-xs font-medium tracking-widest" style={{ color: "var(--royal-gold-dark)" }}>
                PREMIUM REAL ESTATE
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-7xl md:text-8xl">
              <span style={{ color: "var(--navy)" }}>Find Your</span>
              <br />
              <span className="text-gradient">Dream Home</span>
              <br />
              <motion.span
                style={{ color: "var(--navy-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Live Elegantly
              </motion.span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg" style={{ color: "var(--navy-muted)" }}>
              Discover premium properties across India. From luxury apartments to sprawling villas —
              your perfect home is just a search away.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/properties">
                <NeonButton variant="cyan" size="lg">
                  <span className="flex items-center gap-2">
                    Explore Properties
                    <ArrowRight size={18} />
                  </span>
                </NeonButton>
              </Link>
              <Link href="/auth/login">
                <NeonButton variant="ghost" size="lg">
                  Get Started Free
                </NeonButton>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-center">
                <stat.icon size={24} className="mx-auto mb-3" style={{ color: stat.color }} />
                <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>{stat.value}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)" }}>{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-10 w-6 rounded-full flex justify-center pt-2" style={{ border: "1.5px solid var(--card-border)" }}>
            <motion.div
              className="h-2 w-1 rounded-full"
              style={{ background: "var(--royal-gold)" }}
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="relative px-4 py-20" style={{ background: "var(--cream)" }}>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.3em]" style={{ color: "var(--royal-gold)" }}>CURATED FOR YOU</p>
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--navy)" }}>Featured Properties</h2>
            </div>
            <Link href="/properties" className="hidden sm:flex items-center gap-2 text-sm transition-colors duration-200 hover:text-[var(--royal-gold)]" style={{ color: "var(--navy-muted)" }}>
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-2xl" style={{ background: "var(--cream-dark)" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((property, i) => (
                <PropertyCard key={property._id} property={property} index={i} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/properties">
              <NeonButton variant="ghost">View All Properties</NeonButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-2 text-xs font-medium tracking-[0.3em]" style={{ color: "var(--royal-gold)" }}>WHY NEXUS</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--navy)" }}>A Smarter Way to Find Home</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "var(--cream)", color: feature.color }}
                  >
                    <feature.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--navy)" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--navy-muted)" }}>{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20" style={{ background: "var(--navy)" }}>
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Find Your <span className="text-gradient">Dream Home</span>?
            </h2>
            <p className="mb-8 text-white/60">
              Join thousands of families who found their perfect home through NEXUS Realty.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/properties">
                <NeonButton variant="cyan" size="lg">
                  <span className="flex items-center gap-2">
                    Start Exploring <ArrowRight size={18} />
                  </span>
                </NeonButton>
              </Link>
              <Link href="/finance">
                <NeonButton variant="ghost" size="lg">
                  <span style={{ color: "white" }}>Calculate EMI</span>
                </NeonButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12" style={{ borderTop: "1px solid var(--card-border)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Building2 size={20} style={{ color: "var(--royal-gold)" }} />
              <span className="font-bold tracking-wider" style={{ color: "var(--navy)" }}>NEXUS</span>
              <span className="text-xs" style={{ color: "var(--navy-muted)" }}>REALTY</span>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: "var(--navy-muted)" }}>
              <Link href="/properties" className="transition-colors hover:text-[var(--royal-gold)]">Properties</Link>
              <Link href="/finance" className="transition-colors hover:text-[var(--royal-gold)]">Finance</Link>
              <Link href="/dashboard" className="transition-colors hover:text-[var(--royal-gold)]">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
