import os
import json
import requests
from typing import List, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from serpapi import GoogleSearch

# Load environment variables
load_dotenv(dotenv_path="env/.env")

# Gemini setup
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# X/Twitter API constants
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
BASE_URL = "https://api.twitter.com/2"


def search_tweets(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Search for tweets matching a query using Twitter API v2
    """
    url = f"{BASE_URL}/tweets/search/recent"
    
    # Define query parameters
    params = {
        "query": query,
        "max_results": max_results,
        "tweet.fields": "created_at,public_metrics,author_id",
        "expansions": "author_id",
        "user.fields": "name,username,verified,public_metrics"
    }
    
    # Set up headers with bearer token
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching tweets: {e}")
        return {"data": []}


def fetch_tweets_for_ticker(ticker: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Fetch tweets related to a specific stock ticker
    """
    # Search for tweets with cashtag
    query = f"${ticker} lang:en -is:retweet"
    raw_tweets = search_tweets(query, max_results=count)
    
    # If Twitter API returns no results or fails, use SerpAPI as fallback
    if not raw_tweets.get("data"):
        return search_with_serpapi(ticker, count)
    
    # Extract and format the tweet data
    tweets_data = []
    for tweet in raw_tweets.get("data", []):
        # Get user info from includes
        user = next(
            (u for u in raw_tweets.get("includes", {}).get("users", []) 
             if u["id"] == tweet["author_id"]), 
            {"username": "unknown", "name": "Unknown User", "verified": False}
        )
        
        tweets_data.append({
            "id": f"twitter-{tweet['id']}",
            "author": user["username"],
            "author_name": user["name"],
            "content": tweet["text"],
            "likes": tweet.get("public_metrics", {}).get("like_count", 0),
            "retweets": tweet.get("public_metrics", {}).get("retweet_count", 0),
            "time": datetime.strptime(
                tweet["created_at"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d %H:%M"),
            "is_verified": user.get("verified", False),
            "source": "twitter",
            "context_url": f"https://twitter.com/{user['username']}/status/{tweet['id']}"
        })
    
    return tweets_data


def search_with_serpapi(ticker: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Fallback method using SerpAPI to get Twitter results
    """
    params = {
        "q": f"${ticker} site:twitter.com",
        "engine": "google",
        "api_key": os.getenv("SERPAPI_KEY"),
        "num": count,
        "tbm": "nws"
    }
    
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        
        tweets_data = []
        for result in results.get("organic_results", [])[:count]:
            tweets_data.append({
                "id": f"serpapi-{hash(result.get('link', ''))}",
                "author": result.get("source", "Unknown").replace("› ", ""),
                "author_name": result.get("source", "Unknown").replace("› ", ""),
                "content": result.get("snippet", ""),
                "likes": 0,  # Not available from SerpAPI
                "retweets": 0,  # Not available from SerpAPI
                "time": result.get("date", ""),
                "is_verified": False,  # Not available from SerpAPI
                "source": "twitter_via_serpapi",
                "context_url": result.get("link", "")
            })
        
        return tweets_data
    except Exception as e:
        print(f"Error with SerpAPI: {e}")
        return []


def analyze_tweets_with_gemini(tweets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyze tweets using Gemini to extract sentiment and relevance
    """
    if not tweets:
        return []
    
    # Format tweets for Gemini prompt
    tweets_text = "\n\n".join([
        f"Tweet {i+1}: {tweet['content']}" 
        for i, tweet in enumerate(tweets)
    ])
    
    prompt = f"""
    Analyze these tweets about a stock ticker. For each tweet, determine:
    
    1. Sentiment (positive, negative, or neutral)
    2. Relevance to stock trading (high, medium, low)
    3. Key points mentioned (brief bullet points)
    
    Format your response as a JSON array with this structure for each tweet:
    {{
      "tweet_number": 1,
      "sentiment": "positive",
      "relevance": "high",
      "key_points": ["Point 1", "Point 2"]
    }}
    
    Only return the JSON array, nothing else.
    
    Tweets:
    {tweets_text}
    """
    
    try:
        response = model.generate_content(prompt)
        analysis = json.loads(response.text)
        
        # Merge analysis with tweet data
        for i, tweet in enumerate(tweets):
            if i < len(analysis):
                tweet["sentiment"] = analysis[i]["sentiment"]
                tweet["relevance"] = analysis[i]["relevance"]
                tweet["key_points"] = analysis[i]["key_points"]
            else:
                tweet["sentiment"] = "neutral"
                tweet["relevance"] = "medium"
                tweet["key_points"] = []
        
        return tweets
    except Exception as e:
        print(f"Error analyzing tweets with Gemini: {e}")
        # Return tweets with default sentiment
        for tweet in tweets:
            tweet["sentiment"] = "neutral"
            tweet["relevance"] = "medium"
            tweet["key_points"] = []
        return tweets


def get_twitter_sentiment(ticker: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Main function to get Twitter sentiment for a stock ticker
    """
    tweets = fetch_tweets_for_ticker(ticker, count)
    return analyze_tweets_with_gemini(tweets)


# Testing
if __name__ == "__main__":
    result = get_twitter_sentiment("AAPL", 3)
    print(json.dumps(result, indent=2))