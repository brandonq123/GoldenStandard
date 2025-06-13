import React from "react"
import { motion } from "framer-motion"

export function GoldenLogo({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Gradients */}
      <defs>
        <linearGradient id="coinFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ffd700" }} />
          <stop offset="50%" style={{ stopColor: "#d4af36" }} />
          <stop offset="100%" style={{ stopColor: "#ffd700" }} />
        </linearGradient>
        <linearGradient id="coinEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#d4af36" }} />
          <stop offset="50%" style={{ stopColor: "#8b7355" }} />
          <stop offset="100%" style={{ stopColor: "#d4af36" }} />
        </linearGradient>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "white", stopOpacity: "0.4" }} />
          <stop offset="100%" style={{ stopColor: "white", stopOpacity: "0" }} />
        </linearGradient>
      </defs>

      {/* Coin edge (side) */}
      <motion.path
        d="M95 50C95 74.8528 74.8528 95 50 95C25.1472 95 5 74.8528 5 50C5 25.1472 25.1472 5 50 5C74.8528 5 95 25.1472 95 50Z"
        fill="url(#coinEdge)"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Main coin face */}
      <motion.circle
        cx="50"
        cy="50"
        r="42"
        fill="url(#coinFace)"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Inner circle detail */}
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        stroke="#d4af36"
        strokeWidth="2"
        fill="none"
      />

      {/* Dollar sign */}
      <motion.path
        d="M45 30h10M50 30v40M45 70h10M45 45h12M43 55h12"
        stroke="#8b7355"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Shine overlay */}
      <motion.path
        d="M20 20L80 80"
        stroke="url(#shine)"
        strokeWidth="20"
        strokeLinecap="round"
        animate={{
          opacity: [0, 0.5, 0],
          pathLength: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />

      {/* Edge highlights */}
      <motion.circle
        cx="50"
        cy="50"
        r="42"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        fill="none"
      />
    </motion.svg>
  )
} 