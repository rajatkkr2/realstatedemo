"use client";

import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

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
  glowColor = "cyan",
  hover3d = true,
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3d || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setRotateX((y - 0.5) * -15);
      setRotateY((x - 0.5) * 15);
      setGlareX(x * 100);
      setGlareY(y * 100);
    },
    [hover3d]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  }, []);

  const glowColors = {
    cyan: "rgba(0,240,255,0.15)",
    purple: "rgba(180,0,255,0.15)",
    pink: "rgba(255,0,170,0.15)",
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px) saturate(1.5)",
        border: "1px solid var(--glass-border)",
        transformStyle: "preserve-3d",
        perspective: "1000px",
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
        cursor: onClick ? "pointer" : "default",
      }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glowColors[glowColor]}, transparent 60%)`,
          opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
}
