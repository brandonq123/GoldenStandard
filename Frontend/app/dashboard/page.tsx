import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockWatchlist } from "@/components/stock-watchlist"
import { TrendingStocks } from "@/components/trending-stocks"
import { CommunityFeed } from "@/components/community-feed"

export default function DashboardPage() {
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Market Pulse" text=" sentiment across social platforms and forums." />
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Left column - Stocks */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <TrendingStocks />
            <StockWatchlist />
          </div>

          {/* Right column - Community Feed */}
          <div className="lg:col-span-4">
            <CommunityFeed />
          </div>
        </div>
      </DashboardShell>
    </>
  )
}
