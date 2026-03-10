// ============================================
// AI MUSIC GENERATOR - COMPLETE WORKING VERSION
// ============================================

// Global Variables
let currentAudioUrl = '';
let currentSongData = {};

// Initialize on Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 AI Music Generator Initialized');
    initializeGenerator();
    loadSavedData();
});

// Initialize Generator
function initializeGenerator() {
    // Set default values
    document.getElementById('songTitle').value = 'Pyaar Ka Safar';
    document.getElementById('promptInput').value = 'देखिये दिल कह रहा है\nमेरी मंजिल आप हैं\nयार बन के दिल की हर धुआंन में\nसामिल आप हैं';
    
    // Setup voice selection
    document.querySelectorAll('.voice-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.voice-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input').checked = true;
        });
    });
    
    // Setup mood selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load recent generations from localStorage
    loadRecentGenerations();
}

// Load Saved Data
function loadSavedData() {
    const saved = localStorage.getItem('surwave_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            if (settings.genre) document.getElementById('genreSelect').value = settings.genre;
            if (settings.duration) {
                document.getElementById('durationSlider').value = settings.duration;
                updateDuration();
            }
            if (settings.tempo) {
                document.getElementById('tempoSlider').value = settings.tempo;
                updateTempo();
            }
            if (settings.key) document.getElementById('keySelect').value = settings.key;
        } catch (e) {}
    }
}

// ===== GENERATE SONG FUNCTION =====
function generateSong() {
    console.log('🎵 Generating song...');
    
    // Get all values
    const songData = {
        title: document.getElementById('songTitle').value || 'My AI Song',
        prompt: document.getElementById('promptInput').value || 'Romantic song',
        genre: document.getElementById('genreSelect').value,
        voice: document.querySelector('input[name="voice"]:checked')?.value || 'male',
        mood: document.querySelector('.mood-btn.active')?.dataset.mood || 'romantic',
        duration: document.getElementById('durationSlider')?.value || 3,
        tempo: document.getElementById('tempoSlider')?.value || 120,
        key: document.getElementById('keySelect')?.value || 'C',
        language: document.getElementById('languageSelect')?.value || 'hindi'
    };
    
    currentSongData = songData;
    
    // Validate
    if (!songData.title.trim()) {
        showNotification('Please enter a song title', 'error');
        return;
    }
    
    if (!songData.prompt.trim()) {
        showNotification('Please enter lyrics or description', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    // Simulate generation process
    simulateGeneration(songData);
}

// Simulate Generation
function simulateGeneration(songData) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const loadingTip = document.getElementById('loadingTip');
    
    const tips = [
        '🎵 Composing melody...',
        '🎸 Adding instruments...',
        '🎤 Generating vocals...',
        '🎼 Creating harmony...',
        '🥁 Beating drums...',
        '✨ Mixing tracks...',
        '🎹 Adding piano...',
        '📝 Syncing lyrics...',
        '⚡ Mastering audio...',
        '🎯 Final touches...'
    ];
    
    let progress = 0;
    let tipIndex = 0;
    
    // Update tip every 2 seconds
    const tipInterval = setInterval(() => {
        tipIndex = (tipIndex + 1) % tips.length;
        loadingTip.textContent = tips[tipIndex];
    }, 2000);
    
    // Simulate progress
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            clearInterval(tipInterval);
            
            // Generation complete
            setTimeout(() => {
                completeGeneration(songData);
            }, 500);
        }
    }, 100);
}

// Complete Generation
function completeGeneration(songData) {
    // Sample audio URLs (guaranteed to work)
    const sampleAudios = [
        'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    ];
    
    // Select random audio
    const randomIndex
