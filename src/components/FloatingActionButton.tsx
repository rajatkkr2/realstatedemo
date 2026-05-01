"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Calculator, Search, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import Link from "next/link";

const actions = [
  { icon: MessageCircle, label: "Chat", color: "var(--neon-cyan)", action: "chat" },
  { icon: Calculator, label: "EMI Calc", color: "var(--neon-purple)", href: "/finance" },
  { icon: Search, label: "Search", color: "var(--neon-green)", href: "/properties" },
];

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const { toggleChat } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col-reverse items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{
          background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))",
          boxShadow: "0 0 30px rgba(0,240,255,0.4)",
        }}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }}>
          {open ? <X size={24} className="text-black" /> : <Plus size={24} className="text-black" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05 } }}
              exit={{ opacity: 0, y: 20, scale: 0.8, transition: { delay: (actions.length - i) * 0.05 } }}
            >
              {action.href ? (
                <Link
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-110"
                  style={{
                    background: `${action.color}20`,
                    border: `1px solid ${action.color}50`,
                    boxShadow: `0 0 15px ${action.color}30`,
                  }}
                >
                  <action.icon size={18} style={{ color: action.color }} />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (action.action === "chat") toggleChat();
                    setOpen(false);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-110"
                  style={{
                    background: `${action.color}20`,
                    border: `1px solid ${action.color}50`,
                    boxShadow: `0 0 15px ${action.color}30`,
                  }}
                >
                  <action.icon size={18} style={{ color: action.color }} />
                </button>
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
