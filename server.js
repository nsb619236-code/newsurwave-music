// ============================================
// AI SONG GENERATOR - 4-5 MINUTE DURATION
// ============================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json({ limit: '500mb' })); // Large files ke liye limit badhayi
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// ========== CONFIGURATION ==========
const API_KEYS = {
    HUGGING_FACE: 'hf_your_api_key_here',
    REPLICATE: 'r8_your_api_key_here',
    SUNO_AI: 'suno_your_api_key_here'
};

const API_URLS = {
    HUGGING_FACE: 'https://api-inference.huggingface.co/models/facebook/musicgen-large', // Large model for longer duration
    REPLICATE: 'https://api.replicate.com/v1/predictions',
    SUNO_AI: 'https://api.suno.ai/v1/generate'
};

// ========== STORAGE SETUP ==========
const SONGS_DIR = path.join(__dirname, 'generated_songs');
if (!fs.existsSync(SONGS_DIR)) {
    fs.mkdirSync(SONGS_DIR, { recursive: true });
}

// ========== LOGGING ==========
const logFile = path.join(__dirname, 'server.log');
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
}

// ========== HELPER FUNCTIONS ==========

// Generate 4-5 minute audio (240-300 seconds)
function generateLongAudio(params) {
    const {
        style = 'pop',
        mood = 'happy',
        duration = 240, // 4 minutes default (240 seconds)
        tempo = 120,
        key = 'C',
        voice = 'male',
        effects = 'none'
    } = params;

    const sampleRate = 44100;
    const numSamples = sampleRate * duration; // duration in seconds
    const audioData = new Float32Array(numSamples);
    
    console.log(`Generating ${duration} seconds of audio...`);
    
    // Structure for 4-5 minute song:
    // Intro (0-30 sec) → Verse 1 (30-90 sec) → Chorus (90-150 sec) → 
    // Verse 2 (150-210 sec) → Chorus (210-270 sec) → Outro (270-300 sec)
    
    const sections = [
        { name: 'intro', start: 0, end: Math.min(30, duration), volume: 0.5 },
        { name: 'verse1', start: 30, end: Math.min(90, duration), volume: 0.7 },
        { name: 'chorus1', start: 90, end: Math.min(150, duration), volume: 1.0 },
        { name: 'verse2', start: 150, end: Math.min(210, duration), volume: 0.8 },
        { name: 'chorus2', start: 210, end: Math.min(270, duration), volume: 1.0 },
        { name: 'bridge', start: 270, end: Math.min(300, duration), volume: 0.6 },
        { name: 'outro', start: 300, end: duration, volume: 0.4 }
    ].filter(section => section.end > section.start);
    
    // Base frequencies for different styles
    const styleFreqs = {
        pop: { bass: 80, melody: 440, harmony: 880 },
        rock: { bass: 100, melody: 330, harmony: 660 },
        hiphop: { bass: 60, melody: 220, harmony: 440 },
        electronic: { bass: 120, melody: 660, harmony: 1320 },
        classical: { bass: 110, melody: 550, harmony: 1100 },
        jazz: { bass: 90, melody: 440, harmony: 880 },
        rnb: { bass: 70, melody: 440, harmony: 880 },
        country: { bass: 100, melody: 440, harmony: 880 },
        folk: { bass: 110, melody: 440, harmony: 880 },
        metal: { bass: 150, melody: 330, harmony: 660 },
        lofi: { bass: 60, melody: 220, harmony: 440 },
        edm: { bass: 130, melody: 880, harmony: 1760 }
    };
    
    const freqs = styleFreqs[style] || styleFreqs.pop;
    
    // Mood factors
    const moodFactors = {
        happy: { brightness: 1.2, complexity: 0.8 },
        sad: { brightness: 0.6, complexity: 0.5 },
        energetic: { brightness: 1.5, complexity: 1.2 },
        calm: { brightness: 0.7, complexity: 0.4 },
        romantic: { brightness: 1.0, complexity: 0.9 },
        dark: { brightness: 0.4, complexity: 1.0 }
    };
    
    const moodFactor = moodFactors[mood] || moodFactors.happy;
    
    // Tempo factor
    const tempoFactor = tempo / 120;
    
    // Generate each section
    for (const section of sections) {
        const sectionLength = section.end - section.start;
        console.log(`Generating ${section.name} (${section.start}s - ${section.end}s)`);
        
        for (let i = 0; i < sectionLength; i++) {
            const globalIndex = section.start * sampleRate + i;
            if (globalIndex >= numSamples) break;
            
            const t = globalIndex / sampleRate;
            const sectionT = i / sampleRate;
            
            // Different patterns for different sections
            let waveform = 0;
            
            switch(section.name) {
                case 'intro':
                    // Simple, soft intro
                    waveform = Math.sin(2 * Math.PI * freqs.bass * t * tempoFactor) * 0.3 +
                              Math.sin(2 * Math.PI * freqs.melody * t * tempoFactor * 0.5) * 0.2;
                    break;
                    
                case 'verse1':
                case 'verse2':
                    // Verses - medium complexity
                    waveform = Math.sin(2 * Math.PI * freqs.bass * t * tempoFactor) * 0.4 +
                              Math.sin(2 * Math.PI * freqs.melody * t * tempoFactor) * 0.5 +
                              Math.sin(2 * Math.PI * freqs.harmony * t * tempoFactor * 1.5) * 0.3;
                    break;
                    
                case 'chorus1':
                case 'chorus2':
                    // Chorus - full energy
                    waveform = Math.sin(2 * Math.PI * freqs.bass * t * tempoFactor) * 0.6 +
                              Math.sin(2 * Math.PI * freqs.melody * t * tempoFactor * 1.2) * 0.7 +
                              Math.sin(2 * Math.PI * freqs.harmony * t * tempoFactor * 2) * 0.5 +
                              Math.sin(2 * Math.PI * freqs.melody * 2 * t * tempoFactor) * 0.4;
                    break;
                    
                case 'bridge':
                    // Bridge - building up
                    waveform = Math.sin(2 * Math.PI * freqs.bass * t * tempoFactor) * 0.5 +
                              Math.sin(2 * Math.PI * freqs.melody * t * tempoFactor * 0.8) * 0.6 +
                              Math.sin(2 * Math.PI * freqs.harmony * t * tempoFactor * 1.2) * 0.4;
                    break;
                    
                case 'outro':
                    // Outro - fading out
                    const fadeOut = 1 - (sectionT / sectionLength);
                    waveform = (Math.sin(2 * Math.PI * freqs.bass * t * tempoFactor) * 0.3 +
                               Math.sin(2 * Math.PI * freqs.melody * t * tempoFactor * 0.5) * 0.4) * fadeOut;
                    break;
                    
                default:
                    waveform = Math.sin(2 * Math.PI * freqs.melody * t * tempoFactor) * 0.5;
            }
            
            // Apply mood factor
            waveform *= moodFactor.brightness;
            
            // Add effects
            if (effects === 'reverb') {
                waveform *= 0.7 + 0.3 * Math.sin(2 * Math.PI * 0.2 * t);
            } else if (effects === 'echo' && globalIndex > sampleRate) {
                waveform += audioData[globalIndex - Math.floor(sampleRate / 4)] * 0.3;
            } else if (effects === 'chorus') {
                waveform += Math.sin(2 * Math.PI * freqs.melody * 1.01 * t) * 0.2;
            }
            
            // Apply section volume
            waveform *= section.volume;
            
            // Add some variation
            waveform *= 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.1 * t);
            
            audioData[globalIndex] = waveform;
        }
    }
    
    return audioData;
}

