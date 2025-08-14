# Create FastAPI app
import logging
import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from bson import ObjectId
from db import get_collection

# Import Polygon API functions
from API_Calls.Polygon import (
    get_stock_price as polygon_get_stock_price,
    get_historical_data,
    get_company_info,
    get_market_news,
    PolygonException
)

# Load environment variables
load_dotenv()

'''
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
TWITTER_ACCESS_TOKEN_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
'''

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
    
    try:
        # Get current stock price from Polygon
        price_data = polygon_get_stock_price(symbol.upper())
        
        # Get company info from Polygon
        company_data = get_company_info(symbol.upper())
        
        if not price_data.get('results') or not company_data.get('results'):
            raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
        
        # Extract price data
        price_result = price_data['results'][0]
        company_result = company_data['results']
        
        # Calculate price change
        current_price = price_result['c']  # Close price
        previous_close = price_result.get('p', current_price)  # Previous close
        price_change = current_price - previous_close
        price_change_percent = (price_change / previous_close) * 100 if previous_close else 0
        
        # Format volume
        volume = price_result.get('v', 0)
        volume_str = f"{volume/1000000:.1f}M" if volume >= 1000000 else f"{volume/1000:.1f}K"
        
        return {
            "symbol": symbol.upper(),
            "name": company_result.get('name', f"{symbol.upper()} Corporation"),
            "price": round(current_price, 2),
            "change": round(price_change, 2),
            "change_percent": round(price_change_percent, 2),
            "volume": volume_str,
            "market_cap": company_result.get('market_cap', "N/A"),
            "pe_ratio": company_result.get('pe_ratio', 0.0)
        }
        
    except PolygonException as e:
        logger.error(f"Polygon API error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock data: {str(e)}")
    except Exception as e:
        logger.error(f"Error fetching stock info: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/stocks/{symbol}/price", response_model=StockPriceResponse, tags=["Stocks"])
async def get_stock_price(
    symbol: str,
    interval: str = Query("1D", description="Time interval (1D, 1W, 1M, 3M, 1Y, 5Y)")
):
    """
    Get historical price data for a stock
    """
    logger.info(f"Fetching {interval} price data for {symbol}")
    
    # Map frontend intervals to Polygon timespans
    interval_mapping = {
        "1D": ("hour", 1),
        "1W": ("day", 7),
        "1M": ("day", 30),
        "3M": ("day", 90),
        "1Y": ("day", 365),
        "5Y": ("day", 1825)
    }
    
    if interval not in interval_mapping:
        raise HTTPException(status_code=400, detail=f"Invalid interval. Must be one of {list(interval_mapping.keys())}")
    
    try:
        timespan, days_back = interval_mapping[interval]
        
        # Calculate date range
        to_date = datetime.now()
        from_date = to_date - timedelta(days=days_back)
        
        # Get historical data from Polygon
        historical_data = get_historical_data(
            symbol=symbol.upper(),
            timespan=timespan,
            from_date=from_date.strftime("%Y-%m-%d"),
            to_date=to_date.strftime("%Y-%m-%d"),
            limit=1000
        )
        
        if not historical_data.get('results'):
            raise HTTPException(status_code=404, detail=f"No historical data found for {symbol}")
        
        # Transform data to match frontend expectations
        data = []
        for result in historical_data['results']:
            # Format time based on interval
            timestamp = datetime.fromtimestamp(result['t'] / 1000)
            if interval == "1D":
                time_str = timestamp.strftime("%H:%M")
            elif interval in ["1W", "1M", "3M"]:
                time_str = timestamp.strftime("%m/%d")
            else:  # 1Y, 5Y
                time_str = timestamp.strftime("%m/%y")
            
            data.append({
                "time": time_str,
                "open": round(result['o'], 2),
                "high": round(result['h'], 2),
                "low": round(result['l'], 2),
                "close": round(result['c'], 2),
                "volume": result.get('v', 0)
            })
        
        return {
            "symbol": symbol.upper(),
            "interval": interval,
            "data": data
        }
        
    except PolygonException as e:
        logger.error(f"Polygon API error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch price data: {str(e)}")
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

# MongoDB test routes
@app.get("/test-insert", tags=["MongoDB"])
async def test_insert():
    """Insert a test tweet into MongoDB."""
    collection = get_collection()
    test_tweet = {
        "content": "Test tweet from FastAPI",
        "created_at": datetime.now(),
        "author": "test_user",
        "likes": 0
    }
    result = collection.insert_one(test_tweet)
    return {"message": "Test tweet inserted", "id": str(result.inserted_id)}

@app.get("/get-latest", tags=["MongoDB"])
async def get_latest_tweet():
    """Get the most recent tweet from MongoDB."""
    collection = get_collection()
    tweet = collection.find_one(sort=[("created_at", -1)])
    if tweet:
        tweet["_id"] = str(tweet["_id"])  # Convert ObjectId to string
        return tweet
    return {"message": "No tweets found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)