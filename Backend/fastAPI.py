# Create FastAPI app
import logging
import os
import json
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Polygon API key
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
if not POLYGON_API_KEY:
    raise ValueError("POLYGON_API_KEY environment variable is required")

## Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="SentimentTech API",
    description="API for SentimentTech - Real-time sentiment analysis for financial markets",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Pydantic models for request/response
class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: str
    market_cap: str
    pe_ratio: float

class SentimentScore(BaseModel):
    score: float
    magnitude: float
    label: str = Field(...)  # positive, negative, neutral

class SocialMediaPost(BaseModel):
    id: str
    platform: str
    content: str
    created_at: datetime
    sentiment: SentimentScore
    url: Optional[str] = None
    author: Optional[str] = None
    likes: Optional[int] = None

class SentimentResponse(BaseModel):
    symbol: str
    overall_sentiment: SentimentScore
    social_sentiment: Dict[str, SentimentScore]
    trending_topics: List[str]
    recent_posts: List[SocialMediaPost]
    last_updated: datetime

class PriceData(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: Optional[int] = None

class StockPriceResponse(BaseModel):
    symbol: str
    interval: str
    data: List[PriceData]

# Health check route
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Initial Routes
@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "SentimentTech API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/stocks/{symbol}",
            "/stocks/{symbol}/price",
            "/stocks/{symbol}/sentiment",
            "/trending/stocks",
            "/trending/topics"
        ]
    }

# Routes for handling stock data
@app.get("/stocks/{symbol}", response_model=StockData, tags=["Stocks"])
async def get_stock_info(symbol: str):
    """
    Get current stock information for a given symbol
    """
    logger.info(f"Fetching stock info for {symbol}")
    # This would normally fetch from Polygon API
    
    # Mock response
    mock_data = {
        "AAPL": {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "price": 198.14,
            "change": 2.34,
            "change_percent": 1.18,
            "volume": "45.3M",
            "market_cap": "2.87T",
            "pe_ratio": 30.21
        },
        "MSFT": {
            "symbol": "MSFT",
            "name": "Microsoft Corporation",
            "price": 417.23,
            "change": -1.85,
            "change_percent": -0.44,
            "volume": "22.1M",
            "market_cap": "3.1T", 
            "pe_ratio": 35.12
        }
    }
    
    if symbol.upper() not in mock_data:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
    
    return mock_data.get(symbol.upper())

