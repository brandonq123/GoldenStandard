'use client'

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockChart } from "@/components/stock-chart"
import { StockSelector } from "@/components/stock-selector"
import { StockInfo } from "@/components/stock-info"
import { AISummaries } from "@/components/ai-summaries"
import { SourcesList } from "@/components/sources-list"
import { apiService, StockData, PriceData } from "@/lib/api"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Popular stocks for selector
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "UNH", name: "UnitedHealth Group Inc." },
  { symbol: "HD", name: "Home Depot Inc." },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "DIS", name: "Walt Disney Co." },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "NKE", name: "Nike Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "VZ", name: "Verizon Communications Inc." },
  { symbol: "KO", name: "Coca-Cola Co." },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "T", name: "AT&T Inc." },
  { symbol: "ABT", name: "Abbott Laboratories" },
  { symbol: "MRK", name: "Merck & Co. Inc." },
  { symbol: "PEP", name: "PepsiCo Inc." },
  { symbol: "COST", name: "Costco Wholesale Corp." },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc." },
  { symbol: "ACN", name: "Accenture PLC" },
  { symbol: "DHR", name: "Danaher Corporation" },
  { symbol: "LLY", name: "Eli Lilly and Company" },
  { symbol: "BMY", name: "Bristol-Myers Squibb Co." },
  { symbol: "RTX", name: "Raytheon Technologies Corp." },
  { symbol: "QCOM", name: "QUALCOMM Inc." },
  { symbol: "TXN", name: "Texas Instruments Inc." },
  { symbol: "HON", name: "Honeywell International Inc." },
  { symbol: "LOW", name: "Lowe's Companies Inc." },
  { symbol: "UPS", name: "United Parcel Service Inc." },
  { symbol: "CAT", name: "Caterpillar Inc." },
  { symbol: "IBM", name: "International Business Machines Corp." },
  { symbol: "GS", name: "Goldman Sachs Group Inc." },
  { symbol: "MS", name: "Morgan Stanley" },
  { symbol: "BA", name: "Boeing Co." },
  { symbol: "GE", name: "General Electric Co." },
  { symbol: "F", name: "Ford Motor Co." },
  { symbol: "GM", name: "General Motors Co." },
  { symbol: "AMD", name: "Advanced Micro Devices Inc." },
  { symbol: "ORCL", name: "Oracle Corporation" },
  { symbol: "CSCO", name: "Cisco Systems Inc." },
  { symbol: "CMCSA", name: "Comcast Corporation" },
  { symbol: "PM", name: "Philip Morris International Inc." },
  { symbol: "SPY", name: "SPDR S&P 500 ETF" },
  { symbol: "QQQ", name: "Invesco QQQ Trust" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF" },
]

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"
const TIME_PERIODS: TimePeriod[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

export default function StockPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1D")
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [isLoading, setIsLoading] = useState(true)
  const [isChartLoading, setIsChartLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [stockInfo, setStockInfo] = useState<StockData | null>(null)
  const [currentData, setCurrentData] = useState<PriceData[]>([])

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Load stock info first (this works)
        const infoData = await apiService.getStockInfo(selectedStock)
        setStockInfo(infoData)
        setIsLoading(false)
        
        // Try to load price data (this might fail)
        try {
          const priceData = await apiService.getStockPrice(selectedStock, selectedPeriod)
          setCurrentData(priceData.data)
          setIsChartLoading(false)
        } catch (priceErr) {
          console.warn('Price data failed to load:', priceErr)
          // Don't show error for price data, just show empty chart
          setCurrentData([])
          setIsChartLoading(false)
        }
      } catch (err) {
        console.error('Failed to load stock info:', err)
        setError(err instanceof Error ? err.message : 'Failed to load stock data')
        setIsLoading(false)
        setIsChartLoading(false)
      }
    }

    loadInitialData()
  }, [selectedStock])

  // Handle period changes
  useEffect(() => {
    if (!isLoading) {
      const loadPriceData = async () => {
        setIsChartLoading(true)
        setError(null)
        
        try {
          const priceData = await apiService.getStockPrice(selectedStock, selectedPeriod)
          setCurrentData(priceData.data)
          setIsChartLoading(false)
        } catch (err) {
          console.warn('Failed to load price data:', err)
          // Don't show error for price data, just show empty chart
          setCurrentData([])
          setIsChartLoading(false)
        }
      }

      loadPriceData()
    }
  }, [selectedPeriod, selectedStock, isLoading])

  // Handle stock selection
  const handleStockChange = (symbol: string) => {
    setSelectedStock(symbol)
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardShell>
    )
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
          <StockSelector 
            stocks={popularStocks} 
            defaultStock={stockInfo || { symbol: "AAPL", name: "Apple Inc." }}
            onStockChange={handleStockChange}
          />
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
          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="h-5 w-24 animate-pulse rounded-md bg-muted mb-2" />
                  <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          ) : stockInfo ? (
            <StockInfo data={stockInfo} />
          ) : null}
        </div>

        {/* AI Summaries Section */}
        <div className="w-full mt-8">
          <AISummaries isLoading={isLoading} />
        </div>

        {/* Sources Section */}
        <div className="w-full mt-8">
          <SourcesList isLoading={isLoading} />
        </div>
      </div>
    </DashboardShell>
  )
} 