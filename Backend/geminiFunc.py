from google import generativeai as genai

genai.configure(api_key="AIzaSyBt1iE-8tZgkne451ozgjUva4FOVBSY6ug")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Who is the best nba player of all time?")
print(response.text)

def generateSentimentAnylsis(prompt: str):
