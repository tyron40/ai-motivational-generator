/**
 * AI Motivational Speech & Song Generator - Backend API
 * 
 * LEGAL COMPLIANCE:
 * - Only style-based voice references (NO celebrity cloning)
 * - Users can only upload their OWN voice
 * - All AI-generated content must be disclosed
 * - No YouTube audio usage
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Railway TTS service configuration
const TTS_SERVICE_URL = process.env.TTS_SERVICE_URL || 'http://localhost:8000';
const TTS_API_KEY = process.env.TTS_API_KEY || 'your-secure-api-key-here';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const ttsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit TTS calls to 10 per minute
  message: 'TTS rate limit exceeded. Please wait before generating more audio.'
});

app.use('/api/', limiter);
app.use('/api/generate-audio', ttsLimiter);

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only WAV and MP3 are allowed.'));
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

/**
 * Generate motivational text using OpenAI
 */
async function generateMotivationalText(prompt, mode) {
  try {
    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'speech') {
      // Long-form motivational speech
      systemPrompt = `You are a world-class motivational speaker. Create powerful, inspiring speeches that move people to action. Use vivid imagery, personal stories, and emotional appeals. Structure your speech with a strong opening, compelling body, and memorable conclusion.`;
      
      userPrompt = `Create a motivational speech about: ${prompt}

Requirements:
- 300-500 words
- Engaging and emotional
- Include specific examples or metaphors
- Build momentum throughout
- End with a powerful call to action`;

    } else if (mode === 'song') {
      // Spoken/rap-style motivational song (NOT singing)
      systemPrompt = `You are a spoken word artist and motivational rapper. Create punchy, rhythmic motivational content with short lines, pauses, and rap-style cadence. NO singing - only spoken/rap delivery. Use repetition, rhyme, and rhythm.`;
      
      userPrompt = `Create a motivational spoken-word piece about: ${prompt}

Requirements:
- 100-200 words
- Short, punchy lines (5-10 words per line)
- Rap/spoken-word style (NO singing)
- Use rhythm and rhyme
- Include pauses (use "..." or line breaks)
- Repetitive hook/chorus
- High energy and intensity`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: mode === 'speech' ? 1000 : 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate text: ${error.message}`);
  }
}

/**
 * Generate audio using Railway TTS service
 */
async function generateAudio(text, voiceUrl = null) {
  try {
    const response = await axios.post(
      `${TTS_SERVICE_URL}/tts`,
      {
        text: text,
        voice_url: voiceUrl,
        speed: 1.0,
        pitch: 1.0
      },
      {
        headers: {
          'x-api-key': TTS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 120000 // 2 minutes timeout for long audio
      }
    );

    return response.data;
  } catch (error) {
    console.error('TTS service error:', error.message);
    
    // Handle Railway cold start
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('TTS service is starting up. Please try again in a moment.');
    }
    
    throw new Error(`Failed to generate audio: ${error.message}`);
  }
}

// Routes

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Motivational Generator Backend',
    timestamp: new Date().toISOString()
  });
});

/**
 * Generate motivational text
 * POST /api/generate-text
 * Body: { prompt: string, mode: 'speech' | 'song' }
 */
app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    // Validation
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!['speech', 'song'].includes(mode)) {
      return res.status(400).json({ error: 'Mode must be "speech" or "song"' });
    }

    if (prompt.length > 500) {
      return res.status(400).json({ error: 'Prompt too long (max 500 characters)' });
    }

    // Generate text
    const generatedText = await generateMotivationalText(prompt, mode);

    res.json({
      success: true,
      text: generatedText,
      mode: mode
    });

  } catch (error) {
    console.error('Text generation error:', error);
    res.status(500).json({
      error: 'Failed to generate text',
      message: error.message
    });
  }
});

/**
 * Generate audio from text
 * POST /api/generate-audio
 * Body: { text: string, voiceUrl?: string }
 */
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voiceUrl } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 10000) {
      return res.status(400).json({ error: 'Text too long (max 10000 characters)' });
    }

    // Generate audio
    const audioBuffer = await generateAudio(text, voiceUrl);

    // Set headers for audio download
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'attachment; filename=motivational_audio.wav',
      'Content-Length': audioBuffer.length
    });

    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('Audio generation error:', error);
    res.status(500).json({
      error: 'Failed to generate audio',
      message: error.message
    });
  }
});

/**
 * Upload user voice reference
 * POST /api/upload-voice
 * Form data: audio file
 */
app.post('/api/upload-voice', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Validate file duration (should be at least 10 seconds)
    // Note: In production, use a library like 'get-audio-duration' to check
    
    // Return file URL (in production, upload to cloud storage)
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      voiceUrl: fileUrl,
      message: 'Voice uploaded successfully. This voice will be used as reference for TTS generation.',
      disclaimer: 'LEGAL NOTICE: You confirm that you own the rights to this voice recording and consent to its use for AI voice cloning.'
    });

  } catch (error) {
    console.error('Voice upload error:', error);
    res.status(500).json({
      error: 'Failed to upload voice',
      message: error.message
    });
  }
});

/**
 * Serve uploaded files
 */
app.use('/uploads', express.static('uploads'));

/**
 * Get preset voices
 */
app.get('/api/preset-voices', (req, res) => {
  // In production, these would be stored in cloud storage (Supabase, S3, etc.)
  const presetVoices = [
    {
      id: 'deep_motivational_male',
      name: 'Deep Motivational Male',
      description: 'Powerful, authoritative male voice',
      url: `${req.protocol}://${req.get('host')}/preset-voices/deep_motivational_male.wav`,
      style: 'motivational'
    },
    {
      id: 'calm_female_narrator',
      name: 'Calm Female Narrator',
      description: 'Soothing, professional female voice',
      url: `${req.protocol}://${req.get('host')}/preset-voices/calm_female_narrator.wav`,
      style: 'narrative'
    },
    {
      id: 'energetic_sports_voice',
      name: 'Energetic Sports Voice',
      description: 'High-energy, enthusiastic voice',
      url: `${req.protocol}://${req.get('host')}/preset-voices/energetic_sports_voice.wav`,
      style: 'energetic'
    },
    {
      id: 'wise_mentor',
      name: 'Wise Mentor',
      description: 'Experienced, thoughtful voice',
      url: `${req.protocol}://${req.get('host')}/preset-voices/wise_mentor.wav`,
      style: 'wisdom'
    }
  ];

  res.json({
    success: true,
    voices: presetVoices,
    disclaimer: 'All voices are style-based AI references, not celebrity clones.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📝 OpenAI API: ${process.env.OPENAI_API_KEY ? 'Configured' : 'NOT configured'}`);
  console.log(`🎤 TTS Service: ${TTS_SERVICE_URL}`);
});
