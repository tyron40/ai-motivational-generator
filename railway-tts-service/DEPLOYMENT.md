# Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository (optional but recommended)

## Deployment Steps

### Option 1: Deploy from GitHub
1. Push this directory to a GitHub repository
2. Go to Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the Dockerfile
6. Set environment variables in Railway dashboard:
   - `TTS_API_KEY`: Your secure API key

### Option 2: Deploy using Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Environment Variables
Set these in Railway dashboard under "Variables":
- `TTS_API_KEY`: Your secure API key (generate a strong random string)
- `PORT`: Automatically set by Railway (usually 8000)

## Post-Deployment
1. Note your Railway service URL (e.g., `https://your-service.railway.app`)
2. Test the health endpoint: `GET https://your-service.railway.app/health`
3. Use this URL in your backend configuration

## API Usage
```bash
# Health check
curl https://your-service.railway.app/health

# Generate speech
curl -X POST https://your-service.railway.app/tts \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "voice_url": "https://example.com/voice.wav"}' \
  --output speech.wav
```

## Monitoring
- Check logs in Railway dashboard
- Monitor CPU/Memory usage
- Set up alerts for downtime

## Scaling
- Railway auto-scales based on usage
- CPU-based TTS is efficient for moderate loads
- Consider upgrading plan for high-volume usage

## Troubleshooting
- Check Railway logs for errors
- Verify environment variables are set
- Ensure API key matches between services
- Test with mock mode first (NeuTTS not installed)
