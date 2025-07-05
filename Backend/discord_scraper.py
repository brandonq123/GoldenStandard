import requests
from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta
import json

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
    try:
        prompt = f"""
You are analyzing Discord messages for trade plays. Pay special attention to:
1. Messages from {target_author if target_author else 'any author'}
2. Messages that contain ticker symbols ($AAPL, $TSLA, etc.)
3. Messages with trade-related keywords (enter, exit, target, stop loss, etc.)
4. Messages that reference previous messages or provide updates

Recent messages (most recent first):
{[f'{msg.get('author', '')}: {msg.get('content', '')}' for msg in messages[-10:]]}

Identify any complete trade plays and their details. Respond in JSON with keys: 'play', 'tickers', 'action', 'price', 'confidence'.
"""
        response = model.generate_content(prompt)
        
        # Clean the response text - remove markdown code blocks if present
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:]  # Remove ```json
        if response_text.startswith('```'):
            response_text = response_text[3:]  # Remove ```
        if response_text.endswith('```'):
            response_text = response_text[:-3]  # Remove trailing ```
        
        response_text = response_text.strip()
        
        try:
            return json.loads(response_text)
        except Exception as e:
            print(f"Error parsing JSON response: {e}")
            return {"play": None, "tickers": [], "action": None, "price": None, "confidence": 0.0}
    except Exception as e:
        print(f"Error in analyze_with_context: {e}")
        return {"play": None, "tickers": [], "action": None, "price": None, "confidence": 0.0}



if __name__ == "__main__":
    messages = get_messages(CHANNEL_ID)
    if messages:
        # Example: group by author and time, then analyze
        all_plays = []
        # Extract author usernames or IDs from the author objects
        authors = set()
        for msg in messages:
            author = msg.get('author')
            if author:
                # If author is a dict, extract username or id
                if isinstance(author, dict):
                    author_id = author.get('username') or author.get('id') or str(author)
                else:
                    author_id = str(author)
                authors.add(author_id)
        
        for author in authors:
            grouped = group_messages_by_author(messages, author, time_window_minutes=60)
            for group in grouped:
                analysis = analyze_with_context(group, target_author=author)
                all_plays.append({
                    'author': author,
                    'messages': [msg.get('content', '') for msg in group],
                    'analysis': analysis
                })
        print(json.dumps(all_plays, indent=2, default=str))
    else:
        print("No messages fetched.") 