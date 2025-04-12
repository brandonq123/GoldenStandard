import Link from "next/link"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { StockData } from "@/lib/types"

interface SimplifiedStockCardProps {
  stock: StockData
  className?: string
}

export function SimplifiedStockCard({ stock, className }: SimplifiedStockCardProps) {
  // Ensure stock is defined
  if (!stock) {
    return null
  }

  const { symbol, name, price, change, sentiment, mentions } = stock

  return (
    <Link href={`/stocks/${symbol.toLowerCase()}`}>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              sentiment === "bullish"
                ? "bg-green-100 text-green-700"
                : sentiment === "bearish"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700",
            )}
          >
            <span className="text-lg font-bold">{symbol.charAt(0)}</span>
          </div>
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
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="font-bold">${price.toFixed(2)}</div>
          <div className={cn("flex items-center text-sm", change > 0 ? "text-green-500" : "text-red-500")}>
            {change > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
            {Math.abs(change).toFixed(2)}%
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3" />
            {mentions} mentions
          </div>
        </div>
      </div>
    </Link>
  )
}
