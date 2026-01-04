# 🔑 API Keys Setup Guide

This guide explains what API keys you need and how to get them.

## Required API Keys

### Important Note About NeuTTS Air

**You do NOT need a NeuTTS Air API key!** 

NeuTTS Air is a Python library that you install and run yourself. It's not a third-party API service. The TTS service you deploy to Railway will use NeuTTS Air internally.

**What this means:**
- ✅ No NeuTTS Air account needed
- ✅ No NeuTTS Air API key needed
- ✅ Just install the Python package: `pip install neutts-air`
- ✅ Or use mock mode for testing (no installation needed)

---

### 1. OpenAI API Key (REQUIRED)

**What it's for**: Generating motivational text using GPT-4

**How to get it**:

1. Go to https://platform.openai.com/signup
2. Create an account (or sign in if you have one)
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Give it a name (e.g., "AI Motivational Generator")
6. Copy the key (starts with `sk-...`)
7. **IMPORTANT**: Save it immediately - you won't see it again!

**Cost**:
- Pay-as-you-go pricing
- GPT-4 Turbo: ~$0.01 per 1K tokens (input) / ~$0.03 per 1K tokens (output)
- Typical speech generation: ~$0.02-0.05 per request
- You'll need to add credit to your account: https://platform.openai.com/account/billing

**Where to use it**:
```env
# In backend/.env
OPENAI_API_KEY=sk-your-actual-key-here
```

---

### 2. TTS API Key (REQUIRED - You Create This)

**What it's for**: Securing communication between your backend and Railway TTS service

**How to get it**:

This is NOT from a third-party service. You create this yourself!

**Option A: Generate a secure random key**

Windows PowerShell:
```powershell
# Generate a random 32-character key
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Option B: Use an online generator**
- Go to https://randomkeygen.com/
- Copy a "Fort Knox Password" or "CodeIgniter Encryption Key"

**Option C: Simple but secure**
```
my-super-secret-tts-key-2024-change-this-in-production
```

**Where to use it**:

You need to use the SAME key in TWO places:

```env
# In backend/.env
TTS_API_KEY=your-generated-key-here

# In railway-tts-service/.env (and Railway dashboard)
TTS_API_KEY=your-generated-key-here
```

**IMPORTANT**: Both must match exactly!

---

### 3. Railway Service URL (REQUIRED - After Deployment)

**What it's for**: Telling your backend where the TTS service is hosted

**How to get it**:

1. Deploy your TTS service to Railway (see railway-tts-service/DEPLOYMENT.md)
2. Railway will give you a URL like: `https://your-service-name.railway.app`
3. Copy this URL

**Where to use it**:
```env
# In backend/.env
TTS_SERVICE_URL=https://your-service-name.railway.app
```

**Before Railway deployment**:
For local testing only, use:
```env
TTS_SERVICE_URL=http://localhost:8000
```

---

## Complete Setup Checklist

### Step 1: Get OpenAI API Key
- [ ] Create OpenAI account
- [ ] Generate API key
- [ ] Add billing/credits to account
- [ ] Save key securely

### Step 2: Generate TTS API Key
- [ ] Generate a secure random key
- [ ] Save it (you'll use it in 2 places)

### Step 3: Configure Backend
Create `backend/.env`:
```env
OPENAI_API_KEY=sk-your-openai-key-here
TTS_SERVICE_URL=http://localhost:8000
TTS_API_KEY=your-generated-tts-key-here
PORT=3001
NODE_ENV=development
```

### Step 4: Configure Railway TTS Service
Create `railway-tts-service/.env`:
```env
TTS_API_KEY=your-generated-tts-key-here
PORT=8000
```

### Step 5: Deploy to Railway
- [ ] Create Railway account (https://railway.app)
- [ ] Deploy TTS service
- [ ] Set TTS_API_KEY in Railway dashboard
- [ ] Copy Railway service URL
- [ ] Update TTS_SERVICE_URL in backend/.env

---

## Cost Breakdown

### NeuTTS Air
**Required**: No API key needed
**Cost**: FREE
- It's a Python library you run yourself
- No external API calls
- No subscription fees
- CPU-based (works on free Railway tier)

**Installation**: 
```bash
pip install neutts-air
```

**Note**: If NeuTTS Air is not available or doesn't install, the service automatically runs in **mock mode** which generates test audio for development.

### OpenAI API
**Required**: Yes
**Cost**: Pay-as-you-go
- Typical usage: $0.02-0.05 per speech generation
- 100 speeches ≈ $2-5
- You control spending with usage limits

**Free tier**: $5 credit for new accounts (expires after 3 months)

### Railway
**Required**: Yes (for production)
**Cost**: 
- Free tier: $5/month credit (enough for testing)
- Hobby plan: $5/month (recommended)
- Pro plan: $20/month (high volume)

**For local testing**: FREE (run on localhost)

### Total Estimated Cost
- **Development/Testing**: FREE (use localhost + OpenAI free credits)
- **Light Production**: ~$10-15/month (Railway Hobby + OpenAI usage)
- **Medium Production**: ~$25-50/month (Railway Pro + higher OpenAI usage)

---

## Testing Without API Keys

### Option 1: Mock Mode (No APIs needed)
The TTS service has a mock mode that generates silent audio for testing:
- No OpenAI key needed (skip text generation)
- No Railway needed (run TTS locally)
- Test UI and workflow only

### Option 2: OpenAI Only (No TTS)
- Get OpenAI key
- Test text generation
- Skip audio generation
- Test 2 out of 3 steps

### Option 3: Full Local Testing
- Get OpenAI key
- Run TTS service locally (mock mode)
- Test complete workflow
- No Railway needed yet

---

## Security Best Practices

### DO:
✅ Keep API keys in .env files (never commit to Git)
✅ Use different keys for development and production
✅ Rotate keys periodically
✅ Set usage limits on OpenAI dashboard
✅ Monitor API usage regularly

### DON'T:
❌ Commit .env files to Git
❌ Share API keys publicly
❌ Use production keys in development
❌ Hardcode keys in source code
❌ Share keys in screenshots or logs

---

## Troubleshooting

### "Invalid OpenAI API Key"
- Check key starts with `sk-`
- Verify no extra spaces
- Ensure billing is set up
- Check key hasn't been revoked

### "TTS API Key Mismatch"
- Verify same key in backend/.env and Railway
- Check for typos
- Ensure no extra spaces or quotes

### "Cannot Connect to TTS Service"
- Verify Railway service is running
- Check TTS_SERVICE_URL is correct
- Ensure Railway cold start completed (30-60s)
- Test Railway health endpoint directly

---

## Quick Reference

```env
# backend/.env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
TTS_SERVICE_URL=https://your-service.railway.app
TTS_API_KEY=your-secure-random-key-here
PORT=3001

# railway-tts-service/.env
TTS_API_KEY=your-secure-random-key-here
PORT=8000
```

---

## Next Steps

After getting your API keys:

1. ✅ Create .env files with your keys
2. ✅ Install dependencies (npm install, pip install)
3. ✅ Test locally
4. ✅ Deploy to Railway
5. ✅ Update backend with Railway URL
6. ✅ Test production setup

See SETUP.md for detailed instructions!

---

**Need Help?**
- OpenAI: https://help.openai.com/
- Railway: https://docs.railway.app/
- This project: Check SETUP.md and README.md
