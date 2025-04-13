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
    <div className="flex flex-wrap gap-8 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">High</span>
        <span className="font-medium">${data.high.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Low</span>
        <span className="font-medium">${data.low.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Volume</span>
        <span className="font-medium">{data.volume}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Market Cap</span>
        <span className="font-medium">{data.marketCap}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">P/E Ratio</span>
        <span className="font-medium">{data.peRatio.toFixed(2)}</span>
      </div>
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