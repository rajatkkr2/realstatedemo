"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import DemoBanner from "./DemoBanner";
import ChatPanel from "./ChatPanel";
import NotificationPanel from "./NotificationPanel";
import FloatingActionButton from "./FloatingActionButton";
import LeadFormSheet from "./LeadFormSheet";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [leadFormOpen, setLeadFormOpen] = useState(false);

  /* Auto-open lead form after 5 seconds on first visit */
  useEffect(() => {
    const hasShown = sessionStorage.getItem("leadFormShown");
    if (!hasShown) {
      const timer = setTimeout(() => {
        setLeadFormOpen(true);
        sessionStorage.setItem("leadFormShown", "true");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <ParticleField />
      <DemoBanner />
      <Navbar onOpenLeadForm={() => setLeadFormOpen(true)} />
      <main className="relative z-10 flex-1">{children}</main>
      <ChatPanel />
      <NotificationPanel />
      <FloatingActionButton />
      <LeadFormSheet open={leadFormOpen} onClose={() => setLeadFormOpen(false)} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--warm-white)",
            color: "var(--navy)",
            border: "1px solid var(--card-border)",
            backdropFilter: "blur(20px)",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#2E7D5B", secondary: "#FFFFFF" },
          },
          error: {
            iconTheme: { primary: "#C0392B", secondary: "#FFFFFF" },
          },
        }}
      />
    </>
  );
}
