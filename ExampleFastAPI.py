import os
import jwt
import logging
from typing import List, Dict, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, JSON, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timezone
import json
import anthropic
import io
from PyPDF2 import PdfReader
import base64


# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Create FastAPI app
app = FastAPI(title="Class Management API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# How to write routes


@app.get("/classes", response_model=List[ClassResponse])
async def get_user_classes(
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    try:
        logger.info(f"Fetching all classes for user_id: {current_user['user_id']}")
        classes = db.query(Class).filter(
            Class.created_by_user_id == current_user["user_id"]
        ).all()
        logger.info(f"Found {len(classes)} classes")
        return classes
    except Exception as e:
        logger.error(f"Error fetching classes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch classes: {str(e)}")
    
    
@app.post("/study-session", response_model=StudySessionResponse)
async def create_study_session(
        session_data: StudySessionCreate,
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    try:
        # First verify that the class exists and belongs to the user
        class_obj = db.query(Class).filter(
            Class.class_id == session_data.class_id,
            Class.created_by_user_id == current_user["user_id"]
        ).first()

        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")

        logger.info(f"Creating study session for class: {session_data.class_id}")
        new_session = StudySession(
            class_id=session_data.class_id,
            session_name=session_data.session_name
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        logger.info(f"Created study session with id: {new_session.study_session_id}")
        return new_session
    except Exception as e:
        logger.error(f"Error creating study session: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create study session: {str(e)}")
    
