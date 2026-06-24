# FitAI – AI Gym Trainer for Students

A full-stack AI-powered fitness web application built with React + FastAPI, powered by Google Gemini.

## Features

- 🤖 **AI Fitness Coach** — Chat with Gemini-powered personal trainer
- 💪 **Workout Generator** — Custom plans based on your goals & equipment
- 🥗 **Diet Planner** — 7-day personalized meal plans with calorie targets
- 📊 **BMI Calculator** — Body analysis with health recommendations
- 📅 **Workout Scheduler** — Plan your weekly training calendar
- 📈 **Progress Dashboard** — Track weight & workout frequency with charts
- 📚 **Exercise Library** — 15+ exercises with instructions & muscle groups
- 💧 **Water Tracker** — Daily hydration monitoring with streaks
- ✅ **Habit Tracker** — Build consistent fitness habits with streak tracking
- 🌙 **Dark/Light Mode** — Toggle-able theme
- 📱 **Responsive Design** — Works on all screen sizes

## Tech Stack

**Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Recharts + React Router

**Backend:** FastAPI (Python 3.12+) + Google Gemini API

**Storage:** localStorage (no database required)

**Deployment:** Vercel (frontend) + Render (backend)

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.12+
- Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:8000 (already set)
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/chat` | AI fitness chat |
| POST | `/api/workout` | Generate workout plan |
| POST | `/api/diet` | Generate diet plan |
| POST | `/api/bmi` | Calculate BMI |

### Example: Chat Request

```json
POST /api/chat
{
  "message": "How do I build muscle as a student?",
  "history": [],
  "user_profile": {
    "name": "Alex",
    "age": 20,
    "weight": 65,
    "height": 175,
    "goal": "muscle_gain",
    "level": "beginner"
  }
}
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full Vercel + Render deployment guide.

---

## Project Structure

```
fitai/
├── backend/
│   ├── main.py              # FastAPI app + all endpoints
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/      # Navbar
    │   │   └── ui/          # Shared UI components
    │   ├── pages/           # All page components
    │   ├── hooks/           # useLocalStorage, useTheme
    │   ├── lib/             # api.ts, utils.ts
    │   └── types/           # TypeScript interfaces
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_key_here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

---

## License

MIT — free to use for personal and educational projects.
