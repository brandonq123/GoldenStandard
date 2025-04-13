import requests
from google import generativeai as genai
from dotenv import load_dotenv
from serpapi import GoogleSearch
import os

load_dotenv(dotenv_path="env/.env")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def get_news_about(query: str, num_articles=5):
    print("Running get_news_about...")
    print("SERPAPI_KEY:", os.getenv("SERPAPI_KEY"))
    print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))

    params = {
        "q": query,
        "engine": "google_news",
        "api_key": os.getenv("SERPAPI_KEY"),
        "num": num_articles
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        print("FULL RESPONSE:", results)
        articles = results.get("news_results", [])
        if not articles:
            print("No articles found.")
        for article in articles:
            print(f"📰 {article.get('title')}")
            print(f"📅 {article.get('date')}")
            print(f"🌐 {article.get('link')}")
            print(f"📝 {article.get('snippet')}")
            print("-" * 50)
    except Exception as e:
        print("Error fetching news:", e)

get_news_about("Tesla")