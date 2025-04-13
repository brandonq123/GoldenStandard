"""
Polygon API Integration for SentimentTech

This module provides functions to interact with the Polygon.io API for retrieving
stock market data. All functions return mock data to simulate the API responses
without making actual API calls.
"""

import os
import json
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock API key - would normally be loaded from environment variables
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY", "mock_api_key")

# Base URLs for Polygon API
BASE_URL = "https://api.polygon.io/v2"
REFERENCE_URL = "https://api.polygon.io/v3/reference"


class PolygonException(Exception):
    """Custom exception for Polygon API errors"""
    pass


def get_stock_price(symbol: str) -> Dict[str, Any]:
    """
    Get the current stock price and related information for a given symbol.
    
    Args:
        symbol: The stock ticker symbol
        
    Returns:
        Dict containing current stock price data
    """
    logger.info(f"Getting stock price for {symbol}")
    
    # Mock data based on real stock prices
    mock_data = {
        "AAPL": {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "price": 198.14,
            "change": 2.34,
            "change_percent": 1.18,
            "volume": 45320987,
            "prev_close": 195.80,
            "open": 196.42,
            "high": 198.40,
            "low": 195.89,
            "market_cap": 2870000000000,  # 2.87T
            "pe_ratio": 30.21,
        },
        "MSFT": {
            "symbol": "MSFT",
            "name": "Microsoft Corporation",
            "price": 417.23,
            "change": -1.85,
            "change_percent": -0.44,
            "volume": 22145678,
            "prev_close": 419.08,
            "open": 418.72,
            "high": 420.05,
            "low": 415.98,
            "market_cap": 3100000000000,  # 3.1T
            "pe_ratio": 35.12,
        },
        "NVDA": {
            "symbol": "NVDA",
            "name": "NVIDIA Corporation",
            "price": 920.75,
            "change": 15.85,
            "change_percent": 1.72,
            "volume": 38965412,
            "prev_close": 904.90,
            "open": 908.22,
            "high": 924.50,
            "low": 905.30,
            "market_cap": 2270000000000,  # 2.27T
            "pe_ratio": 68.42,
        },
        "TSLA": {
            "symbol": "TSLA",
            "name": "Tesla, Inc.",
            "price": 172.63,
            "change": -3.21,
            "change_percent": -1.75,
            "volume": 96532147,
            "prev_close": 175.84,
            "open": 175.20,
            "high": 176.98,
            "low": 171.55,
            "market_cap": 551400000000,  # 551.4B
            "pe_ratio": 47.83,
        },
        "AMZN": {
            "symbol": "AMZN",
            "name": "Amazon.com, Inc.",
            "price": 182.47,
            "change": 0.86,
            "change_percent": 0.47,
            "volume": 35687412,
            "prev_close": 181.61,
            "open": 181.92,
            "high": 183.25,
            "low": 181.02,
            "market_cap": 1920000000000,  # 1.92T
            "pe_ratio": 50.12,
        },
    }
    
    # Default data for any symbol not in our mocks
    default_data = {
        "symbol": symbol,
        "name": f"{symbol} Corporation",
        "price": round(random.uniform(50, 500), 2),
        "change": round(random.uniform(-10, 10), 2),
        "change_percent": round(random.uniform(-5, 5), 2),
        "volume": random.randint(1000000, 50000000),
        "prev_close": round(random.uniform(50, 500), 2),
        "open": round(random.uniform(50, 500), 2),
        "high": round(random.uniform(50, 500), 2),
        "low": round(random.uniform(50, 500), 2),
        "market_cap": random.randint(10000000000, 5000000000000),
        "pe_ratio": round(random.uniform(10, 100), 2),
    }
    
    # Format the response to match Polygon API's structure
    result = mock_data.get(symbol.upper(), default_data)
    
    response = {
        "status": "OK",
        "request_id": f"mock_request_{random.randint(1000000, 9999999)}",
        "results": result,
        "last_updated": datetime.now().isoformat()
    }
    
    return response


