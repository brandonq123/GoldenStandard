import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Generate current date for realistic post times
const getTimeAgo = (hoursAgo) => {
  const options = { month: 'short', day: 'numeric' };
  const date = new Date();
  if (hoursAgo < 24) {
    return `${hoursAgo}h`;
  } else {
    date.setHours(date.getHours() - hoursAgo);
    return date.toLocaleDateString('en-US', options);
  }
};

// Generate past dates
const getPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mock data for trending topics - updated with real Reddit threads
const mockTrendingTopics = [
  {
    id: 1,
    title: "Monday Market Crash Confirmed With 2 Minutes Of Technical Analysis!",
    subreddit: "r/wallstreetbets",
    upvotes: 6842,
    comments: 785,
    sentiment: "negative",
    trend: "rising",
    timeAgo: getTimeAgo(3),
    url: "https://www.reddit.com/r/wallstreetbets/comments/1jyb1am/monday_market_crash_confirmed_with_2_minutes_of/"
  },
  {
    id: 2,
    title: "Bad Apple!",
    subreddit: "r/wallstreetbets",
    upvotes: 4532,
    comments: 642,
    sentiment: "negative",
    trend: "stable",
    timeAgo: getTimeAgo(8),
    url: "https://www.reddit.com/r/wallstreetbets/comments/1jwe78l/bad_apple/"
  },
  {
    id: 3,
    title: "Why AMD will reach $200 by EOY",
    subreddit: "r/stocks",
    upvotes: 3215,
    comments: 427,
    sentiment: "positive",
    trend: "rising",
    timeAgo: getTimeAgo(12),
    url: "https://www.reddit.com/r/stocks/"
  },
]

// Mock data for buzz-worthy discussions
const mockBuzzWorthy = [
  {
    id: 1,
    title: "NVIDIA is now the second most valuable company in the world",
    subreddit: "r/wallstreetbets",
    upvotes: 21835,
    comments: 2467,
    sentiment: "positive",
    momentum: "high",
    timeAgo: getTimeAgo(5),
    url: "https://www.reddit.com/r/wallstreetbets/"
  },
  {
    id: 2,
    title: "Chinese tariffs on iPhones spell trouble for Apple",
    subreddit: "r/investing",
    upvotes: 15432,
    comments: 1853,
    sentiment: "negative",
    momentum: "high",
    timeAgo: getTimeAgo(7),
    url: "https://www.reddit.com/r/investing/"
  },
]

// Mock data for past events
const mockPastEvents = [
  {
    id: 1,
    title: "Fed Interest Rate Decision - Rates Unchanged",
    date: getPastDate(14),
    impact: "high",
    sentiment: "neutral",
    summary: "Federal Reserve kept interest rates unchanged, signaling potential cuts later in the year if inflation continues to cool",
  },
  {
    id: 2,
    title: "NVIDIA GTC Conference",
    date: getPastDate(21),
    impact: "high",
    sentiment: "positive",
    summary: "NVIDIA's GTC conference showcased new Blackwell architecture, driving significant stock momentum across the AI sector",
  },
  {
    id: 3,
    title: "Apple Vision Pro Launch",
    date: getPastDate(35),
    impact: "medium",
    sentiment: "mixed",
    summary: "Apple's Vision Pro headset launched with mixed reception - impressive technology but questions about mass market appeal",
  },
]

import { Skeleton } from "@/components/ui/skeleton"

interface ForumContentProps {
  isLoading?: boolean;
}

export function ForumContent({ isLoading = false }: ForumContentProps) {
  return (
    <div className="space-y-8">
      {/* Trending Topics Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
        <div className="grid gap-4">
          {isLoading ? (
            // Loading skeletons for trending topics
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`topic-skeleton-${index}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-32 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual trending topics
            mockTrendingTopics.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <a 
                        href={topic.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-lg hover:underline hover:text-primary"
                      >
                        {topic.title}
                      </a>
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
                      <span>{topic.timeAgo}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Buzz-Worthy Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What's Gaining Buzz</h2>
        <div className="grid gap-4">
          {isLoading ? (
            // Loading skeletons for buzz-worthy topics
            Array.from({ length: 2 }).map((_, index) => (
              <Card key={`buzz-skeleton-${index}`} className="hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-32 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual buzz-worthy content
            mockBuzzWorthy.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <a 
                        href={topic.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-lg hover:underline hover:text-primary"
                      >
                        {topic.title}
                      </a>
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
                      <span>{topic.timeAgo}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Past Events</h2>
        <div className="grid gap-4">
          {isLoading ? (
            // Loading skeletons for past events
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
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual past events
            mockPastEvents.map((event) => (
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
            ))
          )}
        </div>
      </section>
    </div>
  )
} 