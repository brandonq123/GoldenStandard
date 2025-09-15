import requests
from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta
import json
import re
import pytz

# Always load .env from the project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Replace these with your actual values
AUTHORIZATION = os.getenv("DISCORD_USER_TOKEN")
CHANNEL_ID = "1073672806669234238"

headers = {
    "Authorization": AUTHORIZATION,
    "User-Agent": "Mozilla/5.0",
}

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client['discord_scraper']  # or your existing DB name
collection = db[f"user_scraped_messages_{CHANNEL_ID}"]

if AUTHORIZATION:
    print(f"Loaded DISCORD_USER_TOKEN: {AUTHORIZATION[:4]}...{AUTHORIZATION[-4:]}")  # Debug: Masked token output
else:
    print("DISCORD_USER_TOKEN is not set or could not be loaded from .env!")

# Gemini setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("GEMINI_API_KEY is not set or could not be loaded from .env!")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)

# Try different model names that might be available
try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    print("Using gemini-1.5-flash model")
except Exception as e:
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        print("Using gemini-1.5-pro model")
    except Exception as e2:
        try:
            model = genai.GenerativeModel("gemini-pro")
            print("Using gemini-pro model")
        except Exception as e3:
            try:
                model = genai.GenerativeModel("gemini-1.0-pro")
                print("Using gemini-1.0-pro model")
            except Exception as e4:
                print(f"Failed to initialize any Gemini model. Errors:")
                print(f"gemini-1.5-flash: {e}")
                print(f"gemini-1.5-pro: {e2}")
                print(f"gemini-pro: {e3}")
                print(f"gemini-1.0-pro: {e4}")
                print("Please check your API key and available models.")
                print("You may need to enable billing or check quota limits.")
                exit(1)

def get_messages(channel_id, limit=100):
    url = f"https://discord.com/api/v9/channels/{channel_id}/messages?limit={limit}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch messages: {response.status_code} {response.text}")
        return []

def analyze_sentiment_with_gemini(text):
    try:
        prompt = f"Classify the sentiment of this message as positive, neutral, or negative. Only return the label.\nMessage: {text}"
        response = model.generate_content(prompt)
        return response.text.strip().lower()
    except Exception as e:
        print(f"Error analyzing sentiment: {e}")
        return "neutral"  # Default fallback

def group_messages_by_time(messages, time_window_minutes=30):
    """Group messages that are close in time."""
    grouped = []
    current_group = []
    for msg in sorted(messages, key=lambda x: x.get('timestamp', '')):
        msg_time = msg.get('timestamp')
        if isinstance(msg_time, str):
            try:
                msg_time = datetime.fromisoformat(msg_time)
            except Exception:
                msg_time = datetime.utcnow()
        msg['timestamp'] = msg_time
        if not current_group:
            current_group.append(msg)
        else:
            time_diff = (msg_time - current_group[-1]['timestamp']).total_seconds() / 60
            if time_diff < time_window_minutes:
                current_group.append(msg)
            else:
                grouped.append(current_group)
                current_group = [msg]
    if current_group:
        grouped.append(current_group)
    return grouped

def group_messages_by_author(messages, author, time_window_minutes=60):
    """Group messages from the same author within a time window."""
    author_messages = []
    for msg in messages:
        msg_author = msg.get('author')
        if msg_author:
            # If author is a dict, extract username or id
            if isinstance(msg_author, dict):
                msg_author_id = msg_author.get('username') or msg_author.get('id') or str(msg_author)
            else:
                msg_author_id = str(msg_author)
            
            if msg_author_id == author:
                author_messages.append(msg)
    
    return group_messages_by_time(author_messages, time_window_minutes)

