'use client'

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ForumContent } from "@/components/forum-content"

export default function ForumPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          heading="Forum Insights" 
          text="Track trending discussions and market sentiment across trading communities."
        />
        
        <ForumContent />
      </div>
    </DashboardShell>
  )
} 