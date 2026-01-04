# Railway Deployment Fix

## Issue
Railway failed to deploy because it couldn't determine how to build the app.

## Solution
I've added multiple configuration files to ensure Railway can deploy successfully:

### 1. railway.json
Tells Railway to use Dockerfile and specifies the start command.

### 2. nixpacks.toml
Alternative build configuration using Nixpacks (Railway's default builder).

### 3. Procfile
Heroku-style process file that Railway also supports.

### 4. Dockerfile
Already exists - Railway should use this.

## Deployment Steps

### Option A: Deploy from Root Directory (Recommended)
Railway needs to deploy from the `tts-api/` subdirectory:

1. In Railway dashboard, go to your service settings
2. Click "Settings" → "Build"
3. Set **Root Directory** to: `tts-api`
4. Set **Build Command** to: (leave empty, Dockerfile will handle it)
5. Set **Start Command** to: `python app.py`
6. Click "Deploy"

### Option B: Deploy tts-api as Separate Repo
```bash
cd tts-api
git init
git add .
git commit -m "TTS API for Railway"
git remote add origin https://github.com/yourusername/tts-api.git
git push -u origin main
```

Then deploy this new repo to Railway.

### Option C: Use Railway CLI
```bash
cd tts-api
railway login
railway init
railway up
```

## Environment Variables to Set in Railway
```
TTS_API_KEY=your-secure-api-key-here
PORT=8000
```

## Expected Build Process
1. Railway detects Dockerfile
2. Builds Docker image with Python 3.9 + espeak-ng + ffmpeg
3. Installs Python dependencies
4. Clones NeuTTS Air repository
5. Downloads model weights (~2.3GB)
6. Starts FastAPI server on PORT

## Troubleshooting

### If build still fails:
1. Check Railway logs for specific error
2. Ensure Root Directory is set to `tts-api`
3. Try using Nixpacks instead of Dockerfile:
   - In Settings → Build
   - Change Builder to "Nixpacks"
   - Railway will use nixpacks.toml

### If deployment succeeds but crashes:
1. Check memory usage (NeuTTS Air needs ~3GB RAM)
2. Upgrade Railway plan if needed
3. Check logs for model loading errors

## Testing After Deployment
```bash
# Get your Railway URL
RAILWAY_URL="https://your-service.railway.app"

# Test health endpoint
curl $RAILWAY_URL/health

# Test TTS generation
curl -X POST $RAILWAY_URL/tts \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Railway!"}' \
  --output test.wav
```

## Notes
- First deployment will take 5-10 minutes (downloading model)
- Subsequent deployments will be faster (cached layers)
- Railway free tier has 500 hours/month
- Consider upgrading for production use
