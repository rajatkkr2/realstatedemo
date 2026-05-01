"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { isDemo } from "@/utils/isDemo";
import { usePropertyStore } from "@/store/propertyStore";

export default function DemoBanner() {
  const resetDemoData = usePropertyStore((s) => s.resetDemoData);

  if (!isDemo) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-3 px-4 py-2"
      style={{
        background: "linear-gradient(90deg, rgba(0,240,255,0.15), rgba(180,0,255,0.15), rgba(255,0,170,0.15))",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,240,255,0.2)",
      }}
    >
      <AlertTriangle size={16} className="text-[var(--neon-cyan)]" />
      <span className="text-sm font-medium tracking-wider text-[var(--neon-cyan)]">
        DEMO MODE ENABLED
      </span>
      <span className="hidden sm:inline text-xs text-white/50">
        — Data is simulated. No changes are persisted.
      </span>
      <button
        onClick={resetDemoData}
        className="ml-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105"
        style={{
          background: "rgba(0,240,255,0.1)",
          border: "1px solid rgba(0,240,255,0.3)",
          color: "var(--neon-cyan)",
        }}
      >
        <RotateCcw size={12} />
        Reset Demo
      </button>
    </motion.div>
  );
}