def get_historical_data(
    symbol: str, 
    timespan: str = "day", 
    from_date: str = None, 
    to_date: str = None, 
    limit: int = 100
) -> Dict[str, Any]:
    """
    Get historical price data for a symbol
    
    Args:
        symbol: The stock ticker symbol
        timespan: Time span of the data (minute, hour, day, week, month, quarter, year)
        from_date: Start date in format YYYY-MM-DD
        to_date: End date in format YYYY-MM-DD
        limit: Maximum number of data points to return
        
    Returns:
        Dict containing historical price data
    """
    logger.info(f"Getting historical data for {symbol}: {timespan} from {from_date} to {to_date}")
    
    # Create synthetic historical data based on current price
    current_price_data = get_stock_price(symbol)
    base_price = current_price_data["results"]["price"]
    
    # Set default dates if not provided
    if not to_date:
        to_date = datetime.now().strftime("%Y-%m-%d")
    
    if not from_date:
        # Default timespan based on requested interval
        days_back = {
            "minute": 1,
            "hour": 7,
            "day": 30,
            "week": 90, 
            "month": 365,
            "quarter": 730,
            "year": 1825
        }.get(timespan, 30)
        
        from_date_obj = datetime.now() - timedelta(days=days_back)
        from_date = from_date_obj.strftime("%Y-%m-%d")
    
    # Generate mock data points
    results = []
    
    # Number of points to generate
    num_points = min(limit, 100)  # Cap at 100 for mock data
    
    # Volatility based on timespan
    volatility_factor = {
        "minute": 0.1,
        "hour": 0.3,
        "day": 0.8,
        "week": 2.0,
        "month": 5.0,
        "quarter": 10.0,
        "year": 20.0
    }.get(timespan, 1.0)
    
    # Generate data points with realistic trends
    price = base_price
    trend = 0.1  # Slight upward trend
    
    # Go backwards in time from the current price
    for i in range(num_points):
        timestamp = (datetime.now() - timedelta(
            days=i * (1 if timespan == "day" else 7 if timespan == "week" else 30 if timespan == "month" else 1),
            hours=i if timespan == "hour" else 0,
            minutes=i if timespan == "minute" else 0
        )).isoformat()
        
        # Add some randomness to the price movements
        if random.random() < 0.1:  # 10% chance to change trend
            trend = random.uniform(-0.2, 0.2)
            
        change = trend + random.uniform(-volatility_factor, volatility_factor)
        
        # Price for this data point (going backward, so we subtract)
        price = max(0.01, price - change)
        
        open_price = price - random.uniform(-volatility_factor/2, volatility_factor/2)
        high_price = max(price, open_price) + random.uniform(0, volatility_factor/2)
        low_price = min(price, open_price) - random.uniform(0, volatility_factor/2)
        
        # Ensure values are positive and properly ordered
        open_price = max(0.01, open_price)
        low_price = max(0.01, min(low_price, open_price, price))
        high_price = max(high_price, open_price, price)
        
        volume = int(random.uniform(0.8, 1.2) * current_price_data["results"]["volume"] / num_points)
        
        results.append({
            "t": timestamp,
            "o": round(open_price, 2),
            "h": round(high_price, 2),
            "l": round(low_price, 2),
            "c": round(price, 2),
            "v": volume,
            "vw": round((open_price + high_price + low_price + price) / 4, 2),  # Volume-weighted price
            "n": random.randint(1000, 10000)  # Number of transactions
        })
    
    # Reverse so the oldest is first (ascending order)
    results.reverse()
    
    # Format to match Polygon API response
    response = {
        "status": "OK",
        "request_id": f"mock_request_{random.randint(1000000, 9999999)}",
        "ticker": symbol.upper(),
        "adjusted": True,
        "queryCount": len(results),
        "resultsCount": len(results),
        "results": results,
    }
    
    return response


