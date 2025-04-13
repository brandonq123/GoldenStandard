import os
import praw
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv(dotenv_path="/env/.env")

# Reddit setup
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")


def fetch_reddit_comments(ticker: str, count: int = 5):
    subreddit = reddit.subreddit("wallstreetbets")
    posts = subreddit.search(ticker, sort="new", limit=count)
    comments_data = []

    for post in posts:
        post.comments.replace_more(limit=0)
        for comment in post.comments:
            if (
                comment.author
                and comment.author.name.lower() != "visualmod"
                and len(comment.body.strip()) > 20
                and ticker.upper() in comment.body.upper()
            ):
                comments_data.append({
                    "content": comment.body.strip(),
                    "url": f"https://reddit.com{post.permalink}"
                })
                break  # one per post

    return comments_data


def analyze_with_gemini(comments):
    input_for_gemini = f"""
Here are Reddit comments about a stock. Return only relevant ones. For each one, respond in this JSON format:

{{
  "title": "Reddit - r/wallstreetbets",
  "content": "...",
  "date": "YYYY-MM-DD",
  "type": "forum",
  "sentiment": "positive | neutral | negative",
  "url": "https://reddit.com/post"
}}

Today is {datetime.utcnow().strftime('%Y-%m-%d')}. Use today's date.

Comments:
{[c['content'] for c in comments]}
"""

    response = model.generate_content(input_for_gemini)
    return response.text  # this will be a JSON list


# 🔄 Put it all together
if __name__ == "__main__":
    raw_comments = fetch_reddit_comments("NVDA", count=5)
    if not raw_comments:
        print("No relevant comments found.")
    else:
        analyzed = analyze_with_gemini(raw_comments)
        print(analyzed)