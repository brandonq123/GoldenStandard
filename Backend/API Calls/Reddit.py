import praw
from dotenv import load_dotenv
import os

# Get the absolute path to the .env file
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "../.."))
env_path = os.path.join(project_root, "env", ".env")

print("Looking for .env file at:", env_path)
load_dotenv(dotenv_path=env_path)

print("Client ID:", os.getenv("REDDIT_CLIENT_ID"))
print("Secret:", os.getenv("REDDIT_CLIENT_SECRET"))
print("User Agent:", os.getenv("REDDIT_USER_AGENT"))

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
        post.comments.replace_more(limit=0)

        for comment in post.comments:
            if (
                comment.author
                and comment.author.name.lower() != "visualmod"
                and len(comment.body.strip()) > 20
                and ticker.upper() in comment.body.upper()
            ):
                comments_data.append({
                    "id": f"reddit-{post.id}-{comment.id}",
                    "author": comment.author.name,
                    "content": comment.body.strip(),
                    "upvotes": comment.score,
                    "replies": len(comment.replies),
                    "time": f"{int((post.created_utc - comment.created_utc) // 3600)}h ago",
                    "sentiment": "neutral",
                    "isInfluential": comment.score > 100,
                    "source": "reddit",
                    "context_url": f"https://reddit.com{post.permalink}"
                })
                break  # FIRST valid comment only

    return comments_data

# Run test
if __name__ == "__main__":
    comments = fetch_reddit_comments_for_ticker(reddit, "NVDA", count=5)
    print(comments)