@app.get("/stocks/{symbol}/price", response_model=StockPriceResponse, tags=["Stocks"])
async def get_stock_price(
    symbol: str,
    interval: str = Query("1D", description="Time interval (1D, 1W, 1M, 3M, 1Y, 5Y)")
):
    """
    Get historical price data for a stock from Polygon
    """
    logger.info(f"Fetching {interval} price data for {symbol}")
    
    try:
        now = datetime.utcnow()
        
        if interval == "1D":
            start = (now - timedelta(days=1)).strftime("%Y-%m-%d")
            multiplier, timespan = 5, "minute"
        elif interval == "1W":
            start = (now - timedelta(weeks=1)).strftime("%Y-%m-%d")
            multiplier, timespan = 30, "minute"
        elif interval == "1M":
            start = (now - timedelta(days=30)).strftime("%Y-%m-%d")
            multiplier, timespan = 1, "day"
        elif interval == "3M":
            start = (now - timedelta(days=90)).strftime("%Y-%m-%d")
            multiplier, timespan = 1, "day"
        elif interval == "1Y":
            start = (now - timedelta(days=365)).strftime("%Y-%m-%d")
            multiplier, timespan = 1, "day"
        elif interval == "5Y":
            start = (now - timedelta(days=5*365)).strftime("%Y-%m-%d")
            multiplier, timespan = 1, "week"
        else:
            raise HTTPException(status_code=400, detail="Invalid interval")

        url = f"https://api.polygon.io/v2/aggs/ticker/{symbol.upper()}/range/{multiplier}/{timespan}/{start}/{now.strftime('%Y-%m-%d')}?adjusted=true&sort=asc&limit=5000&apiKey={POLYGON_API_KEY}"

        r = requests.get(url)
        data = r.json()

        if "results" not in data:
            raise HTTPException(status_code=500, detail=f"Polygon error: {data.get('error', 'No results')}")

        candles = []
        for item in data["results"]:
            timestamp = datetime.utcfromtimestamp(item["t"]/1000)
            
            # Format time based on interval
            if interval == "1D":
                time_str = timestamp.strftime("%H:%M")
            elif interval in ["1W", "1M", "3M"]:
                time_str = timestamp.strftime("%m/%d")
            else:  # 1Y, 5Y
                time_str = timestamp.strftime("%m/%y")
            
            candles.append({
                "time": time_str,
                "open": round(item["o"], 2),
                "high": round(item["h"], 2),
                "low": round(item["l"], 2),
                "close": round(item["c"], 2),
                "volume": item["v"]
            })

        logger.info(f"Returning {len(candles)} candles for {symbol}")
        
        return {
            "symbol": symbol.upper(),
            "interval": interval,
            "data": candles
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error fetching price data: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Routes for handling sentiment analysis
@app.get("/stocks/{symbol}/sentiment", response_model=SentimentResponse, tags=["Sentiment"])
async def get_stock_sentiment(symbol: str):
    """
    Get sentiment analysis for a stock from social media and news sources
    """
    logger.info(f"Fetching sentiment data for {symbol}")
    
    # This would call to our sentiment analysis service
    # For now, return mock data
    return {
        "symbol": symbol.upper(),
        "overall_sentiment": {
            "score": 0.65,
            "magnitude": 0.8,
            "label": "positive"
        },
        "social_sentiment": {
            "reddit": {
                "score": 0.45,
                "magnitude": 0.9,
                "label": "neutral"
            },
            "twitter": {
                "score": 0.75, 
                "magnitude": 0.85,
                "label": "positive"
            },
            "news": {
                "score": 0.68,
                "magnitude": 0.7,
                "label": "positive"
            }
        },
        "trending_topics": [
            "earnings", "iphone", "artificial intelligence", "vision pro", "tariffs"
        ],
        "recent_posts": [
            {
                "id": "post1",
                "platform": "reddit",
                "content": "Apple's services business continues to grow impressively",
                "created_at": datetime.now() - timedelta(hours=2),
                "sentiment": {
                    "score": 0.82,
                    "magnitude": 0.7,
                    "label": "positive"
                },
                "url": "https://reddit.com/r/investing/comments/123456",
                "author": "investor123",
                "likes": 42
            },
            {
                "id": "post2",
                "platform": "twitter",
                "content": "Vision Pro sales seem to be below expectations. Not a good sign.",
                "created_at": datetime.now() - timedelta(hours=5),
                "sentiment": {
                    "score": -0.45,
                    "magnitude": 0.65,
                    "label": "negative"
                },
                "author": "@techanalyst",
                "likes": 118
            }
        ],
        "last_updated": datetime.now()
    }

@app.get("/trending/stocks", tags=["Trending"])
async def get_trending_stocks():
    """
    Get stocks trending on social media
    """
    logger.info("Fetching trending stocks")
    
    # This would query our analytics database
    return {
        "trending_stocks": [
            {
                "symbol": "NVDA",
                "name": "NVIDIA Corporation",
                "sentiment_score": 0.87,
                "sentiment_label": "positive",
                "mention_count": 1245,
                "price_change_24h": 2.3
            },
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "sentiment_score": 0.65,
                "sentiment_label": "positive", 
                "mention_count": 986,
                "price_change_24h": 1.18
            },
            {
                "symbol": "TSLA",
                "name": "Tesla, Inc.",
                "sentiment_score": 0.42,
                "sentiment_label": "neutral",
                "mention_count": 875,
                "price_change_24h": -0.8
            }
        ],
        "last_updated": datetime.now().isoformat()
    }

@app.get("/trending/topics", tags=["Trending"])
async def get_trending_topics():
    """
    Get trending financial topics from social media
    """
    logger.info("Fetching trending topics")
    
    return {
        "trending_topics": [
            {
                "topic": "Artificial Intelligence",
                "sentiment_score": 0.78,
                "mention_count": 2341,
                "related_stocks": ["NVDA", "MSFT", "GOOG"]
            },
            {
                "topic": "Interest Rates",
                "sentiment_score": -0.25,
                "mention_count": 1872,
                "related_stocks": ["JPM", "GS", "BAC"]
            },
            {
                "topic": "Semiconductor Shortage",
                "sentiment_score": 0.15,
                "mention_count": 1544,
                "related_stocks": ["INTC", "AMD", "TSM"]
            }
        ],
        "last_updated": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)