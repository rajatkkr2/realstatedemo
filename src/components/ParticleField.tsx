"use client";

import { motion } from "framer-motion";

const floatingDots = [
  { size: 6, x: "10%", y: "20%", delay: 0, duration: 8 },
  { size: 4, x: "85%", y: "15%", delay: 2, duration: 10 },
  { size: 5, x: "70%", y: "60%", delay: 1, duration: 9 },
  { size: 3, x: "25%", y: "75%", delay: 3, duration: 11 },
  { size: 4, x: "50%", y: "40%", delay: 0.5, duration: 7 },
  { size: 5, x: "90%", y: "80%", delay: 1.5, duration: 12 },
  { size: 3, x: "15%", y: "50%", delay: 4, duration: 9 },
  { size: 6, x: "60%", y: "10%", delay: 2.5, duration: 8 },
];

export default function ParticleField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Warm gradient orbs — more visible */}
      <motion.div
        className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,164,92,0.1) 0%, transparent 65%)" }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-20 h-[450px] w-[450px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(44,95,138,0.08) 0%, transparent 65%)" }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,164,92,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating gold dots */}
      {floatingDots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.x,
            top: dot.y,
            background: i % 2 === 0 ? "rgba(200,164,92,0.35)" : "rgba(44,95,138,0.25)",
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Thin animated diagonal lines */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-40"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,164,92,0.12), transparent)" }}
        animate={{ y: ["-100%", "100vh"], opacity: [0, 0.5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 0 }}
      />
      <motion.div
        className="absolute top-0 left-2/3 w-px h-32"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(44,95,138,0.1), transparent)" }}
        animate={{ y: ["-100%", "100vh"], opacity: [0, 0.4, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
      />
    </div>
  );
}
