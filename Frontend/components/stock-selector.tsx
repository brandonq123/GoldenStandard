'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Stock {
  symbol: string
  name: string
}

interface StockSelectorProps {
  stocks: Stock[]
  defaultStock: Stock
  onStockChange?: (symbol: string) => void
  onSelect?: (stock: Stock) => void
}

export function StockSelector({ stocks, defaultStock, onStockChange, onSelect }: StockSelectorProps) {
  const handleStockChange = (value: string) => {
    const selected = stocks.find(s => s.symbol === value)
    if (selected) {
      if (onSelect) onSelect(selected)
      if (onStockChange) onStockChange(value)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={defaultStock.symbol} onValueChange={handleStockChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a stock" />
        </SelectTrigger>
        <SelectContent>
          {stocks.map((stock) => (
            <SelectItem key={stock.symbol} value={stock.symbol}>
              {stock.symbol} - {stock.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
        Buy
      </Button>
      <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
        Sell
      </Button>
    </div>
  )
} 