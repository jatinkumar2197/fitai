# FitAI Deployment Guide

## Backend → Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial FitAI commit"
git remote add origin https://github.com/YOUR_USERNAME/fitai.git
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | fitai-backend |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### Step 3: Add Environment Variable

In Render dashboard → **Environment** tab:

```
GEMINI_API_KEY = your_actual_api_key_here
```

### Step 4: Deploy

Click **Create Web Service**. Render will build and deploy automatically.

Your backend URL will be: `https://fitai-backend.onrender.com`

> **Note:** Free Render instances spin down after 15 minutes of inactivity. First request after sleep may take 30–60 seconds.

---

## Frontend → Vercel

### Step 1: Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 3: Add Environment Variable

In Vercel → **Settings → Environment Variables**:

```
VITE_API_URL = https://fitai-backend.onrender.com
```

### Step 4: Deploy

Click **Deploy**. Vercel builds and deploys automatically.

Your frontend URL will be: `https://fitai.vercel.app`

---

## Deploy via CLI

### Backend (Render)

```bash
# Install render CLI
# Or use the render.yaml file approach
```

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: fitai-backend
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

### Frontend (Vercel CLI)

```bash
cd frontend
vercel --prod
# Follow prompts, set VITE_API_URL when asked
```

---

## Update CORS for Production

The backend already allows all origins (`allow_origins=["*"]`). For production security, restrict to your Vercel domain:

In `backend/main.py`, change:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-fitai.vercel.app"],
    ...
)
```

---

## Verify Deployment

After deploying, test all endpoints:

```bash
# Health check
curl https://fitai-backend.onrender.com/health

# BMI calculation (no API key needed)
curl -X POST https://fitai-backend.onrender.com/api/bmi \
  -H "Content-Type: application/json" \
  -d '{"weight": 70, "height": 175, "age": 22, "gender": "male"}'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend returns 500 | Check `GEMINI_API_KEY` is set correctly in Render env vars |
| CORS error in browser | Verify `VITE_API_URL` matches your Render backend URL exactly |
| Frontend shows blank page | Check Vercel build logs; ensure `dist` is the output dir |
| Render sleeps too long | Upgrade to a paid Render plan, or use a cron job to ping `/health` every 10 min |
| Gemini API error | Ensure your API key is valid at [aistudio.google.com](https://aistudio.google.com) |
