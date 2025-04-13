import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for sources
const mockSources = [
  {
    id: 1,
    title: "Reddit - r/wallstreetbets",
    content: "Discussion about recent market trends and potential opportunities in tech stocks",
    date: "2024-03-20",
    type: "forum",
    sentiment: "positive",
    url: "https://reddit.com/r/wallstreetbets/thread123",
  },
  {
    id: 2,
    title: "Bloomberg - Tech Sector Analysis",
    content: "In-depth analysis of the tech sector's performance and future outlook",
    date: "2024-03-19",
    type: "article",
    sentiment: "neutral",
    url: "https://bloomberg.com/tech-analysis",
  },
  {
    id: 3,
    title: "Reddit - r/investing",
    content: "Community discussion about long-term investment strategies and market indicators",
    date: "2024-03-19",
    type: "forum",
    sentiment: "mixed",
    url: "https://reddit.com/r/investing/thread456",
  },
  {
    id: 4,
    title: "Financial Times - Market Update",
    content: "Latest market updates and expert opinions on current economic conditions",
    date: "2024-03-18",
    type: "article",
    sentiment: "neutral",
    url: "https://ft.com/market-update",
  },
]

export function SourcesList() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Information Sources</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {mockSources.map((source) => (
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
        ))}
      </div>
    </div>
  )
} 