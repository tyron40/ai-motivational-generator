# Backend API - AI Motivational Generator

Node.js Express backend for text generation and audio orchestration.

## Features

- OpenAI GPT-4 integration for text generation
- Railway TTS service integration
- File upload handling for user voices
- Rate limiting and security
- Preset voice management

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Text
```
POST /api/generate-text
Content-Type: application/json

{
  "prompt": "Overcoming fear",
  "mode": "speech" | "song"
}

Response:
{
  "success": true,
  "text": "Generated motivational text...",
  "mode": "speech"
}
```

### Generate Audio
```
POST /api/generate-audio
Content-Type: application/json

{
  "text": "Your motivational text here",
  "voiceUrl": "https://example.com/voice.wav" (optional)
}

Response: audio/wav file
```

### Upload Voice
```
POST /api/upload-voice
Content-Type: multipart/form-data

Form data:
- audio: WAV or MP3 file (max 10MB)

Response:
{
  "success": true,
  "voiceUrl": "http://localhost:3001/uploads/filename.wav",
  "message": "Voice uploaded successfully",
  "disclaimer": "Legal notice..."
}
```

### Get Preset Voices
```
GET /api/preset-voices

Response:
{
  "success": true,
  "voices": [
    {
      "id": "deep_motivational_male",
      "name": "Deep Motivational Male",
      "description": "Powerful, authoritative male voice",
      "url": "http://localhost:3001/preset-voices/deep_motivational_male.wav",
      "style": "motivational"
    },
    ...
  ],
  "disclaimer": "All voices are style-based AI references"
}
```

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your keys
# OPENAI_API_KEY=sk-...
# TTS_SERVICE_URL=https://your-railway-service.railway.app
# TTS_API_KEY=your-api-key

# Start server
npm run dev
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `TTS_SERVICE_URL`: Railway TTS service URL
- `TTS_API_KEY`: API key for TTS service
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: development | production

## Rate Limits

- General API: 100 requests per 15 minutes
- TTS generation: 10 requests per minute

## Security

- Helmet.js for security headers
- CORS enabled
- File upload validation
- Input sanitization
- Rate limiting

## Error Handling

All errors return JSON:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Legal Compliance

- Only style-based voices
- User voice upload restrictions
- Clear AI disclosure
- No celebrity cloning
