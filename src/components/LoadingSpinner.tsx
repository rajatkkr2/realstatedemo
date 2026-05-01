"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative h-16 w-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--royal-gold)", borderRightColor: "var(--royal-gold)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: "var(--accent-blue)", borderLeftColor: "var(--accent-blue)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--royal-gold-light)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p
        className="text-sm tracking-wider"
        style={{ color: "var(--navy-muted)" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
