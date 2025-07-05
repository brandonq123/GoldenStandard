import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Discord setup
AUTHORIZATION = os.getenv("DISCORD_USER_TOKEN")
CHANNEL_ID = "1073672806669234238"

headers = {
    "Authorization": AUTHORIZATION,
    "User-Agent": "Mozilla/5.0",
}

# Gemini setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def get_single_message(channel_id):
    """Get just 1 message from Discord"""
    url = f"https://discord.com/api/v9/channels/{channel_id}/messages?limit=1"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        messages = response.json()
        if messages:
            return messages[0]  # Return the first (most recent) message
    else:
        print(f"Failed to fetch messages: {response.status_code} {response.text}")
    return None

def analyze_single_message(message):
    """Analyze a single Discord message for trade-related content"""
    try:
        # Try different models
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
        
        # Extract message content
        content = message.get('content', '')
        author = message.get('author', {})
        if isinstance(author, dict):
            author_name = author.get('username', 'Unknown')
        else:
            author_name = str(author)
        
        prompt = f"""
Analyze this Discord message for any trade-related information:

Author: {author_name}
Message: {content}

Look for:
1. Stock ticker symbols (like $AAPL, $TSLA, etc.)
2. Trade actions (buy, sell, enter, exit, etc.)
3. Price targets or stop losses
4. Any trading strategy mentioned

You must respond with ONLY valid JSON. No other text before or after the JSON.

Example response format:
{{
  "has_trade_info": false,
  "tickers": [],
  "action": "none",
  "price_target": null,
  "confidence": 1,
  "summary": "No trade information found"
}}

Now analyze the message and respond with JSON only:
"""
        
        print(f"\n🔍 Analyzing message from {author_name}...")
        print(f"Message: {content[:100]}...")
        
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
        
        # Try to parse JSON response
        try:
            result = json.loads(response_text)
            print(f"\n✅ Analysis complete!")
            return result
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse JSON response: {e}")
            print(f"Cleaned response: {response_text}")
            
            # Fallback: create a basic result
            return {
                "has_trade_info": False,
                "tickers": [],
                "action": "none",
                "price_target": None,
                "confidence": 1,
                "summary": "Could not parse AI response",
                "raw_response": response_text
            }
        
    except Exception as e:
        print(f"❌ Error analyzing message: {e}")
        return {"error": str(e)}

def main():
    print("🧪 Testing Single Discord Message Analysis")
    print("=" * 50)
    
    # Check API keys
    if not AUTHORIZATION:
        print("❌ DISCORD_USER_TOKEN not found in .env")
        return
    
    if not GEMINI_API_KEY:
        print("❌ GEMINI_API_KEY not found in .env")
        return
    
    print("✅ API keys found")
    
    # Get single message
    print("\n📡 Fetching 1 Discord message...")
    message = get_single_message(CHANNEL_ID)
    
    if not message:
        print("❌ No message found")
        return
    
    print(f"✅ Message fetched successfully")
    
    # Analyze the message
    print("\n🤖 Running AI analysis...")
    analysis = analyze_single_message(message)
    
    # Display results
    print("\n📊 RESULTS:")
    print("=" * 50)
    print(json.dumps(analysis, indent=2))
    
    # Summary
    if analysis.get('has_trade_info'):
        print(f"\n🎯 Trade Info Found!")
        print(f"Tickers: {analysis.get('tickers', [])}")
        print(f"Action: {analysis.get('action', 'None')}")
        print(f"Price Target: {analysis.get('price_target', 'None')}")
        print(f"Confidence: {analysis.get('confidence', 'N/A')}/10")
    else:
        print(f"\n📝 No trade info found in this message")

if __name__ == "__main__":
    main() 