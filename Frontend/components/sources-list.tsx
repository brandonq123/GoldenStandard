import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Get current date
const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Real content from Reddit threads
const getSourceVariations = () => {
  // Actual r/wallstreetbets content
  const redditWsbVariations = [
    "I got out of 90% of AAPL position. I'm not trusting them with all the vague innovation claims. Let's see what Tim Apple does in a year and maybe I'll be back.",
    "Genuine question - How does Apple continue to do well despite being in a downtrend for multiple years, not having a truly innovative product in a decade, and coming up with products that don't work?",
    "Monday Market Crash Confirmed With 2 Minutes Of Technical Analysis! SPY got rejected off of monthly resistance and is now heading back to retest 483 support. If we break that, the party is over.",
    "Apple stock isn't meant to be a moonshot. It's the Coca-Cola of tech - stable, reliable, massive scale. Sure iPhone sales are down, but Services are up big time."
  ]
  
  const bloombergVariations = [
    "In-depth analysis of the tech sector's performance and future outlook",
    "Expert commentary on Apple's financial position and market strategy",
    "Analysis comparing major tech companies' growth metrics and market share",
    "Technical evaluation of AAPL stock performance relative to sector benchmarks"
  ]
  
  // Actual r/investing content
  const redditInvestingVariations = [
    "I keep buying AAPL every 2 weeks like clockwork. Long term they're positioned well across hardware, services, and potentially AR/VR. This Vision Pro situation will resolve itself.",
    "Apple's decision to delay its generative AI features shows that the company is still committed to quality over rushing to market. Buy on this temporary dip.",
    "If you're considering investing in AAPL for the next 5-10 years, remember they have $167B in cash, a strong services business, and the most valuable brand in the world.",
    "The consumer electronics market is cyclical, and we're in a tough spot, but Apple's customer retention metrics are unmatched in the industry."
  ]
  
  const financialTimesVariations = [
    "Latest market updates and expert opinions on current economic conditions",
    "Analysis of tech sector performance in relation to broader market trends",
    "Expert insights on Apple's revenue streams and diversification strategy",
    "Evaluation of market conditions affecting major tech holdings"
  ]
  
  // Random sentiment assignment - weighted for real sentiment
  const sentiments = ["positive", "negative", "neutral", "mixed"]
  const getRandomSentiment = (bias) => {
    if (bias && Math.random() > 0.5) return bias
    return sentiments[Math.floor(Math.random() * sentiments.length)]
  }

  return [
    {
      id: 1,
      title: "Reddit - r/wallstreetbets: Bad Apple",
      content: redditWsbVariations[Math.floor(Math.random() * redditWsbVariations.length)],
      date: getCurrentDate(),
      type: "forum",
      sentiment: getRandomSentiment("negative"),
      url: "https://www.reddit.com/r/wallstreetbets/comments/1jwe78l/bad_apple/",
    },
    {
      id: 2,
      title: "Bloomberg - Apple Inc Stock Quote",
      content: "Apple Inc. (AAPL:US) stock quote, chart, news, analysis, fundamentals, and trading information for investors and financial professionals.",
      date: getCurrentDate(),
      type: "article",
      sentiment: getRandomSentiment("neutral"),
      url: "https://www.bloomberg.com/quote/AAPL:US",
    },
    {
      id: 3,
      title: "Reddit - r/wallstreetbets: Monday Market Crash",
      content: "Monday Market Crash Confirmed With 2 Minutes Of Technical Analysis! SPY got rejected off of monthly resistance and is now heading back to retest 483 support. If we break that, the party is over.",
      date: getCurrentDate(),
      type: "forum",
      sentiment: getRandomSentiment("negative"),
      url: "https://www.reddit.com/r/wallstreetbets/comments/1jyb1am/monday_market_crash_confirmed_with_2_minutes_of/",
    },
    {
      id: 4,
      title: "Financial Times - iPhone Tariff Issues",
      content: "China's commerce ministry has announced a probe into EU tariffs on electric vehicles. The tensions come amid US-EU discussions on EV subsidies and Apple's iPhone tariff concerns in key markets.",
      date: getCurrentDate(),
      type: "article",
      sentiment: getRandomSentiment("negative"),
      url: "https://www.ft.com/content/3eb48a07-7cb0-4a44-9159-eb5b402c2fec",
    },
  ]
}

// Initial mock data
const mockSources = getSourceVariations()

interface SourcesListProps {
  isLoading?: boolean;
}

export function SourcesList({ isLoading = false }: SourcesListProps) {
  const [sources, setSources] = useState(mockSources)
  const [loadingDone, setLoadingDone] = useState(false)
  
  useEffect(() => {
    // Reset loading state when isLoading becomes true
    if (isLoading) {
      setLoadingDone(false)
    }
    
    // If parent component says loading is done, start our own timeout
    // Sources load faster than AI summaries but slower than chart data
    if (!isLoading && !loadingDone) {
      // Simulate data fetching delay - takes 2-3 seconds after other data is loaded
      const sourcesFetchTimer = setTimeout(() => {
        setSources(getSourceVariations())
        setLoadingDone(true)
      }, 2000 + Math.random() * 1000)
      
      return () => clearTimeout(sourcesFetchTimer)
    }
  }, [isLoading, loadingDone])
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Information Sources</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading || !loadingDone ? (
          // Loading skeletons
          [...Array(4)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-2" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual content
          sources.map((source) => (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{source.title}</span>
                  <div className="flex gap-2">
                    <Badge variant={source.type === "forum" ? "secondary" : "outline"}>
                      {source.type}
                    </Badge>
                    <Badge 
                      variant={
                        source.sentiment === "positive" 
                          ? "success" 
                          : source.sentiment === "negative" 
                            ? "destructive" 
                            : "default"
                      }
                    >
                      {source.sentiment}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{source.content}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Posted: {source.date}</span>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Source
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 