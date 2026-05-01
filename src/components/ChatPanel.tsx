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
  text: "Hi! I'm the NEXUS assistant. I can help you find properties, answer questions about listings, or connect you with an agent. How can I help?",
  timestamp: new Date().toISOString(),
};

function getBotResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("price") || q.includes("cost") || q.includes("budget"))
    return "You can filter properties by price range using the search filters on our Properties page. We have options from ₹50L to ₹10+ Cr. Would you like me to help you narrow down?";
  if (q.includes("location") || q.includes("city") || q.includes("where") || q.includes("area"))
    return "We have listings across multiple cities and states. Use the search bar on the Properties page to filter by city, state, pincode, or area/locality.";
  if (q.includes("contact") || q.includes("agent") || q.includes("call") || q.includes("phone"))
    return "You can send an inquiry directly from any property detail page. Just click on a property and fill in the inquiry form — the admin will get back to you!";
  if (q.includes("emi") || q.includes("loan") || q.includes("finance"))
    return "Check out our Finance page for an EMI calculator and market price trends. It helps you estimate monthly payments based on property price, down payment, and interest rate.";
  if (q.includes("register") || q.includes("sign up") || q.includes("account"))
    return "You can create an account by clicking Register in the top menu. Choose between a regular User or Admin role during registration.";
  if (q.includes("admin") || q.includes("add property") || q.includes("list property"))
    return "Admins can add and manage properties from the Admin Panel. Register as an admin, then go to Admin → Add Property to create a listing with all details.";
  if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
    return "Hello! 👋 How can I help you today? I can assist with property search, pricing, EMI calculations, or account setup.";
  if (q.includes("thank"))
    return "You're welcome! Feel free to ask if you need anything else. Happy house hunting! 🏠";
  return "I can help you with property search, pricing info, EMI calculation, contacting agents, and account setup. Could you be more specific about what you need?";
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
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: getBotResponse(userInput),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
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
            background: "rgba(10,10,35,0.95)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(0,240,255,0.2)",
            boxShadow: "0 0 40px rgba(0,240,255,0.1)",
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)]">
                <Bot size={16} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Nexus AI Assistant</p>
                <p className="text-[10px] text-[var(--neon-green)]">● Online</p>
              </div>
            </div>
            <button onClick={toggleChat} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.sender === "user"
                    ? "bg-[var(--neon-purple)]"
                    : "bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-blue)]"
                }`}>
                  {msg.sender === "user" ? <User size={13} className="text-white" /> : <Bot size={13} className="text-black" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    msg.sender === "user"
                      ? "rounded-br-sm bg-[var(--neon-purple)]/20 text-white"
                      : "rounded-bl-sm bg-white/5 text-white/80"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-blue))",
                }}
              >
                <Send size={16} className="text-black" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
