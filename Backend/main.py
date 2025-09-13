# Create FastAPI app
import logging
import os
import json
import time
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from bson import ObjectId
# from db import get_collection  # Commented out for now - focusing on Polygon API

# Import Polygon API functions
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'API Calls'))
from Polygon import (
    get_stock_price as polygon_get_stock_price,
    get_historical_data,
    get_company_info,
    get_market_news,
    PolygonException
)

# Load environment variables
load_dotenv()

# Get Polygon API key
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")

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
        price_data = None
        company_data = None
        
        try:
            price_data = polygon_get_stock_price(symbol.upper())
        except PolygonException as e:
            logger.warning(f"Failed to get price data for {symbol}: {e}")
            # Continue with company data only
        
        try:
            company_data = get_company_info(symbol.upper())
        except PolygonException as e:
            logger.warning(f"Failed to get company data for {symbol}: {e}")
            # Continue with price data only
        
        # If both failed, return error
        if not price_data and not company_data:
            raise HTTPException(status_code=404, detail=f"Stock {symbol} not found or API unavailable")
        
        # Extract and process data with fallbacks
        current_price = 0.0
        price_change = 0.0
        price_change_percent = 0.0
        volume_str = "N/A"
        
        if price_data and price_data.get('results'):
            price_result = price_data['results'][0]
            current_price = price_result['c']  # Close price
            previous_close = price_result.get('p', current_price)  # Previous close
            price_change = current_price - previous_close
            price_change_percent = (price_change / previous_close) * 100 if previous_close else 0
            
            # Format volume
            volume = price_result.get('v', 0)
            volume_str = f"{volume/1000000:.1f}M" if volume >= 1000000 else f"{volume/1000:.1f}K"
        
        # Format market cap as string
        market_cap = "N/A"
        company_name = f"{symbol.upper()} Corporation"
        pe_ratio = 0.0
        
        if company_data and company_data.get('results'):
            company_result = company_data['results']
            company_name = company_result.get('name', company_name)
            market_cap = company_result.get('market_cap', "N/A")
            if isinstance(market_cap, (int, float)):
                if market_cap >= 1e12:
                    market_cap = f"${market_cap/1e12:.1f}T"
                elif market_cap >= 1e9:
                    market_cap = f"${market_cap/1e9:.1f}B"
                elif market_cap >= 1e6:
                    market_cap = f"${market_cap/1e6:.1f}M"
                else:
                    market_cap = f"${market_cap:,.0f}"
            pe_ratio = company_result.get('pe_ratio', 0.0)
        
        return {
            "symbol": symbol.upper(),
            "name": company_name,
            "price": round(current_price, 2),
            "change": round(price_change, 2),
            "change_percent": round(price_change_percent, 2),
            "volume": volume_str,
            "market_cap": market_cap,
            "pe_ratio": pe_ratio
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
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
    
    try:
        # Use a more reliable date range - end with yesterday to avoid market hours issues
        now = datetime.utcnow()
        end_date = (now - timedelta(days=1)).strftime("%Y-%m-%d")  # Use yesterday as end date
        
        # Map intervals to Polygon parameters with more conservative date ranges
        if interval == "1D":
            start = (now - timedelta(days=2)).strftime("%Y-%m-%d")  # Get 2 days to ensure we have data
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
            start = (now - timedelta(days=30)).strftime("%Y-%m-%d")
            multiplier, timespan = 1, "day"

        # Build Polygon API URL with more reliable date range
        url = f"https://api.polygon.io/v2/aggs/ticker/{symbol.upper()}/range/{multiplier}/{timespan}/{start}/{end_date}"
        params = {
            "adjusted": "true",
            "sort": "asc",
            "apiKey": POLYGON_API_KEY
        }
        
        logger.info(f"Calling Polygon API: {url}")
        
        # Add longer delay to avoid rate limiting
        time.sleep(0.2)
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            logger.error(f"Polygon API error: {response.status_code} - {response.text}")
            # Return empty data instead of throwing error to prevent frontend crashes
            return {
                "symbol": symbol.upper(),
                "interval": interval,
                "data": []
            }
        
        data = response.json()
        
        if not data.get("results"):
            logger.warning(f"No historical data found for {symbol}")
            return {
                "symbol": symbol.upper(),
                "interval": interval,
                "data": []
            }
        
        # Transform data to match frontend expectations
        candles = []
        for item in data.get("results", []):
            timestamp = datetime.utcfromtimestamp(item["t"] / 1000)
            
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
                "volume": item.get("v", 0)
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

# MongoDB test routes - commented out for now
# @app.get("/test-insert", tags=["MongoDB"])
# async def test_insert():
#     """Insert a test tweet into MongoDB."""
#     collection = get_collection()
#     test_tweet = {
#         "content": "Test tweet from FastAPI",
#         "created_at": datetime.now(),
#         "author": "test_user",
#         "likes": 0
#     }
#     result = collection.insert_one(test_tweet)
#     return {"message": "Test tweet inserted", "id": str(result.inserted_id)}

# @app.get("/get-latest", tags=["MongoDB"])
# async def get_latest_tweet():
#     """Get the most recent tweet from MongoDB."""
#     collection = get_collection()
#     tweet = collection.find_one(sort=[("created_at", -1)])
#     if tweet:
#         tweet["_id"] = str(tweet["_id"])  # Convert ObjectId to string
#         return tweet
#     return {"message": "No tweets found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)