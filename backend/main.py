from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import httpx
from dotenv import load_dotenv
import math

load_dotenv()

app = FastAPI(title="FitAI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openrouter/free"


async def call_ai(system_prompt: str, user_message: str) -> str:
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "FitAI",
    }

    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "max_tokens": 1500,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=body)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"OpenRouter error: {response.text}")
        data = response.json()
        return data["choices"][0]["message"]["content"]


# ── Request Models ──────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    user_profile: Optional[dict] = None

class WorkoutRequest(BaseModel):
    fitness_goal: str
    fitness_level: str
    available_days: int
    equipment: str
    age: int
    weight: float
    height: float
    health_conditions: Optional[str] = ""
    workout_duration: int = 45

class DietRequest(BaseModel):
    age: int
    weight: float
    height: float
    gender: str
    activity_level: str
    diet_goal: str
    dietary_restrictions: Optional[str] = ""
    allergies: Optional[str] = ""

class BMIRequest(BaseModel):
    weight: float
    height: float
    age: int
    gender: str


# ── Endpoints ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "FitAI API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    profile_context = ""
    if req.user_profile:
        p = req.user_profile
        profile_context = f"""
User Profile:
- Name: {p.get('name', 'User')}
- Age: {p.get('age', 'Not specified')}
- Weight: {p.get('weight', 'Not specified')} kg
- Height: {p.get('height', 'Not specified')} cm
- Goal: {p.get('goal', 'General fitness')}
- Fitness level: {p.get('level', 'Beginner')}
"""

    system_prompt = f"""You are FitAI, an expert AI personal trainer and nutritionist for students.
You are friendly, motivating, and science-based. You provide specific, actionable advice.
Always be encouraging and adapt advice to the student lifestyle (limited time, budget, equipment).
{profile_context}
Keep responses concise (under 300 words), structured with bullet points when helpful.
Never recommend anything potentially dangerous. Always suggest consulting a doctor for medical concerns."""

    history_text = ""
    if req.history:
        for msg in req.history[-6:]:
            role = "User" if msg.get("role") == "user" else "FitAI"
            history_text += f"{role}: {msg.get('content', '')}\n"

    full_message = f"{history_text}User: {req.message}"

    try:
        reply = await call_ai(system_prompt, full_message)
        return {"response": reply, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/workout")
async def generate_workout(req: WorkoutRequest):
    system_prompt = "You are an expert personal trainer. Create detailed, safe, and effective workout plans."

    user_message = f"""Create a detailed, personalized weekly workout plan for a student with these parameters:

Fitness Goal: {req.fitness_goal}
Fitness Level: {req.fitness_level}
Available Days per Week: {req.available_days}
Equipment Available: {req.equipment}
Age: {req.age} years
Weight: {req.weight} kg
Height: {req.height} cm
Health Conditions: {req.health_conditions or 'None'}
Preferred workout duration: {req.workout_duration} minutes

Generate a complete {req.available_days}-day workout plan with exercises, sets, reps, and rest times.
Format with clear headings for each day. Include warm-up and cool-down. Add form tips."""

    try:
        plan = await call_ai(system_prompt, user_message)
        return {"workout_plan": plan, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/diet")
async def generate_diet(req: DietRequest):
    if req.gender.lower() == "male":
        bmr = 88.362 + (13.397 * req.weight) + (4.799 * req.height) - (5.677 * req.age)
    else:
        bmr = 447.593 + (9.247 * req.weight) + (3.098 * req.height) - (4.330 * req.age)

    activity_multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }
    tdee = bmr * activity_multipliers.get(req.activity_level, 1.375)

    if req.diet_goal == "weight_loss":
        target_calories = tdee - 400
    elif req.diet_goal == "muscle_gain":
        target_calories = tdee + 300
    else:
        target_calories = tdee

    system_prompt = "You are an expert nutritionist. Create practical, affordable meal plans for students."

    user_message = f"""Create a detailed 7-day meal plan for a student:

Age: {req.age}, Gender: {req.gender}
Weight: {req.weight} kg, Height: {req.height} cm
Activity Level: {req.activity_level}
Diet Goal: {req.diet_goal}
Dietary Restrictions: {req.dietary_restrictions or 'None'}
Allergies: {req.allergies or 'None'}
Target Daily Calories: {target_calories:.0f} calories

Create a complete 7-day meal plan with breakfast, lunch, dinner and snacks.
Make meals affordable and easy to prepare for students.
Include a grocery list and meal prep tips."""

    try:
        plan = await call_ai(system_prompt, user_message)
        return {
            "diet_plan": plan,
            "nutrition_profile": {
                "bmr": round(bmr),
                "tdee": round(tdee),
                "target_calories": round(target_calories),
            },
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/bmi")
async def calculate_bmi(req: BMIRequest):
    height_m = req.height / 100
    bmi = round(req.weight / (height_m ** 2), 1)

    if bmi < 18.5:
        category = "Underweight"
        color = "blue"
        advice = "You are below healthy weight. Focus on nutrient-dense foods and strength training to build muscle mass."
    elif bmi < 25:
        category = "Normal weight"
        color = "green"
        advice = "Great job! You're in the healthy BMI range. Maintain with balanced diet and regular exercise."
    elif bmi < 30:
        category = "Overweight"
        color = "yellow"
        advice = "Slightly above healthy range. A combination of cardio, strength training, and mindful eating can help."
    else:
        category = "Obese"
        color = "red"
        advice = "Consider consulting a healthcare provider. Start with low-impact exercise and dietary changes."

    height_m = req.height / 100
    ideal_min = round(18.5 * (height_m ** 2), 1)
    ideal_max = round(24.9 * (height_m ** 2), 1)

    if req.gender.lower() == "male":
        body_fat = round(max(0, 1.20 * bmi + 0.23 * req.age - 16.2), 1)
    else:
        body_fat = round(max(0, 1.20 * bmi + 0.23 * req.age - 5.4), 1)

    return {
        "bmi": bmi,
        "category": category,
        "color": color,
        "advice": advice,
        "ideal_weight_range": {"min": ideal_min, "max": ideal_max},
        "estimated_body_fat": body_fat,
        "status": "success",
    }