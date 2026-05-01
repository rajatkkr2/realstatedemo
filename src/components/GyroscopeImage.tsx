"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface GyroscopeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  intensity?: number;
}

export default function GyroscopeImage({
  src,
  alt,
  width = 600,
  height = 400,
  className = "",
  intensity = 20,
}: GyroscopeImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [scale, setScale] = useState(1.05);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = e.gamma ? Math.max(-45, Math.min(45, e.gamma)) : 0;
      const y = e.beta ? Math.max(-45, Math.min(45, e.beta - 45)) : 0;
      setTiltX((x / 45) * intensity);
      setTiltY((y / 45) * intensity);
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, [intensity]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTiltX((x - 0.5) * intensity);
      setTiltY((y - 0.5) * -intensity);
      setScale(1.08);
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
    setScale(1.05);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          rotateX: tiltY * 0.5,
          rotateY: tiltX * 0.5,
          scale: scale,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover"
          unoptimized
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          x: tiltX * 2,
          y: tiltY * 2,
        }}
        style={{
          background: `radial-gradient(circle at ${50 + tiltX}% ${50 + tiltY}%, rgba(0,240,255,0.15), transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ border: "1px solid rgba(0,240,255,0.15)" }}
      />
    </motion.div>
  );
}
