"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function FloatingActionButton() {
  const { chatOpen, toggleChat } = useUIStore();
  const [showTooltip, setShowTooltip] = useState(false);

  /* Auto-open chat after 3 seconds on first visit */
  useEffect(() => {
    const hasOpened = sessionStorage.getItem("chatAutoOpened");
    if (!hasOpened) {
      const timer = setTimeout(() => {
        toggleChat();
        sessionStorage.setItem("chatAutoOpened", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Show tooltip after 5 seconds if chat hasn't been opened */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!chatOpen) setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [chatOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {showTooltip && !chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="mb-2 rounded-xl px-4 py-2.5 shadow-lg"
            style={{
              background: "var(--navy)",
              color: "white",
              maxWidth: 200,
            }}
          >
            <p className="text-xs font-medium">👋 Need help finding your dream property?</p>
            <div className="absolute -right-2 bottom-4 h-3 w-3 rotate-45" style={{ background: "var(--navy)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat button — large and visible */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          toggleChat();
          setShowTooltip(false);
        }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl"
        style={{
          background: chatOpen
            ? "var(--navy)"
            : "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))",
          boxShadow: chatOpen
            ? "0 4px 20px rgba(26,26,46,0.3)"
            : "0 4px 24px rgba(200,164,92,0.4)",
        }}
      >
        <motion.div animate={{ rotate: chatOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {chatOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <MessageCircle size={26} className="text-white" />
          )}
        </motion.div>

        {/* Pulsing ring when chat is closed */}
        {!chatOpen && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(200,164,92,0.25)" }}
            />
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
              style={{ background: "#2E7D5B" }}
            >
              1
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
