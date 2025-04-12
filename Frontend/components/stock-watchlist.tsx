import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockStockData } from "@/lib/mock-data"
import { SimplifiedStockCard } from "@/components/simplified-stock-card"

export function StockWatchlist() {
  // Ensure mockStockData is defined and has values
  const safeStockData = mockStockData && mockStockData.length > 0 ? mockStockData : []

  // Get first 4 stocks as favorites
  const favoriteStocks = safeStockData.slice(0, 4)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Watchlist</CardTitle>
          <CardDescription>Track your favorite stocks and their sentiment</CardDescription>
        </div>
        <Link href="/watchlist" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favoriteStocks.map((stock) => (
            <SimplifiedStockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