def get_company_info(symbol: str) -> Dict[str, Any]:
    """
    Get company information for a given symbol
    
    Args:
        symbol: The stock ticker symbol
        
    Returns:
        Dict containing company information
    """
    logger.info(f"Getting company info for {symbol}")
    
    # Mock company data
    mock_company_data = {
        "AAPL": {
            "name": "Apple Inc.",
            "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod.",
            "homepage_url": "https://www.apple.com",
            "market_cap": 2870000000000,
            "industry": "Consumer Electronics",
            "sector": "Technology",
            "employees": 164000,
            "ceo": "Tim Cook",
            "hq_address": "One Apple Park Way, Cupertino, CA 95014, United States",
            "exchange": "NASDAQ",
            "founded": "1976-04-01"
        },
        "MSFT": {
            "name": "Microsoft Corporation",
            "description": "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and Personal Computing.",
            "homepage_url": "https://www.microsoft.com",
            "market_cap": 3100000000000,
            "industry": "SoftwareInfrastructure",
            "sector": "Technology",
            "employees": 221000,
            "ceo": "Satya Nadella",
            "hq_address": "One Microsoft Way, Redmond, WA 98052, United States",
            "exchange": "NASDAQ",
            "founded": "1975-04-04"
        },
        "NVDA": {
            "name": "NVIDIA Corporation",
            "description": "NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company's Graphics segment offers GeForce GPUs for gaming and PCs, the GeForce NOW game streaming service and related infrastructure, and solutions for gaming platforms.",
            "homepage_url": "https://www.nvidia.com",
            "market_cap": 2270000000000,
            "industry": "Semiconductors",
            "sector": "Technology",
            "employees": 26196,
            "ceo": "Jensen Huang",
            "hq_address": "2788 San Tomas Expressway, Santa Clara, CA 95051, United States",
            "exchange": "NASDAQ",
            "founded": "1993-04-09"
        }
    }
    
    # Default data for any symbol not in our mocks
    default_data = {
        "name": f"{symbol} Corporation",
        "description": f"A publicly traded company with ticker symbol {symbol}.",
        "homepage_url": f"https://www.{symbol.lower()}.com",
        "market_cap": random.randint(1000000000, 5000000000000),
        "industry": random.choice(["Technology", "Healthcare", "Finance", "Consumer Goods", "Industrial"]),
        "sector": random.choice(["Technology", "Healthcare", "Finance", "Consumer Goods", "Industrial"]),
        "employees": random.randint(1000, 500000),
        "ceo": "John Doe",
        "hq_address": "123 Corporate Drive, Business City, CA 90210, United States",
        "exchange": random.choice(["NYSE", "NASDAQ"]),
        "founded": f"{random.randint(1950, 2015)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
    }
    
    # Format response to match Polygon API
    company_data = mock_company_data.get(symbol.upper(), default_data)
    
    response = {
        "status": "OK",
        "request_id": f"mock_request_{random.randint(1000000, 9999999)}",
        "results": company_data
    }
    
    return response


