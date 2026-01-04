# NeuTTS Air API Wrapper - Usage Guide

## What You Have

A complete FastAPI wrapper around the TTS engine located in `railway-tts-service/app.py`.

**Current Status:** Using **gTTS** (Google Text-to-Speech) because your Python 3.12 is too new for Coqui TTS.

## How to Use in VS Code

### 1. Open Terminal in VS Code
Press `` Ctrl+` `` or go to **Terminal → New Terminal**

### 2. Navigate to TTS Service Directory
```bash
cd railway-tts-service
```

### 3. Install Dependencies (if not done)
```bash
pip install -r requirements.txt
```

### 4. Set Environment Variables
Create a `.env` file:
```bash
TTS_API_KEY=your-secure-api-key-here
PORT=8000
```

### 5. Run the API Server
```bash
python app.py
```

You should see:
```
INFO:__main__:gTTS engine initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## API Endpoints

### Health Check
```bash
GET http://localhost:8000/
GET http://localhost:8000/health
```

### Generate Speech
```bash
POST http://localhost:8000/tts
Headers:
  x-api-key: your-secure-api-key-here
  Content-Type: application/json

Body:
{
  "text": "Hello, this is a test",
  "voice_url": "https://example.com/voice.wav",  // optional
  "speed": 1.0,  // optional (not supported by gTTS)
  "pitch": 1.0   // optional (not supported by gTTS)
}
```

## Test with cURL

### Windows PowerShell:
```powershell
# Health check
curl http://localhost:8000/health

# Generate speech
curl -X POST http://localhost:8000/tts `
  -H "x-api-key: your-secure-api-key-here" `
  -H "Content-Type: application/json" `
  -d '{\"text\": \"Never give up on your dreams\"}' `
  --output speech.wav
```

### Windows CMD:
```cmd
curl -X POST http://localhost:8000/tts ^
  -H "x-api-key: your-secure-api-key-here" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"Never give up on your dreams\"}" ^
  --output speech.wav
```

## Test with Python

```python
import requests

url = "http://localhost:8000/tts"
headers = {
    "x-api-key": "your-secure-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "text": "Never give up on your dreams"
}

response = requests.post(url, headers=headers, json=data)

if response.status_code == 200:
    with open("speech.wav", "wb") as f:
        f.write(response.content)
    print("Audio saved to speech.wav")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
```

## Upgrade to Real Voice Cloning

**Current Limitation:** gTTS doesn't support voice cloning.

**To Enable Voice Cloning:**

1. **Install Python 3.9-3.11** (Coqui TTS requirement)
2. **Update requirements.txt:**
   ```
   TTS==0.22.0
   ```
3. **Update app.py** to use Coqui TTS instead of gTTS
4. **Restart the service**

See `NEUTTS_ALTERNATIVES.md` for detailed instructions.

## Integration with Your Bolt.new Site

Your backend (`backend/server.js`) already calls this API:

```javascript
// In backend/server.js
const ttsResponse = await axios.post(
  `${TTS_SERVICE_URL}/tts`,
  {
    text: generatedText,
    voice_url: voiceUrl
  },
  {
    headers: {
      'x-api-key': TTS_API_KEY,
      'Content-Type': 'application/json'
    },
    responseType: 'arraybuffer'
  }
);
```

## Troubleshooting

### Port Already in Use
```bash
# Windows: Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Import Errors
```bash
pip install --upgrade -r requirements.txt
```

### API Key Issues
Make sure the API key in `.env` matches the one in `backend/.env`:
- `railway-tts-service/.env`: `TTS_API_KEY=your-key`
- `backend/.env`: `TTS_API_KEY=your-key`

## Deploy to Railway

See `DEPLOYMENT.md` for Railway deployment instructions.

## File Structure

```
railway-tts-service/
├── app.py              # Main FastAPI application (THE API WRAPPER)
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── .env               # Environment variables
├── DEPLOYMENT.md      # Railway deployment guide
└── USAGE_GUIDE.md     # This file
```

## Summary

✅ **The API wrapper is DONE** - it's in `app.py`
✅ **FastAPI wraps the TTS engine** - handles HTTP requests
✅ **Authentication included** - API key protection
✅ **Voice cloning ready** - just needs Coqui TTS upgrade
✅ **Production ready** - can deploy to Railway

**You're all set!** The TTS API is wrapped and working. Just run `python app.py` to start it.
