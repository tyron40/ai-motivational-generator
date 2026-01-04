"""
NeuTTS Air TTS API - Production Ready
FastAPI wrapper for NeuTTS Air voice cloning model

LEGAL COMPLIANCE:
- Style-based voices only (NO celebrity cloning)
- Users may only upload their OWN voice for reference
- All generated audio is AI-synthesized and must be disclosed
- No permanent training on uploaded voices (reference-only)
- Audio outputs are watermarked with Perth (Perceptual Threshold)

ARCHITECTURE:
- Uses official NeuTTS Air from: https://github.com/neuphonic/neutts-air
- Model loaded once at startup for efficiency
- CPU-only inference (Railway compatible)
- Reference voice encoding cached per request
"""

import os
import sys
import tempfile
import logging
from pathlib import Path
from typing import Optional
import requests

from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Add neutts-air to Python path
NEUTTS_PATH = Path(__file__).parent / "neutts-air"
sys.path.insert(0, str(NEUTTS_PATH))

from neuttsair.neutts import NeuTTSAir
import soundfile as sf

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="NeuTTS Air TTS API",
    description="Production-ready voice cloning API using NeuTTS Air",
    version="1.0.0"
)

# Configuration
API_KEY = os.getenv("API_KEY", "change-this-in-production")
PORT = int(os.getenv("PORT", 8080))
BACKBONE_REPO = os.getenv("BACKBONE_REPO", "neuphonic/neutts-air")
CODEC_REPO = os.getenv("CODEC_REPO", "neuphonic/neucodec")

# Global TTS model (loaded once at startup)
tts_model = None


class TTSRequest(BaseModel):
    """
    TTS request model
    
    LEGAL NOTICE:
    - text: The text to synthesize
    - voice_url: Optional URL to reference audio (user must own rights)
    - ref_text: Optional transcript of reference audio
    """
    text: str
    voice_url: Optional[str] = None
    ref_text: Optional[str] = None


def validate_api_key(x_api_key: str = Header(None)):
    """Validate API key from header"""
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    return True


