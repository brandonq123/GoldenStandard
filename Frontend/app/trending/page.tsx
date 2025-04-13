'use client'

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TrendingContent } from "@/components/trending-content"

export default function TrendingPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2500 + Math.random() * 1500)  // 2.5-4 second load time
    
    return () => clearTimeout(loadingTimer)
  }, [])

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          heading="Market Trends" 
          text="Track trending stocks and upcoming market events across platforms."
        />
        
        <TrendingContent isLoading={isLoading} />
      </div>
    </DashboardShell>
  )
} 