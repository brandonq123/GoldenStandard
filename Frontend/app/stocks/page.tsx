'use client'

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockChart } from "@/components/stock-chart"
import { StockSelector } from "@/components/stock-selector"
import { StockInfo } from "@/components/stock-info"
import { AISummaries } from "@/components/ai-summaries"
import { SourcesList } from "@/components/sources-list"
import { mockStockData } from "@/lib/mock-stock-data"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Placeholder data
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
]

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"
const TIME_PERIODS: TimePeriod[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

export default function StockPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1D")
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isChartLoading, setIsChartLoading] = useState(true)
  const [currentData, setCurrentData] = useState(mockStockData["1D"])

  // Initial page load - load everything
  useEffect(() => {
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setIsFirstLoad(false)
        setIsChartLoading(false)
      }, 2500 + Math.random() * 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isFirstLoad])
  
  // Only reload chart data when period changes
  useEffect(() => {
    if (!isFirstLoad) {
      // Only show loading for chart when changing time period
      setIsChartLoading(true)
      
      const chartDataTimer = setTimeout(() => {
        setCurrentData(mockStockData[selectedPeriod])
        setIsChartLoading(false)
      }, 1200 + Math.random() * 800)
      
      return () => clearTimeout(chartDataTimer)
    }
  }, [selectedPeriod, isFirstLoad])

  const stockInfo = {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: currentData[currentData.length - 1].close,
    change: currentData[currentData.length - 1].close - currentData[0].open,
    changePercent: ((currentData[currentData.length - 1].close - currentData[0].open) / currentData[0].open) * 100,
    high: Math.max(...currentData.map(d => d.high)),
    low: Math.min(...currentData.map(d => d.low)),
    volume: "45.3M",
    marketCap: "2.87T",
    peRatio: 30.21,
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          heading="Stock Analysis" 
          text="Real-time market data and sentiment analysis."
        />
        
        {/* Stock Selector */}
        <div className="w-full max-w-xs">
          <StockSelector stocks={mockStocks} defaultStock={stockInfo} />
        </div>

        {/* Main Chart */}
        <div className="w-full border rounded-lg p-6 bg-background">
          {isChartLoading ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="h-64 w-full animate-pulse rounded-md bg-muted" />
            </div>
          ) : (
            <StockChart data={currentData} selectedPeriod={selectedPeriod} />
          )}
          
          {/* Time Range Selector */}
          <div className="flex justify-start gap-6 mt-6">
            {TIME_PERIODS.map((period) => (
              <motion.button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "relative px-2 py-1 text-sm font-medium",
                  selectedPeriod === period ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isChartLoading}
              >
                {period}
                {selectedPeriod === period && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 h-0.5 bg-primary"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 24, opacity: 1 }}
                    exit={{ y: 28, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stock Information */}
        <div className="w-full">
          {isChartLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="h-5 w-24 animate-pulse rounded-md bg-muted mb-2" />
                  <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <StockInfo data={stockInfo} />
          )}
        </div>

        {/* AI Summaries Section */}
        <div className="w-full mt-8">
          <AISummaries isLoading={isFirstLoad} />
        </div>

        {/* Sources Section */}
        <div className="w-full mt-8">
          <SourcesList isLoading={isFirstLoad} />
        </div>
      </div>
    </DashboardShell>
  )
} 