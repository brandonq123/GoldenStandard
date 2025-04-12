"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MarketOverviewProps {
  className?: string
}

export function MarketOverview({ className }: MarketOverviewProps) {
  // Ensure marketData is defined and has values
  const safeMarketData = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return {
      time: `${hour}:00`,
      value: 4200 + Math.random() * 200,
    }
  })

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>S&P 500 index performance and overall market sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer>
              <AreaChart
                data={safeMarketData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                  tickFormatter={(value) => `${value || 0}`}
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
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                              <span className="font-bold">{payload[0]?.value || 0}</span>
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
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">Overall Sentiment</div>
              <div className="text-lg font-bold text-green-500">Bullish</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">WSB Sentiment</div>
              <div className="text-lg font-bold text-green-500">Very Bullish</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">News Sentiment</div>
              <div className="text-lg font-bold text-amber-500">Neutral</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs font-medium">Twitter Sentiment</div>
              <div className="text-lg font-bold text-green-500">Bullish</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
