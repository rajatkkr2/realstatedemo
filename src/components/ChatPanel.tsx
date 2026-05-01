"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

const welcomeMsg: ChatMessage = {
  id: "welcome",
  sender: "bot",
  text: "Welcome to NEXUS Realty! I can help you find properties, answer questions, or connect you with our team. How can I assist you today?",
  timestamp: new Date().toISOString(),
};

function getBotReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("price") || q.includes("cost") || q.includes("budget"))
    return "You can filter properties by price range on our Properties page. We have options starting from ₹50L to ₹10+ Cr.";
  if (q.includes("location") || q.includes("city") || q.includes("area"))
    return "We have listings across multiple cities. Use the search filters on the Properties page to find homes in your preferred location.";
  if (q.includes("contact") || q.includes("agent") || q.includes("call"))
    return "You can send an inquiry directly from any property page. Our team will get back to you within 24 hours.";
  if (q.includes("emi") || q.includes("loan") || q.includes("finance"))
    return "Visit our Finance page for an EMI calculator and market insights to help plan your purchase.";
  if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
    return "Hello! How can I help you today? I can assist with property search, pricing, or financing questions.";
  return "I can help with property search, pricing, EMI calculations, and more. Could you tell me more about what you're looking for?";
}

export default function ChatPanel() {
  const { chatOpen, toggleChat } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMsg]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `msg-${Date.now()}`, sender: "user", text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `msg-${Date.now() + 1}`, sender: "bot", text: getBotReply(userInput), timestamp: new Date().toISOString() }]);
    }, 800);
  };

  return (
    <AnimatePresence>
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-[90] flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl"
          style={{
            background: "var(--warm-white)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 8px 40px rgba(26,26,46,0.12)",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--card-border)", background: "var(--cream)" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))" }}>
                <Bot size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Nexus Assistant</p>
                <p className="text-[10px]" style={{ color: "var(--accent-green)" }}>● Online</p>
              </div>
            </div>
            <button onClick={toggleChat} className="rounded-lg p-1.5 transition-colors hover:bg-white" style={{ color: "var(--navy-muted)" }}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "var(--background)" }}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: msg.sender === "user" ? "var(--navy)" : "var(--royal-gold)" }}>
                  {msg.sender === "user" ? <User size={13} /> : <Bot size={13} />}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.sender === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                  style={{
                    background: msg.sender === "user" ? "var(--navy)" : "var(--cream)",
                    color: msg.sender === "user" ? "white" : "var(--navy)",
                  }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3" style={{ borderTop: "1px solid var(--card-border)", background: "var(--warm-white)" }}>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--royal-gold)" }}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
