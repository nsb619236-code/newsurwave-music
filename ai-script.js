// ============================================
// SUNO AI CLONE - COMPLETE JAVASCRIPT
// DARK GREEN THEME WITH REAL AI GENERATION
// ============================================

// Global Variables
let currentAudioUrl = '';
let currentSongData = {};
let selectedVoice = 'male';
let selectedMood = 'romantic';
const API_URL = 'http://localhost:5000';

// Initialize on Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Suno AI Clone Initialized');
    
    // Initialize particles
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: '#00ff9d' },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00ff9d',
                    opacity: 0.2,
                    width: 1
                },
                move: { enable: true, speed: 2 }
            }
        });
    }
    
    // Load recent songs
    loadRecentSongs();
    
    // Set default values
    setDefaultValues();
});

// Set Default Values
function setDefaultValues() {
    const titleInput = document.getElementById('songTitle');
    if (titleInput && !titleInput.value) {
        titleInput.value = 'Midnight Dreams';
    }
    
    const promptInput = document.getElementById('promptInput');
    if (promptInput && !promptInput.value) {
        promptInput.value = 'A romantic Hindi song with soft piano, emotional vocals, and modern beats';
    }
}

// ===== VOICE SELECTION =====
function selectVoice(element, voice) {
    document.querySelectorAll('.voice-option').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedVoice = voice;
}

// ===== MOOD SELECTION =====
function selectMood(element) {
    document.querySelectorAll('.mood-btn').forEach(el => {
        el.classList.remove('active');
    });
    element.classList.add('active');
    selectedMood = element.dataset.mood;
}

// ===== ADVANCED SETTINGS =====
function toggleAdvanced() {
    const panel = document.getElementById('advancedPanel');
    const icon = document.querySelector('.advanced-toggle .fa-chevron-down');
    
    panel.classList.toggle('hidden');
    if (panel.classList.contains('hidden')) {
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.style.transform = 'rotate(180deg)';
    }
}

function updateDuration() {
    const slider = document.getElementById('durationSlider');
    const value = document.getElementById('durationValue');
    const seconds = slider.value;
    
    if (seconds < 60) {
        value.textContent = seconds + ' seconds';
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        value.textContent = minutes + 'm ' + remainingSeconds + 's';
    }
}

function updateTempo() {
    const slider = document.getElementById('tempoSlider');
    const value = document.getElementById('tempoValue');
    value.textContent = slider.value + ' BPM';
}

// ===== USE PROMPT =====
function usePrompt(text) {
    document.getElementById('promptInput').value = text;
}

// ===== TRY STYLE =====
function tryStyle(style, prompt) {
    document.getElementById('promptInput').value = prompt;
    
    // Set genre based on style
    const genreSelect = document.getElementById('genreSelect');
    if (style === 'romantic') genreSelect.value = 'hindi';
    else if (style === 'punjabi') genreSelect.value = 'punjabi';
    else if (style === 'edm') genreSelect.value = 'edm';
    else if (style === 'sad') genreSelect.value = 'hindi';
    
    // Set mood
    document.querySelectorAll('.mood-btn').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.mood === style || (style === 'edm' && el.dataset.mood === 'energetic')) {
            el.classList.add('active');
            selectedMood = el.dataset.mood;
        }
    });
    
    showNotification('✨ Style selected! Click Generate', 'info');
}

// ===== GENERATE SONG =====
async function generateSong() {
    const title = document.getElementById('songTitle').value;
    const prompt = document.getElementById('promptInput').value;
    const genre = document.getElementById('genreSelect').value;
    const duration = document.getElementById('durationSlider')?.value || 30;
    const tempo = document.getElementById('tempoSlider')?.value || 120;
    const key = document.getElementById('keySelect')?.value || 'C';
    
    if (!title || !prompt) {
        showNotification('Please enter song title and description', 'error');
        return;
    }
    
    // Save current song data
    currentSongData = {
        title, prompt, genre, duration, tempo, key,
        voice: selectedVoice,
        mood: selectedMood
    };
    
    // Show loading
    showLoading(true);
    
    try {
        // Call backend API
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                duration: Math.floor(duration / 15) * 15 // Round to nearest 15 seconds
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentAudioUrl = data.audio_url;
            
            // Update UI
            document.getElementById('resultTitle').textContent = title;
            document.getElementById('resultDuration').textContent = formatDuration(duration);
            document.getElementById('resultGenre').textContent = 
                document.getElementById('genreSelect').selectedOptions[0].text;
            document.getElementById('resultVoice').textContent = 
                selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1);
            document.getElementById('resultMood').textContent = 
                selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1);
            document.getElementById('lyricsPreview').textContent = 
                prompt.length > 100 ? prompt.substring(0, 100) + '...' : prompt;
            
            // Set audio
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = currentAudioUrl;
            audioPlayer.load();
            
            // Draw waveform
            drawWaveform();
            
            // Hide loading, show result
            showLoading(false);
            
            // Add to recent
            addToRecent(currentSongData);
            
            showNotification('✨ Song generated successfully!', 'success');
            
            // Update credits
            updateCredits();
        } else {
            throw new Error(data.error || 'Generation failed');
        }
        
    } catch (error) {
        console.error('Generation error:', error);
        showNotification('Error generating song. Using demo mode.', 'error');
        
        // Demo mode fallback
        demoModeGenerate();
    }
}

