import praw
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="../env/.env")

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

def fetch_reddit_comments_for_ticker(reddit, ticker: str, count: int = 5):
    subreddit = reddit.subreddit("wallstreetbets")
    posts = subreddit.search(ticker, sort="new", limit=count)
    comments_data = []

    for post in posts:
        post.comments.replace_more(limit=0)  # Expand top-level comments
        if post.comments:
            top_comment = post.comments[0]
            comments_data.append({
                "id": f"reddit-{post.id}-{top_comment.id}",
                "author": top_comment.author.name if top_comment.author else "Anonymous",
                "content": top_comment.body,
                "upvotes": top_comment.score,
                "replies": len(top_comment.replies),
                "time": f"{int((post.created_utc - top_comment.created_utc) // 3600)}h ago",
                "sentiment": "neutral",  # You can use TextBlob or similar to infer
                "isInfluential": top_comment.score > 100,
                "source": "reddit"
            })

    print(comments_data)

fetch_reddit_comments_for_ticker(reddit, "NVDA")