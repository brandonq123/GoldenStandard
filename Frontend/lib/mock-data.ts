import type { StockData, Comment, MarketDataPoint, PriceDataPoint, SocialPost } from "./types"

// Mock stock data
export const mockStockData: StockData[] = [
  {
    symbol: "GME",
    name: "GameStop Corp.",
    price: 142.68,
    change: 12.43,
    sentiment: "bullish",
    mentions: 1243,
  },
  {
    symbol: "AMC",
    name: "AMC Entertainment Holdings Inc.",
    price: 36.72,
    change: 8.21,
    sentiment: "bullish",
    mentions: 987,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 712.45,
    change: -2.34,
    sentiment: "neutral",
    mentions: 756,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 198.15,
    change: 0.87,
    sentiment: "bullish",
    mentions: 543,
  },
  {
    symbol: "PLTR",
    name: "Palantir Technologies Inc.",
    price: 24.32,
    change: -1.23,
    sentiment: "bearish",
    mentions: 432,
  },
  {
    symbol: "BB",
    name: "BlackBerry Limited",
    price: 10.76,
    change: 3.45,
    sentiment: "bullish",
    mentions: 321,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 198.65,
    change: 2.12,
    sentiment: "bullish",
    mentions: 298,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 287.93,
    change: 0.54,
    sentiment: "neutral",
    mentions: 276,
  },
]

// Generate market data
export const marketData: MarketDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return {
    time: `${hour}:00`,
    value: 4200 + Math.random() * 200,
  }
})

// Generate stock price data
export function generateStockPriceData(basePrice: number): PriceDataPoint[] {
  const price = basePrice || 100 // Default to 100 if basePrice is undefined
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    const randomFactor = (Math.random() - 0.5) * 0.05
    return {
      time: `${hour}:00`,
      price: price * (1 + randomFactor),
    }
  })
}

// Generate comments
export function generateComments(stock: StockData, source: "wsb" | "twitter" | "news", count: number): Comment[] {
  if (!stock) {
    // Return empty array with default structure if stock is undefined
    return Array.from({ length: count }, (_, i) => ({
      id: `${source}-default-${i}`,
      author: "Anonymous",
      content: "No content available",
      upvotes: 0,
      replies: 0,
      time: "0h ago",
      sentiment: "neutral",
      isInfluential: false,
      source,
    }))
  }

  const symbol = stock.symbol || "STOCK"
  const name = stock.name || "Company"

  const bullishPhrases = [
    `${symbol} is going to the moon! 🚀🚀🚀`,
    `Just bought more ${symbol}, this is going to print money`,
    `${symbol} earnings will crush expectations, mark my words`,
    `Diamond hands on ${symbol}, not selling until $1000`,
    `${name} has massive potential, extremely bullish`,
    `${symbol} short squeeze incoming, hedgies are scared`,
  ]

  const bearishPhrases = [
    `${symbol} is way overvalued, this is going to crash hard`,
    `Just shorted ${symbol}, free money`,
    `${name} earnings will disappoint, mark my words`,
    `${symbol} is a pump and dump, get out while you can`,
    `${name} has serious competition problems, bearish`,
    `${symbol} insiders are selling, that tells you everything`,
  ]

  const neutralPhrases = [
    `${symbol} might go either way, watching closely`,
    `Holding ${symbol} but with tight stop losses`,
    `${name} has both upside and downside potential`,
    `Not sure about ${symbol} right now, need more data`,
    `${name} is fairly valued at current prices`,
    `${symbol} is consolidating, waiting for a breakout`,
  ]

  return Array.from({ length: count }, (_, i) => {
    const id = `${source}-${stock.symbol}-${i}`
    const isInfluential = Math.random() > 0.7
    const upvotes = Math.floor(Math.random() * 1000) + (isInfluential ? 500 : 0)
    const replies = Math.floor(Math.random() * 50)
    const hours = Math.floor(Math.random() * 12) + 1
    const time = `${hours}h ago`

    // Determine sentiment based on stock's overall sentiment but with some randomness
    let sentiment: "bullish" | "bearish" | "neutral"
    const rand = Math.random()

    if (stock.sentiment === "bullish") {
      sentiment = rand < 0.7 ? "bullish" : rand < 0.9 ? "neutral" : "bearish"
    } else if (stock.sentiment === "bearish") {
      sentiment = rand < 0.7 ? "bearish" : rand < 0.9 ? "neutral" : "bullish"
    } else {
      sentiment = rand < 0.4 ? "neutral" : rand < 0.7 ? "bullish" : "bearish"
    }

    // Select content based on sentiment
    let content: string
    if (sentiment === "bullish") {
      content = bullishPhrases[Math.floor(Math.random() * bullishPhrases.length)]
    } else if (sentiment === "bearish") {
      content = bearishPhrases[Math.floor(Math.random() * bearishPhrases.length)]
    } else {
      content = neutralPhrases[Math.floor(Math.random() * neutralPhrases.length)]
    }

    // Generate random author names
    const authors = [
      "DiamondHands",
      "WSBLegend",
      "MoonRocket",
      "StockGuru",
      "TradeMaster",
      "InvestorPro",
      "MarketWhiz",
      "TrendTrader",
    ]
    const author = authors[Math.floor(Math.random() * authors.length)] + Math.floor(Math.random() * 1000)

    return {
      id,
      author,
      content,
      upvotes,
      replies,
      time,
      sentiment,
      isInfluential,
      source,
    }
  })
}

