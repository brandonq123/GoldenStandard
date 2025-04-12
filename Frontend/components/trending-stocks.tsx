import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockStockData } from "@/lib/mock-data"
import { SimplifiedStockCard } from "@/components/simplified-stock-card"

export function TrendingStocks() {
  // Ensure mockStockData is defined and has values
  const safeStockData = mockStockData && mockStockData.length > 0 ? mockStockData : []

  // Sort by mention count to get trending stocks
  const trendingStocks = [...safeStockData].sort((a, b) => b.mentions - a.mentions).slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Trending on Social</CardTitle>
          <CardDescription>Most discussed stocks across platforms</CardDescription>
        </div>
        <Link href="/trending" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingStocks.map((stock) => (
            <SimplifiedStockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
