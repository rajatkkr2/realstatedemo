"use client";

import { motion } from "framer-motion";

/* Each building: x position, final height, width, delay, color */
const buildings = [
  { x: 40, h: 180, w: 32, delay: 0.8, color: "#1A1A2E" },
  { x: 80, h: 130, w: 28, delay: 1.2, color: "#2D2D44" },
  { x: 115, h: 210, w: 36, delay: 0.6, color: "#1A1A2E" },
  { x: 160, h: 160, w: 30, delay: 1.0, color: "#2D2D44" },
  { x: 200, h: 240, w: 40, delay: 0.4, color: "#1A1A2E" },
  { x: 250, h: 120, w: 26, delay: 1.4, color: "#4A4A6A" },
  { x: 285, h: 190, w: 34, delay: 0.7, color: "#2D2D44" },
  { x: 328, h: 260, w: 42, delay: 0.3, color: "#1A1A2E" },
  { x: 380, h: 150, w: 28, delay: 1.1, color: "#4A4A6A" },
  { x: 415, h: 200, w: 36, delay: 0.5, color: "#2D2D44" },
  { x: 460, h: 170, w: 30, delay: 0.9, color: "#1A1A2E" },
  { x: 500, h: 230, w: 38, delay: 0.35, color: "#2D2D44" },
  { x: 548, h: 140, w: 26, delay: 1.3, color: "#4A4A6A" },
  { x: 580, h: 220, w: 40, delay: 0.55, color: "#1A1A2E" },
  { x: 630, h: 160, w: 32, delay: 0.85, color: "#2D2D44" },
  { x: 670, h: 250, w: 44, delay: 0.25, color: "#1A1A2E" },
  { x: 725, h: 130, w: 28, delay: 1.15, color: "#4A4A6A" },
  { x: 760, h: 190, w: 34, delay: 0.65, color: "#2D2D44" },
  { x: 805, h: 210, w: 38, delay: 0.45, color: "#1A1A2E" },
  { x: 855, h: 145, w: 30, delay: 1.05, color: "#4A4A6A" },
  { x: 895, h: 270, w: 46, delay: 0.2, color: "#1A1A2E" },
  { x: 950, h: 160, w: 32, delay: 0.75, color: "#2D2D44" },
  { x: 990, h: 200, w: 36, delay: 0.5, color: "#1A1A2E" },
  { x: 1035, h: 140, w: 28, delay: 1.0, color: "#4A4A6A" },
  { x: 1070, h: 185, w: 34, delay: 0.6, color: "#2D2D44" },
];

/* Trees that fade out as buildings rise */
const trees = [
  { x: 60, delay: 0 },
  { x: 150, delay: 0.1 },
  { x: 270, delay: 0.15 },
  { x: 350, delay: 0.05 },
  { x: 450, delay: 0.2 },
  { x: 560, delay: 0.08 },
  { x: 680, delay: 0.12 },
  { x: 790, delay: 0.18 },
  { x: 900, delay: 0.06 },
  { x: 1000, delay: 0.14 },
];

/* Window lights on buildings */
function BuildingWindows({ w, h }: { w: number; h: number }) {
  const cols = Math.max(1, Math.floor((w - 8) / 8));
  const rows = Math.max(1, Math.floor((h - 20) / 14));
  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = Math.random() > 0.35;
      windows.push(
        <motion.rect
          key={`${r}-${c}`}
          x={6 + c * 8}
          y={10 + r * 14}
          width={4}
          height={6}
          rx={0.5}
          fill={lit ? "rgba(200,164,92,0.6)" : "rgba(200,164,92,0.15)"}
          initial={{ opacity: 0 }}
          animate={{ opacity: lit ? [0.3, 0.8, 0.3] : 0.2 }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      );
    }
  }
  return <>{windows}</>;
}

