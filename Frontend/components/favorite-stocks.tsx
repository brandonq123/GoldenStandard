import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StockCard } from "@/components/stock-card"
import { mockStockData } from "@/lib/mock-data"

interface FavoriteStocksProps {
  className?: string
}

export function FavoriteStocks({ className }: FavoriteStocksProps) {
  // Ensure mockStockData is defined and has values
  const safeStockData = mockStockData && mockStockData.length > 0 ? mockStockData : []

  // Get first 4 stocks as favorites
  const favoriteStocks = safeStockData.slice(0, 4)

  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader>
        <CardTitle>Your Watchlist</CardTitle>
        <CardDescription>Track your favorite stocks and their sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {favoriteStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
