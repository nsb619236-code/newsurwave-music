// API call functhf_ljKQSvUHeVhoePwciLXczOPZlQJtXFJWusion
async function generateSong() {
    const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: document.getElementById('songTitle').value,
            lyrics: document.getElementById('lyrics').value,
            style: document.getElementById('musicStyle').value,
            duration: 30,
            // ... other parameters
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Convert base64 to audio and play
        const audio = new Audio('data:audio/wav;base64,' + data.audioData);
        audio.play();
    }
}
