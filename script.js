// ========== GLOBAL VARIABLES ==========
let currentUser = null;
let songs = [];
let playlists = [];
let currentSong = null;
let isPlaying = false;
let audio = new Audio();
let currentRadio = null;
let radioInterval = null;
let userEarnings = 0;
let userPlays = 0;
let userHours = 0;
let likedSongs = [];
let volume = 70;
let isMuted = false;
let repeatMode = 'none'; // none, all, one
let shuffleMode = false;
let audioFiles = [];
let imageFiles = [];

// ========== SAMPLE SONGS ==========
const sampleSongs = [
    {id: 1, title: 'Blinding Lights', artist: 'The Weeknd', emoji: '🎤', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 200, plays: 1240000, genre: 'Pop'},
    {id: 2, title: 'Levitating', artist: 'Dua Lipa', emoji: '✨', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 203, plays: 980000, genre: 'Pop'},
    {id: 3, title: 'Peaches', artist: 'Justin Bieber', emoji: '🍑', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 198, plays: 750000, genre: 'Pop'},
    {id: 4, title: 'Stay', artist: 'Kid Laroi', emoji: '⭐', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 210, plays: 890000, genre: 'Pop'},
];

// ========== RADIO STATIONS ==========
const radioStations = [
    {id: 1, name: 'Bollywood Hits', country: 'India', emoji: '🇮🇳', listeners: '2.5M', genre: 'Bollywood'},
    {id: 2, name: 'English Pop', country: 'USA', emoji: '🇺🇸', listeners: '5M', genre: 'Pop'},
    {id: 3, name: 'Punjabi Beats', country: 'India', emoji: '🇮🇳', listeners: '1.8M', genre: 'Punjabi'},
    {id: 4, name: 'K-Pop', country: 'Korea', emoji: '🇰🇷', listeners: '3.2M', genre: 'K-Pop'},
    {id: 5, name: 'Latin Hits', country: 'Spain', emoji: '🇪🇸', listeners: '4M', genre: 'Latin'},
    {id: 6, name: 'Arabic Hits', country: 'UAE', emoji: '🇦🇪', listeners: '2.8M', genre: 'Arabic'},
    {id: 7, name: 'Japanese Pop', country: 'Japan', emoji: '🇯🇵', listeners: '2.1M', genre: 'J-Pop'},
    {id: 8, name: 'French Café', country: 'France', emoji: '🇫🇷', listeners: '1.2M', genre: 'French'},
];

// ========== SAMPLE PLAYLISTS ==========
const samplePlaylists = [
    {id: 1, name: 'Chill Vibes', songs: [1, 2], cover: '🌊'},
    {id: 2, name: 'Workout Hits', songs: [3, 4], cover: '💪'},
    {id: 3, name: 'Party Mix', songs: [1, 3], cover: '🎉'},
];

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupAudioListeners();
    checkUser();
    showHome();
});

function loadData() {
    // Load songs
    let savedSongs = localStorage.getItem('songs');
    if(savedSongs) {
        try {
            songs = JSON.parse(savedSongs);
        } catch(e) {
            songs = [];
        }
    } else {
        songs = [];
    }
    
    if(songs.length === 0) {
        songs = [...sampleSongs];
        saveSongs();
    }
    
    // Load playlists
    let savedPlaylists = localStorage.getItem('playlists');
    if(savedPlaylists) {
        try {
            playlists = JSON.parse(savedPlaylists);
        } catch(e) {
            playlists = [...samplePlaylists];
        }
    } else {
        playlists = [...samplePlaylists];
    }
    
    // Load liked songs
    let savedLiked = localStorage.getItem('likedSongs');
    if(savedLiked) {
        try {
            likedSongs = JSON.parse(savedLiked);
        } catch(e) {
            likedSongs = [];
        }
    }
    
    // Load user data
    let savedEarnings = localStorage.getItem('earnings');
    let savedPlays = localStorage.getItem('plays');
    let savedHours = localStorage.getItem('hours');
    
    userEarnings = savedEarnings ? parseFloat(savedEarnings) : 0;
    userPlays = savedPlays ? parseInt(savedPlays) : 0;
    userHours = savedHours ? parseFloat(savedHours) : 0;
    
    updateBalance();
}

