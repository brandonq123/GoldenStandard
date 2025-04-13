'use client'

import React from "react"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: string
  marketCap: string
  peRatio: number
}

interface StockInfoProps {
  data: StockData
}

export function StockInfo({ data }: StockInfoProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <InfoCard
        label="Current Price"
        value={`$${data.price.toFixed(2)}`}
        detail={
          <span className={data.change >= 0 ? "text-green-600" : "text-red-600"}>
            {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </span>
        }
      />
      <InfoCard
        label="Day Range"
        value={`$${data.low.toFixed(2)} - $${data.high.toFixed(2)}`}
      />
      <InfoCard
        label="Volume"
        value={data.volume}
      />
      <InfoCard
        label="Market Cap"
        value={data.marketCap}
      />
      <InfoCard
        label="P/E Ratio"
        value={data.peRatio.toFixed(2)}
      />
    </div>
  )
}

interface InfoCardProps {
  label: string
  value: string
  detail?: React.ReactNode
}

function InfoCard({ label, value, detail }: InfoCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-background">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {detail && <div className="mt-1">{detail}</div>}
    </div>
  )
} 