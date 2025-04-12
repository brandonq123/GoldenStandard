"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { StockData } from "@/lib/types"
import { generateStockPriceData } from "@/lib/mock-data"

interface StockOverviewProps {
  stock: StockData
}

export function StockOverview({ stock }: StockOverviewProps) {
  // Ensure stock is defined
  if (!stock) {
    return null // Return null if stock is undefined
  }

  const priceData = generateStockPriceData(stock.price)
  const isPositive = stock.change > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Overview</CardTitle>
        <CardDescription>Historical price data and key metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer>
              <AreaChart
                data={priceData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={30}
                  tickFormatter={(value) => value || ""}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value || 0}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                              <span className="font-bold text-muted-foreground">{label || ""}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
                              <span className="font-bold">${payload[0]?.value || 0}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">Open</div>
              <div className="text-lg font-bold">${(stock.price - stock.price * 0.01).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">High</div>
              <div className="text-lg font-bold">${(stock.price + stock.price * 0.02).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">Low</div>
              <div className="text-lg font-bold">${(stock.price - stock.price * 0.02).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">Volume</div>
              <div className="text-lg font-bold">{(Math.random() * 10 + 1).toFixed(1)}M</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