function saveSongs() {
    let songsToSave = songs.filter(s => !sampleSongs.find(sample => sample.id === s.id));
    localStorage.setItem('songs', JSON.stringify(songsToSave));
}

function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

function saveUserData() {
    localStorage.setItem('earnings', userEarnings.toString());
    localStorage.setItem('plays', userPlays.toString());
    localStorage.setItem('hours', userHours.toString());
    updateBalance();
}

function updateBalance() {
    document.getElementById('balanceDisplay').innerText = '$' + userEarnings.toFixed(2);
}

function checkUser() {
    let savedUser = localStorage.getItem('currentUser');
    if(savedUser) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        currentUser = users.find(u => u.email === savedUser);
        if(currentUser) {
            document.getElementById('userAvatar').innerText = (currentUser.name || currentUser.email)[0].toUpperCase();
            loadUserData();
        }
    }
}

function loadUserData() {
    let userData = JSON.parse(localStorage.getItem('userData_' + currentUser.email) || '{"earnings":0,"plays":0,"hours":0}');
    userEarnings = userData.earnings;
    userPlays = userData.plays;
    userHours = userData.hours;
    updateBalance();
}

function saveUserSpecificData() {
    if(!currentUser) return;
    localStorage.setItem('userData_' + currentUser.email, JSON.stringify({
        earnings: userEarnings,
        plays: userPlays,
        hours: userHours
    }));
}

// ========== AUDIO SETUP ==========
function setupAudioListeners() {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('totalTime').innerText = formatTime(audio.duration);
    });
}

function updateProgress() {
    if(audio.duration) {
        let progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
    }
}