def get_market_news(
    symbol: Optional[str] = None, 
    limit: int = 10
) -> Dict[str, Any]:
    """
    Get market news, optionally filtered by ticker
    
    Args:
        symbol: Optional stock ticker to filter news
        limit: Maximum number of news items to return
        
    Returns:
        Dict containing news articles
    """
    logger.info(f"Getting market news for {symbol if symbol else 'general market'}")
    
    # Mock news articles
    general_articles = [
        {
            "id": "mock_article_1",
            "title": "Federal Reserve Signals Rate Cut Later This Year",
            "author": "Jane Smith",
            "published_utc": (datetime.now() - timedelta(hours=3)).isoformat(),
            "article_url": "https://www.financialnews.com/fed-signals-rate-cut",
            "tickers": ["SPY", "QQQ", "DIA"],
            "amp_url": "https://www.financialnews.com/amp/fed-signals-rate-cut",
            "image_url": "https://www.financialnews.com/images/fed-meeting.jpg",
            "description": "The Federal Reserve indicated it may begin cutting interest rates later this year if inflation continues to cool, according to meeting minutes released today."
        },
        {
            "id": "mock_article_2",
            "title": "Tech Stocks Rally on AI Optimism",
            "author": "John Johnson",
            "published_utc": (datetime.now() - timedelta(hours=5)).isoformat(),
            "article_url": "https://www.techmarketwatch.com/tech-stocks-rally",
            "tickers": ["AAPL", "MSFT", "NVDA", "GOOGL"],
            "amp_url": "https://www.techmarketwatch.com/amp/tech-stocks-rally",
            "image_url": "https://www.techmarketwatch.com/images/tech-rally.jpg",
            "description": "Major technology stocks rallied today as investors remain optimistic about the growth potential of artificial intelligence applications."
        },
        {
            "id": "mock_article_3",
            "title": "Oil Prices Drop on Increased Supply Concerns",
            "author": "Sarah Williams",
            "published_utc": (datetime.now() - timedelta(hours=8)).isoformat(),
            "article_url": "https://www.energymarkets.com/oil-prices-drop",
            "tickers": ["XOM", "CVX", "USO"],
            "amp_url": "https://www.energymarkets.com/amp/oil-prices-drop",
            "image_url": "https://www.energymarkets.com/images/oil-rigs.jpg",
            "description": "Crude oil prices fell today as OPEC+ countries consider increasing production quotas in response to global demand."
        }
    ]
    
    apple_articles = [
        {
            "id": "mock_apple_1",
            "title": "Apple's iPhone Faces Potential China Tariffs",
            "author": "Michael Chen",
            "published_utc": (datetime.now() - timedelta(hours=2)).isoformat(),
            "article_url": "https://www.techdaily.com/apple-iphone-china-tariffs",
            "tickers": ["AAPL"],
            "amp_url": "https://www.techdaily.com/amp/apple-iphone-china-tariffs",
            "image_url": "https://www.techdaily.com/images/iphone-china.jpg",
            "description": "Apple Inc. shares declined amid concerns about potential tariffs on iPhones and other products manufactured in China."
        },
        {
            "id": "mock_apple_2",
            "title": "Apple's Vision Pro Sales Reportedly Below Expectations",
            "author": "Lisa Reynolds",
            "published_utc": (datetime.now() - timedelta(hours=6)).isoformat(),
            "article_url": "https://www.techinvestor.com/apple-vision-pro-sales",
            "tickers": ["AAPL"],
            "amp_url": "https://www.techinvestor.com/amp/apple-vision-pro-sales",
            "image_url": "https://www.techinvestor.com/images/vision-pro.jpg",
            "description": "Initial sales figures for Apple's Vision Pro headset are coming in below the company's internal projections, according to supply chain sources."
        },
        {
            "id": "mock_apple_3",
            "title": "Apple Delays Some AI Features in iOS 18",
            "author": "Robert Johnson",
            "published_utc": (datetime.now() - timedelta(days=1)).isoformat(),
            "article_url": "https://www.applereports.com/ios-18-ai-features-delayed",
            "tickers": ["AAPL"],
            "amp_url": "https://www.applereports.com/amp/ios-18-ai-features-delayed",
            "image_url": "https://www.applereports.com/images/ios18.jpg",
            "description": "Apple has reportedly decided to delay some anticipated AI features in iOS 18, pushing them to later updates as they require additional development time."
        }
    ]
    
    nvidia_articles = [
        {
            "id": "mock_nvidia_1",
            "title": "NVIDIA Becomes World's Second Most Valuable Company",
            "author": "David Miller",
            "published_utc": (datetime.now() - timedelta(hours=4)).isoformat(),
            "article_url": "https://www.techmarkets.com/nvidia-second-most-valuable",
            "tickers": ["NVDA"],
            "amp_url": "https://www.techmarkets.com/amp/nvidia-second-most-valuable",
            "image_url": "https://www.techmarkets.com/images/nvidia-hq.jpg",
            "description": "NVIDIA has surpassed Apple to become the world's second most valuable company, reflecting continued investor enthusiasm for AI technology leaders."
        },
        {
            "id": "mock_nvidia_2",
            "title": "NVIDIA's Blackwell GPU Platform Shipping Later This Year",
            "author": "Jennifer Wong",
            "published_utc": (datetime.now() - timedelta(hours=10)).isoformat(),
            "article_url": "https://www.semiconductornews.com/nvidia-blackwell-shipping",
            "tickers": ["NVDA"],
            "amp_url": "https://www.semiconductornews.com/amp/nvidia-blackwell-shipping",
            "image_url": "https://www.semiconductornews.com/images/blackwell-gpu.jpg",
            "description": "NVIDIA confirms its next-generation Blackwell GPU platform will begin shipping to major customers in the third quarter, potentially boosting data center revenues."
        }
    ]
    
    # Select appropriate articles based on ticker
    if symbol:
        if symbol.upper() == "AAPL":
            articles = apple_articles + general_articles
        elif symbol.upper() == "NVDA":
            articles = nvidia_articles + general_articles
        else:
            articles = general_articles
    else:
        articles = general_articles
    
    # Limit the number of results
    articles = articles[:limit]
    
    # Format response to match Polygon API
    response = {
        "status": "OK",
        "request_id": f"mock_request_{random.randint(1000000, 9999999)}",
        "results": articles,
        "next_url": None
    }
    
    return response


