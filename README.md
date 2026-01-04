# 🎤 AI Motivational Speech & Spoken-Song Generator

A production-ready full-stack application for generating AI-powered motivational speeches and spoken songs with custom voice cloning.

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows-blue)

## ⚠️ Legal Compliance

This project strictly adheres to ethical AI voice generation:

- ✅ **Style-inspired voices ONLY** (NO celebrity cloning)
- ✅ **Users can only upload their OWN voice**
- ✅ **Clear AI-generated content disclosure**
- ✅ **No YouTube audio usage**
- ✅ **Full legal compliance documentation**

See [LEGAL_COMPLIANCE.md](LEGAL_COMPLIANCE.md) for complete details.

## 🚀 Features

### Content Generation
- **Motivational Speeches**: Long-form inspirational content (300-500 words)
- **Motivational Songs**: Spoken-word/rap-style content (100-200 words)
- **AI-Powered Text**: GPT-4 generates compelling, emotional content
- **Custom Voice Cloning**: Use preset voices or upload your own

### Voice Options
- **4 Preset Voices**: Style-based generic voices
  - Deep Motivational Male
  - Calm Female Narrator
  - Energetic Sports Voice
  - Wise Mentor
- **User Voice Upload**: Clone your own voice (WAV/MP3, 10+ seconds)
- **Reference-Based TTS**: NeuTTS Air with voice cloning

### User Experience
- **3-Step Workflow**: Prompt → Generate Text → Generate Audio
- **Real-Time Preview**: Review text before audio generation
- **Audio Player**: Built-in playback controls
- **Download**: Save generated audio as WAV files
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│                    http://localhost:3000                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Node.js/Express)               │
│                    http://localhost:3001                     │
│  ┌──────────────────┐              ┌────────────────────┐   │
│  │  OpenAI GPT-4    │              │  Railway TTS API   │   │
│  │ (Text Generation)│              │ (Audio Generation) │   │
│  └──────────────────┘              └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│            Railway TTS Service (Python/FastAPI)              │
│                  NeuTTS Air (CPU-based TTS)                  │
│              https://your-service.railway.app                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
ai-motivational-generator/
├── railway-tts-service/      # Python FastAPI TTS microservice
│   ├── app.py               # Main TTS server
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Container configuration
│   ├── DEPLOYMENT.md        # Railway deployment guide
│   └── .env.example         # Environment template
│
├── backend/                  # Node.js Express backend
│   ├── server.js            # Main API server
│   ├── package.json         # Node dependencies
│   ├── .env.example         # Environment template
│   └── README.md            # Backend documentation
│
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── App.css          # Styles
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Node dependencies
│   └── README.md            # Frontend documentation
│
├── preset-voices/            # Voice reference samples
│   └── README.md            # Voice guidelines
│
├── SETUP.md                 # Complete setup guide
├── LEGAL_COMPLIANCE.md      # Legal documentation
├── TODO.md                  # Implementation checklist
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool
- **Axios**: HTTP client
- **CSS3**: Custom styling

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **OpenAI API**: GPT-4 text generation
- **Multer**: File upload handling
- **Helmet**: Security headers
- **Express Rate Limit**: API protection

### TTS Service
- **Python 3.9**: Programming language
- **FastAPI**: Modern API framework
- **NeuTTS Air**: CPU-based TTS engine
- **Uvicorn**: ASGI server

### Infrastructure
- **Railway**: TTS service hosting
- **Bolt.new**: Frontend/backend hosting (optional)
- **Supabase/S3**: Cloud storage (optional)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.9+** - [Download](https://www.python.org/)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone or navigate to the project**
```bash
cd ai-motivational-generator
code .
```

2. **Setup Railway TTS Service**
```bash
cd railway-tts-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env and set TTS_API_KEY
python app.py
```

3. **Setup Backend**
```bash
cd backend
npm install
copy .env.example .env
# Edit .env and set OPENAI_API_KEY, TTS_SERVICE_URL, TTS_API_KEY
npm run dev
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📝 Configuration

### Backend (.env)
```env
OPENAI_API_KEY=sk-your-openai-api-key
TTS_SERVICE_URL=https://your-railway-service.railway.app
TTS_API_KEY=your-secure-api-key
PORT=3001
```

### Railway TTS Service (.env)
```env
TTS_API_KEY=your-secure-api-key
PORT=8000
```

## 🌐 Deployment

### Railway (TTS Service)

1. Create Railway account at https://railway.app
2. Create new project
3. Deploy from GitHub or use Railway CLI
4. Set environment variable: `TTS_API_KEY`
5. Note your service URL

See [railway-tts-service/DEPLOYMENT.md](railway-tts-service/DEPLOYMENT.md) for details.

### Bolt.new or Vercel (Frontend + Backend)

1. Build frontend: `cd frontend && npm run build`
2. Deploy backend with built frontend
3. Set environment variables in hosting platform

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup instructions
- **[LEGAL_COMPLIANCE.md](LEGAL_COMPLIANCE.md)** - Legal requirements
- **[TODO.md](TODO.md)** - Implementation checklist
- **[backend/README.md](backend/README.md)** - Backend API docs
- **[frontend/README.md](frontend/README.md)** - Frontend docs
- **[railway-tts-service/DEPLOYMENT.md](railway-tts-service/DEPLOYMENT.md)** - Railway guide

## 🎯 Usage

1. **Select Mode**: Choose Speech or Spoken Song
2. **Enter Prompt**: Describe what you want (e.g., "Overcoming fear")
3. **Select Voice**: Choose preset or upload your own
4. **Generate Text**: AI creates motivational content
5. **Generate Audio**: Convert text to speech
6. **Play & Download**: Listen and save your audio

## 🔒 Security Features

- API key authentication
- Rate limiting (100 req/15min, 10 TTS/min)
- File upload validation
- Input sanitization
- CORS protection
- Security headers (Helmet)
- Content moderation ready

## ⚖️ Legal & Ethics

### What's Allowed
✅ Style-based voice descriptions
✅ Your own voice recordings
✅ Generic voice characteristics
✅ Personal/educational use

### What's Prohibited
❌ Celebrity voice cloning
❌ Impersonation
❌ Unauthorized voice use
❌ YouTube audio extraction
❌ Commercial use without licensing

## 🐛 Troubleshooting

### Railway Cold Start
First request may take 30-60 seconds. Subsequent requests are fast.

### NeuTTS Not Installed
Service runs in mock mode for testing. For production, ensure neutts-air is installed.

### OpenAI API Errors
Check API key is valid and has credits at https://platform.openai.com/

### Audio Not Playing
Check browser console, ensure audio format is supported.

See [SETUP.md](SETUP.md) for more troubleshooting tips.

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Add more voice styles
- Improve UI/UX
- Add features from TODO.md
- Enhance security
- Optimize performance

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 text generation
- **NeuTTS Air** - CPU-based TTS engine
- **Railway** - TTS service hosting
- **React** - Frontend framework
- **FastAPI** - Python API framework

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error messages
3. Verify environment variables
4. Test services independently
5. Check Railway logs

## 🎓 Educational Use

This project is designed for:
- Learning full-stack AI development
- Understanding voice cloning ethics
- Building production-ready applications
- Exploring AI content generation

## ⚠️ Disclaimer

This service uses AI technology to generate synthetic voices. All generated audio is artificial and should be clearly labeled as AI-generated when shared. Users are responsible for ensuring their use complies with all applicable laws and regulations.

---

**Built with ❤️ for ethical AI voice generation**

**Version**: 1.0.0  
**Status**: Production Ready  
**Platform**: Windows + VS Code  
**Last Updated**: 2024
