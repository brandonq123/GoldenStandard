'use client'

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TrendingContent } from "@/components/trending-content"

export default function TrendingPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          heading="Market Trends" 
          text="Track trending stocks and upcoming market events across platforms."
        />
        
        <TrendingContent />
      </div>
    </DashboardShell>
  )
} 