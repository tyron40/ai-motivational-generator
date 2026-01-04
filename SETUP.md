# Setup Guide - AI Motivational Generator

Complete setup instructions for Windows + VS Code.

## Prerequisites

- Node.js 18+ (https://nodejs.org/)
- Python 3.9+ (https://www.python.org/)
- VS Code (https://code.visualstudio.com/)
- Git (https://git-scm.com/)

## Project Structure

```
ai-motivational-generator/
├── railway-tts-service/    # Python FastAPI TTS microservice
├── backend/                # Node.js Express backend
├── frontend/               # React frontend
├── preset-voices/          # Voice reference samples
└── uploads/                # User-uploaded voices (auto-created)
```

## Step 1: Clone/Setup Project

```bash
# If starting fresh
cd Desktop
mkdir ai-motivational-generator
cd ai-motivational-generator

# Open in VS Code
code .
```

## Step 2: Setup Railway TTS Service

```bash
cd railway-tts-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and set your API key
# TTS_API_KEY=your-secure-random-key-here

# Test locally
python app.py
```

The service will run on http://localhost:8000

Test it:
```bash
curl http://localhost:8000/health
```

## Step 3: Deploy to Railway

1. Go to https://railway.app and sign up
2. Create new project
3. Deploy from GitHub or use Railway CLI
4. Set environment variable: `TTS_API_KEY`
5. Note your Railway URL (e.g., https://your-service.railway.app)

See `railway-tts-service/DEPLOYMENT.md` for detailed instructions.

## Step 4: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit `.env`:
```
OPENAI_API_KEY=sk-your-openai-api-key
TTS_SERVICE_URL=https://your-railway-service.railway.app
TTS_API_KEY=same-key-as-railway
PORT=3001
```

Get OpenAI API key from: https://platform.openai.com/api-keys

Start backend:
```bash
npm run dev
```

Backend runs on http://localhost:3001

## Step 5: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on http://localhost:3000

## Step 6: Test the Application

1. Open http://localhost:3000 in your browser
2. Enter a motivational prompt
3. Select speech or song mode
4. Choose a voice style
5. Generate text
6. Convert to audio
7. Play and download

## Environment Variables Summary

### Railway TTS Service (.env)
```
TTS_API_KEY=your-secure-api-key-here
PORT=8000
```

### Backend (.env)
```
OPENAI_API_KEY=sk-your-openai-api-key
TTS_SERVICE_URL=https://your-railway-service.railway.app
TTS_API_KEY=same-as-railway-key
PORT=3001
```

### Frontend
No .env needed (uses proxy to backend)

## Troubleshooting

### Railway TTS Service Issues

**Problem**: NeuTTS not installed
- **Solution**: Service runs in mock mode for testing. For production, ensure neutts-air is properly installed.

**Problem**: Railway cold start timeout
- **Solution**: First request may take 30-60 seconds. Subsequent requests are fast.

### Backend Issues

**Problem**: OpenAI API errors
- **Solution**: Check API key is valid and has credits

**Problem**: Cannot connect to TTS service
- **Solution**: Verify Railway URL and API key match

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Ensure backend is running on port 3001

**Problem**: Audio doesn't play
- **Solution**: Check browser console for errors, ensure audio format is supported

## Production Deployment

### Backend + Frontend (Bolt.new or Vercel)

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Deploy backend with built frontend
3. Set environment variables in hosting platform

### Railway (TTS Service)

Already deployed in Step 3.

## Voice Files

Place sample voice files in `preset-voices/` directory:
- deep_motivational_male.wav
- calm_female_narrator.wav
- energetic_sports_voice.wav
- wise_mentor.wav

See `preset-voices/README.md` for requirements.

## Security Notes

- Never commit .env files
- Use strong API keys
- Enable rate limiting in production
- Validate all user inputs
- Scan uploaded audio files

## Legal Compliance

✅ Only style-based voices (NO celebrity cloning)
✅ Users can only upload their OWN voice
✅ Clear AI disclosure on all generated content
✅ No YouTube audio usage

## Support

For issues:
1. Check logs in VS Code terminal
2. Verify all environment variables
3. Test each service independently
4. Check Railway logs for TTS service

## Next Steps

1. Add preset voice files
2. Configure cloud storage for uploads (Supabase/S3)
3. Add user authentication
4. Implement usage tracking
5. Add more voice styles
6. Optimize audio generation speed
