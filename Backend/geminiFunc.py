from google import generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="env/.env")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_text(prompt: str):
    response = model.generate_content(prompt)
    return response.text

print(generate_text("Who is the best nba player of all time?"))