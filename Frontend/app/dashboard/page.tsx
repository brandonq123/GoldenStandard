"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

const floatingAnimationLeft = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const floatingAnimationRight = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1.5 // Start at different point in animation
    }
  }
}

export default function DashboardPage() {
  return (
    <React.Fragment>
      <DashboardShell>
        <DashboardHeader heading="Your Dashboard" text="Track stock sentiment in real-time across Reddit, news, and trading forums — all in one dashboard." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px]">
          {/* Stocks Card */}
          <motion.div
            initial="initial"
            animate="animate"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(212, 175, 54, 0.3)",
              transition: { duration: 0.2 }
            }}
            variants={floatingAnimationLeft}
          >
            <Link 
              href="/stocks" 
              className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-primary/30 hover:border-primary transition-all bg-background"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">Stocks</h2>
              <p className="text-gray-600 text-center max-w-sm">Discover real-time market trends and get ahead with AI-powered stock sentiment analysis</p>
            </Link>
          </motion.div>

          {/* Market Overview Card */}
          <motion.div
            initial="initial"
            animate="animate"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(212, 175, 54, 0.3)",
              transition: { duration: 0.2 }
            }}
            variants={floatingAnimationRight}
          >
            <Link 
              href="/dashboard/multi-stocks" 
              className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-primary/30 hover:border-primary transition-all bg-background"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">Market Overview</h2>
              <p className="text-gray-600 text-center max-w-sm">View real-time data for 50+ top stocks and ETFs in a comprehensive market dashboard</p>
            </Link>
          </motion.div>

          {/* Forums Card */}
          <motion.div
            initial="initial"
            animate="animate"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(212, 175, 54, 0.3)",
              transition: { duration: 0.2 }
            }}
            variants={floatingAnimationRight}
          >
            <Link 
              href="/forums" 
              className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-primary/30 hover:border-primary transition-all bg-background"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">Forums</h2>
              <p className="text-gray-600 text-center max-w-sm">Join the conversation and tap into the collective wisdom of our trading community</p>
            </Link>
          </motion.div>
        </div>
      </DashboardShell>
    </React.Fragment>
  )
}
