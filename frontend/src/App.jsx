/**
 * AI Motivational Speech & Song Generator - Frontend
 * 
 * LEGAL COMPLIANCE:
 * - Only style-based voice references (NO celebrity cloning)
 * - Users can only upload their OWN voice
 * - All AI-generated content is clearly disclosed
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [mode, setMode] = useState('speech')
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [presetVoices, setPresetVoices] = useState([])
  const [uploadedVoice, setUploadedVoice] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: Input, 2: Text Generated, 3: Audio Generated

  // Fetch preset voices on mount
  useEffect(() => {
    fetchPresetVoices()
  }, [])

  const fetchPresetVoices = async () => {
    try {
      const response = await axios.get('/api/preset-voices')
      setPresetVoices(response.data.voices)
      if (response.data.voices.length > 0) {
        setSelectedVoice(response.data.voices[0])
      }
    } catch (err) {
      console.error('Failed to fetch preset voices:', err)
    }
  }

  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/generate-text', {
        prompt: prompt,
        mode: mode
      })

      setGeneratedText(response.data.text)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate text')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAudio = async () => {
    if (!generatedText) {
      setError('No text to convert to audio')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const voiceUrl = uploadedVoice ? uploadedVoice.voiceUrl : selectedVoice?.url

      const response = await axios.post('/api/generate-audio', {
        text: generatedText,
        voiceUrl: voiceUrl
      }, {
        responseType: 'blob'
      })

      const audioBlob = new Blob([response.data], { type: 'audio/wav' })
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate audio')
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!['audio/wav', 'audio/mpeg', 'audio/mp3'].includes(file.type)) {
      setError('Please upload a WAV or MP3 file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', file)

      const response = await axios.post('/api/upload-voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setUploadedVoice(response.data)
      setSelectedVoice(null) // Deselect preset voice
      alert('Voice uploaded successfully! This will be used for audio generation.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload voice')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!audioUrl) return

    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `motivational_${mode}_${Date.now()}.wav`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setPrompt('')
    setGeneratedText('')
    setAudioUrl(null)
    setError(null)
    setStep(1)
    setUploadedVoice(null)
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🎤 AI Motivational Generator</h1>
          <p className="subtitle">Create inspiring speeches and spoken songs with AI</p>
          <div className="disclaimer">
            ⚠️ AI-Generated Content | Style-Based Voices Only | No Celebrity Cloning
          </div>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="step">
            <div className="mode-selector">
              <button
                className={`mode-btn ${mode === 'speech' ? 'active' : ''}`}
                onClick={() => setMode('speech')}
              >
                📢 Speech
              </button>
              <button
                className={`mode-btn ${mode === 'song' ? 'active' : ''}`}
                onClick={() => setMode('song')}
              >
                🎵 Spoken Song
              </button>
            </div>

            <div className="form-group">
              <label>What should I create for you?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'speech' 
                  ? "e.g., Overcoming fear and taking action" 
                  : "e.g., Never give up on your dreams"}
                rows={4}
                maxLength={500}
              />
              <div className="char-count">{prompt.length}/500</div>
            </div>

            <div className="form-group">
              <label>Select Voice Style</label>
              <div className="voice-grid">
                {presetVoices.map((voice) => (
                  <button
                    key={voice.id}
                    className={`voice-card ${selectedVoice?.id === voice.id && !uploadedVoice ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedVoice(voice)
                      setUploadedVoice(null)
                    }}
                  >
                    <div className="voice-name">{voice.name}</div>
                    <div className="voice-desc">{voice.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Or Upload Your Own Voice (Optional)</label>
              <div className="upload-section">
                <input
                  type="file"
                  accept="audio/wav,audio/mp3,audio/mpeg"
                  onChange={handleVoiceUpload}
                  id="voice-upload"
                  className="file-input"
                />
                <label htmlFor="voice-upload" className="upload-btn">
                  📁 Upload Voice (WAV/MP3)
                </label>
                {uploadedVoice && (
                  <div className="upload-success">
                    ✅ Voice uploaded successfully
                  </div>
                )}
                <div className="upload-note">
                  ⚠️ You confirm you own the rights to this voice recording
                </div>
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={handleGenerateText}
              disabled={loading || !prompt.trim()}
            >
              {loading ? 'Generating...' : 'Generate Text'}
            </button>
          </div>
        )}

        {/* Step 2: Text Generated */}
        {step === 2 && (
          <div className="step">
            <h2>Generated {mode === 'speech' ? 'Speech' : 'Spoken Song'}</h2>
            <div className="generated-text">
              {generatedText}
            </div>

            <div className="button-group">
              <button
                className="secondary-btn"
                onClick={handleReset}
              >
                Start Over
              </button>
              <button
                className="primary-btn"
                onClick={handleGenerateAudio}
                disabled={loading}
              >
                {loading ? 'Generating Audio...' : 'Convert to Audio'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Audio Generated */}
        {step === 3 && (
          <div className="step">
            <h2>Your Motivational {mode === 'speech' ? 'Speech' : 'Song'}</h2>
            
            <div className="generated-text">
              {generatedText}
            </div>

            {audioUrl && (
              <div className="audio-player">
                <audio controls src={audioUrl} />
              </div>
            )}

            <div className="button-group">
              <button
                className="secondary-btn"
                onClick={handleReset}
              >
                Create Another
              </button>
              <button
                className="primary-btn"
                onClick={handleDownload}
                disabled={!audioUrl}
              >
                📥 Download Audio
              </button>
            </div>

            <div className="ai-disclosure">
              🤖 This audio was generated using AI technology
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Powered by OpenAI GPT-4 & NeuTTS Air</p>
          <p className="legal-note">
            All voices are style-based AI references. No celebrity cloning.
            Users may only upload their own voice recordings.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