// Convert Float32Array to WAV
function audioBufferToWav(buffer, sampleRate = 44100) {
    const numChannels = 1;
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataLength = buffer.length * blockAlign;
    
    const wavHeader = Buffer.alloc(44);
    
    // RIFF header
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + dataLength, 4);
    wavHeader.write('WAVE', 8);
    
    // fmt chunk
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20);
    wavHeader.writeUInt16LE(numChannels, 22);
    wavHeader.writeUInt32LE(sampleRate, 24);
    wavHeader.writeUInt32LE(sampleRate * blockAlign, 28);
    wavHeader.writeUInt16LE(blockAlign, 32);
    wavHeader.writeUInt16LE(bitDepth, 34);
    
    // data chunk
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(dataLength, 40);
    
    // Convert float32 to int16
    const audioData = Buffer.alloc(dataLength);
    for (let i = 0; i < buffer.length; i++) {
        const sample = Math.max(-1, Math.min(1, buffer[i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        audioData.writeInt16LE(intSample, i * bytesPerSample);
    }
    
    return Buffer.concat([wavHeader, audioData]);
}

// ========== API ROUTES ==========

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        server: 'AI Song Generator',
        maxDuration: '5 minutes',
        uptime: process.uptime()
    });
});

// Get available styles
app.get('/api/styles', (req, res) => {
    const styles = [
        { id: 'pop', name: 'Pop', icon: '🎵' },
        { id: 'rock', name: 'Rock', icon: '🎸' },
        { id: 'hiphop', name: 'Hip Hop', icon: '🎤' },
        { id: 'electronic', name: 'Electronic', icon: '🎹' },
        { id: 'classical', name: 'Classical', icon: '🎻' },
        { id: 'jazz', name: 'Jazz', icon: '🎷' },
        { id: 'rnb', name: 'R&B', icon: '🎵' },
        { id: 'country', name: 'Country', icon: '🪕' },
        { id: 'folk', name: 'Folk', icon: '🎸' },
        { id: 'metal', name: 'Metal', icon: '🤘' },
        { id: 'lofi', name: 'Lo-Fi', icon: '☕' },
        { id: 'edm', name: 'EDM', icon: '⚡' }
    ];
    res.json(styles);
});