def get_ticker_types() -> Dict[str, Any]:
    """Get a list of supported ticker types"""
    
    ticker_types = [
        {"code": "CS", "description": "Common Stock"},
        {"code": "PFD", "description": "Preferred Stock"},
        {"code": "BONDS", "description": "Bond"},
        {"code": "ETF", "description": "Exchange Traded Fund"},
        {"code": "FUND", "description": "Mutual Fund"},
        {"code": "INDEX", "description": "Market Index"},
        {"code": "FOREX", "description": "Foreign Exchange"},
        {"code": "CRYPTO", "description": "Cryptocurrency"},
        {"code": "OPTION", "description": "Options Contract"},
        {"code": "FUTURE", "description": "Futures Contract"}
    ]
    
    response = {
        "status": "OK",
        "request_id": f"mock_request_{random.randint(1000000, 9999999)}",
        "results": ticker_types
    }
    
    return response


def get_market_status() -> Dict[str, Any]:
    """Get current market status (open/closed)"""
    
    # Check if current time is during market hours (9:30 AM - 4:00 PM ET, M-F)
    now = datetime.now()
    market_open = now.weekday() < 5 and 9 <= now.hour < 16  # Simplified check
    
    response = {
        "status": "OK",
        "request_id": f"mock_request_{random.randint(1000000, 9999999)}",
        "results": {
            "market_status": "open" if market_open else "closed",
            "server_time": now.isoformat(),
            "exchanges": {
                "nyse": "open" if market_open else "closed",
                "nasdaq": "open" if market_open else "closed",
                "otc": "open" if market_open else "closed"
            },
            "currencies": {
                "fx": "open",  # Forex markets generally open 24/5
                "crypto": "open"  # Crypto markets generally open 24/7
            }
        }
    }
    
    return response


if __name__ == "__main__":
    # Simple test of functions
    test_symbol = "AAPL"
    print(f"Current price for {test_symbol}:")
    price_data = get_stock_price(test_symbol)
    print(json.dumps(price_data, indent=2))
    
    print(f"\nHistorical data for {test_symbol}:")
    historical_data = get_historical_data(test_symbol, timespan="day", limit=5)
    print(json.dumps(historical_data, indent=2))
    
    print(f"\nCompany info for {test_symbol}:")
    company_data = get_company_info(test_symbol)
    print(json.dumps(company_data, indent=2))
    
    print(f"\nNews for {test_symbol}:")
    news_data = get_market_news(test_symbol, limit=2)
    print(json.dumps(news_data, indent=2))