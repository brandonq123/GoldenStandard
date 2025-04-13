// Generate mock data for different time periods
function generateMockData(startPrice: number, volatility: number, periods: number, interval: string) {
  const data = []
  let currentPrice = startPrice

  for (let i = 0; i < periods; i++) {
    const change = (Math.random() - 0.5) * volatility
    const open = currentPrice
    const close = open + change
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    currentPrice = close

    data.push({
      time: interval,
      open,
      high,
      low,
      close
    })
  }

  return data
}

// Mock data for different time periods
export const mockStockData = {
  // Daily data (5-minute intervals)
  "1D": generateMockData(182.5, 0.5, 78, "").map((item, i) => ({
    ...item,
    time: `${Math.floor(i / 12) + 9}:${(i % 12) * 5 || '00'}`
  })),

  // Weekly data (daily intervals)
  "1W": generateMockData(180, 2, 5, "").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (4 - i))
    return {
      ...item,
      time: date.toLocaleDateString('en-US', { weekday: 'short' })
    }
  }),

  // Monthly data (daily intervals)
  "1M": generateMockData(175, 3, 22, "").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (21 - i))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getDate()}`
    }
  }),

  // 3-Month data (daily intervals)
  "3M": generateMockData(170, 5, 66, "").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (65 - i))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getDate()}`
    }
  }),

  // Yearly data (weekly intervals)
  "1Y": generateMockData(160, 8, 52, "").map((item, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (364 - i * 7))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getDate()}`
    }
  }),

  // 5-Year data (monthly intervals)
  "5Y": generateMockData(120, 15, 60, "").map((item, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (59 - i))
    return {
      ...item,
      time: `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`
    }
  })
} 