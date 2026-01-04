"""
Railway TTS Microservice using gTTS (Google Text-to-Speech)
Simple, reliable TTS service compatible with Python 3.12

LEGAL COMPLIANCE:
- This service generates AI voices for STYLE-BASED references only
- NO celebrity voice cloning
- Users may only upload their OWN voice for cloning
- All generated audio must be disclosed as AI-generated

NOTE: gTTS uses Google's TTS API and doesn't support voice cloning.
For voice cloning, consider upgrading to Python 3.9-3.11 and using Coqui TTS.
"""

from fastapi import FastAPI, HTTPException, Header, File, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
import tempfile
import requests
import logging
from typing import Optional
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="gTTS Service")

# API Key for authentication
API_KEY = os.getenv("TTS_API_KEY", "your-secure-api-key-here")

# gTTS configuration
try:
    from gtts import gTTS
    tts_engine = "gtts"
    logger.info("gTTS engine initialized successfully")
except ImportError as e:
    logger.error(f"Failed to import gTTS: {e}")
    tts_engine = None


class TTSRequest(BaseModel):
    text: str
    voice_url: Optional[str] = None
    speed: Optional[float] = 1.0
    pitch: Optional[float] = 1.0


def verify_api_key(x_api_key: str = Header(None)):
    """Verify API key authentication"""
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True


def download_reference_audio(url: str) -> str:
    """Download reference audio to temporary file"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.write(response.content)
        temp_file.close()
        
        logger.info(f"Downloaded reference audio to {temp_file.name}")
        return temp_file.name
    except Exception as e:
        logger.error(f"Failed to download reference audio: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to download reference audio: {str(e)}")


def generate_audio(text: str, reference_audio_path: Optional[str] = None, speed: float = 1.0, pitch: float = 1.0):
    """Generate audio using gTTS"""
    try:
        if tts_engine is None:
            raise HTTPException(status_code=500, detail="TTS engine not initialized")
        
        # Note: gTTS doesn't support voice cloning or speed/pitch adjustment
        if reference_audio_path:
            logger.warning("Voice cloning requested but gTTS doesn't support it. Using default voice.")
        
        if speed != 1.0 or pitch != 1.0:
            logger.warning("Speed/pitch adjustment requested but gTTS doesn't support it.")
        
        # Generate audio with gTTS
        logger.info("Generating audio with gTTS")
        tts = gTTS(text=text, lang='en', slow=False)
        
        # Save to BytesIO buffer
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        return audio_buffer.read()
        
    except Exception as e:
        logger.error(f"Audio generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(e)}")
                

def generate_mock_audio(text: str) -> bytes:
    """Generate mock WAV audio for testing"""
    # Simple WAV header for 1 second of silence at 16kHz mono
    sample_rate = 16000
    duration = min(len(text) * 0.1, 10)  # Approximate duration
    num_samples = int(sample_rate * duration)
    
    # WAV header
    wav_header = bytearray([
        0x52, 0x49, 0x46, 0x46,  # "RIFF"
        0x00, 0x00, 0x00, 0x00,  # File size (placeholder)
        0x57, 0x41, 0x56, 0x45,  # "WAVE"
        0x66, 0x6D, 0x74, 0x20,  # "fmt "
        0x10, 0x00, 0x00, 0x00,  # Subchunk size (16)
        0x01, 0x00,              # Audio format (1 = PCM)
        0x01, 0x00,              # Num channels (1 = mono)
        0x80, 0x3E, 0x00, 0x00,  # Sample rate (16000)
        0x00, 0x7D, 0x00, 0x00,  # Byte rate
        0x02, 0x00,              # Block align
        0x10, 0x00,              # Bits per sample (16)
        0x64, 0x61, 0x74, 0x61,  # "data"
        0x00, 0x00, 0x00, 0x00,  # Data size (placeholder)
    ])
    
    # Silent audio data
    audio_data = bytes(num_samples * 2)  # 16-bit samples
    
    # Update sizes
    data_size = len(audio_data)
    file_size = len(wav_header) + data_size - 8
    
    wav_header[4:8] = file_size.to_bytes(4, 'little')
    wav_header[40:44] = data_size.to_bytes(4, 'little')
    
    return bytes(wav_header) + audio_data


@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "gTTS Service (Google Text-to-Speech)",
        "engine": "active" if tts_engine else "not initialized",
        "model": "gTTS",
        "voice_cloning": False,
        "note": "For voice cloning, use Python 3.9-3.11 with Coqui TTS"
    }
    

@app.post("/tts")
async def text_to_speech(
    request: TTSRequest,
    authenticated: bool = Header(None, alias="x-api-key", include_in_schema=False)
):
    """
    Generate speech audio from text
    
    LEGAL NOTICE:
    - Only use style-based reference voices
    - Users must own the rights to any uploaded reference audio
    - Generated audio is AI-synthesized and must be disclosed as such
    """
    # Verify API key
    verify_api_key(authenticated)
    
    # Validate input
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 10000:
        raise HTTPException(status_code=400, detail="Text too long (max 10000 characters)")
    
    reference_audio_path = None
    
    try:
        # Download reference audio if provided
        if request.voice_url:
            reference_audio_path = download_reference_audio(request.voice_url)
        
        # Generate audio
        audio_data = generate_audio(
            text=request.text,
            reference_audio_path=reference_audio_path,
            speed=request.speed,
            pitch=request.pitch
        )
        
        # Return audio as streaming response
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/wav",
            headers={
                "Content-Disposition": "attachment; filename=generated_speech.wav"
            }
        )
    
    finally:
        # Clean up temporary reference audio file
        if reference_audio_path and os.path.exists(reference_audio_path):
            try:
                os.unlink(reference_audio_path)
                logger.info(f"Cleaned up temporary file: {reference_audio_path}")
            except Exception as e:
                logger.error(f"Failed to clean up temporary file: {e}")


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "tts_engine": "active" if tts_engine else "not initialized",
        "model": "gTTS (Google Text-to-Speech)",
        "voice_cloning_support": False,
        "speed_pitch_support": False,
        "languages_supported": "100+",
        "note": "Simple, reliable TTS. For advanced features, use Coqui TTS with Python 3.9-3.11"
    }
    

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