// ===== DEMO MODE (Fallback) =====
function demoModeGenerate() {
    setTimeout(() => {
        // Sample audio URLs
        const demoSongs = [
            'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        ];
        
        currentAudioUrl = demoSongs[Math.floor(Math.random() * demoSongs.length)];
        
        document.getElementById('audioPlayer').src = currentAudioUrl;
        showLoading(false);
        showNotification('🎵 Demo mode - Get API key for real AI!', 'info');
    }, 3000);
}

// ===== SHOW/HIDE LOADING =====
function showLoading(show) {
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    const generateBtn = document.getElementById('generateBtn');
    
    if (show) {
        loadingSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
        generateBtn.disabled = true;
        
        // Simulate progress
        simulateProgress();
    } else {
        loadingSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        generateBtn.disabled = false;
    }
}

// ===== SIMULATE PROGRESS =====
function simulateProgress() {
    const progressFill = document.getElementById('progressFill');
    const loadingTip = document.getElementById('loadingTip');
    
    const tips = [
        '🎵 Composing melody...',
        '🎸 Adding instruments...',
        '🎤 Generating vocals...',
        '🎼 Creating harmony...',
        '✨ Mixing tracks...',
        '⚡ Mastering audio...'
    ];
    
    let progress = 0;
    let tipIndex = 0;
    
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        
        if (progress % 20 === 0 && tipIndex < tips.length) {
            loadingTip.textContent = tips[tipIndex];
            tipIndex++;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
}

// ===== WAVEFORM =====
function drawWaveform() {
    const canvas = document.getElementById('waveform');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth || 800;
    canvas.height = 100;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate random waveform data
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push(Math.random() * 60 + 20);
    }
    
    // Draw gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#00ff9d');
    gradient.addColorStop(1, '#00cc7a');
    
    ctx.fillStyle = gradient;
    
    // Draw bars
    const barWidth = canvas.width / data.length;
    data.forEach((value, index) => {
        const x = index * barWidth;
        const y = (canvas.height - value) / 2;
        ctx.fillRect(x, y, barWidth - 2, value);
    });
}

// ===== DOWNLOAD SONG =====
function downloadSong() {
    if (!currentAudioUrl) {
        showNotification('No song to download', 'error');
        return;
    }
    
    const title = document.getElementById('songTitle').value || 'AI_Song';
    
    const a = document.createElement('a');
    a.href = currentAudioUrl;
    a.download = `${title.replace(/\s+/g, '_')}_SunoAI.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('⬇️ Download started!', 'success');
}

// ===== SAVE TO LIBRARY =====
function saveToLibrary() {
    if (!currentAudioUrl) {
        showNotification('No song to save', 'error');
        return;
    }
    
    // Save to localStorage
    const savedSongs = JSON.parse(localStorage.getItem('suno_saved_songs') || '[]');
    savedSongs.push({
        ...currentSongData,
        audioUrl: currentAudioUrl,
        savedAt: new Date().toISOString()
    });
    localStorage.setItem('suno_saved_songs', JSON.stringify(savedSongs));
    
    showNotification('💾 Song saved to library!', 'success');
}

// ===== SHARE SONG =====
function shareSong() {
    if (!currentAudioUrl) return;
    
    const title = document.getElementById('songTitle').value || 'AI Song';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out my AI generated song!',
            url: currentAudioUrl
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(currentAudioUrl);
        showNotification('🔗 Link copied!', 'success');
    }
}

// ===== REGENERATE SONG =====
function regenerateSong() {
    generateSong();
}

// ===== EDIT LYRICS =====
function editLyrics() {
    document.getElementById('promptInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== RECENT SONGS =====
function loadRecentSongs() {
    const recent = JSON.parse(localStorage.getItem('suno_recent_songs') || '[]');
    const recentList = document.getElementById('recentList');
    
    if (!recentList) return;
    
    recentList.innerHTML = '';
    recent.slice(0, 3).forEach(song => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.onclick = () => loadRecentSong(song);
        item.innerHTML = `
            <i class="fas fa-music"></i>
            <div class="recent-info">
                <span class="recent-title">${song.title || 'AI Song'}</span>
                <span class="recent-time">${song.time || 'Recently'}</span>
            </div>
            <i class="fas fa-play"></i>
        `;
        recentList.appendChild(item);
    });
}

function addToRecent(song) {
    const recent = JSON.parse(localStorage.getItem('suno_recent_songs') || '[]');
    recent.unshift({
        ...song,
        time: new Date().toLocaleTimeString()
    });
    if (recent.length > 5) recent.pop();
    localStorage.setItem('suno_recent_songs', JSON.stringify(recent));
    loadRecentSongs();
}

function loadRecentSong(song) {
    if (song.audioUrl) {
        currentAudioUrl = song.audioUrl;
        document.getElementById('audioPlayer').src = song.audioUrl;
        document.getElementById('resultSection').classList.remove('hidden');
        drawWaveform();
    }
}

// ===== NOTIFICATION =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00ff9d' : type === 'error' ? '#ff4757' : '#1e2635'};
        color: ${type === 'success' ? '#0b0e14' : '#ffffff'};
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0, 255, 157, 0.3);
        z-index: 9999;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideUp 0.3s ease;
        border: 1px solid rgba(0, 255, 157, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== UPDATE CREDITS =====
function updateCredits() {
    const creditSpan = document.querySelector('.credit-display span');
    if (creditSpan) {
        const current = parseInt(creditSpan.textContent) || 50;
        const newCredits = Math.max(0, current - 4);
        creditSpan.textContent = newCredits + ' Credits Available';
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDuration(seconds) {
    if (seconds < 60) return seconds + 's';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + 'm ' + secs + 's';
}

// ===== ADD CSS ANIMATIONS =====
(function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        
        .hidden { display: none !important; }
        
        #generateBtn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
})();
