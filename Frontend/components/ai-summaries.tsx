import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for AI summarizations
const mockSummaries = [
  {
    id: 1,
    title: "Market Overview",
    summary: "The market sentiment appears to be cautiously optimistic, with key indicators showing a positive trend. Major tech stocks are leading the charge, while traditional sectors remain stable.",
    confidence: "High",
    timestamp: "2024-03-20 14:30",
  },
  {
    id: 2,
    title: "Social Media Sentiment",
    summary: "Reddit and Twitter discussions show increased interest in AI-related stocks. The sentiment is particularly strong around companies with upcoming product launches.",
    confidence: "Medium",
    timestamp: "2024-03-20 14:15",
  },
  {
    id: 3,
    title: "Forum Insights",
    summary: "Trading forums indicate growing interest in renewable energy stocks. Several key influencers are discussing potential breakout opportunities in the sector.",
    confidence: "High",
    timestamp: "2024-03-20 14:00",
  },
]

export function AISummaries() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI Market Insights</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockSummaries.map((summary) => (
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
        ))}
      </div>
    </div>
  )
} 