"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "pink";
  hover3d?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        cursor: onClick ? "pointer" : "default",
      }}
      whileHover={onClick ? { y: -4, boxShadow: "0 8px 40px rgba(26,26,46,0.1), 0 2px 8px rgba(200,164,92,0.08)" } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
