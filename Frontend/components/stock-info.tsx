'use client'

import React from "react"
import { StockData } from "@/lib/api"

interface StockInfoProps {
  data: StockData
}

export function StockInfo({ data }: StockInfoProps) {
  const isPositive = data.change >= 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <InfoCard 
        label="Price" 
        value={`$${data.price.toFixed(2)}`}
        detail={
          <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{data.change.toFixed(2)} ({isPositive ? '+' : ''}{data.change_percent.toFixed(2)}%)
          </div>
        }
      />
      <InfoCard 
        label="Volume" 
        value={data.volume}
      />
      <InfoCard 
        label="Market Cap" 
        value={data.market_cap}
      />
      <InfoCard 
        label="P/E Ratio" 
        value={data.pe_ratio > 0 ? data.pe_ratio.toFixed(2) : 'N/A'}
      />
      <InfoCard 
        label="Change" 
        value={`${isPositive ? '+' : ''}${data.change_percent.toFixed(2)}%`}
        detail={
          <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{data.change.toFixed(2)}
          </div>
        }
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
    <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
      {detail && <div className="mt-1">{detail}</div>}
    </div>
  )
} 