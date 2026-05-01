"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import ChatPanel from "./ChatPanel";
import NotificationPanel from "./NotificationPanel";
import FloatingActionButton from "./FloatingActionButton";
import { useAuthStore } from "@/store/authStore";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const { loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <ChatPanel />
      <NotificationPanel />
      <FloatingActionButton />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(10,10,35,0.95)",
            color: "#e0e0ff",
            border: "1px solid rgba(0,240,255,0.2)",
            backdropFilter: "blur(20px)",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#00f0ff", secondary: "#050510" },
          },
          error: {
            iconTheme: { primary: "#ff00aa", secondary: "#050510" },
          },
        }}
      />
    </>
  );
}