def analyze_with_context(messages, target_author=None):
    """Enhanced analysis specifically for stock-related content"""
    try:
        # Try different models (your existing fallback logic)
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            print("Using gemini-1.5-flash model")
        except Exception as e:
            try:
                model = genai.GenerativeModel("gemini-1.5-pro")
                print("Using gemini-1.5-pro model")
            except Exception as e2:
                model = genai.GenerativeModel("gemini-pro")
                print("Using gemini-pro model")
        
        # Create enhanced prompt
        messages_text = [f'{msg.get("author", "")}: {msg.get("content", "")}' for msg in messages[-10:]]
        
        prompt = f"""
Analyze these Discord messages for stock trading information:

Target Author: {target_author if target_author else 'any author'}
Recent Messages:
{messages_text}

Focus on:
1. Stock ticker symbols ($AAPL, $TSLA, etc.)
2. Trading sentiment (bullish/bearish/neutral)
3. Specific actions (buy, sell, hold, short, long)
4. Price targets or stop losses
5. Trading strategy or reasoning
6. Market timing (entry/exit points)
7. Confidence level in the analysis

Respond in JSON format:
{{
  "has_trade_info": true/false,
  "tickers": ["$AAPL", "$TSLA"],
  "sentiment": "bullish/bearish/neutral",
  "action": "buy/sell/hold/short/long/none",
  "price_target": "specific price or null",
  "stop_loss": "specific price or null",
  "confidence": 1-10,
  "strategy": "brief description of trading logic",
  "urgency": "high/medium/low",
  "summary": "what the person is saying about the stock"
}}
"""
        
        response = model.generate_content(prompt)
        
        # Clean response (remove markdown)
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        try:
            return json.loads(response_text)
        except Exception as e:
            print(f"Error parsing JSON response: {e}")
            return {"play": None, "tickers": [], "action": None, "price": None, "confidence": 0.0}
            
    except Exception as e:
        print(f"Error in analyze_with_context: {e}")
        return {"play": None, "tickers": [], "action": None, "price": None, "confidence": 0.0}

def setup_mongodb():
    """Setup MongoDB connection and create indexes"""
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        print("❌ MONGO_URI not found in .env")
        return None
    
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client['discord_scraper']
        
        # Create indexes for better performance
        stock_messages = db['stock_messages']
        
        # Index on tickers for fast lookups
        stock_messages.create_index("tickers_mentioned")
        
        # Index on timestamp for date-based queries
        stock_messages.create_index("timestamp")
        
        # Index on author for user-based queries
        stock_messages.create_index("author_username")
        
        # Compound index for common queries
        stock_messages.create_index([("tickers_mentioned", 1), ("timestamp", -1)])
        
        print("✅ MongoDB connected successfully with indexes")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None

def parse_discord_timestamp(timestamp_str):
    """Parse Discord timestamp safely and convert to EST"""
    try:
        # Discord timestamps are often in ISO format with 'Z' suffix
        if isinstance(timestamp_str, str):
            if timestamp_str.endswith('Z'):
                dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            else:
                dt = datetime.fromisoformat(timestamp_str)
        elif isinstance(timestamp_str, (int, float)):
            # Unix timestamp
            dt = datetime.fromtimestamp(float(timestamp_str))
        else:
            dt = datetime.utcnow()
        
        # Convert to EST/EDT (handles daylight saving automatically)
        est_tz = pytz.timezone('America/New_York')
        return dt.astimezone(est_tz)
        
    except (ValueError, TypeError):
        # Fallback to current time in EST
        est_tz = pytz.timezone('America/New_York')
        return datetime.now(est_tz)

def is_stock_related_message(content):
    """Smart filtering for stock-related content"""
    if not content or content.strip() == "":
        return False, []
    
    # Stock ticker patterns ($AAPL, $TSLA, etc.)
    ticker_pattern = r'\$[A-Z]{1,5}'
    tickers = re.findall(ticker_pattern, content.upper())
    
    # Stock-related keywords (more comprehensive)
    stock_keywords = [
        'stock', 'shares', 'buy', 'sell', 'long', 'short', 'position',
        'entry', 'exit', 'target', 'stop loss', 'portfolio', 'market',
        'earnings', 'dividend', 'bullish', 'bearish', 'rally', 'crash',
        'trading', 'invest', 'hold', 'dump', 'pump', 'moon', 'rocket',
        'support', 'resistance', 'breakout', 'breakdown', 'volume',
        'catalyst', 'news', 'fda', 'approval', 'merger', 'acquisition'
    ]
    
    has_tickers = len(tickers) > 0
    has_keywords = any(keyword in content.lower() for keyword in stock_keywords)
    
    return has_tickers or has_keywords, tickers

