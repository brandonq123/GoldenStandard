"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { StockData } from "@/lib/types"

interface SentimentAnalysisProps {
  stock: StockData
}

export function SentimentAnalysis({ stock }: SentimentAnalysisProps) {
  // Ensure stock is defined
  if (!stock) {
    return null // Return null if stock is undefined
  }

  // Generate sentiment distribution data
  const sentimentData = [
    {
      name: "Bullish",
      value: stock.sentiment === "bullish" ? 65 : stock.sentiment === "neutral" ? 35 : 15,
      color: "#22c55e",
    },
    { name: "Neutral", value: stock.sentiment === "neutral" ? 50 : 25, color: "#f59e0b" },
    {
      name: "Bearish",
      value: stock.sentiment === "bearish" ? 65 : stock.sentiment === "neutral" ? 35 : 15,
      color: "#ef4444",
    },
  ]

  // Generate source distribution data
  const sourceData = [
    { name: "WSB", value: 45, color: "#8b5cf6" },
    { name: "Twitter", value: 30, color: "#3b82f6" },
    { name: "News", value: 15, color: "#10b981" },
    { name: "Other", value: 10, color: "#6b7280" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Sentiment distribution across social platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-medium">Sentiment Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Sentiment</span>
                                  <span className="font-bold text-muted-foreground">{payload[0]?.name || ""}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                                  <span className="font-bold">{payload[0]?.value || 0}%</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Source Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer>
                  <BarChart
                    data={sourceData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Source</span>
                                  <span className="font-bold text-muted-foreground">{payload[0]?.name || ""}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                                  <span className="font-bold">{payload[0]?.value || 0}%</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
