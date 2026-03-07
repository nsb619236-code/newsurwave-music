// Variables
let currentAudioUrl = '';
let currentSongId = '';

// Generate music function
async function generateMusic() {
    const prompt = document.getElementById('promptInput').value;
    const genre = document.getElementById('genreSelect').value;
    const duration = document.getElementById('durationSelect').value;

    if (!prompt) {
        alert('Please describe your song first!');
        return;
    }

    // Show loading
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('generateBtn').disabled = true;

    try {
        // API call to your backend
        // Abhi ke liye demo ke taur par local MP3 use karenge
        // Baad mein ise real API se replace karna
        
        setTimeout(() => {
            // Demo - aapke existing songs mein se random play karein
            const demoSongs = ['Song1.mp3', 'song2.mp3'];
            const randomSong = demoSongs[Math.floor(Math.random() * demoSongs.length)];
            
            currentAudioUrl = randomSong;
            
            // Update audio player
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = randomSong;
            
            // Hide loading, show result
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('generateBtn').disabled = false;
            
        }, 3000); // 3 second loading show karein
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating song. Please try again.');
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('generateBtn').disabled = false;
    }
}

// Download song
function downloadSong() {
    if (!currentAudioUrl) return;
    
    const a = document.createElement('a');
    a.href = currentAudioUrl;
    a.download = `AI_Song_${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Save to library (Firebase)
async function saveToLibrary() {
    try {
        const user = firebase.auth().currentUser;
        
        if (!user) {
            alert('Please login to save songs!');
            window.location.href = 'login.html';
            return;
        }
        
        const songData = {
            title: document.getElementById('promptInput').value.substring(0, 50),
            url: currentAudioUrl,
            genre: document.getElementById('genreSelect').value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: user.uid
        };
        
        await firebase.firestore().collection('generated_songs').add(songData);
        alert('Song saved to your library!');
        
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving song');
    }
}

// Share functions
function shareOnWhatsApp() {
    const text = `Check out this AI generated song: ${currentAudioUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}

function copyLink() {
    navigator.clipboard.writeText(currentAudioUrl);
    alert('Link copied!');
}

// Use example prompt
function useExample(text) {
    document.getElementById('promptInput').value = text;
}

// Check login status on load
firebase.auth().onAuthStateChanged((user) => {
    const authBtn = document.getElementById('authBtn');
    if (user) {
        authBtn.textContent = 'Logout';
        authBtn.href = '#';
        authBtn.onclick = () => {
            firebase.auth().signOut();
            window.location.reload();
        };
    } else {
        authBtn.textContent = 'Login';
        authBtn.href = 'login.html';
    }
});
