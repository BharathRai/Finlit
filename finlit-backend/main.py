# finlit-backend/main.py
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os # Import os to read environment variables
from dotenv import load_dotenv # If using .env locally

# Load .env file for local development (optional)
load_dotenv()

# Import other modules...
from models import (
    QuizSubmissionPayload, UserProfile, Recommendation, QuizQuestionData, ContentItem
)
from data_store import (
    save_user_profile, get_user_profile, get_all_content,
    select_initial_quiz_set
)
from quiz_logic import build_profile_from_quiz
from recommendation_logic import generate_recommendations_for_user

app = FastAPI(
    title="FinLit Backend API",
    description="API for Financial Literacy App with Quiz and Recommendations",
    version="0.1.3",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# --- CONFIGURE CORS FROM ENVIRONMENT VARIABLE ---
# Get allowed origins from environment variable, split by comma
origins_str = os.getenv("CORS_ORIGINS", "") # Default to empty string if not set
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

# Fallback to default if environment variable is not set or empty
if not origins:
    print("WARN: CORS_ORIGINS environment variable not set or empty. Defaulting to local development URL.")
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # Add your frontend Render URL here as a fallback if needed,
        # but using the ENV VAR is better for deployment.
        # e.g., "https://your-frontend-name.onrender.com"
    ]

print(f"Configuring CORS for origins: {origins}") # Log the origins being used

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Use the list derived from ENV VAR
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END CORS CONFIGURATION ---

async def get_current_user_id() -> str: return "test_user_01" # Replace with real auth

@app.get("/api")
async def read_root(): return {"message": "Welcome to the FinLit Backend API!"}

@app.get("/api/quiz/questions", response_model=List[QuizQuestionData])
async def get_initial_quiz_endpoint(limit: int = Query(default=10, ge=5, le=25)):
    print(f"Endpoint /api/quiz/questions called with limit={limit}")
    try:
        questions = select_initial_quiz_set(num_questions=limit)
        if not questions: print("Error: select_initial_quiz_set returned no questions."); raise HTTPException(status_code=404, detail="Could not select quiz questions.")
        print(f"Returning {len(questions)} selected questions.")
        return questions
    except Exception as e: print(f"Error selecting quiz questions: {e}"); raise HTTPException(status_code=500, detail="Could not retrieve quiz questions.")

@app.post("/api/quiz/submit", response_model=UserProfile)
async def submit_quiz(payload: QuizSubmissionPayload, user_id: str = Depends(get_current_user_id)):
    if not payload.answers: raise HTTPException(status_code=400, detail="No answers provided.")
    print(f"Endpoint /api/quiz/submit: User {user_id}, Answers: {len(payload.answers)}")
    try:
        profile = build_profile_from_quiz(user_id=user_id, quiz_answers=payload.answers)
        save_user_profile(profile)
        print(f"Generated profile for {user_id}: {profile.model_dump()}")
        return profile
    except Exception as e: print(f"Error processing quiz: {e}"); raise HTTPException(status_code=500, detail="Error processing quiz.")

@app.get("/api/recommendations", response_model=List[Recommendation])
async def get_recommendations_endpoint(user_id: str = Depends(get_current_user_id), limit: int = Query(default=5, ge=1, le=10)):
    print(f"Endpoint /api/recommendations: User {user_id}, Limit: {limit}")
    profile = get_user_profile(user_id)
    if not profile: print(f"Profile not found for {user_id}."); raise HTTPException(status_code=404, detail="User profile not found. Complete quiz first.")
    try:
        recommendations = generate_recommendations_for_user(profile=profile, limit=limit)
        print(f"Generated {len(recommendations)} recommendations for {user_id}")
        return recommendations
    except Exception as e: print(f"Error generating recommendations: {e}"); raise HTTPException(status_code=500, detail="Error generating recommendations.")

@app.get("/api/content", response_model=List[ContentItem])
async def get_all_available_content(): return get_all_content()

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server via main block...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) # Added reload=True for convenience if running directly