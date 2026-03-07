// ===== GLOBAL VARIABLES =====
let currentAudioUrl = '';
let currentSongId = '';
let isPlaying = false;
let audioContext = null;
let isLooping = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkAuth();
    
    // Initialize audio context
    initAudioContext();
    
    // Load saved settings
    loadSavedSettings();
    
    // Setup event listeners
    setupEventListeners();
});

// ===== AUTH FUNCTIONS =====
function checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        const authBtn = document.getElementById('authBtn');
        if (user) {
            authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            authBtn.href = '#';
            authBtn.onclick = (e) => {
                e.preventDefault();
                firebase.auth().signOut();
                window.location.reload();
            };
            
            // Load user credits
            loadUserCredits(user.uid);
        } else {
            authBtn.innerHTML = '<i class="fas fa-user"></i> Login';
            authBtn.href = 'login.html';
        }
    });
}

function loadUserCredits(userId) {
    // Get user credits from Firestore
    firebase.firestore().collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const credits = doc.data().credits || 50;
                document.querySelector('.credit-badge').innerHTML = 
                    `<i class="fas fa-bolt"></i> ${credits} Credits Left`;
            }
        });
}

// ===== AUDIO FUNCTIONS =====
function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playPreview() {
    const audio = document.getElementById('audioPlayer');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function toggleLoop() {
    const audio = document.getElementById('audioPlayer');
    isLooping = !isLooping;
    audio.loop = isLooping;
    
    const loopBtn = document.querySelector('.fa-redo-alt').parentElement;
    if (isLooping) {
        loopBtn.style.background = 'var(--gradient)';
        loopBtn.style.color = 'white';
    } else {
        loopBtn.style.background = 'white';
        loopBtn.style.color = 'var(--dark)';
    }
}

// ===== GENERATION FUNCTIONS =====
async function generateSong() {
    const title = document.getElementById('songTitle').value;
    const prompt = document.getElementById('promptInput').value;
    const genre = document.getElementById('genreSelect').value;
    const voice = document.querySelector('input[name="voice"]:checked').value;
    const mood = document.querySelector('.mood-btn.active')?.dataset.mood || 'energetic';
    const duration = document.getElementById('durationSlider')?.value || 4;
    const tempo = document.getElementById('tempoSlider')?.value || 120;
    const key = document.getElementById('keySelect')?.value || 'C';

    if (!title || !prompt) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading
    document.getElementById('loadingIndicator').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('generateBtn').disabled = true;

    try {
        // Simulate generation progress
        simulateProgress();
        
        // API call to backend
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                prompt,
                genre,
                voice,
                mood,
                duration,
                tempo,
                key
            })
        });

        const data = await response.json();
        
        if (data.success) {
            currentAudioUrl = data.audio_url;
            
            // Update UI
            document.getElementById('loadingIndicator').classList.add('hidden');
            document.getElementById('resultSection').classList.remove('hidden');
            
            // Set audio source
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = currentAudioUrl;
            
            // Update song info
            document.querySelector('.song-info h2').innerHTML = 
                '<i class="fas fa-check-circle" style="color: #4CAF50;"></i> ' + title;
            
            document.querySelector('.meta-tag:first-child').innerHTML = 
                `<i class="fas fa-clock"></i> ${duration}:00`;
            
            document.querySelector('.lyrics-preview p').textContent = prompt;
            
            // Draw waveform
            drawWaveform();
            
            showNotification('Song generated successfully!', 'success');
            
            // Deduct credits
            updateCredits();
        } else {
            showNotification('Error generating song', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('generateBtn').disabled = false;
    }
}

function simulateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const tipText = document.getElementById('tipText');
    
    const tips = [
        'Adding magical melodies...',
        'Composing harmonies...',
        'Mixing tracks...',
        'Mastering audio...',
        'Almost done...'
    ];
    
    let width = 0;
    let tipIndex = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += 2;
            progressFill.style.width = width + '%';
            
            if (width % 20 === 0 && tipIndex < tips.length) {
                tipText.textContent = tips[tipIndex];
                tipIndex++;
            }
        }
    }, 600);
}

// ===== WAVEFORM VISUALIZATION =====
function drawWaveform() {
    const canvas = document.getElementById('waveform');
    const ctx = canvas.getContext('2d');
    
    // Sample waveform data (in real app, get from audio)
    const data = new Array(100).fill(0).map(() => Math.random() * 80 + 20);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    
    const barWidth = canvas.width / data.length;
    
    data.forEach((value, index) => {
        const height = value;
        const x = index * barWidth;
        const y = (canvas.height - height) / 2;
        
        ctx.fillRect(x, y, barWidth - 2, height);
    });
}

