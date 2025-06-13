import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Get current date and time for timestamp
const getCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// Mock data for AI summarizations
const mockSummaries = [
  {
    id: 1,
    title: "Market Overview",
    summary: "The market sentiment appears to be cautiously optimistic, with key indicators showing a positive trend. Major tech stocks are leading the charge, while traditional sectors remain stable.",
    confidence: "High",
    timestamp: getCurrentDateTime(),
  },
  {
    id: 2,
    title: "Social Media Sentiment",
    summary: "Reddit and Twitter discussions show increased interest in AI-related stocks. The sentiment is particularly strong around companies with upcoming product launches.",
    confidence: "Medium",
    timestamp: getCurrentDateTime(),
  },
  {
    id: 3,
    title: "Forum Insights",
    summary: "Trading forums indicate growing interest in renewable energy stocks. Several key influencers are discussing potential breakout opportunities in the sector.",
    confidence: "High",
    timestamp: getCurrentDateTime(),
  },
]

interface AISummariesProps {
  isLoading?: boolean;
}

// Generate slightly different summaries for each reload
const getSummaryVariations = () => {
  const marketOverviewVariations = [
    "The market sentiment appears to be cautiously optimistic, with key indicators showing a positive trend. Major tech stocks are leading the charge, while traditional sectors remain stable.",
    "Analysis indicates a cautiously bullish market environment. Technical indicators suggest continued upward momentum, especially in technology and healthcare sectors.",
    "Market indicators point to an optimistic outlook with strong buying pressure. Leading tech stocks continue to outperform broader indices and supporting the overall uptrend.",
    "Current market analysis suggests a carefully optimistic sentiment with improving technical indicators. The tech sector continues to show strength while financials are consolidating.",
  ]

  const socialMediaVariations = [
    "Reddit and Twitter discussions show increased interest in AI-related stocks. The sentiment is particularly strong around companies with upcoming product launches.",
    "Social media activity indicates growing enthusiasm for AI technologies and related companies. Discussions are focused on upcoming product releases and technological breakthroughs.",
    "Social platforms are buzzing with interest in artificial intelligence stocks. Sentiment analysis shows particularly positive reactions to recent AI advancements and upcoming launches.",
    "Analysis of social networks reveals heightened attention to AI and robotics companies, with a notable focus on businesses with imminent product or service announcements.",
  ]

  const forumVariations = [
    "Trading forums indicate growing interest in renewable energy stocks. Several key influencers are discussing potential breakout opportunities in the sector.",
    "Investment forums show increasing discussion around green energy companies. Multiple respected analysts have highlighted potential growth opportunities in the sector.",
    "Forum activity suggests rising attention to sustainable energy stocks. Several widely-followed traders are identifying potential value plays in this growing market.",
    "Trading communities are showing elevated interest in clean energy investments. Discussion volume has increased significantly with several potential breakout candidates identified.",
  ]

  return [
    {
      id: 1,
      title: "Market Overview",
      summary: marketOverviewVariations[Math.floor(Math.random() * marketOverviewVariations.length)],
      confidence: Math.random() > 0.3 ? "High" : "Medium",
      timestamp: getCurrentDateTime(),
    },
    {
      id: 2,
      title: "Social Media Sentiment",
      summary: socialMediaVariations[Math.floor(Math.random() * socialMediaVariations.length)],
      confidence: Math.random() > 0.5 ? "Medium" : "High",
      timestamp: getCurrentDateTime(),
    },
    {
      id: 3,
      title: "Forum Insights",
      summary: forumVariations[Math.floor(Math.random() * forumVariations.length)],
      confidence: Math.random() > 0.3 ? "High" : "Medium",
      timestamp: getCurrentDateTime(),
    },
  ]
}

export function AISummaries({ isLoading = false }: AISummariesProps) {
  const [summaries, setSummaries] = useState(mockSummaries)
  const [loadingDone, setLoadingDone] = useState(false)
  
  useEffect(() => {
    // Reset loading state when isLoading becomes true
    if (isLoading) {
      setLoadingDone(false)
    }
    
    // If parent component says loading is done, start our own longer timeout
    // This simulates AI analysis taking longer than basic data fetching
    if (!isLoading && !loadingDone) {
      // Simulate AI processing delay - takes 4-6 seconds after other data is loaded
      const aiProcessingTimer = setTimeout(() => {
        setSummaries(getSummaryVariations())
        setLoadingDone(true)
      }, 4000 + Math.random() * 2000)
      
      return () => clearTimeout(aiProcessingTimer)
    }
  }, [isLoading, loadingDone])
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI Market Insights</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || !loadingDone ? (
          // Loading skeletons
          [...Array(3)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual content
          summaries.map((summary) => (
            <Card key={summary.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{summary.title}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    summary.confidence === "High" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {summary.confidence} Confidence
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{summary.summary}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Updated: {summary.timestamp}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 