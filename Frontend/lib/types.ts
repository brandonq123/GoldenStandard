export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  sentiment: "bullish" | "bearish" | "neutral"
  mentions: number
}

export interface Comment {
  id: string
  author: string
  content: string
  upvotes: number
  replies: number
  time: string
  sentiment: "bullish" | "bearish" | "neutral"
  isInfluential: boolean
  source: "wsb" | "twitter" | "news"
}

export interface MarketDataPoint {
  time: string
  value: number
}

export interface PriceDataPoint {
  time: string
  price: number
}

export interface SocialPost {
  id: string
  author: string
  content: string
  likes: number
  replies: number
  timestamp: string
  source: "twitter" | "reddit" | "news"
  stockMentions: string[]
  sentiment?: "bullish" | "bearish" | "neutral"
}