// ===== DOWNLOAD FUNCTION =====
function downloadSong() {
    if (!currentAudioUrl) {
        showNotification('No song to download', 'error');
        return;
    }
    
    const title = document.getElementById('songTitle').value || 'AI_Song';
    
    // Create download link
    const a = document.createElement('a');
    a.href = currentAudioUrl;
    a.download = `${title.replace(/\s+/g, '_')}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('Download started!', 'success');
}

// ===== SAVE TO LIBRARY =====
async function saveToLibrary() {
    const user = firebase.auth().currentUser;
    
    if (!user) {
        showNotification('Please login to save songs', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    try {
        const songData = {
            title: document.getElementById('songTitle').value,
            prompt: document.getElementById('promptInput').value,
            genre: document.getElementById('genreSelect').value,
            voice: document.querySelector('input[name="voice"]:checked').value,
            mood: document.querySelector('.mood-btn.active')?.dataset.mood,
            duration: document.getElementById('durationSlider')?.value,
            tempo: document.getElementById('tempoSlider')?.value,
            key: document.getElementById('keySelect')?.value,
            audioUrl: currentAudioUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: user.uid
        };
        
        await firebase.firestore().collection('generated_songs').add(songData);
        showNotification('Song saved to library!', 'success');
    } catch (error) {
        console.error('Error saving:', error);
        showNotification('Error saving song', 'error');
    }
}

// ===== UI FUNCTIONS =====
function toggleAdvanced() {
    const panel = document.getElementById('advancedPanel');
    const icon = document.querySelector('.toggle-advanced .fa-chevron-down');
    
    panel.classList.toggle('hidden');
    icon.style.transform = panel.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
}

function updateDuration() {
    const slider = document.getElementById('durationSlider');
    const value = document.getElementById('durationValue');
    const mins = slider.value;
    const secs = mins * 60;
    value.textContent = `${mins} Min (${secs} sec)`;
}

function updateTempo() {
    const slider = document.getElementById('tempoSlider');
    const value = document.getElementById('tempoValue');
    value.textContent = `${slider.value} BPM`;
}

function usePrompt(text) {
    document.getElementById('promptInput').value = text;
}

function tryStyle(style) {
    const prompts = {
        romantic: 'Romantic love song with soft piano and emotional vocals',
        party: 'High energy party anthem with electronic beats',
        workout: 'Motivational workout music with strong bass',
        meditation: 'Calm meditation music with nature sounds'
    };
    
    document.getElementById('promptInput').value = prompts[style];
    document.getElementById('genreSelect').value = style === 'workout' ? 'electronic' : style;
}

function shareSong() {
    if (!currentAudioUrl) return;
    
    const shareData = {
        title: document.getElementById('songTitle').value,
        text: 'Check out my AI generated song!',
        url: currentAudioUrl
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        prompt('Copy this link:', currentAudioUrl);
    }
}

function addToPlaylist() {
    showNotification('Added to playlist!', 'success');
}

function regenerateSong() {
    generateSong();
}

function editSong() {
    document.getElementById('promptInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== MOOD SELECTION =====
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== VOICE SELECTION =====
document.querySelectorAll('.voice-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.voice-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        this.querySelector('input').checked = true;
    });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#ff6b6b'};
        color: white;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== SAVE SETTINGS =====
function saveSettings() {
    const settings = {
        genre: document.getElementById('genreSelect').value,
        voice: document.querySelector('input[name="voice"]:checked').value,
        mood: document.querySelector('.mood-btn.active')?.dataset.mood,
        duration: document.getElementById('durationSlider')?.value,
        tempo: document.getElementById('tempoSlider')?.value,
        key: document.getElementById('keySelect')?.value
    };
    
    localStorage.setItem('musicSettings', JSON.stringify(settings));
}

function loadSavedSettings() {
    const saved = localStorage.getItem('musicSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        
        if (settings.genre) document.getElementById('genreSelect').value = settings.genre;
        if (settings.voice) {
            document.querySelectorAll('.voice-option').forEach(opt => {
                if (opt.querySelector('input').value === settings.voice) {
                    opt.click();
                }
            });
        }
        if (settings.mood) {
            document.querySelectorAll('.mood-btn').forEach(btn => {
                if (btn.dataset.mood === settings.mood) {
                    btn.click();
                }
            });
        }
        if (settings.duration) {
            document.getElementById('durationSlider').value = settings.duration;
            updateDuration();
        }
        if (settings.tempo) {
            document.getElementById('tempoSlider').value = settings.tempo;
            updateTempo();
        }
        if (settings.key) document.getElementById('keySelect').value = settings.key;
    }
}

function setupEventListeners() {
    // Auto-save settings on change
    document.getElementById('genreSelect').addEventListener('change', saveSettings);
    document.querySelectorAll('input[name="voice"]').forEach(r => {
        r.addEventListener('change', saveSettings);
    });
    document.getElementById('durationSlider').addEventListener('input', saveSettings);
    document.getElementById('tempoSlider').addEventListener('input', saveSettings);
    document.getElementById('keySelect').addEventListener('change', saveSettings);
}

// ===== UPDATE CREDITS =====
function updateCredits() {
    const creditBadge = document.querySelector('.credit-badge');
    const currentCredits = parseInt(creditBadge.textContent.match(/\d+/)[0]);
    const newCredits = currentCredits - 4;
    
    creditBadge.innerHTML = `<i class="fas fa-bolt"></i> ${newCredits} Credits Left`;
    
    // Update in Firebase if logged in
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('users').doc(user.uid).update({
            credits: firebase.firestore.FieldValue.increment(-4)
        });
    }
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
