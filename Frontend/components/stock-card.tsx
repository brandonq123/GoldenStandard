import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { StockData } from "@/lib/types"

interface StockCardProps {
  stock: StockData
  className?: string
}

export function StockCard({ stock, className }: StockCardProps) {
  // Ensure stock is defined
  if (!stock) {
    return null
  }

  const { symbol, name, price, change, sentiment, mentions } = stock

  return (
    <Link href={`/stocks/${symbol.toLowerCase()}`}>
      <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{symbol}</h3>
                <Badge
                  variant={sentiment === "bullish" ? "success" : sentiment === "bearish" ? "destructive" : "outline"}
                >
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${price.toFixed(2)}</p>
              <div className={cn("flex items-center text-sm", change > 0 ? "text-green-500" : "text-red-500")}>
                {change > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                {Math.abs(change).toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{mentions} mentions</span>
            </div>
            <div
              className={cn(
                "font-medium",
                sentiment === "bullish"
                  ? "text-green-500"
                  : sentiment === "bearish"
                    ? "text-red-500"
                    : "text-amber-500",
              )}
            >
              {sentiment === "bullish" ? "🚀 " : sentiment === "bearish" ? "📉 " : "⚖️ "}
              {sentiment === "bullish" ? "Bullish" : sentiment === "bearish" ? "Bearish" : "Neutral"}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
