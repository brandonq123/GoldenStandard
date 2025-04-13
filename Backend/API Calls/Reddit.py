import praw
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="env/.env")

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

subreddit = reddit.subreddit("wallstreetbets")
ticker = "NVDA"

for post in subreddit.search(ticker, sort="new", limit=5):
    print(f"{post.title}\n{post.url}\n")