export default function CityScapeAnimation() {
  const baseY = 320;

  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ height: 340 }}>
      <svg
        viewBox="0 0 1100 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Ground gradient */}
        <defs>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(200,164,92,0.08)" />
            <stop offset="100%" stopColor="rgba(200,164,92,0.02)" />
          </linearGradient>
          <linearGradient id="skyGlow" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgba(200,164,92,0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Sky glow behind buildings */}
        <motion.rect
          x="0" y="100" width="1100" height="240"
          fill="url(#skyGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
        />

        {/* Ground plane */}
        <rect x="0" y={baseY} width="1100" height="20" fill="url(#groundGrad)" />

        {/* Ground line */}
        <motion.line
          x1="0" y1={baseY} x2="1100" y2={baseY}
          stroke="rgba(200,164,92,0.2)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Trees (fade out) */}
        {trees.map((tree, i) => (
          <motion.g
            key={`tree-${i}`}
            initial={{ opacity: 0.7, y: 0 }}
            animate={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 + tree.delay, duration: 1.5, ease: "easeIn" }}
          >
            {/* Trunk */}
            <rect x={tree.x - 2} y={baseY - 30} width={4} height={30} fill="rgba(139,105,60,0.4)" rx={1} />
            {/* Canopy */}
            <circle cx={tree.x} cy={baseY - 40} r={14} fill="rgba(46,125,91,0.3)" />
            <circle cx={tree.x - 6} cy={baseY - 34} r={10} fill="rgba(46,125,91,0.25)" />
            <circle cx={tree.x + 6} cy={baseY - 34} r={10} fill="rgba(46,125,91,0.25)" />
          </motion.g>
        ))}

        {/* Rolling hills (fade out) */}
        <motion.path
          d={`M0 ${baseY} Q100 ${baseY - 30} 200 ${baseY} Q300 ${baseY - 20} 400 ${baseY} Q500 ${baseY - 35} 600 ${baseY} Q700 ${baseY - 15} 800 ${baseY} Q900 ${baseY - 25} 1000 ${baseY} L1100 ${baseY}`}
          fill="rgba(46,125,91,0.12)"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 2, ease: "easeIn" }}
        />

        {/* Buildings rising up */}
        {buildings.map((b, i) => (
          <motion.g key={`building-${i}`}>
            {/* Building body */}
            <motion.rect
              x={b.x - b.w / 2}
              y={baseY}
              width={b.w}
              height={0}
              fill={b.color}
              rx={2}
              initial={{ height: 0, y: baseY }}
              animate={{ height: b.h, y: baseY - b.h }}
              transition={{
                delay: 1.0 + b.delay,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {/* Window lights */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 + b.delay, duration: 1.0 }}
            >
              <motion.svg
                x={b.x - b.w / 2}
                y={baseY - b.h}
                width={b.w}
                height={b.h}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 + b.delay, duration: 0.8 }}
              >
                <BuildingWindows w={b.w} h={b.h} />
              </motion.svg>
            </motion.g>

            {/* Roof antenna on tall buildings */}
            {b.h > 200 && (
              <motion.line
                x1={b.x}
                y1={baseY - b.h}
                x2={b.x}
                y2={baseY - b.h - 20}
                stroke="rgba(200,164,92,0.4)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.5 + b.delay, duration: 0.6 }}
              />
            )}
            {b.h > 200 && (
              <motion.circle
                cx={b.x}
                cy={baseY - b.h - 20}
                r={2}
                fill="rgba(200,164,92,0.6)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 3.0 + b.delay, duration: 2, repeat: Infinity }}
              />
            )}
          </motion.g>
        ))}

        {/* Construction crane (animated) */}
        <motion.g
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: [0, 0.6, 0.6, 0], x: [0, 0, 30, 30] }}
          transition={{ delay: 0.5, duration: 4, ease: "easeInOut" }}
        >
          {/* Crane tower */}
          <rect x={548} y={baseY - 280} width={4} height={280} fill="rgba(200,164,92,0.3)" />
          {/* Crane arm */}
          <rect x={550} y={baseY - 280} width={80} height={3} fill="rgba(200,164,92,0.3)" />
          {/* Crane cable */}
          <motion.line
            x1={620} y1={baseY - 277} x2={620} y2={baseY - 200}
            stroke="rgba(200,164,92,0.25)"
            strokeWidth="1"
            animate={{ y2: [baseY - 240, baseY - 180, baseY - 240] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Hook */}
          <motion.rect
            x={616} y={baseY - 200} width={8} height={8}
            fill="rgba(200,164,92,0.3)"
            rx={1}
            animate={{ y: [baseY - 244, baseY - 184, baseY - 244] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Subtle road */}
        <motion.rect
          x={0} y={baseY + 2} width={1100} height={6}
          fill="rgba(26,26,46,0.06)"
          rx={3}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />

        {/* Small car moving */}
        <motion.g
          initial={{ x: -40 }}
          animate={{ x: 1150 }}
          transition={{ delay: 4, duration: 6, ease: "linear", repeat: Infinity, repeatDelay: 3 }}
        >
          <rect x={0} y={baseY - 4} width={18} height={6} rx={2} fill="rgba(200,164,92,0.35)" />
          <circle cx={4} cy={baseY + 3} r={2.5} fill="rgba(26,26,46,0.2)" />
          <circle cx={14} cy={baseY + 3} r={2.5} fill="rgba(26,26,46,0.2)" />
        </motion.g>

        {/* Second car */}
        <motion.g
          initial={{ x: 1150 }}
          animate={{ x: -40 }}
          transition={{ delay: 6, duration: 8, ease: "linear", repeat: Infinity, repeatDelay: 5 }}
        >
          <rect x={0} y={baseY - 2} width={16} height={5} rx={2} fill="rgba(44,95,138,0.3)" />
          <circle cx={4} cy={baseY + 4} r={2} fill="rgba(26,26,46,0.15)" />
          <circle cx={12} cy={baseY + 4} r={2} fill="rgba(26,26,46,0.15)" />
        </motion.g>
      </svg>
    </div>
  );
}