// Generate social posts
export function generateSocialPosts(source: "twitter" | "reddit" | "news", count: number): SocialPost[] {
  // Twitter content templates
  const twitterContent = [
    "Just bought more $STOCK! The earnings report looks promising. #investing",
    "Watching $STOCK closely. The technical indicators are showing a potential breakout pattern.",
    "$STOCK is trending on StockTwits today. Lots of bullish sentiment.",
    "Anyone else following $STOCK? The new product announcement could be a game changer.",
    "Sold my $STOCK position today. Taking profits after the recent run-up.",
    "$STOCK and $OTHERSTOCK are my top picks for this quarter. Both have strong fundamentals.",
    "The market is down but $STOCK is holding strong. Good sign of strength.",
    "$STOCK just broke through resistance. Looking for continuation tomorrow.",
    "Analyst upgrade on $STOCK this morning. Price target raised to $TARGET.",
    "$STOCK is getting crushed after earnings. Missed expectations by $AMOUNT.",
  ]

  // Reddit content templates
  const redditContent = [
    "DD on $STOCK: I've been researching this company for weeks and here's why I think it's undervalued...",
    "What's everyone's thoughts on $STOCK after today's price action? Seems like institutions are accumulating.",
    "YOLO update: Just put my life savings into $STOCK calls expiring this Friday. Wish me luck!",
    "$STOCK technical analysis: The weekly chart is showing a cup and handle pattern that could lead to a breakout.",
    "Why I'm bearish on $STOCK: The company's debt levels are concerning and competition is increasing.",
    "Insider buying at $STOCK - executives purchased $AMOUNT worth of shares last week. Bullish signal?",
    "I've been holding $STOCK for 2 years now. Up over 300% and still not selling. Diamond hands!",
    "$STOCK vs $OTHERSTOCK - comprehensive comparison of financials and growth prospects.",
    "Loss porn: My $STOCK options expired worthless today. $AMOUNT down the drain.",
    "The $STOCK short squeeze is just getting started. Short interest is still over 20%!",
  ]

  // News content templates
  const newsContent = [
    "$STOCK Reports Q3 Earnings: Revenue up 15%, EPS beats estimates by $0.12",
    "$STOCK Announces New Partnership with $OTHERSTOCK to Expand Market Reach",
    "Analyst Initiates Coverage of $STOCK with 'Buy' Rating and $TARGET Price Target",
    "$STOCK CEO Steps Down Amid Controversy; Shares Fall 8% in After-Hours Trading",
    "$STOCK Completes Acquisition of $OTHERSTOCK for $AMOUNT Billion",
    "Federal Investigation into $STOCK Practices Sends Shares Tumbling",
    "$STOCK Unveils New Product Line at Annual Conference; Analysts Optimistic",
    "Market Volatility Hits Tech Sector; $STOCK Among Hardest Hit",
    "$STOCK Raises Full-Year Guidance After Strong Quarter; Shares Surge",
    "$STOCK Announces Stock Split and Dividend Increase; Shareholders Rejoice",
  ]

  // Select content templates based on source
  let contentTemplates: string[]
  if (source === "twitter") {
    contentTemplates = twitterContent
  } else if (source === "reddit") {
    contentTemplates = redditContent
  } else {
    contentTemplates = newsContent
  }

  // Generate random posts
  return Array.from({ length: count }, (_, i) => {
    const id = `${source}-${i}-${Date.now()}`

    // Random stock mentions (1-3 stocks)
    const stockCount = Math.floor(Math.random() * 3) + 1
    const stockMentions: string[] = []
    for (let j = 0; j < stockCount; j++) {
      const randomStock = mockStockData[Math.floor(Math.random() * mockStockData.length)]
      if (!stockMentions.includes(randomStock.symbol)) {
        stockMentions.push(randomStock.symbol)
      }
    }

    // Get random content template and replace placeholders
    let content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)]

    // Replace $STOCK with the first stock mention
    content = content.replace(/\$STOCK/g, stockMentions[0])

    // Replace $OTHERSTOCK with another stock if available
    if (stockMentions.length > 1) {
      content = content.replace(/\$OTHERSTOCK/g, stockMentions[1])
    } else {
      content = content.replace(/\$OTHERSTOCK/g, mockStockData[Math.floor(Math.random() * mockStockData.length)].symbol)
    }

    // Replace other placeholders
    content = content.replace(/\$AMOUNT/g, (Math.random() * 10).toFixed(2))
    content = content.replace(/\$TARGET/g, (Math.random() * 500 + 50).toFixed(2))

    // Random author names based on source
    let authorPrefix: string
    if (source === "twitter") {
      authorPrefix = ["trader", "investor", "stocks", "finance", "market"][Math.floor(Math.random() * 5)]
    } else if (source === "reddit") {
      authorPrefix = ["wallstreetbets", "investing", "stocks", "thetagang", "options"][Math.floor(Math.random() * 5)]
    } else {
      authorPrefix = ["MarketWatch", "Bloomberg", "CNBC", "Reuters", "FinancialTimes"][Math.floor(Math.random() * 5)]
    }
    const author = `${authorPrefix}_${Math.floor(Math.random() * 1000)}`

    // Random likes and replies
    const likes = Math.floor(Math.random() * 1000)
    const replies = Math.floor(Math.random() * 100)

    // Random timestamp within the last 24 hours
    const now = new Date()
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString()

    // Random sentiment
    const sentiments: ("bullish" | "bearish" | "neutral")[] = ["bullish", "bearish", "neutral"]
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

    return {
      id,
      author,
      content,
      likes,
      replies,
      timestamp,
      source,
      stockMentions,
      sentiment,
    }
  })
}