function handleSongEnd() {
    if(repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
    } else if(repeatMode === 'all' || shuffleMode) {
        nextSong();
    } else {
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
    }
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ========== AUTH ==========
function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function toggleAuth() {
    let title = document.getElementById('authTitle');
    if(title.innerText === 'Login to Music Boss') {
        title.innerText = 'Create Account';
        document.getElementById('authBtn').innerText = 'Sign Up';
        document.getElementById('toggleBtn').innerText = 'Back to Login';
    } else {
        title.innerText = 'Login to Music Boss';
        document.getElementById('authBtn').innerText = 'Login';
        document.getElementById('toggleBtn').innerText = 'Create Account';
    }
}

function handleAuth() {
    let email = document.getElementById('email').value;
    let pass = document.getElementById('password').value;
    let title = document.getElementById('authTitle').innerText;
    
    if(!email || !pass) {
        showToast('Please fill all fields');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if(title === 'Create Account') {
        if(users.find(u => u.email === email)) {
            showToast('User already exists');
            return;
        }
        let newUser = {email, pass, name: email.split('@')[0]};
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('currentUser', email);
        showToast('Account created successfully!');
    } else {
        let user = users.find(u => u.email === email && u.pass === pass);
        if(user) {
            currentUser = user;
            localStorage.setItem('currentUser', email);
            showToast('Login successful!');
        } else {
            showToast('Invalid credentials');
            return;
        }
    }
    
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('userAvatar').innerText = (currentUser.name || currentUser.email)[0].toUpperCase();
    loadUserData();
}

// ========== PAGE NAVIGATION ==========
function showPage(page) {
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if(page === 'home') showHome();
    if(page === 'search') showSearch();
    if(page === 'library') showLibrary();
    if(page === 'upload') showUploadModal();
    if(page === 'radio') showRadio();
    if(page === 'earnings') showEarnings();
}

// ========== HOME PAGE ==========
function showHome() {
    let html = `
        <div class="section-title">
            <i class="fas fa-fire"></i> Trending Now
        </div>
        <div class="card-grid" id="trendingGrid"></div>
        
        <div class="section-title">
            <i class="fas fa-clock"></i> Recently Played
        </div>
        <div class="card-grid" id="recentGrid"></div>
        
        <div class="section-title">
            <i class="fas fa-broadcast-tower"></i> Live Radio
        </div>
        <div class="radio-grid" id="radioGrid"></div>
        
        <div class="section-title">
            <i class="fas fa-chart-line"></i> Top Charts
        </div>
        <div class="card-grid" id="chartsGrid"></div>
        
        <div class="section-title">
            <i class="fas fa-list"></i> Featured Playlists
        </div>
        <div class="card-grid" id="playlistGrid"></div>
    `;
    
    document.getElementById('mainContent').innerHTML = html;
    
    // Trending songs
    let trending = '';
    songs.slice(0, 6).forEach(s => {
        trending += createSongCard(s);
    });
    document.getElementById('trendingGrid').innerHTML = trending;
    
    // Recently played (simulate with some songs)
    let recent = '';
    songs.slice(2, 5).forEach(s => {
        recent += createSongCard(s);
    });
    document.getElementById('recentGrid').innerHTML = recent;
    
    // Radio stations
    let radio = '';
    radioStations.slice(0, 4).forEach(r => {
        radio += `
            <div class="radio-card" onclick="playRadio(${r.id})">
                <span class="live-badge">LIVE</span>
                <h2>${r.emoji}</h2>
                <h3>${r.name}</h3>
                <p>${r.country} • ${r.listeners}</p>
            </div>
        `;
    });
    document.getElementById('radioGrid').innerHTML = radio;
    
    // Charts
    let charts = '';
    songs.slice(0, 4).forEach(s => {
        charts += createSongCard(s);
    });
    document.getElementById('chartsGrid').innerHTML = charts;
    
    // Playlists
    let playlistHtml = '';
    playlists.forEach(p => {
        playlistHtml += `
            <div class="music-card" onclick="showPlaylist(${p.id})">
                <div class="card-img">${p.cover}</div>
                <div class="card-title">${p.name}</div>
                <div class="card-artist">${p.songs.length} songs</div>
            </div>
        `;
    });
    document.getElementById('playlistGrid').innerHTML = playlistHtml;
}

function createSongCard(song) {
    let isLiked = likedSongs.includes(song.id) ? 'fas' : 'far';
    return `
        <div class="music-card" data-id="${song.id}">
            <div class="card-img" style="${song.poster ? `background-image: url('${song.poster}')` : ''}">
                ${!song.poster ? song.emoji : ''}
                <div class="play-overlay" onclick="playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="card-title">${song.title}</div>
            <div class="card-artist">${song.artist}</div>
            ${song.user ? '<span class="card-badge">Your Upload</span>' : ''}
            <div class="button-group">
                <button class="play-btn" onclick="playSong(${song.id})">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="delete-btn" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// ========== SEARCH PAGE ==========
function showSearch() {
    let html = `
        <div class="section-title">
            <i class="fas fa-search"></i> Search
        </div>
        <input type="text" id="searchInput" placeholder="Search songs, artists, albums..." onkeyup="searchSongs()">
        <div class="card-grid" id="searchResults"></div>
    `;
    document.getElementById('mainContent').innerHTML = html;
    document.getElementById('searchInput').focus();
}

function searchSongs() {
    let query = document.getElementById('searchInput').value.toLowerCase();
    if(query.length < 2) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }
    
    let results = songs.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query) ||
        (s.genre && s.genre.toLowerCase().includes(query))
    );
    
    let html = '';
    results.forEach(s => {
        html += createSongCard(s);
    });
    document.getElementById('searchResults').innerHTML = html || '<p>No results found</p>';
}

// ========== LIBRARY PAGE ==========
function showLibrary() {
    if(!currentUser) {
        showToast('Please login to view your library');
        showAuthModal();
        return;
    }
    
    let userSongs = songs.filter(s => s.user === currentUser.email);
    let userPlaylists = playlists.filter(p => p.user === currentUser.email);
    
    let html = `
        <div class="library-filters">
            <span class="filter-chip active" onclick="filterLibrary('all')">All</span>
            <span class="filter-chip" onclick="filterLibrary('songs')">Songs</span>
            <span class="filter-chip" onclick="filterLibrary('playlists')">Playlists</span>
            <span class="filter-chip" onclick="filterLibrary('artists')">Artists</span>
        </div>
        
        <div class="section-title">
            <i class="fas fa-music"></i> Your Songs
        </div>
        <div class="card-grid" id="librarySongs"></div>
        
        <div class="section-title">
            <i class="fas fa-list"></i> Your Playlists
        </div>
        <div class="card-grid" id="libraryPlaylists"></div>
    `;
    
    document.getElementById('mainContent').innerHTML = html;
    
    // Show user songs
    let songsHtml = '';
    userSongs.forEach(s => {
        songsHtml += createSongCard(s);
    });
    document.getElementById('librarySongs').innerHTML = songsHtml || '<p>No uploaded songs yet</p>';
    
    // Show playlists
    let playlistHtml = '';
    userPlaylists.forEach(p => {
        playlistHtml += `
            <div class="music-card" onclick="showPlaylist(${p.id})">
                <div class="card-img">${p.cover}</div>
                <div class="card-title">${p.name}</div>
                <div class="card-artist">${p.songs.length} songs</div>
            </div>
        `;
    });
    document.getElementById('libraryPlaylists').innerHTML = playlistHtml || '<p>Create your first playlist</p>';
}

function filterLibrary(filter) {
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
    // Implement filtering logic
}

// ========== UPLOAD MODAL ==========
function showUploadModal() {
    if(!currentUser) {
        showToast('Please login to upload');
        showAuthModal();
        return;
    }
    document.getElementById('uploadModal').classList.add('active');
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
    resetUploadForms();
}

function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Upload').classList.add('active');
}

function previewAudio(input) {
    if(input.files && input.files[0]) {
        let fileName = input.files[0].name;
        showToast('Selected: ' + fileName);
    }
}

function previewImage(input) {
    if(input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let preview = document.getElementById('singlePreview');
            preview.innerHTML = `<img src="${e.target.result}" class="preview-item">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function handleMultipleAudio() {
    let files = document.getElementById('multipleAudio').files;
    audioFiles = Array.from(files);
    let html = '<h4>Selected Audio Files:</h4>';
    audioFiles.forEach((f, i) => {
        html += `
            <div class="file-item">
                <span><i class="fas fa-music"></i> ${f.name}</span>
                <span class="remove-file" onclick="removeAudio(${i})">✖</span>
            </div>
        `;
    });
    document.getElementById('multipleAudioList').innerHTML = html;
}

function handleMultipleImages() {
    let files = document.getElementById('multipleImage').files;
    imageFiles = Array.from(files);
    let html = '<h4>Selected Images:</h4>';
    imageFiles.forEach((f, i) => {
        html += `
            <div class="file-item">
                <span><i class="fas fa-image"></i> ${f.name}</span>
                <span class="remove-file" onclick="removeImage(${i})">✖</span>
            </div>
        `;
    });
    document.getElementById('multipleImageList').innerHTML = html;
}

function removeAudio(index) {
    audioFiles.splice(index, 1);
    handleMultipleAudio();
}

function removeImage(index) {
    imageFiles.splice(index, 1);
    handleMultipleImages();
}

function uploadSingle() {
    let audioFile = document.getElementById('singleAudio').files[0];
    let title = document.getElementById('singleTitle').value;
    let artist = document.getElementById('singleArtist').value;
    let genre = document.getElementById('singleGenre').value;
    
    if(!audioFile) { showToast('Select audio file'); return; }
    if(!title || !artist) { showToast('Enter title and artist'); return; }
    
    let poster = null;
    if(document.getElementById('singleImage').files[0]) {
        poster = URL.createObjectURL(document.getElementById('singleImage').files[0]);
    }
    
    let newSong = {
        id: Date.now(),
        title: title,
        artist: artist,
        genre: genre,
        emoji: '🎵',
        poster: poster,
        url: URL.createObjectURL(audioFile),
        user: currentUser.email,
        plays: 0,
        duration: 180
    };
    
    songs.push(newSong);
    saveSongs();
    showToast('Song uploaded successfully!');
    closeUploadModal();
}

function uploadMultiple() {
    if(audioFiles.length === 0) { showToast('Select audio files'); return; }
    
    let artist = document.getElementById('multipleArtist').value;
    let genre = document.getElementById('multipleGenre').value;
    
    if(!artist) { showToast('Enter artist name'); return; }
    
    let count = 0;
    
    audioFiles.forEach((file, i) => {
        let title = prompt('Enter title for song ' + (i+1), file.name.split('.')[0]);
        if(!title) title = file.name;
        
        let poster = imageFiles[i] ? URL.createObjectURL(imageFiles[i]) : null;
        
        let newSong = {
            id: Date.now() + i,
            title: title,
   
