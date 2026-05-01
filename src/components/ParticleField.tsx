"use client";

import { motion } from "framer-motion";

export default function ParticleField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle warm gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,164,92,0.06) 0%, transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-60 -left-40 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(44,95,138,0.05) 0%, transparent 70%)" }}
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,164,92,0.03) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
