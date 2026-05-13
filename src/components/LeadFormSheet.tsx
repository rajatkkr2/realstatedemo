"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

interface LeadFormSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function LeadFormSheet({ open, onClose }: LeadFormSheetProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;
    setLoading(true);

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          source: "lead_form",
        }),
      });
    } catch {
      // still show success for UX
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "", message: "" });
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md overflow-y-auto"
            style={{
              background: "var(--warm-white)",
              boxShadow: "-8px 0 40px rgba(26,26,46,0.12)",
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
              style={{
                background: "linear-gradient(135deg, var(--navy), #2D2D44)",
                color: "white",
              }}
            >
              <div>
                <h2 className="text-xl font-bold">Get in Touch</h2>
                <p className="mt-1 text-sm text-white/70">We&apos;d love to hear from you</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "rgba(46,125,91,0.1)" }}
                  >
                    <CheckCircle size={32} style={{ color: "#2E7D5B" }} />
                  </motion.div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--navy)" }}>
                    Thank You!
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--navy-muted)" }}>
                    We&apos;ve received your inquiry. Our team will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-sm" style={{ color: "var(--navy-muted)" }}>
                    Fill in your details and our property experts will reach out to you shortly.
                  </p>

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--navy)" }}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#C8A45C]/30"
                        style={{
                          background: "var(--cream)",
                          color: "var(--navy)",
                          border: "1px solid var(--card-border)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--navy)" }}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2"
                        style={{
                          background: "var(--cream)",
                          color: "var(--navy)",
                          border: "1px solid var(--card-border)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--navy)" }}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2"
                        style={{
                          background: "var(--cream)",
                          color: "var(--navy)",
                          border: "1px solid var(--card-border)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--navy)" }}>
                      Your Inquiry
                    </label>
                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-3 top-3" style={{ color: "var(--navy-muted)" }} />
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us what you're looking for — budget, location, property type..."
                        className="w-full resize-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2"
                        style={{
                          background: "var(--cream)",
                          color: "var(--navy)",
                          border: "1px solid var(--card-border)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all btn-shine"
                    style={{
                      background: "linear-gradient(135deg, var(--royal-gold), var(--royal-gold-dark))",
                      boxShadow: "0 4px 16px rgba(200,164,92,0.3)",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? "Sending..." : "Submit Inquiry"}
                      {!loading && <Send size={16} />}
                    </span>
                  </motion.button>

                  <p className="text-center text-[11px]" style={{ color: "var(--navy-muted)" }}>
                    By submitting, you agree to be contacted by our team regarding your property inquiry.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
