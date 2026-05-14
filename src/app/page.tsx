"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  ArrowRight,
  MapPin,
  TrendingUp,
  Search,
  Home as HomeIcon,
  Star,
  ChevronDown,
  BadgeCheck,
  IndianRupee,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import CityScapeAnimation from "@/components/CityScapeAnimation";
import { usePropertyStore } from "@/store/propertyStore";

const stats = [
  { label: "Properties Listed", value: 12400, suffix: "+", icon: Building2, color: "var(--royal-gold)" },
  { label: "Cities Covered", value: 50, suffix: "+", icon: MapPin, color: "var(--accent-blue)" },
  { label: "Happy Families", value: 8200, suffix: "+", icon: HomeIcon, color: "var(--accent-green)" },
  { label: "Growth Rate", value: 340, suffix: "%", icon: TrendingUp, color: "var(--royal-gold-dark)" },
];

const features = [
  { title: "Smart Search", description: "Find your perfect home with intelligent filters — search by city, area, budget, and lifestyle preferences.", icon: Search, color: "var(--royal-gold)" },
  { title: "Virtual Tours", description: "Explore properties from the comfort of your home with immersive visual walkthroughs and detailed galleries.", icon: Star, color: "var(--accent-blue)" },
  { title: "Verified Listings", description: "Every property is verified for authenticity. Transparent pricing with no hidden charges.", icon: BadgeCheck, color: "var(--accent-green)" },
  { title: "Quick Finance", description: "Instantly calculate EMIs, compare loan options, and get pre-approved with our finance tools.", icon: IndianRupee, color: "var(--royal-gold-dark)" },
];

/* Animated counter hook */
function useCounter(end: number, duration: number = 2000, inView: boolean = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView]);
  return count;
}

function AnimatedStat({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(stat.value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <GlassCard className="p-6 text-center hover-lift">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <stat.icon size={28} className="mx-auto mb-3" style={{ color: stat.color }} />
        </motion.div>
        <p className="text-3xl font-bold" style={{ color: "var(--navy)" }}>
          {count.toLocaleString()}{stat.suffix}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--navy-muted)" }}>{stat.label}</p>
      </GlassCard>
    </motion.div>
  );
}

