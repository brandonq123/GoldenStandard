import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Mock API data structure for trending stocks with updated prices
const mockTrendingStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 198.14,
    change: 2.34,
    changePercent: 1.18,
    volume: 45678900,
    marketCap: "2.87T",
    sentiment: "positive",
    mentions: 12500,
    sources: ["r/wallstreetbets", "r/stocks", "r/investing"],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    currentPrice: 920.75,
    change: 15.85,
    changePercent: 1.72,
    volume: 34567800,
    marketCap: "2.27T",
    sentiment: "very positive",
    mentions: 9800,
    sources: ["r/wallstreetbets", "r/stocks"],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    currentPrice: 172.63,
    change: -3.21,
    changePercent: -1.75,
    volume: 56789000,
    marketCap: "551.4B",
    sentiment: "mixed",
    mentions: 8500,
    sources: ["r/wallstreetbets", "r/stocks"],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 417.23,
    change: -1.85,
    changePercent: -0.44,
    volume: 23456700,
    marketCap: "3.10T",
    sentiment: "positive",
    mentions: 7200,
    sources: ["r/stocks", "r/investing"],
  },
]

// Get current date for realistic event dates
const today = new Date();
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Mock API data structure for important events with updated dates
const mockImportantEvents = [
  {
    id: 1,
    title: "Fed Interest Rate Decision",
    date: formatDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)), // 14 days from now
    impact: "high",
    affectedStocks: ["^GSPC", "^DJI", "^IXIC"],
    sentiment: "neutral",
    summary: "Federal Reserve to announce interest rate decision, potentially affecting market volatility",
    sources: ["Bloomberg", "Reuters", "CNBC"],
  },
  {
    id: 2,
    title: "NVIDIA GTC Conference",
    date: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
    impact: "high",
    affectedStocks: ["NVDA", "AMD", "INTC"],
    sentiment: "positive",
    summary: "NVIDIA's annual GTC conference expected to showcase new AI developments",
    sources: ["TechCrunch", "The Verge", "r/wallstreetbets"],
  },
  {
    id: 3,
    title: "Apple iPhone Tariff Decision",
    date: formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)), // 8 days from now
    impact: "medium",
    affectedStocks: ["AAPL", "QCOM", "SWKS"],
    sentiment: "negative",
    summary: "Decision expected on potential iPhone tariffs in key markets, possibly affecting Apple's market position",
    sources: ["Financial Times", "Bloomberg", "r/apple"],
  },
]

import { Skeleton } from "@/components/ui/skeleton"

interface TrendingContentProps {
  isLoading?: boolean;
}

export function TrendingContent({ isLoading = false }: TrendingContentProps) {
  return (
    <div className="space-y-8">
      {/* Trending Stocks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Stocks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
            // Loading skeletons for trending stocks
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={`stock-skeleton-${index}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual trending stocks content
            mockTrendingStocks.map((stock) => (
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
                        <span className="text-2xl font-bold">${stock.currentPrice.toFixed(2)}</span>
                        <span className={`text-lg ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
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
            ))
          )}
        </div>
      </section>

      {/* Important Events Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid gap-4">
          {isLoading ? (
            // Loading skeletons for events
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`event-skeleton-${index}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Skeleton className="h-6 w-64" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-28 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual events content
            mockImportantEvents.map((event) => (
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
            ))
          )}
        </div>
      </section>
    </div>
  )
} 