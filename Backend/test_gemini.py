import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    try:
        genai.configure(api_key=api_key)
        
        # Try different models (flash first as it's cheaper)
        models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"]
        
        for model_name in models_to_try:
            try:
                print(f"\n🔍 Testing {model_name}...")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content("Say 'Hello, this is a test!'")
                print(f"✅ {model_name} works!")
                print(f"Response: {response.text}")
                return True
            except Exception as e:
                print(f"❌ {model_name} failed: {str(e)[:100]}...")
        
        print("\n❌ No models worked. Check your API access.")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing Gemini API Access...")
    success = test_gemini()
    
    if not success:
        print("\n🔧 Troubleshooting:")
        print("1. Go to https://makersuite.google.com/app/apikey")
        print("2. Verify your API key is active")
        print("3. Check billing: https://console.cloud.google.com/billing")
        print("4. Enable API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
        print("5. Check quota limits: https://console.cloud.google.com/apis/credentials") 