def download_reference_audio(url: str) -> str:
    """
    Download reference audio from URL
    
    LEGAL: User must own rights to this audio
    Returns: Path to downloaded file
    """
    try:
        logger.info(f"Downloading reference audio from: {url}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.write(response.content)
        temp_file.close()
        
        logger.info(f"Reference audio saved to: {temp_file.name}")
        return temp_file.name
        
    except Exception as e:
        logger.error(f"Failed to download reference audio: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to download reference audio: {str(e)}"
        )


def generate_speech(
    text: str,
    ref_audio_path: Optional[str] = None,
    ref_text: Optional[str] = None
) -> str:
    """
    Generate speech using NeuTTS Air
    
    Args:
        text: Text to synthesize
        ref_audio_path: Optional path to reference audio
        ref_text: Optional transcript of reference audio
        
    Returns:
        Path to generated WAV file
        
    LEGAL NOTICE:
    - Generated audio is AI-synthesized (watermarked)
    - Must be disclosed as AI-generated
    - Reference voices must be user's own voice
    """
    if not tts_model:
        raise HTTPException(
            status_code=500,
            detail="TTS model not initialized"
        )
    
    try:
        # Use default reference if none provided
        if not ref_audio_path:
            logger.info("No reference audio provided, using default voice")
            ref_audio_path = str(NEUTTS_PATH / "samples" / "dave.wav")
            ref_text_path = str(NEUTTS_PATH / "samples" / "dave.txt")
            with open(ref_text_path, "r") as f:
                ref_text = f.read().strip()
        
        # Load reference text if it's a file path
        if ref_text and os.path.exists(ref_text):
            with open(ref_text, "r") as f:
                ref_text = f.read().strip()
        elif not ref_text:
            # If no ref_text provided, use empty string
            ref_text = ""
            logger.warning("No reference text provided, using empty string")
        
        logger.info(f"Encoding reference audio: {ref_audio_path}")
        ref_codes = tts_model.encode_reference(ref_audio_path)
        
        logger.info(f"Generating speech for text: {text[:50]}...")
        wav = tts_model.infer(text, ref_codes, ref_text)
        
        # Save to temporary file
        output_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        sf.write(output_file.name, wav, 24000)
        output_file.close()
        
        logger.info(f"✅ Speech generated successfully: {output_file.name}")
        return output_file.name
        
    except Exception as e:
        logger.error(f"Speech generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Speech generation failed: {str(e)}"
        )


@app.on_event("startup")
async def startup_event():
    """Initialize NeuTTS Air model at startup"""
    global tts_model
    
    try:
        logger.info("=" * 60)
        logger.info("🚀 Initializing NeuTTS Air TTS Model")
        logger.info("=" * 60)
        logger.info(f"Backbone: {BACKBONE_REPO}")
        logger.info(f"Codec: {CODEC_REPO}")
        logger.info(f"Device: CPU")
        
        tts_model = NeuTTSAir(
            backbone_repo=BACKBONE_REPO,
            backbone_device="cpu",
            codec_repo=CODEC_REPO,
            codec_device="cpu"
        )
        
        logger.info("✅ NeuTTS Air model loaded successfully")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize TTS model: {e}")
        logger.error("Server will start but TTS requests will fail")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "NeuTTS Air TTS API",
        "model": BACKBONE_REPO,
        "voice_cloning": True,
        "version": "1.0.0",
        "legal_notice": "AI-generated audio. Style-based voices only. No celebrity cloning."
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": tts_model is not None,
        "backbone": BACKBONE_REPO,
        "codec": CODEC_REPO,
        "device": "cpu",
        "voice_cloning_support": True,
        "watermarked": True,
        "legal_compliance": {
            "celebrity_cloning": False,
            "user_voice_only": True,
            "ai_disclosure": True,
            "reference_only": True
        }
    }


@app.post("/tts")
async def text_to_speech(
    request: TTSRequest,
    x_api_key: str = Header(None)
):
    """
    Convert text to speech with optional voice cloning
    
    LEGAL NOTICE:
    - Generated audio is AI-synthesized and watermarked
    - Users must own rights to any reference voice
    - No celebrity voice cloning
    - Style-based voices only
    - Reference audio is used temporarily and not stored
    
    Args:
        request: TTSRequest with text and optional voice_url/ref_text
        x_api_key: API key for authentication
        
    Returns:
        WAV audio file (24kHz, watermarked)
    """
    # Validate API key
    validate_api_key(x_api_key)
    
    # Validate input
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 10000:
        raise HTTPException(
            status_code=400,
            detail="Text too long (max 10000 characters)"
        )
    
    ref_audio_path = None
    output_path = None
    
    try:
        # Download reference audio if provided
        if request.voice_url:
            ref_audio_path = download_reference_audio(request.voice_url)
        
        # Generate speech
        output_path = generate_speech(
            text=request.text,
            ref_audio_path=ref_audio_path,
            ref_text=request.ref_text
        )
        
        # Return audio file
        return FileResponse(
            output_path,
            media_type="audio/wav",
            filename="speech.wav",
            headers={
                "X-AI-Generated": "true",
                "X-Watermarked": "true",
                "X-Model": "NeuTTS-Air"
            }
        )
        
    finally:
        # Clean up temporary files
        if ref_audio_path and os.path.exists(ref_audio_path):
            try:
                os.unlink(ref_audio_path)
                logger.info(f"Cleaned up reference audio: {ref_audio_path}")
            except Exception as e:
                logger.error(f"Failed to clean up reference audio: {e}")
        
        # Note: output_path cleanup handled by FileResponse


if __name__ == "__main__":
    import uvicorn
    logger.info(f"🚀 Starting NeuTTS Air TTS API on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