// Get duration options (4-5 minutes)
app.get('/api/durations', (req, res) => {
    const durations = [
        { value: 240, label: '4 Minutes (240 sec)' },
        { value: 270, label: '4.5 Minutes (270 sec)' },
        { value: 300, label: '5 Minutes (300 sec)' }
    ];
    res.json(durations);
});

// MAIN GENERATION ENDPOINT
app.post('/api/generate', async (req, res) => {
    const startTime = Date.now();
    const requestId = crypto.randomBytes(8).toString('hex');
    
    try {
        logMessage(`📥 [${requestId}] New generation request`);
        
        // Get parameters with 4-5 min duration
        const {
            title = 'AI Song',
            lyrics = '',
            style = 'pop',
            mood = 'happy',
            duration = 240, // Default 4 minutes
            voice = 'male',
            tempo = 120,
            key = 'C',
            effects = 'none',
            quality = '320'
        } = req.body;
        
        // Validate duration (4-5 minutes only)
        const validDuration = Math.min(300, Math.max(240, duration));
        
        logMessage(`📝 [${requestId}] Generating ${validDuration}s song`);
        logMessage(`   Style: ${style}, Mood: ${mood}, Tempo: ${tempo}`);
        
        // Generate long audio
        const audioFloat32 = generateLongAudio({
            style,
            mood,
            duration: validDuration,
            tempo,
            key,
            voice,
            effects
        });
        
        // Convert to WAV
        const wavData = audioBufferToWav(audioFloat32);
        
        // Save file
        const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${validDuration}s_${Date.now()}.wav`;
        const filepath = path.join(SONGS_DIR, filename);
        fs.writeFileSync(filepath, wavData);
        
        // Convert to base64 for frontend
        const base64Audio = wavData.toString('base64');
        
        const timeTaken = Date.now() - startTime;
        
        logMessage(`✅ [${requestId}] Complete in ${timeTaken}ms`);
        logMessage(`💾 File: ${filename} (${(wavData.length / 1024 / 1024).toFixed(2)} MB)`);
        
        res.json({
            success: true,
            requestId,
            title,
            style,
            mood,
            duration: validDuration,
            durationMinutes: (validDuration / 60).toFixed(1),
            filename,
            fileSize: `${(wavData.length / 1024 / 1024).toFixed(2)} MB`,
            audioData: base64Audio,
            timeTaken
        });
        
    } catch (error) {
        logMessage(`❌ [${requestId}] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(SONGS_DIR, filename);
    
    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// List all songs
app.get('/api/songs', (req, res) => {
    try {
        const files = fs.readdirSync(SONGS_DIR)
            .filter(f => f.endsWith('.wav'))
            .map(f => {
                const stats = fs.statSync(path.join(SONGS_DIR, f));
                return {
                    filename: f,
                    size: stats.size,
                    created: stats.birthtime,
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2)
                };
            });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete song
app.delete('/api/songs/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(SONGS_DIR, filename);
    
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 AI SONG GENERATOR (4-5 MINUTE SONGS)');
    console.log('='.repeat(60));
    console.log(`✅ Server: http://localhost:${PORT}`);
    console.log(`⏱️  Duration: 4-5 minutes (240-300 seconds)`);
    console.log(`📁 Songs folder: ${SONGS_DIR}`);
    console.log('='.repeat(60));
});
