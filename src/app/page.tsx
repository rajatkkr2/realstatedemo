"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  ArrowRight,
  MapPin,
  BedDouble,
  TrendingUp,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { usePropertyStore } from "@/store/propertyStore";

const stats = [
  { label: "Properties Listed", value: "12,400+", icon: Building2, color: "var(--neon-cyan)" },
  { label: "Cities Covered", value: "50+", icon: MapPin, color: "var(--neon-purple)" },
  { label: "Happy Residents", value: "8,200+", icon: BedDouble, color: "var(--neon-pink)" },
  { label: "Growth Rate", value: "340%", icon: TrendingUp, color: "var(--neon-green)" },
];

const features = [
  { title: "AI Discovery", description: "Neural network-powered property matching based on your lifestyle DNA.", icon: Sparkles, color: "var(--neon-cyan)" },
  { title: "Holo Tours", description: "Immersive holographic property walkthroughs from anywhere on Earth.", icon: Globe, color: "var(--neon-purple)" },
  { title: "Smart Contracts", description: "Blockchain-verified transactions with zero-fraud guarantee.", icon: Shield, color: "var(--neon-green)" },
  { title: "Instant Finance", description: "AI-calculated EMI plans with quantum-speed loan approvals.", icon: Zap, color: "var(--neon-pink)" },
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
        <div className="absolute inset-0 grid-bg" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(0,240,255,0.08)",
                border: "1px solid rgba(0,240,255,0.2)",
              }}
              animate={{ boxShadow: ["0 0 20px rgba(0,240,255,0.1)", "0 0 40px rgba(0,240,255,0.2)", "0 0 20px rgba(0,240,255,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={14} className="text-[var(--neon-cyan)]" />
              <span className="text-xs font-medium tracking-widest text-[var(--neon-cyan)]">
                WELCOME TO THE FUTURE
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-white">Find Your</span>
              <br />
              <span className="text-gradient">Dream Space</span>
              <br />
              <span className="text-white/60">in 2050</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-white/40 sm:text-lg">
              AI-powered real estate platform with holographic tours, neural matching,
              and quantum-secured transactions. The future of living starts here.
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
            {stats.map((stat, i) => (
              <GlassCard key={stat.label} className="p-6 text-center" glowColor={i % 2 === 0 ? "cyan" : "purple"}>
                <stat.icon size={24} className="mx-auto mb-3" style={{ color: stat.color }} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-white/40">{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-10 w-6 rounded-full border border-white/20 flex justify-center pt-2">
            <motion.div
              className="h-2 w-1 rounded-full bg-[var(--neon-cyan)]"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[var(--neon-cyan)]">CURATED FOR YOU</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Featured Properties</h2>
            </div>
            <Link href="/properties" className="hidden sm:flex items-center gap-2 text-sm text-white/40 hover:text-[var(--neon-cyan)] transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-2xl bg-white/5" />
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
            <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[var(--neon-purple)]">WHY NEXUS</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Built for the Future</h2>
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
                <GlassCard className="p-6 h-full" glowColor={i % 2 === 0 ? "cyan" : "purple"}>
                  <div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `${feature.color}15`, color: feature.color }}
                  >
                    <feature.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <GlassCard className="p-10 text-center sm:p-16" glowColor="purple">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to Find Your <span className="text-gradient">Future Home</span>?
              </h2>
              <p className="mb-8 text-white/40">
                Join thousands of residents who found their dream space through NEXUS.
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
                  <NeonButton variant="purple" size="lg">
                    Calculate EMI
                  </NeonButton>
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-[var(--neon-cyan)]" />
              <span className="font-bold tracking-wider text-white/60">NEXUS</span>
              <span className="text-xs text-white/20"> 2050</span>
            </div>
            <div className="flex gap-6 text-xs text-white/30">
              <Link href="/properties" className="hover:text-[var(--neon-cyan)] transition-colors">Properties</Link>
              <Link href="/finance" className="hover:text-[var(--neon-cyan)] transition-colors">Finance</Link>
              <Link href="/dashboard" className="hover:text-[var(--neon-cyan)] transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