def store_stock_message(db, message_data, ai_analysis):
    """Store only stock-related messages with enhanced metadata"""
    
    content = message_data.get('content', '')
    is_stock, tickers = is_stock_related_message(content)
    
    if not is_stock:
        return None  # Don't store non-stock messages
    
    # Extract author info
    author = message_data.get('author', {})
    if isinstance(author, dict):
        author_id = author.get('id')
        author_username = author.get('username', 'Unknown')
        author_discriminator = author.get('discriminator', '')
    else:
        author_id = str(author)
        author_username = str(author)
        author_discriminator = ''
    
    # Parse timestamp safely
    timestamp = parse_discord_timestamp(message_data['timestamp'])
    
    # Create comprehensive document
    stock_message_doc = {
        # Discord message data
        'discord_id': message_data['id'],
        'author_id': author_id,
        'author_username': author_username,
        'author_discriminator': author_discriminator,
        'content': content,
        'channel_id': CHANNEL_ID,  # Use the global CHANNEL_ID
        'guild_id': message_data.get('guild_id'),
        'timestamp': timestamp,
        'created_at': datetime.now(pytz.timezone('America/New_York')),
        
        # Stock analysis data
        'tickers_mentioned': tickers,
        'is_stock_related': True,
        'has_trade_signal': ai_analysis.get('has_trade_info', False),
        
        # AI Analysis results
        'ai_analysis': ai_analysis,
        
        # Enhanced metadata for filtering
        'confidence_score': ai_analysis.get('confidence', 0),
        'action_type': ai_analysis.get('action', 'none'),
        'sentiment': ai_analysis.get('sentiment', 'neutral'),
        'urgency': ai_analysis.get('urgency', 'low'),
        
        # Search optimization
        'search_text': content.lower(),  # For text search
        'ticker_count': len(tickers)
    }
    
    # Store in MongoDB
    try:
        stock_messages = db['stock_messages']
        result = stock_messages.insert_one(stock_message_doc)
        
        print(f"💾 Stored stock message: {tickers} - {author_username}")
        return result.inserted_id
        
    except Exception as e:
        print(f"❌ Failed to store message: {e}")
        return None

def get_stock_insights(db, days_back=7):
    """Get insights from stored stock messages"""
    
    stock_messages = db['stock_messages']
    
    # Get recent messages
    cutoff_date = datetime.now(pytz.timezone('America/New_York')) - timedelta(days=days_back)
    
    # Most mentioned tickers
    pipeline = [
        {"$match": {"created_at": {"$gte": cutoff_date}}},
        {"$unwind": "$tickers_mentioned"},
        {"$group": {"_id": "$tickers_mentioned", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    
    top_tickers = list(stock_messages.aggregate(pipeline))
    
    # Sentiment analysis
    sentiment_pipeline = [
        {"$match": {"created_at": {"$gte": cutoff_date}}},
        {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}}
    ]
    
    sentiment_breakdown = list(stock_messages.aggregate(sentiment_pipeline))
    
    return {
        "top_tickers": top_tickers,
        "sentiment_breakdown": sentiment_breakdown,
        "total_messages": stock_messages.count_documents({"created_at": {"$gte": cutoff_date}})
    }


if __name__ == "__main__":
    # Setup MongoDB
    db = setup_mongodb()
    if db is None:
        print("❌ Cannot proceed without MongoDB connection")
        exit(1)
    
    messages = get_messages(CHANNEL_ID)
    if messages:
        # Process and store messages
        all_plays = []
        stored_count = 0
        skipped_count = 0
        
        # Extract authors (your existing logic)
        authors = set()
        for msg in messages:
            author = msg.get('author')
            if author:
                if isinstance(author, dict):
                    author_id = author.get('username') or author.get('id') or str(author)
                else:
                    author_id = str(author)
                authors.add(author_id)
        
        for author in authors:
            grouped = group_messages_by_author(messages, author, time_window_minutes=60)
            for group in grouped:
                analysis = analyze_with_context(group, target_author=author)
                
                # Store each message individually
                for msg in group:
                    stored_id = store_stock_message(db, msg, analysis)
                    if stored_id:
                        stored_count += 1
                    else:
                        skipped_count += 1
                
                all_plays.append({
                    'author': author,
                    'messages': [msg.get('content', '') for msg in group],
                    'analysis': analysis
                })
        
        # Print results
        print(f"\n📊 Processing complete:")
        print(f"   ✅ Stored: {stored_count} stock messages")
        print(f"   ⏭️  Skipped: {skipped_count} non-stock messages")
        
        # Get insights
        insights = get_stock_insights(db, days_back=1)
        print(f"\n🔍 Today's Stock Insights:")
        print(f"   Total messages: {insights['total_messages']}")
        print(f"   Top tickers: {[t['_id'] for t in insights['top_tickers'][:5]]}")
        
        print(json.dumps(all_plays, indent=2, default=str))
    else:
        print("No messages fetched.") 