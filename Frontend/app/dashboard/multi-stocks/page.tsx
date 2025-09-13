'use client'

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { apiService, StockData } from "@/lib/api"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// All available stocks for rotation
const allStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
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
]

// Function to get 5 stocks with rotation
function getCurrentStocks() {
  const now = new Date()
  const minuteIndex = Math.floor(now.getTime() / (60 * 1000)) // Changes every minute
  const startIndex = (minuteIndex * 5) % allStocks.length
  return allStocks.slice(startIndex, startIndex + 5)
}

interface StockCardProps {
  stock: StockData | undefined
  isLoading: boolean
}

function StockCard({ stock, isLoading }: StockCardProps) {
  if (isLoading || !stock) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow"
      >
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </motion.div>
    )
  }

  // Check if this is fallback data (no real price data)
  const isFallbackData = stock.price === 0.00 && stock.change === 0.00

  const isPositive = stock.change >= 0
  const isNegative = stock.change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 border rounded-lg bg-background hover:shadow-md transition-shadow cursor-pointer",
        isFallbackData && "opacity-60"
      )}
      whileHover={{ scale: isFallbackData ? 1.0 : 1.02 }}
      whileTap={{ scale: isFallbackData ? 1.0 : 0.98 }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{stock.symbol}</h3>
            <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
          </div>
          {isFallbackData && (
            <div className="text-xs text-orange-500 font-medium">API Error</div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-lg font-bold">
            {isFallbackData ? "N/A" : `$${stock.price.toFixed(2)}`}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-sm font-medium",
              isPositive && !isFallbackData && "text-green-600",
              isNegative && !isFallbackData && "text-red-600",
              (!isPositive && !isNegative) || isFallbackData ? "text-gray-600" : ""
            )}>
              {isFallbackData ? "N/A" : `${isPositive ? '+' : ''}${stock.change.toFixed(2)} (${stock.change_percent.toFixed(2)}%)`}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Vol: {stock.volume}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MultiStocksPage() {
  const [stocksData, setStocksData] = useState<Record<string, StockData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [currentStocks, setCurrentStocks] = useState(getCurrentStocks())

  // Load all stocks data
  useEffect(() => {
    const loadAllStocks = async () => {
      setIsLoading(true)
      setError(null)
      
      // Get current 5 stocks for this minute
      const stocksToLoad = getCurrentStocks()
      setCurrentStocks(stocksToLoad)
      
      try {
        // Load data for all stocks with a small delay between each to avoid rate limiting
        const results = []
        for (const stock of stocksToLoad) {
          try {
            const data = await apiService.getStockInfo(stock.symbol)
            results.push({ symbol: stock.symbol, data })
            // Add a delay between requests to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 300))
          } catch (err) {
            console.warn(`Failed to load ${stock.symbol}:`, err)
            // Create a fallback data object for failed stocks
            const fallbackData = {
              symbol: stock.symbol,
              name: stock.name,
              price: 0.00,
              change: 0.00,
              change_percent: 0.00,
              volume: "N/A",
              market_cap: "N/A",
              pe_ratio: 0.0
            }
            results.push({ symbol: stock.symbol, data: fallbackData })
          }
        }
        
        // Create a map of symbol to data
        const stocksMap: Record<string, StockData> = {}
        results.forEach(result => {
          if (result.data) {
            stocksMap[result.symbol] = result.data
          }
        })
        
        setStocksData(stocksMap)
        setLastUpdated(new Date())
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load stocks:', err)
        setError(err instanceof Error ? err.message : 'Failed to load stocks data')
        setIsLoading(false)
      }
    }

    loadAllStocks()
    
    // Refresh data every minute to rotate stocks and stay within rate limits
    const interval = setInterval(loadAllStocks, 60000)
    
    return () => clearInterval(interval)
  }, [])

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
          heading="Market Overview" 
          text="Real-time data for rotating stocks (changes every minute)."
        />
        
        {/* Last Updated */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {Object.keys(stocksData).length} stocks loaded
          </p>
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {currentStocks.map((stock, index) => (
            <StockCard
              key={stock.symbol}
              stock={stocksData[stock.symbol]}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Loading market data...</span>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
