# Preset Voice References

This directory contains sample voice references for the TTS system.

## LEGAL COMPLIANCE

⚠️ **IMPORTANT**: All voices in this directory must be:
- Style-based references ONLY
- NOT cloned from real celebrities
- Generic voice styles (e.g., "deep male", "calm female")
- Properly licensed or created specifically for this project

## Voice Files

The following voice files should be placed in this directory:

1. **deep_motivational_male.wav**
   - Style: Deep, authoritative male voice
   - Use case: Powerful motivational speeches
   - Duration: 10-30 seconds of sample speech

2. **calm_female_narrator.wav**
   - Style: Soothing, professional female voice
   - Use case: Calm, thoughtful narration
   - Duration: 10-30 seconds of sample speech

3. **energetic_sports_voice.wav**
   - Style: High-energy, enthusiastic voice
   - Use case: Sports motivation, high-intensity content
   - Duration: 10-30 seconds of sample speech

4. **wise_mentor.wav**
   - Style: Experienced, thoughtful voice
   - Use case: Wisdom, guidance, mentorship
   - Duration: 10-30 seconds of sample speech

## Creating Voice References

### Option 1: Record Your Own
1. Record 10-30 seconds of clear speech
2. Use a good quality microphone
3. Speak naturally and clearly
4. Save as WAV format (16kHz, mono recommended)

### Option 2: Use Royalty-Free Voice Samples
1. Find royalty-free voice samples online
2. Ensure proper licensing
3. Convert to WAV format if needed

### Option 3: Generate with TTS (for testing)
1. Use a basic TTS service to generate sample audio
2. Use generic voices only
3. Clearly mark as AI-generated

## File Format Requirements

- Format: WAV (preferred) or MP3
- Sample Rate: 16kHz or 22kHz
- Channels: Mono (1 channel)
- Bit Depth: 16-bit
- Duration: 10-30 seconds minimum

## Storage in Production

In production, these files should be stored in:
- Supabase Storage
- AWS S3
- Google Cloud Storage
- Any CDN with public access

Update the backend API to reference the correct URLs.

## Testing Without Real Voice Files

For development/testing, you can:
1. Use the TTS service in mock mode
2. Generate placeholder audio files
3. Use text-to-speech tools to create sample voices

## DO NOT

❌ Clone celebrity voices
❌ Use copyrighted audio without permission
❌ Use YouTube audio
❌ Train on real people's voices without consent
❌ Name voices after real people
