'use client'

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockChart } from "@/components/stock-chart"
import { StockSelector } from "@/components/stock-selector"
import { StockInfo } from "@/components/stock-info"

// Placeholder data
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
]

const mockStockData = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 182.63,
  change: 1.25,
  changePercent: 0.69,
  high: 183.75,
  low: 181.92,
  volume: "45.3M",
  marketCap: "2.87T",
  peRatio: 30.21,
}

export default function StockPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          heading="Stock Analysis" 
          text="Real-time market data and sentiment analysis."
        />
        
        {/* Stock Selector */}
        <div className="w-full max-w-xs">
          <StockSelector stocks={mockStocks} defaultStock={mockStockData} />
        </div>

        {/* Main Chart */}
        <div className="w-full border rounded-lg p-6 bg-background">
          <StockChart data={mockStockData} />
        </div>

        {/* Stock Information */}
        <div className="w-full">
          <StockInfo data={mockStockData} />
        </div>
      </div>
    </DashboardShell>
  )
} 