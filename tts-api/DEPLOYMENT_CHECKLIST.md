# NeuTTS Air TTS API - Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Setup (Windows)
- [ ] Python 3.9 installed
- [ ] espeak-ng installed and configured
- [ ] Git installed
- [ ] VS Code installed

### Repository Setup
- [ ] NeuTTS Air cloned in `tts-api/neutts-air/`
- [ ] Virtual environment created
- [ ] Dependencies installed from requirements.txt
- [ ] `.env` file created with secure API_KEY
- [ ] Tested locally on http://localhost:8080

### Files Verification
- [ ] `app.py` - FastAPI application (uses real NeuTTS Air)
- [ ] `requirements.txt` - All dependencies including NeuTTS Air deps
- [ ] `Dockerfile` - Railway deployment config
- [ ] `README.md` - Complete documentation
- [ ] `.env.example` - Environment template
- [ ] `.gitignore` - Proper exclusions
- [ ] `setup-windows.bat` - Windows setup script
- [ ] `start.bat` - Quick start script
- [ ] `neutts-air/` - Cloned NeuTTS Air repository

## 🚂 Railway Deployment

### Step 1: Prepare Repository
```bash
cd tts-api
git init
git add .
git commit -m "NeuTTS Air TTS API - Production Ready"
```

### Step 2: Push to GitHub
```bash
# Create new repo on GitHub first, then:
git remote add origin https://github.com/yourusername/neutts-air-api.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Railway
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects Dockerfile ✅

### Step 4: Configure Environment Variables
In Railway Dashboard → Variables, set:
```
API_KEY=your-secure-random-key-here-use-strong-password
BACKBONE_REPO=neuphonic/neutts-air
CODEC_REPO=neuphonic/neucodec
```

**Note:** PORT is automatically set by Railway

### Step 5: Monitor Deployment
- [ ] Check deployment logs
- [ ] Wait for "✅ NeuTTS Air model loaded successfully"
- [ ] First deployment takes 5-10 minutes (model download)
- [ ] Note your Railway URL: `https://your-service.railway.app`

### Step 6: Test Deployment
```bash
# Health check
curl https://your-service.railway.app/health

# Generate speech
curl -X POST https://your-service.railway.app/tts \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Testing NeuTTS Air deployment"}' \
  --output test.wav
```

## 🔗 Integration with Bolt.new

### Backend Integration
Add to your Bolt.new backend (server.js):

```javascript
const TTS_API_URL = process.env.TTS_API_URL; // Railway URL
const TTS_API_KEY = process.env.TTS_API_KEY;

async function generateSpeech(text, voiceUrl = null, refText = null) {
  const response = await fetch(`${TTS_API_URL}/tts`, {
    method: 'POST',
    headers: {
      'x-api-key': TTS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      voice_url: voiceUrl,
      ref_text: refText
    })
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

// API endpoint
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voiceUrl, refText } = req.body;
    const audio = await generateSpeech(text, voiceUrl, refText);
    
    res.set('Content-Type', 'audio/wav');
    res.set('X-AI-Generated', 'true');
    res.send(Buffer.from(audio));
  } catch (error) {
    console.error('TTS generation failed:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Environment Variables for Bolt.new
```
TTS_API_URL=https://your-service.railway.app
TTS_API_KEY=your-secure-api-key
```

## 🧪 Testing

### Local Testing
```bash
# 1. Start the API
cd tts-api
.\start.bat

# 2. Test health endpoint
curl http://localhost:8080/health

# 3. Generate speech
curl -X POST http://localhost:8080/tts \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from NeuTTS Air"}' \
  --output test.wav

# 4. Play the audio
test.wav
```

### Production Testing
```bash
# Replace with your Railway URL
curl -X POST https://your-service.railway.app/tts \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Production test"}' \
  --output production-test.wav
```

## 🔐 Security Checklist

- [ ] Strong API_KEY set (min 32 characters, random)
- [ ] API_KEY stored in Railway environment variables (not in code)
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Input validation active (max 10000 chars)
- [ ] Temporary file cleanup working
- [ ] No sensitive data in logs
- [ ] Rate limiting considered (add if needed)

## 📊 Monitoring

### Railway Dashboard
- [ ] Check CPU usage (should be moderate)
- [ ] Check memory usage (2-4 GB expected)
- [ ] Monitor request logs
- [ ] Set up alerts for downtime

### Health Checks
```bash
# Automated health check
while true; do
  curl -s https://your-service.railway.app/health | jq
  sleep 60
done
```

## ⚖️ Legal Compliance Verification

- [ ] No celebrity voice cloning implemented
- [ ] Style-based voices only
- [ ] User voice upload is reference-only (not stored)
- [ ] AI disclosure in response headers
- [ ] Watermarking active (Perth)
- [ ] Legal comments in code
- [ ] Terms of service clear

## 🐛 Troubleshooting

### Model Loading Fails
- Check Railway logs for specific error
- Verify internet connection (models download from HuggingFace)
- Increase Railway timeout if needed
- Check disk space

### API Returns 500
- Check Railway logs
- Verify espeak-ng is installed in Docker
- Test locally first
- Check model files downloaded correctly

### Slow Response Times
- First request is slower (cold start)
- Subsequent requests should be fast
- Consider Railway plan upgrade if needed
- Check CPU/memory usage

### Voice Cloning Not Working
- Verify reference audio is valid WAV/MP3
- Check reference audio URL is accessible
- Ensure ref_text is provided
- Test with sample voices first

## 📈 Performance Optimization

- [ ] Model loaded once at startup ✅
- [ ] Temporary files cleaned up ✅
- [ ] CPU-only mode for Railway ✅
- [ ] Consider caching reference encodings (future)
- [ ] Monitor and optimize based on usage

## 🎯 Success Criteria

- [ ] API responds to health checks
- [ ] Speech generation works with default voice
- [ ] Voice cloning works with reference audio
- [ ] Bolt.new can fetch and play audio
- [ ] No errors in Railway logs
- [ ] Response times acceptable (<5s)
- [ ] Legal compliance verified
- [ ] Documentation complete

## 📝 Post-Deployment

- [ ] Document Railway URL
- [ ] Share API_KEY securely with team
- [ ] Update Bolt.new environment variables
- [ ] Test end-to-end flow
- [ ] Monitor for 24 hours
- [ ] Set up backup/redundancy if needed

---

## 🚀 Quick Commands Reference

```bash
# Local setup
cd tts-api
.\setup-windows.bat

# Start locally
.\start.bat

# Test locally
curl http://localhost:8080/health

# Deploy to Railway
git push origin main

# Test production
curl https://your-service.railway.app/health
```

---

**Status:** Ready for deployment ✅

This API uses the REAL NeuTTS Air model from https://github.com/neuphonic/neutts-air
