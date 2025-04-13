import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Mock data for trending topics
const mockTrendingTopics = [
  {
    id: 1,
    title: "AI Stocks Surge After New Breakthrough",
    subreddit: "r/wallstreetbets",
    upvotes: 12500,
    comments: 850,
    sentiment: "positive",
    trend: "rising",
    timeAgo: "2h",
  },
  {
    id: 2,
    title: "Market Correction Discussion Thread",
    subreddit: "r/investing",
    upvotes: 8900,
    comments: 1200,
    sentiment: "mixed",
    trend: "stable",
    timeAgo: "4h",
  },
  {
    id: 3,
    title: "New Tech IPO Analysis",
    subreddit: "r/stocks",
    upvotes: 7500,
    comments: 600,
    sentiment: "positive",
    trend: "rising",
    timeAgo: "6h",
  },
]

// Mock data for buzz-worthy discussions
const mockBuzzWorthy = [
  {
    id: 1,
    title: "Breaking: Major Tech Company Acquisition",
    subreddit: "r/wallstreetbets",
    upvotes: 15000,
    comments: 2000,
    sentiment: "positive",
    momentum: "high",
    timeAgo: "1h",
  },
  {
    id: 2,
    title: "Market Manipulation Investigation",
    subreddit: "r/investing",
    upvotes: 12000,
    comments: 1800,
    sentiment: "negative",
    momentum: "high",
    timeAgo: "3h",
  },
]

// Mock data for past events
const mockPastEvents = [
  {
    id: 1,
    title: "Fed Interest Rate Decision",
    date: "2024-03-15",
    impact: "high",
    sentiment: "neutral",
    summary: "Federal Reserve announced interest rate decision, causing market volatility",
  },
  {
    id: 2,
    title: "Tech Earnings Season",
    date: "2024-03-10",
    impact: "medium",
    sentiment: "mixed",
    summary: "Major tech companies reported earnings, with mixed results across the sector",
  },
  {
    id: 3,
    title: "Crypto Market Rally",
    date: "2024-03-05",
    impact: "high",
    sentiment: "positive",
    summary: "Cryptocurrency market experienced significant gains following regulatory clarity",
  },
]

export function ForumContent() {
  return (
    <div className="space-y-8">
      {/* Trending Topics Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
        <div className="grid gap-4">
          {mockTrendingTopics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{topic.title}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{topic.subreddit}</Badge>
                      <Badge 
                        variant={
                          topic.sentiment === "positive" 
                            ? "success" 
                            : topic.sentiment === "negative" 
                              ? "destructive" 
                              : "default"
                        }
                      >
                        {topic.sentiment}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>↑ {topic.upvotes.toLocaleString()}</span>
                      <span>💬 {topic.comments.toLocaleString()}</span>
                    </div>
                    <span>{topic.timeAgo} ago</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Buzz-Worthy Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What's Gaining Buzz</h2>
        <div className="grid gap-4">
          {mockBuzzWorthy.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{topic.title}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{topic.subreddit}</Badge>
                      <Badge variant="destructive">🔥 Hot</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>↑ {topic.upvotes.toLocaleString()}</span>
                      <span>💬 {topic.comments.toLocaleString()}</span>
                    </div>
                    <span>{topic.timeAgo} ago</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Past Events Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Past Events</h2>
        <div className="grid gap-4">
          {mockPastEvents.map((event) => (
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
                  <p className="text-muted-foreground">{event.summary}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
} 