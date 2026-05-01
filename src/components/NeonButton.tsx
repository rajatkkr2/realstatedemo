"use client";

import { motion } from "framer-motion";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "cyan" | "purple" | "pink" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  disableInDemo?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export default function NeonButton({
  children,
  onClick,
  variant = "cyan",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: NeonButtonProps) {
  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-4 text-base",
  };

  const variants = {
    cyan: {
      bg: "var(--royal-gold)",
      text: "#FFFFFF",
      hoverBg: "var(--royal-gold-dark)",
    },
    purple: {
      bg: "var(--navy)",
      text: "#FFFFFF",
      hoverBg: "var(--navy-light)",
    },
    pink: {
      bg: "var(--accent-red)",
      text: "#FFFFFF",
      hoverBg: "#A93226",
    },
    ghost: {
      bg: "transparent",
      text: "var(--navy)",
      hoverBg: "var(--cream)",
    },
  };

  const v = variants[variant];
  const isGhost = variant === "ghost";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`relative rounded-xl font-semibold tracking-wide transition-all duration-300 ${sizes[size]} ${className} ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        background: v.bg,
        border: isGhost ? "1px solid var(--card-border)" : "none",
        color: v.text,
        boxShadow: isGhost ? "none" : "0 2px 8px rgba(200,164,92,0.2)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = v.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = v.bg;
      }}
    >
      {children}
    </motion.button>
  );
}
