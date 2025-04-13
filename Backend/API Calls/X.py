from playwright.sync_api import sync_playwright
from google import generativeai as genai
from dotenv import load_dotenv
from playwright_stealth import stealth_sync

import os

load_dotenv(dotenv_path="../../env/.env")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def scrape_twitter(query: str, limit: int = 5):
    tweets = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Set to False so you can see it working
        page = browser.new_page()
        search_url = f"https://twitter.com/search?q={query}&src=typed_query&f=live"
        page.goto(search_url)

        # Wait for tweets to load
        page.wait_for_timeout(5000)

        tweet_elements = page.locator("article").all()
        for i, tweet in enumerate(tweet_elements):
            if i >= limit:
                break

            full_text = tweet.text_content()
            tweets.append(full_text)

        browser.close()
    return tweets



def launch_browser_with_login():
    with sync_playwright() as p:
        user_data_dir = "./twitter_profile"
        browser = p.chromium.launch_persistent_context(user_data_dir=user_data_dir, headless=False)
        page = browser.new_page()

        # Enable stealth mode
        stealth_sync(page)

        page.goto("https://twitter.com/login")
        print("⚠️ Log into Twitter manually, then close the window.")
        page.wait_for_timeout(300000)  # 5 minutes to log in
        browser.close()

launch_browser_with_login()

# results = scrape_twitter("Tesla")
# for i, r in enumerate(results):
#     print(f"\nTweet #{i+1}:\n{r}\n{'-'*50}")
