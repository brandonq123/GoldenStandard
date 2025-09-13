import os
import json
import logging
import requests
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")

BASE_URL = "https://api.polygon.io/v2"
REFERENCE_URL = "https://api.polygon.io/v3/reference"


class PolygonException(Exception):
    pass


def get_stock_price(symbol: str) -> Dict[str, Any]:
    url = f"{BASE_URL}/aggs/ticker/{symbol}/prev"
    params = {"apiKey": POLYGON_API_KEY}
    
    logger.info(f"Getting stock price for {symbol}")
    
    # Add a small delay to avoid rate limiting
    time.sleep(0.1)
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Error fetching stock price: {response.text}")
        raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()
    return data


def get_historical_data(
    symbol: str, 
    timespan: str = "day", 
    from_date: str = None, 
    to_date: str = None, 
    limit: int = 100
) -> Dict[str, Any]:
    # Use the correct endpoint for historical data
    url = f"{BASE_URL}/aggs/ticker/{symbol}/range/1/{timespan}"
    
    if not to_date:
        to_date = datetime.now().strftime("%Y-%m-%d")
    
    if not from_date:
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
    
    params = {
        "from": from_date,
        "to": to_date,
        "limit": limit,
        "apiKey": POLYGON_API_KEY
    }
    
    logger.info(f"Getting historical data for {symbol}: {timespan} from {from_date} to {to_date}")
    logger.info(f"URL: {url}")
    logger.info(f"Params: {params}")
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Error fetching historical data: {response.text}")
        logger.error(f"Response status: {response.status_code}")
        # Try with a different endpoint format
        if timespan == "hour":
            # For intraday data, try a different approach
            url = f"{BASE_URL}/aggs/ticker/{symbol}/range/1/day"
            params = {
                "from": from_date,
                "to": to_date,
                "limit": limit,
                "apiKey": POLYGON_API_KEY
            }
            logger.info(f"Retrying with daily data: {url}")
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                logger.error(f"Retry also failed: {response.text}")
                raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
        else:
            raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()
    return data


def get_company_info(symbol: str) -> Dict[str, Any]:
    url = f"{REFERENCE_URL}/tickers/{symbol}"
    params = {"apiKey": POLYGON_API_KEY}
    
    logger.info(f"Getting company info for {symbol}")
    
    # Add a small delay to avoid rate limiting
    time.sleep(0.1)
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Error fetching company info: {response.text}")
        raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()
    return data


def get_market_news(
    symbol: Optional[str] = None, 
    limit: int = 10
) -> Dict[str, Any]:
    url = f"{REFERENCE_URL}/news"
    
    params = {
        "limit": limit,
        "apiKey": POLYGON_API_KEY
    }
    
    if symbol:
        params["ticker"] = symbol
    
    logger.info(f"Getting market news for {symbol if symbol else 'general market'}")
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Error fetching market news: {response.text}")
        raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()
    return data


def get_ticker_types() -> Dict[str, Any]:
    url = f"{REFERENCE_URL}/types"
    params = {"apiKey": POLYGON_API_KEY}
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Error fetching ticker types: {response.text}")
        raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()
    return data


def get_market_status() -> Dict[str, Any]:
    url = f"{REFERENCE_URL}/market/status"
    params = {"apiKey": POLYGON_API_KEY}
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Error fetching market status: {response.text}")
        raise PolygonException(f"API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()
    return data