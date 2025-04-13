import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Mock API data structure for trending stocks
const mockTrendingStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 175.34,
    change: 2.45,
    changePercent: 1.42,
    volume: 45678900,
    marketCap: "2.87T",
    sentiment: "positive",
    mentions: 12500,
    sources: ["r/wallstreetbets", "r/stocks", "r/investing"],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    currentPrice: 950.02,
    change: 25.67,
    changePercent: 2.78,
    volume: 34567800,
    marketCap: "2.35T",
    sentiment: "very positive",
    mentions: 9800,
    sources: ["r/wallstreetbets", "r/stocks"],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    currentPrice: 180.45,
    change: -3.21,
    changePercent: -1.75,
    volume: 56789000,
    marketCap: "574.5B",
    sentiment: "mixed",
    mentions: 8500,
    sources: ["r/wallstreetbets", "r/stocks"],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 420.78,
    change: 5.32,
    changePercent: 1.28,
    volume: 23456700,
    marketCap: "3.12T",
    sentiment: "positive",
    mentions: 7200,
    sources: ["r/stocks", "r/investing"],
  },
]

// Mock API data structure for important events
const mockImportantEvents = [
  {
    id: 1,
    title: "Fed Interest Rate Decision",
    date: "2024-03-20",
    impact: "high",
    affectedStocks: ["^GSPC", "^DJI", "^IXIC"],
    sentiment: "neutral",
    summary: "Federal Reserve to announce interest rate decision, potentially affecting market volatility",
    sources: ["Bloomberg", "Reuters", "CNBC"],
  },
  {
    id: 2,
    title: "NVIDIA GTC Conference",
    date: "2024-03-18",
    impact: "high",
    affectedStocks: ["NVDA", "AMD", "INTC"],
    sentiment: "positive",
    summary: "NVIDIA's annual GTC conference expected to showcase new AI developments",
    sources: ["TechCrunch", "The Verge", "r/wallstreetbets"],
  },
  {
    id: 3,
    title: "Apple Spring Event",
    date: "2024-03-21",
    impact: "medium",
    affectedStocks: ["AAPL", "QCOM", "SWKS"],
    sentiment: "positive",
    summary: "Apple expected to announce new products and services",
    sources: ["MacRumors", "9to5Mac", "r/apple"],
  },
]

export function TrendingContent() {
  return (
    <div className="space-y-8">
      {/* Trending Stocks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Stocks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockTrendingStocks.map((stock) => (
            <motion.div
              key={stock.symbol}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-2">{stock.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={
                          stock.sentiment === "very positive" 
                            ? "success" 
                            : stock.sentiment === "positive" 
                              ? "default" 
                              : "warning"
                        }
                      >
                        {stock.sentiment}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">${stock.currentPrice}</span>
                      <span className={`text-lg ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex gap-4">
                        <span>Vol: {stock.volume.toLocaleString()}</span>
                        <span>Mkt Cap: {stock.marketCap}</span>
                      </div>
                      <span>Mentions: {stock.mentions.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stock.sources.map((source, index) => (
                        <Badge key={index} variant="secondary">{source}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Important Events Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid gap-4">
          {mockImportantEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{event.title}</span>
                    <div className="flex gap-2">
                      <Badge 
                        variant={
                          event.impact === "high" 
                            ? "destructive" 
                            : event.impact === "medium" 
                              ? "warning" 
                              : "default"
                        }
                      >
                        {event.impact} impact
                      </Badge>
                      <Badge variant="outline">{event.date}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">{event.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.affectedStocks.map((stock) => (
                        <Badge key={stock} variant="secondary">{stock}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.sources.map((source, index) => (
                        <Badge key={index} variant="outline">{source}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
} 