/* Stagger container variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Home() {
  const { properties, fetchProperties, isLoading } = usePropertyStore();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  const featured = properties.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
        <div className="absolute inset-0 hero-pattern" />

        {/* Decorative rotating rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="deco-ring absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: "1px solid rgba(200,164,92,0.08)" }} />
          <div className="deco-ring-reverse absolute h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: "1px dashed rgba(200,164,92,0.06)" }} />
          <div className="deco-ring absolute h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: "1px solid rgba(44,95,138,0.04)" }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="relative z-10 mx-auto max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 border-glow"
            style={{ background: "var(--cream)", border: "1px solid var(--card-border)" }}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 150 }}
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <Building2 size={14} style={{ color: "var(--royal-gold)" }} />
            </motion.div>
            <span className="text-xs font-medium tracking-widest" style={{ color: "var(--royal-gold-dark)" }}>
              PREMIUM REAL ESTATE
            </span>
          </motion.div>

          {/* Heading with staggered reveal */}
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-7xl md:text-8xl">
            <motion.span
              className="inline-block"
              style={{ color: "var(--navy)" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            >
              Find Your
            </motion.span>
            <br />
            <motion.span
              className="inline-block text-gradient"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            >
              Dream Home
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              style={{ color: "var(--navy-muted)" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            >
              Live Elegantly
            </motion.span>
          </h1>

          {/* Animated gold underline */}
          <motion.div
            className="mx-auto mb-8 h-[3px] rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, var(--royal-gold), transparent)" }}
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
          />

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--navy-muted)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            Discover premium properties across India. From luxury apartments to sprawling villas —
            your perfect home is just a search away.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link href="/properties">
              <NeonButton variant="cyan" size="lg">
                <span className="flex items-center gap-2">
                  Explore Properties
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowRight size={18} />
                  </motion.span>
                </span>
              </NeonButton>
            </Link>
            <Link href="/auth/login">
              <NeonButton variant="ghost" size="lg">
                Get Started Free
              </NeonButton>
            </Link>
          </motion.div>

          {/* Stats with animated counters */}
          <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Animated Cityscape — fields transforming to city */}
        <CityScapeAnimation />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-widest" style={{ color: "var(--navy-muted)" }}>SCROLL</span>
            <div className="h-10 w-6 rounded-full flex justify-center pt-2" style={{ border: "1.5px solid var(--card-border)" }}>
              <motion.div
                className="h-2 w-1 rounded-full"
                style={{ background: "var(--royal-gold)" }}
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <ChevronDown size={14} style={{ color: "var(--royal-gold)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="relative px-4 py-32" style={{ background: "var(--cream)" }}>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-16 flex items-end justify-between"
          >
            <div>
              <motion.p
                className="mb-2 text-xs font-medium tracking-[0.3em]"
                style={{ color: "var(--royal-gold)" }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                CURATED FOR YOU
              </motion.p>
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--navy)" }}>Featured Properties</h2>
              <motion.div
                className="mt-3 h-[3px] rounded-full"
                style={{ background: "var(--royal-gold)" }}
                initial={{ width: 0 }}
                whileInView={{ width: 60 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </div>
            <Link href="/properties" className="hidden sm:flex items-center gap-2 text-sm transition-colors duration-200 hover:text-[var(--royal-gold)] hover-underline" style={{ color: "var(--navy-muted)" }}>
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[380px] rounded-2xl shimmer-gold" style={{ background: "var(--cream-dark)" }} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {featured.map((property, i) => (
                <motion.div key={property._id} variants={itemVariants}>
                  <PropertyCard property={property} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/properties">
              <NeonButton variant="ghost">View All Properties</NeonButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4 py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(200,164,92,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(44,95,138,0.04) 0%, transparent 70%)" }} />

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-20 text-center"
          >
            <motion.p
              className="mb-2 text-xs font-medium tracking-[0.3em]"
              style={{ color: "var(--royal-gold)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              WHY NEXUS
            </motion.p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--navy)" }}>A Smarter Way to Find Home</h2>
            <motion.div
              className="mx-auto mt-4 h-[3px] rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, var(--royal-gold), transparent)" }}
              initial={{ width: 0 }}
              whileInView={{ width: 100 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              >
                <GlassCard className="px-7 py-8 h-full hover-lift group">
                  <motion.div
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ background: `${feature.color}12`, color: feature.color, border: `1.5px solid ${feature.color}25` }}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon size={28} strokeWidth={2} />
                  </motion.div>
                  <h3 className="mb-3 text-lg font-bold hover-underline inline-block" style={{ color: "var(--navy)" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--navy-muted)", lineHeight: 1.7 }}>{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-32 overflow-hidden" style={{ background: "var(--navy)" }}>
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-10 right-10 h-64 w-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,164,92,0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 h-48 w-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,164,92,0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h2
              className="mb-4 text-3xl font-bold text-white sm:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Ready to Find Your <span className="text-gradient">Dream Home</span>?
            </motion.h2>
            <motion.div
              className="mx-auto mb-6 h-[2px] rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, var(--royal-gold), transparent)" }}
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
            <motion.p
              className="mb-10 text-lg text-white/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Join thousands of families who found their perfect home through NEXUS Realty.
            </motion.p>
            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="/properties">
                <NeonButton variant="cyan" size="lg">
                  <span className="flex items-center gap-2">
                    Start Exploring
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight size={18} />
                    </motion.span>
                  </span>
                </NeonButton>
              </Link>
              <Link href="/finance">
                <NeonButton variant="ghost" size="lg">
                  <span style={{ color: "white" }}>Calculate EMI</span>
                </NeonButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="px-4 py-12"
        style={{ borderTop: "1px solid var(--card-border)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Building2 size={20} style={{ color: "var(--royal-gold)" }} />
              <span className="font-bold tracking-wider" style={{ color: "var(--navy)" }}>NEXUS</span>
              <span className="text-xs" style={{ color: "var(--navy-muted)" }}>REALTY</span>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: "var(--navy-muted)" }}>
              <Link href="/properties" className="transition-colors hover:text-[var(--royal-gold)] hover-underline">Properties</Link>
              <Link href="/finance" className="transition-colors hover:text-[var(--royal-gold)] hover-underline">Finance</Link>
              <Link href="/dashboard" className="transition-colors hover:text-[var(--royal-gold)] hover-underline">Dashboard</Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
