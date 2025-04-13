'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Stock {
  symbol: string
  name: string
}

interface StockSelectorProps {
  stocks: Stock[]
  defaultStock: Stock
  onSelect?: (stock: Stock) => void
}

export function StockSelector({ stocks, defaultStock, onSelect }: StockSelectorProps) {
  return (
    <Select defaultValue={defaultStock.symbol} onValueChange={(value) => {
      const selected = stocks.find(s => s.symbol === value)
      if (selected && onSelect) onSelect(selected)
    }}>
      <SelectTrigger className="w-full">
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
  )
} 