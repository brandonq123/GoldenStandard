// Generate realistic AAPL stock patterns
// Current price: $198.14

// This function creates realistic-looking data with patterns resembling real market data
function generateRealisticStockData(endPrice: number, periods: number, patternType: string, volatilityLevel: 'low' | 'medium' | 'high' = 'medium') {
  const data = []
  
  // Set volatility based on time period
  const volatilityMap = {
    low: { daily: 0.5, daily_range: 1.2, trend_change: 0.03 },
    medium: { daily: 1.2, daily_range: 1.8, trend_change: 0.05 },
    high: { daily: 2.0, daily_range: 3.0, trend_change: 0.08 }
  }
  
  const volatility = volatilityMap[volatilityLevel]
  
  // Different patterns for different timeframes
  const patterns = {
    // Intraday - slight uptrend with normal volatility
    intraday: {
      priceChange: 0.8,
      startPrice: endPrice - 0.8,
      baseVolatility: volatility.daily,
      trendChangeProbability: volatility.trend_change
    },
    // Week - slight up and down
    weekly: {
      priceChange: -1.5,
      startPrice: endPrice + 1.5,
      baseVolatility: volatility.daily * 1.5,
      trendChangeProbability: volatility.trend_change * 1.2
    },
    // Month - generally trending upward
    monthly: {
      priceChange: -3.2,
      startPrice: endPrice + 3.2,
      baseVolatility: volatility.daily * 1.8,
      trendChangeProbability: volatility.trend_change * 1.3
    },
    // 3 Month - more volatility with net small gain
    threeMonth: {
      priceChange: -5.4,
      startPrice: endPrice + 5.4,
      baseVolatility: volatility.daily * 2.2,
      trendChangeProbability: volatility.trend_change * 1.5
    },
    // 1 Year - overall uptrend with corrections
    yearly: {
      priceChange: -42.6,
      startPrice: endPrice + 42.6,
      baseVolatility: volatility.daily * 3,
      trendChangeProbability: volatility.trend_change * 2
    },
    // 5 Year - major growth with corrections
    fiveYear: {
      priceChange: -120.5,
      startPrice: endPrice + 120.5,
      baseVolatility: volatility.daily * 4,
      trendChangeProbability: volatility.trend_change * 3
    },
  }
  
  // Get the selected pattern
  const pattern = patterns[patternType]
  let currentPrice = pattern.startPrice
  
  // Calculate trend needed to reach target price
  let baseTrend = pattern.priceChange / periods
  let currentTrend = baseTrend
  
  for (let i = 0; i < periods; i++) {
    // Occasionally change the trend direction around the base trend
    if (Math.random() < pattern.trendChangeProbability) {
      currentTrend = baseTrend + (Math.random() - 0.5) * pattern.baseVolatility * 0.5
    }
    
    // Calculate day's price movement
    const dailyVolatility = pattern.baseVolatility * (0.7 + Math.random() * 0.6) // Variable daily volatility
    const change = currentTrend + (Math.random() - 0.5) * dailyVolatility
    
    const open = Number(currentPrice.toFixed(2))
    let close = Number((open + change).toFixed(2))
    
    // Last item should be exactly the current price
    if (i === periods - 1) {
      close = endPrice
    }
    
    // Calculate high and low with realistic ranges
    const highRange = Math.random() * volatility.daily_range
    const lowRange = Math.random() * volatility.daily_range
    const high = Number(Math.max(open, close, open + highRange).toFixed(2))
    const low = Number(Math.min(open, close, close - lowRange).toFixed(2))
    
    // Update current price for next iteration
    currentPrice = close
    
    data.push({
      time: "",
      open,
      high,
      low,
      close
    })
  }
  
  return data
}

// The current Apple stock price
const CURRENT_PRICE = 198.14

// Mock data for different time periods
export const mockStockData = {
  // Daily data (5-minute intervals)
  "1D": generateRealisticStockData(CURRENT_PRICE, 78, "intraday").map((item, i) => ({
    ...item,
    time: `${Math.floor(i / 12) + 9}:${(i % 12) * 5 || '00'}`
  })),

  // Weekly data (daily intervals)
  "1W": generateRealisticStockData(CURRENT_PRICE, 5, "weekly").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (4 - i))
    return {
      ...item,
      time: date.toLocaleDateString('en-US', { weekday: 'short' })
    }
  }),

  // Monthly data (daily intervals)
  "1M": generateRealisticStockData(CURRENT_PRICE, 22, "monthly").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (21 - i))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getDate()}`
    }
  }),

  // 3-Month data (daily intervals)
  "3M": generateRealisticStockData(CURRENT_PRICE, 66, "threeMonth").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (65 - i))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getDate()}`
    }
  }),

  // Yearly data (weekly intervals)
  "1Y": generateRealisticStockData(CURRENT_PRICE, 52, "yearly").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (364 - i * 7))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getDate()}`
    }
  }),

  // 5-Year data (monthly intervals)
  "5Y": generateRealisticStockData(CURRENT_PRICE, 60, "fiveYear").map((item, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (59 - i))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`
    }
  })
} 