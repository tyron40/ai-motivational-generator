# 🚂 Railway Deployment - Step-by-Step Guide

## ✅ Prerequisites Checklist
- [x] Dockerfile exists in `tts-api/` directory
- [x] railway.json configured
- [x] Code pushed to GitHub
- [x] Railway account created

---

## 📋 Deployment Steps

### Step 1: Create New Project on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select repository: `tyron40/ai-motivational-generator`

### Step 2: Configure Root Directory ⚠️ CRITICAL

**This is the most important step!**

1. After project is created, click on your service
2. Go to **Settings** tab
3. Scroll to **"Build"** section
4. Find **"Root Directory"** field
5. Enter: `tts-api`
6. Click **"Save"**

**Why this matters:** Railway needs to know that your Dockerfile is in the `tts-api/` subdirectory, not the root of the repository.

### Step 3: Set Environment Variables

1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add:
   - **Key:** `TTS_API_KEY`
   - **Value:** `your-secure-random-api-key-here`
   
**Generate a secure API key:**
```bash
# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Or use any random string generator
```

### Step 4: Trigger Deployment

1. Railway should auto-deploy after setting Root Directory
2. If not, click **"Deploy"** button
3. Watch the build logs in the **"Deployments"** tab

### Step 5: Monitor Build Progress

**Expected build stages:**
1. ✅ Cloning repository
2. ✅ Detecting Dockerfile (should say "Using Dockerfile")
3. ✅ Building Docker image
4. ✅ Installing system dependencies (espeak-ng, ffmpeg)
5. ✅ Installing Python packages
6. ✅ Cloning NeuTTS Air
7. ✅ Starting application
8. ✅ Health check passing

**Build time:** 5-10 minutes (first deploy)

### Step 6: Verify Deployment

1. Once deployed, Railway will provide a URL like:
   `https://your-service.railway.app`

2. Test the health endpoint:
```bash
curl https://your-service.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "tts_engine": "active",
  "cpu_mode": true
}
```

3. Test TTS generation:
```bash
curl -X POST https://your-service.railway.app/tts \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Railway!"}' \
  --output test.wav
```

---

## 🔧 Troubleshooting

### Issue: "Dockerfile does not exist"
**Solution:** Make sure Root Directory is set to `tts-api` in Settings → Build

### Issue: "Builder not found"
**Solution:** Railway should auto-detect Dockerfile. Check that:
- Root Directory = `tts-api`
- Dockerfile exists in `tts-api/` directory
- Latest code is pushed to GitHub

### Issue: Build timeout
**Solution:** 
- First build takes longer (downloading models)
- Increase timeout in Settings if needed
- Railway free tier has build time limits

### Issue: Out of memory
**Solution:**
- NeuTTS Air model is ~2.3GB
- Upgrade Railway plan if needed
- Model loads into memory on startup

### Issue: Health check failing
**Solution:**
- Check logs for errors
- Verify espeak-ng installed correctly
- Ensure port 8080 is exposed

---

## 📊 Expected Resource Usage

- **Memory:** ~3-4GB (model + runtime)
- **CPU:** Low (CPU-based inference)
- **Disk:** ~5GB (model + dependencies)
- **Build Time:** 5-10 minutes
- **Cold Start:** 30-60 seconds

---

## 🎯 Post-Deployment

### Update Backend Configuration

Once Railway deployment is successful, update your backend `.env`:

```env
# backend/.env
RAILWAY_TTS_URL=https://your-service.railway.app
TTS_API_KEY=your-api-key-here
OPENAI_API_KEY=your-openai-key
```

### Test Full Integration

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Generate a motivational speech
5. Verify audio plays correctly

---

## 📝 Railway Dashboard Checklist

- [ ] Root Directory set to `tts-api`
- [ ] Environment variable `TTS_API_KEY` set
- [ ] Build logs show "Using Dockerfile"
- [ ] Deployment status is "Active"
- [ ] Health endpoint returns 200 OK
- [ ] TTS endpoint generates audio
- [ ] Domain/URL noted for backend config

---

## 🚀 Success Indicators

✅ Build completes without errors
✅ Service shows "Active" status
✅ Health endpoint accessible
✅ TTS generation works
✅ API key authentication works
✅ Audio quality is good

---

## 📞 Support

If deployment fails after following these steps:
1. Check Railway build logs for specific errors
2. Verify all files are pushed to GitHub
3. Ensure Root Directory is exactly `tts-api`
4. Check Railway status page for platform issues

**Repository:** https://github.com/tyron40/ai-motivational-generator
