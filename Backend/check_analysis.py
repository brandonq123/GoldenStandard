import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi
from datetime import datetime, timedelta
import pytz

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def check_ai_analysis_coverage():
    """Check how many messages have AI analysis vs fallback data"""
    
    # Connect to MongoDB
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        print("❌ MONGO_URI not found in .env")
        return
    
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client['discord_scraper']
        stock_messages = db['stock_messages']
        
        print("🔍 Analyzing AI Analysis Coverage in MongoDB")
        print("=" * 50)
        
        # Total messages
        total_messages = stock_messages.count_documents({})
        print(f"📊 Total messages in collection: {total_messages}")
        
        # Messages with proper AI analysis
        proper_analysis = stock_messages.count_documents({
            "ai_analysis.has_trade_info": {"$exists": True}
        })
        
        # Messages with fallback data (no AI analysis)
        fallback_data = stock_messages.count_documents({
            "ai_analysis.play": None,
            "ai_analysis.tickers": [],
            "ai_analysis.action": None,
            "ai_analysis.price": None,
            "ai_analysis.confidence": 0.0
        })
        
        # Messages with partial analysis
        partial_analysis = total_messages - proper_analysis - fallback_data
        
        print(f"\n📈 Analysis Breakdown:")
        print(f"  ✅ Proper AI Analysis: {proper_analysis} ({proper_analysis/total_messages*100:.1f}%)")
        print(f"  ⚠️  Partial Analysis: {partial_analysis} ({partial_analysis/total_messages*100:.1f}%)")
        print(f"  ❌ Fallback Data: {fallback_data} ({fallback_data/total_messages*100:.1f}%)")
        
        # Recent messages analysis
        est_tz = pytz.timezone('America/New_York')
        one_day_ago = datetime.now(est_tz) - timedelta(days=1)
        
        recent_total = stock_messages.count_documents({
            "created_at": {"$gte": one_day_ago}
        })
        
        recent_proper = stock_messages.count_documents({
            "created_at": {"$gte": one_day_ago},
            "ai_analysis.has_trade_info": {"$exists": True}
        })
        
        recent_fallback = stock_messages.count_documents({
            "created_at": {"$gte": one_day_ago},
            "ai_analysis.play": None,
            "ai_analysis.tickers": [],
            "ai_analysis.action": None,
            "ai_analysis.price": None,
            "ai_analysis.confidence": 0.0
        })
        
        print(f"\n📅 Last 24 Hours:")
        print(f"  Total: {recent_total}")
        print(f"  Proper Analysis: {recent_proper}")
        print(f"  Fallback Data: {recent_fallback}")
        
        # Show examples of each type
        print(f"\n🔍 Examples:")
        
        # Example of proper analysis
        proper_example = stock_messages.find_one({
            "ai_analysis.has_trade_info": {"$exists": True}
        })
        if proper_example:
            print(f"\n✅ Proper AI Analysis Example:")
            print(f"  Content: {proper_example['content'][:100]}...")
            print(f"  Sentiment: {proper_example['ai_analysis'].get('sentiment', 'N/A')}")
            print(f"  Confidence: {proper_example['ai_analysis'].get('confidence', 'N/A')}")
            print(f"  Tickers: {proper_example['ai_analysis'].get('tickers', [])}")
        
        # Example of fallback data
        fallback_example = stock_messages.find_one({
            "ai_analysis.play": None,
            "ai_analysis.tickers": [],
            "ai_analysis.action": None,
            "ai_analysis.price": None,
            "ai_analysis.confidence": 0.0
        })
        if fallback_example:
            print(f"\n❌ Fallback Data Example:")
            print(f"  Content: {fallback_example['content'][:100]}...")
            print(f"  Analysis: {fallback_example['ai_analysis']}")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        if fallback_data > 0:
            print(f"  • You have {fallback_data} messages without AI analysis")
            print(f"  • This is likely due to Gemini API quota limits")
            print(f"  • Consider upgrading to a paid Gemini plan for more requests")
            print(f"  • Or run the scraper multiple times when quota resets")
        
        if proper_analysis > 0:
            print(f"  • {proper_analysis} messages have proper AI analysis")
            print(f"  • These are ready for sentiment analysis and trading insights")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_ai_analysis_coverage()
