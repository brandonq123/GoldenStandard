import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import google.generativeai as genai
from dotenv import load_dotenv
import requests
from textblob import TextBlob
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import pickle

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Initialize Gemini AI
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        else:
            logger.warning("GEMINI_API_KEY not found, AI features will be limited")
            self.gemini_model = None
        
        # Initialize ML models
        self.sentiment_model = None
        self.price_prediction_model = None
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.scaler = StandardScaler()
        
        # Load pre-trained models if available
        self.load_models()
    
    def load_models(self):
        """Load pre-trained models from disk"""
        try:
            if os.path.exists('models/sentiment_model.pkl'):
                with open('models/sentiment_model.pkl', 'rb') as f:
                    self.sentiment_model = pickle.load(f)
                logger.info("Loaded pre-trained sentiment model")
            
            if os.path.exists('models/price_prediction_model.pkl'):
                with open('models/price_prediction_model.pkl', 'rb') as f:
                    self.price_prediction_model = pickle.load(f)
                logger.info("Loaded pre-trained price prediction model")
                
        except Exception as e:
            logger.warning(f"Could not load pre-trained models: {e}")
    
    def save_models(self):
        """Save trained models to disk"""
        os.makedirs('models', exist_ok=True)
        
        if self.sentiment_model:
            with open('models/sentiment_model.pkl', 'wb') as f:
                pickle.dump(self.sentiment_model, f)
        
        if self.price_prediction_model:
            with open('models/price_prediction_model.pkl', 'wb') as f:
                pickle.dump(self.price_prediction_model, f)
    
    def analyze_sentiment_gemini(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment using Gemini AI"""
        if not self.gemini_model:
            return self.analyze_sentiment_basic(text)
        
        try:
            prompt = f"""
            Analyze the sentiment of this financial text and provide a detailed analysis.
            
            Text: {text}
            
            Respond in JSON format with the following structure:
            {{
                "sentiment": "positive|negative|neutral",
                "confidence": 0.0-1.0,
                "magnitude": 0.0-1.0,
                "key_topics": ["topic1", "topic2"],
                "emotion": "fear|greed|optimism|pessimism|neutral",
                "summary": "Brief summary of the sentiment"
            }}
            
            Focus on financial context and market implications.
            """
            
            response = self.gemini_model.generate_content(prompt)
            result = json.loads(response.text)
            
            return {
                "score": self._sentiment_to_score(result["sentiment"]),
                "magnitude": result["magnitude"],
                "label": result["sentiment"],
                "confidence": result["confidence"],
                "key_topics": result["key_topics"],
                "emotion": result["emotion"],
                "summary": result["summary"]
            }
            
        except Exception as e:
            logger.error(f"Gemini sentiment analysis failed: {e}")
            return self.analyze_sentiment_basic(text)
    
    def analyze_sentiment_basic(self, text: str) -> Dict[str, Any]:
        """Basic sentiment analysis using TextBlob"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            # Convert polarity to sentiment label
            if polarity > 0.1:
                sentiment = "positive"
            elif polarity < -0.1:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            return {
                "score": polarity,
                "magnitude": abs(polarity),
                "label": sentiment,
                "confidence": 0.7,
                "key_topics": [],
                "emotion": "neutral",
                "summary": f"Basic sentiment analysis: {sentiment}"
            }
            
        except Exception as e:
            logger.error(f"Basic sentiment analysis failed: {e}")
            return {
                "score": 0.0,
                "magnitude": 0.0,
                "label": "neutral",
                "confidence": 0.0,
                "key_topics": [],
                "emotion": "neutral",
                "summary": "Analysis failed"
            }
    
    def _sentiment_to_score(self, sentiment: str) -> float:
        """Convert sentiment label to numerical score"""
        mapping = {
            "positive": 0.8,
            "negative": -0.8,
            "neutral": 0.0
        }
        return mapping.get(sentiment, 0.0)
    
    def analyze_stock_buzz(self, symbol: str, social_data: List[Dict]) -> Dict[str, Any]:
        """Analyze overall stock buzz from social media data"""
        if not social_data:
            return self._empty_buzz_analysis()
        
        # Aggregate sentiment scores
        sentiments = []
        topics = []
        emotions = []
        
        for post in social_data:
            sentiment = self.analyze_sentiment_gemini(post.get('content', ''))
            sentiments.append(sentiment['score'])
            topics.extend(sentiment.get('key_topics', []))
            emotions.append(sentiment.get('emotion', 'neutral'))
        
        # Calculate aggregate metrics
        avg_sentiment = np.mean(sentiments) if sentiments else 0.0
        sentiment_std = np.std(sentiments) if sentiments else 0.0
        
        # Most common topics and emotions
        topic_counts = {}
        for topic in topics:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
        
        emotion_counts = {}
        for emotion in emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        # Determine overall sentiment label
        if avg_sentiment > 0.2:
            overall_sentiment = "positive"
        elif avg_sentiment < -0.2:
            overall_sentiment = "negative"
        else:
            overall_sentiment = "neutral"
        
        # Calculate buzz intensity
        buzz_intensity = len(social_data) * abs(avg_sentiment)
        
        return {
            "symbol": symbol,
            "overall_sentiment": {
                "score": avg_sentiment,
                "magnitude": abs(avg_sentiment),
                "label": overall_sentiment,
                "confidence": min(0.9, 0.5 + abs(avg_sentiment) * 0.4)
            },
            "buzz_metrics": {
                "intensity": buzz_intensity,
                "volume": len(social_data),
                "sentiment_volatility": sentiment_std,
                "dominant_emotion": max(emotion_counts.items(), key=lambda x: x[1])[0] if emotion_counts else "neutral"
            },
            "trending_topics": sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:5],
            "sentiment_distribution": {
                "positive": len([s for s in sentiments if s > 0.1]),
                "negative": len([s for s in sentiments if s < -0.1]),
                "neutral": len([s for s in sentiments if -0.1 <= s <= 0.1])
            },
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def predict_price_movement(self, symbol: str, historical_data: List[Dict], 
                             sentiment_data: Dict) -> Dict[str, Any]:
        """Predict short-term price movement using ML and sentiment"""
        try:
            # Extract features from historical data
            if len(historical_data) < 10:
                return self._empty_prediction()
            
            # Calculate technical indicators
            closes = [d['close'] for d in historical_data]
            volumes = [d.get('volume', 0) for d in historical_data]
            
            # Simple moving averages
            sma_5 = np.mean(closes[-5:]) if len(closes) >= 5 else closes[-1]
            sma_20 = np.mean(closes[-20:]) if len(closes) >= 20 else closes[-1]
            
            # Price momentum
            price_momentum = (closes[-1] - closes[-5]) / closes[-5] if len(closes) >= 5 else 0
            
            # Volume trend
            volume_trend = (volumes[-1] - np.mean(volumes[-5:])) / np.mean(volumes[-5:]) if len(volumes) >= 5 else 0
            
            # Sentiment features
            sentiment_score = sentiment_data.get('overall_sentiment', {}).get('score', 0)
            sentiment_magnitude = sentiment_data.get('overall_sentiment', {}).get('magnitude', 0)
            buzz_intensity = sentiment_data.get('buzz_metrics', {}).get('intensity', 0)
            
            # Combine features
            features = [
                price_momentum,
                volume_trend,
                (closes[-1] - sma_5) / sma_5,
                (closes[-1] - sma_20) / sma_20,
                sentiment_score,
                sentiment_magnitude,
                buzz_intensity / 1000  # Normalize
            ]
            
            # Simple prediction logic (can be enhanced with ML models)
            prediction_score = (
                features[0] * 0.3 +  # Price momentum
                features[1] * 0.2 +  # Volume trend
                features[2] * 0.2 +  # SMA5 deviation
                features[3] * 0.1 +  # SMA20 deviation
                features[4] * 0.15 + # Sentiment
                features[5] * 0.05   # Sentiment magnitude
            )
            
            # Determine prediction direction
            if prediction_score > 0.02:
                direction = "bullish"
                confidence = min(0.9, 0.5 + abs(prediction_score) * 10)
            elif prediction_score < -0.02:
                direction = "bearish"
                confidence = min(0.9, 0.5 + abs(prediction_score) * 10)
            else:
                direction = "neutral"
                confidence = 0.5
            
            return {
                "symbol": symbol,
                "prediction": {
                    "direction": direction,
                    "confidence": confidence,
                    "score": prediction_score,
                    "expected_change_percent": prediction_score * 5,  # Rough estimate
                    "timeframe": "24h"
                },
                "factors": {
                    "price_momentum": features[0],
                    "volume_trend": features[1],
                    "technical_indicators": features[2] + features[3],
                    "sentiment_impact": features[4],
                    "buzz_impact": features[6]
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Price prediction failed: {e}")
            return self._empty_prediction()
    
    def generate_ai_summary(self, symbol: str, stock_data: Dict, 
                           sentiment_data: Dict, prediction_data: Dict) -> Dict[str, Any]:
        """Generate comprehensive AI summary using Gemini"""
        if not self.gemini_model:
            return self._generate_basic_summary(symbol, stock_data, sentiment_data, prediction_data)
        
        try:
            prompt = f"""
            Generate a comprehensive market analysis for {symbol} based on the following data:
            
            Stock Data:
            - Current Price: ${stock_data.get('price', 0):.2f}
            - Change: {stock_data.get('change', 0):.2f} ({stock_data.get('change_percent', 0):.2f}%)
            - Volume: {stock_data.get('volume', 'N/A')}
            - Market Cap: {stock_data.get('market_cap', 'N/A')}
            
            Sentiment Analysis:
            - Overall Sentiment: {sentiment_data.get('overall_sentiment', {}).get('label', 'neutral')}
            - Sentiment Score: {sentiment_data.get('overall_sentiment', {}).get('score', 0):.3f}
            - Buzz Intensity: {sentiment_data.get('buzz_metrics', {}).get('intensity', 0):.1f}
            - Trending Topics: {sentiment_data.get('trending_topics', [])}
            
            Price Prediction:
            - Direction: {prediction_data.get('prediction', {}).get('direction', 'neutral')}
            - Confidence: {prediction_data.get('prediction', {}).get('confidence', 0):.1%}
            - Expected Change: {prediction_data.get('prediction', {}).get('expected_change_percent', 0):.2f}%
            
            Provide a professional analysis in JSON format with:
            {{
                "market_overview": "Brief market overview",
                "sentiment_analysis": "Detailed sentiment breakdown",
                "technical_analysis": "Technical indicators summary",
                "risk_assessment": "Key risks and considerations",
                "recommendation": "buy|hold|sell with reasoning",
                "confidence_level": "high|medium|low",
                "key_factors": ["factor1", "factor2", "factor3"]
            }}
            """
            
            response = self.gemini_model.generate_content(prompt)
            result = json.loads(response.text)
            
            return {
                "symbol": symbol,
                "summary": result,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"AI summary generation failed: {e}")
            return self._generate_basic_summary(symbol, stock_data, sentiment_data, prediction_data)
    
    def _generate_basic_summary(self, symbol: str, stock_data: Dict, 
                               sentiment_data: Dict, prediction_data: Dict) -> Dict[str, Any]:
        """Generate basic summary without AI"""
        sentiment = sentiment_data.get('overall_sentiment', {}).get('label', 'neutral')
        prediction = prediction_data.get('prediction', {}).get('direction', 'neutral')
        
        return {
            "symbol": symbol,
            "summary": {
                "market_overview": f"{symbol} is currently trading at ${stock_data.get('price', 0):.2f} with {stock_data.get('change_percent', 0):.2f}% change.",
                "sentiment_analysis": f"Social media sentiment is {sentiment} with moderate buzz activity.",
                "technical_analysis": "Technical indicators show mixed signals.",
                "risk_assessment": "Consider market volatility and external factors.",
                "recommendation": "hold",
                "confidence_level": "medium",
                "key_factors": ["Price momentum", "Volume trends", "Market sentiment"]
            },
            "generated_at": datetime.now().isoformat()
        }
    
    def _empty_buzz_analysis(self) -> Dict[str, Any]:
        """Return empty buzz analysis structure"""
        return {
            "symbol": "",
            "overall_sentiment": {
                "score": 0.0,
                "magnitude": 0.0,
                "label": "neutral",
                "confidence": 0.0
            },
            "buzz_metrics": {
                "intensity": 0.0,
                "volume": 0,
                "sentiment_volatility": 0.0,
                "dominant_emotion": "neutral"
            },
            "trending_topics": [],
            "sentiment_distribution": {"positive": 0, "negative": 0, "neutral": 0},
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def _empty_prediction(self) -> Dict[str, Any]:
        """Return empty prediction structure"""
        return {
            "symbol": "",
            "prediction": {
                "direction": "neutral",
                "confidence": 0.0,
                "score": 0.0,
                "expected_change_percent": 0.0,
                "timeframe": "24h"
            },
            "factors": {
                "price_momentum": 0.0,
                "volume_trend": 0.0,
                "technical_indicators": 0.0,
                "sentiment_impact": 0.0,
                "buzz_impact": 0.0
            },
            "timestamp": datetime.now().isoformat()
        }

# Global AI service instance
ai_service = AIService()
