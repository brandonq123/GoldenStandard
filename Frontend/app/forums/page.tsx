'use client'

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ForumContent } from "@/components/forum-content"

export default function ForumPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching from Reddit API
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3000 + Math.random() * 2000) // 3-5 second variable loading time
    
    return () => clearTimeout(loadingTimer)
  }, [])

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          heading="Forum Insights" 
          text="Track trending discussions and market sentiment across trading communities."
        />
        
        <ForumContent isLoading={isLoading} />
      </div>
    </DashboardShell>
  )
} 