from google import generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="../env/.env")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Who is the best nba player of all time?")
print(response.text)

# def generateSentimentAnylsis(prompt: str):
