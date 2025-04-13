import React from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  return (
    <React.Fragment>
      <DashboardShell>
        <DashboardHeader heading="Market Pulse" text="Stock sentiment across social platforms and forums." />
        <div className="grid grid-cols-2 gap-8 h-[600px]">
          {/* Stocks Card */}
          <Link 
            href="/stocks" 
            className="flex flex-col items-center justify-center h-full rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all bg-background"
          >
            <h2 className="text-3xl font-bold mb-4">Stocks</h2>
            <p className="text-gray-600 text-center max-w-sm">Discover real-time market trends and get ahead with AI-powered stock sentiment analysis</p>
          </Link>

          {/* Forums Card */}
          <Link 
            href="/forums" 
            className="flex flex-col items-center justify-center h-full rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all bg-background"
          >
            <h2 className="text-3xl font-bold mb-4">Forums</h2>
            <p className="text-gray-600 text-center max-w-sm">Join the conversation and tap into the collective wisdom of our trading community</p>
          </Link>
        </div>
      </DashboardShell>
    </React.Fragment>
  )
}
