# SupportOS AI — Production Deployment Guide

## 1. Overview

SupportOS AI is deployed as a decoupled architecture:
- **Backend**: Render Web Service (FastAPI / Uvicorn / Python 3.14)
- **Frontend**: Vercel Serverless Platform (Next.js 16 / React 19 / TypeScript)

---

## 2. Backend Deployment (Render)

1. Log into Render Dashboard and connect GitHub repo `MD-KAIF16/SupportOS-AI`.
2. Select **Root Directory**: `backend`.
3. Set **Build Command**: `pip install -r requirements.txt`.
4. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Configure Environment Variables in Render:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `SECRET_KEY`
   - `ALLOWED_ORIGINS` = `https://supportos-ai-mocha.vercel.app`
6. Set **Health Check Path**: `/health`.

---

## 3. Frontend Deployment (Vercel)

1. Import project in Vercel.
2. Select **Root Directory**: `frontend`.
3. Configure Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://supportos-ai-backend.onrender.com`
4. Deploy and verify HTTPS connection to deployed backend.
