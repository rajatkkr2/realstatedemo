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
  const isDisabled = disabled;

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const variants = {
    cyan: {
      bg: "rgba(0,240,255,0.1)",
      border: "rgba(0,240,255,0.4)",
      text: "#00f0ff",
      shadow: "0 0 20px rgba(0,240,255,0.3)",
      hoverBg: "rgba(0,240,255,0.2)",
    },
    purple: {
      bg: "rgba(180,0,255,0.1)",
      border: "rgba(180,0,255,0.4)",
      text: "#b400ff",
      shadow: "0 0 20px rgba(180,0,255,0.3)",
      hoverBg: "rgba(180,0,255,0.2)",
    },
    pink: {
      bg: "rgba(255,0,170,0.1)",
      border: "rgba(255,0,170,0.4)",
      text: "#ff00aa",
      shadow: "0 0 20px rgba(255,0,170,0.3)",
      hoverBg: "rgba(255,0,170,0.2)",
    },
    ghost: {
      bg: "transparent",
      border: "rgba(255,255,255,0.1)",
      text: "#e0e0ff",
      shadow: "none",
      hoverBg: "rgba(255,255,255,0.05)",
    },
  };

  const v = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.05, boxShadow: v.shadow }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      className={`relative rounded-xl font-semibold tracking-wide transition-all duration-300 ${sizes[size]} ${className} ${
        isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        color: v.text,
      }}
    >
      {children}
    </motion.button>
  );
}
