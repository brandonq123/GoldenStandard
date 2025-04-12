"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StockData } from "@/lib/types"
import { CommentList } from "@/components/comment-list"
import { generateComments } from "@/lib/mock-data"

interface SentimentTabsProps {
  stock: StockData
}

export function SentimentTabs({ stock }: SentimentTabsProps) {
  // Ensure stock is defined
  if (!stock) {
    return null // Return null if stock is undefined
  }

  // Generate mock comments for each source
  const wsbComments = generateComments(stock, "wsb", 5)
  const twitterComments = generateComments(stock, "twitter", 5)
  const newsComments = generateComments(stock, "news", 5)

  return (
    <Tabs defaultValue="wsb">
      <TabsList className="grid w-full grid-cols-3 md:w-auto">
        <TabsTrigger value="wsb">r/WallStreetBets</TabsTrigger>
        <TabsTrigger value="twitter">Twitter</TabsTrigger>
        <TabsTrigger value="news">News</TabsTrigger>
      </TabsList>
      <TabsContent value="wsb">
        <Card>
          <CardContent className="p-4 pt-6">
            <CommentList comments={wsbComments} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="twitter">
        <Card>
          <CardContent className="p-4 pt-6">
            <CommentList comments={twitterComments} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="news">
        <Card>
          <CardContent className="p-4 pt-6">
            <CommentList comments={newsComments} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
