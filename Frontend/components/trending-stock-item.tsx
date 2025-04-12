import Link from "next/link"
import { ArrowDown, ArrowUp, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StockData } from "@/lib/types"

interface TrendingStockItemProps {
  stock: StockData
  className?: string
}

export function TrendingStockItem({ stock, className }: TrendingStockItemProps) {
  // Ensure stock is defined
  if (!stock) {
    return null
  }

  const { symbol, name, price, change, sentiment, mentions } = stock

  return (
    <Link href={`/stocks/${symbol.toLowerCase()}`}>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-accent",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              sentiment === "bullish" ? "bg-green-100" : sentiment === "bearish" ? "bg-red-100" : "bg-amber-100",
            )}
          >
            <span className="text-lg">{sentiment === "bullish" ? "🚀" : sentiment === "bearish" ? "📉" : "⚖️"}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{symbol}</h3>
              <div className={cn("flex items-center text-xs", change > 0 ? "text-green-500" : "text-red-500")}>
                {change > 0 ? <ArrowUp className="mr-0.5 h-3 w-3" /> : <ArrowDown className="mr-0.5 h-3 w-3" />}
                {Math.abs(change).toFixed(2)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">{mentions}</span>
        </div>
      </div>
    </Link>
  )
}
