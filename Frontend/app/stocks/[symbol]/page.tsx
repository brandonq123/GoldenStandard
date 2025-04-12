import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockOverview } from "@/components/stock-overview"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { SentimentTabs } from "@/components/sentiment-tabs"
import { mockStockData } from "@/lib/mock-data"

export default function StockPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params

  // Ensure mockStockData is defined and has values
  const safeStockData = mockStockData && mockStockData.length > 0 ? mockStockData : []

  // Find the stock or use the first one as a fallback, or create a default if empty
  const stockData = safeStockData.find((stock) => stock.symbol === symbol.toUpperCase()) ||
    safeStockData[0] || {
      symbol: "DEMO",
      name: "Demo Stock",
      price: 100,
      change: 0,
      sentiment: "neutral" as const,
      mentions: 0,
    }

  return (
    <>
      <DashboardShell>
        <DashboardHeader
          heading={`${stockData.name} (${stockData.symbol})`}
          text={`$${stockData.price.toFixed(2)} • ${stockData.change > 0 ? "+" : ""}${stockData.change.toFixed(2)}% today`}
        />
        <div className="grid gap-4">
          <StockOverview stock={stockData} />
          <SentimentAnalysis stock={stockData} />
          <SentimentTabs stock={stockData} />
        </div>
      </DashboardShell>
    </>
  )
}
