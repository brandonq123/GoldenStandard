// API service for Golden Standard
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: string;
  market_cap: string;
  pe_ratio: number;
}

export interface PriceData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface StockPriceResponse {
  symbol: string;
  interval: string;
  data: PriceData[];
}

export interface SentimentScore {
  score: number;
  magnitude: number;
  label: string;
}

export interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  created_at: string;
  sentiment: SentimentScore;
  url?: string;
  author?: string;
  likes?: number;
}

export interface SentimentResponse {
  symbol: string;
  overall_sentiment: SentimentScore;
  social_sentiment: Record<string, SentimentScore>;
  trending_topics: string[];
  recent_posts: SocialMediaPost[];
  last_updated: string;
}

export interface TrendingStock {
  symbol: string;
  name: string;
  sentiment_score: number;
  sentiment_label: string;
  mention_count: number;
  price_change_24h: number;
}

export interface TrendingTopic {
  topic: string;
  sentiment_score: number;
  mention_count: number;
  related_stocks: string[];
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Stock data endpoints
  async getStockInfo(symbol: string): Promise<StockData> {
    return this.request<StockData>(`/stocks/${symbol.toUpperCase()}`);
  }

  async getStockPrice(symbol: string, interval: string): Promise<StockPriceResponse> {
    return this.request<StockPriceResponse>(`/stocks/${symbol.toUpperCase()}/price?interval=${interval}`);
  }

  async getStockSentiment(symbol: string): Promise<SentimentResponse> {
    return this.request<SentimentResponse>(`/stocks/${symbol.toUpperCase()}/sentiment`);
  }

  // Trending data endpoints
  async getTrendingStocks(): Promise<{ trending_stocks: TrendingStock[]; last_updated: string }> {
    return this.request<{ trending_stocks: TrendingStock[]; last_updated: string }>('/trending/stocks');
  }

  async getTrendingTopics(): Promise<{ trending_topics: TrendingTopic[]; last_updated: string }> {
    return this.request<{ trending_topics: TrendingTopic[]; last_updated: string }>('/trending/topics');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();
