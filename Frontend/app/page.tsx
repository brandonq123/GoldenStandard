"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GoldenLogo } from "@/components/golden-logo"
import { playStartupSound } from "@/lib/sounds"

export default function LandingPage() {
  const router = useRouter()
  const [hoverLogo, setHoverLogo] = useState(false)
  const [hoverButton, setHoverButton] = useState(false)

  const handleGetStarted = () => {
    playStartupSound()
    router.push("/dashboard")
  }

  // Animation for the background particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 2,
    velocity: Math.random() * 0.3 + 0.1,
  }))

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/10"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              opacity: Math.random() * 0.5 + 0.3,
              scale: particle.size / 10,
            }}
            animate={{
              y: [`${particle.y}%`, `${(particle.y + 20) % 100}%`],
              x: [`${particle.x}%`, `${(particle.x + (Math.random() * 10 - 5)) % 100}%`],
            }}
            transition={{
              duration: 10 / particle.velocity,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Logo area */}
        <motion.div
          className="mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-primary/10 p-8 shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(212, 175, 54, 0.5)" }}
          onHoverStart={() => setHoverLogo(true)}
          onHoverEnd={() => setHoverLogo(false)}
        >
          <motion.div
            animate={hoverLogo ? { rotateY: 180 } : { rotateY: 0 }}
            transition={{ duration: 0.6 }}
            className="flex h-full w-full items-center justify-center"
          >
            <GoldenLogo className="h-32 w-32" />
          </motion.div>
        </motion.div>

        {/* App title */}
        <motion.h1
          className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
            Golden Standard
          </span>
        </motion.h1>

        <motion.p
          className="mb-8 max-w-md text-lg text-muted-foreground font-serif italic tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Outsmart the Market. Before It Moves.
        </motion.p>

        {/* Get Started button with ripple effect */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setHoverButton(true)}
          onHoverEnd={() => setHoverButton(false)}
        >
          <Button 
            size="lg" 
            className="h-12 px-8 text-lg font-semibold" 
            onClick={handleGetStarted}
          >
            {/* Letter-by-letter ripple effect */}
            <span className="relative">
              {"Get Started".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="relative inline-block"
                  animate={
                    hoverButton
                      ? {
                          y: [0, -5, 0],
                          color: ["#fff", "#fff", "#fff"],
                          textShadow: [
                            "0 0 0px rgba(255,255,255,0)",
                            "0 0 10px rgba(255,255,255,0.8)",
                            "0 0 0px rgba(255,255,255,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    repeat: hoverButton ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 0.8,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
