import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi
from datetime import datetime
import pytz

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def create_analyzed_collection():
    """Create a new collection with only messages that have full AI analysis"""
    
    # Connect to MongoDB
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        print("❌ MONGO_URI not found in .env")
        return
    
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client['discord_scraper']
        
        # Source collection (all messages)
        stock_messages = db['stock_messages']
        
        # New collection (only fully analyzed messages)
        analyzed_messages = db['analyzed_messages']
        
        print("🔍 Creating Analyzed Messages Collection")
        print("=" * 50)
        
        # Find messages with proper AI analysis
        proper_analysis_query = {
            "ai_analysis.has_trade_info": {"$exists": True},
            "ai_analysis.sentiment": {"$exists": True},
            "ai_analysis.confidence": {"$exists": True, "$gt": 0}
        }
        
        # Count messages that will be copied
        total_analyzed = stock_messages.count_documents(proper_analysis_query)
        print(f"📊 Found {total_analyzed} messages with full AI analysis")
        
        if total_analyzed == 0:
            print("❌ No messages with full AI analysis found")
            return
        
        # Clear existing analyzed collection (optional)
        analyzed_messages.drop()
        print("🗑️  Cleared existing analyzed_messages collection")
        
        # Copy messages with full analysis to new collection
        analyzed_docs = list(stock_messages.find(proper_analysis_query))
        
        # Insert into new collection
        result = analyzed_messages.insert_many(analyzed_docs)
        print(f"✅ Copied {len(result.inserted_ids)} messages to analyzed_messages collection")
        
        # Create indexes for better performance
        analyzed_messages.create_index("tickers_mentioned")
        analyzed_messages.create_index("ai_analysis.sentiment")
        analyzed_messages.create_index("ai_analysis.confidence")
        analyzed_messages.create_index("timestamp")
        analyzed_messages.create_index("author_username")
        print("📈 Created performance indexes")
        
        # Show summary of the new collection
        print(f"\n📋 Analyzed Messages Collection Summary:")
        print(f"  Total messages: {analyzed_messages.count_documents({})}")
        
        # Sentiment breakdown
        sentiment_pipeline = [
            {"$group": {"_id": "$ai_analysis.sentiment", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        sentiment_breakdown = list(analyzed_messages.aggregate(sentiment_pipeline))
        
        print(f"  Sentiment breakdown:")
        for sentiment in sentiment_breakdown:
            print(f"    {sentiment['_id']}: {sentiment['count']} messages")
        
        # Confidence breakdown
        confidence_pipeline = [
            {"$group": {"_id": "$ai_analysis.confidence", "count": {"$sum": 1}}},
            {"$sort": {"_id": -1}}
        ]
        confidence_breakdown = list(analyzed_messages.aggregate(confidence_pipeline))
        
        print(f"  Confidence scores:")
        for conf in confidence_breakdown:
            print(f"    {conf['_id']}/10: {conf['count']} messages")
        
        # Top tickers
        ticker_pipeline = [
            {"$unwind": "$tickers_mentioned"},
            {"$group": {"_id": "$tickers_mentioned", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        top_tickers = list(analyzed_messages.aggregate(ticker_pipeline))
        
        print(f"  Top tickers:")
        for ticker in top_tickers:
            print(f"    {ticker['_id']}: {ticker['count']} mentions")
        
        # Show example of clean data
        example = analyzed_messages.find_one()
        if example:
            print(f"\n✅ Example of Clean Analyzed Data:")
            print(f"  Author: {example['author_username']}")
            print(f"  Content: {example['content'][:100]}...")
            print(f"  Sentiment: {example['ai_analysis']['sentiment']}")
            print(f"  Confidence: {example['ai_analysis']['confidence']}/10")
            print(f"  Tickers: {example['ai_analysis']['tickers']}")
            print(f"  Action: {example['ai_analysis']['action']}")
        
        print(f"\n🎯 Collection 'analyzed_messages' is ready!")
        print(f"  • Contains only high-quality AI analyzed messages")
        print(f"  • Perfect for Gemini prompts and analysis")
        print(f"  • Indexed for fast queries")
        print(f"  • Clean, structured data")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_collection_comparison():
    """Show comparison between original and analyzed collections"""
    
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        return
    
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client['discord_scraper']
        
        stock_messages = db['stock_messages']
        analyzed_messages = db['analyzed_messages']
        
        print(f"\n📊 Collection Comparison:")
        print(f"  stock_messages: {stock_messages.count_documents({})} total messages")
        print(f"  analyzed_messages: {analyzed_messages.count_documents({})} clean messages")
        print(f"  Quality: {analyzed_messages.count_documents({})/stock_messages.count_documents({})*100:.1f}% of messages are fully analyzed")
        
    except Exception as e:
        print(f"Error in comparison: {e}")

if __name__ == "__main__":
    success = create_analyzed_collection()
    if success:
        show_collection_comparison()
