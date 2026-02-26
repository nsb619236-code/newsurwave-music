// songs array (duration जोड़ दिया – optional, audio से auto calculate होगा)
const songs = [
  {
    title: "Sky Dreams",
    artist: "WaveBeats",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/id/1015/500/500",
    // duration: "3:42"   ← optional, audio से ले लेंगे
  },
  {
    title: "Night Drive",
    artist: "DJ Flow",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/id/1016/500/500"
  },
  {
    title: "Sunset Vibes",
    artist: "Chill Master",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/id/1018/500/500"
  }
];

// Elements (तुम्हारे HTML IDs से मैच करो)
const audio          = document.getElementById("audio-player");  // या "audio" अगर HTML में id="audio" है
const cover          = document.getElementById("cover");         // player-cover या cover
const titleEl        = document.getElementById("title");
const artistEl       = document.getElementById("artist");
const playBtn        = document.getElementById("play");          // play-btn भी हो सकता है
const prevBtn        = document.getElementById("prev");
const nextBtn        = document.getElementById("next");
const progress       = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const currentTimeEl  = document.getElementById("currentTime");
const durationEl     = document.getElementById("duration");
const playlist       = document.getElementById("playlist");

let currentSongIndex = 0;
let isPlaying = false;

// पुराने playSong को हटा दो – सिर्फ ये वाला रखो
function loadSong(index) {
  const song = songs[index];
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.audio;
  audio.load();
}

function playSong(index) {
  if (index < 0 || index >= songs.length) return;

  currentSongIndex = index;
  loadSong(index);

  audio.pause();
  audio.currentTime = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';  // Font Awesome icon
        cover.classList.add('rotating');
      })
      .catch(err => {
        console.log("Play failed:", err);
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        cover.classList.remove('rotating');
        if (err.name === 'NotAllowedError') {
          alert("Mobile पर प्ले करने के लिए पहले पेज पर कहीं टैप करो या नीचे वाला प्ले बटन दबाओ।");
        }
      });
  }
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    cover.classList.remove('rotating');
    isPlaying = false;
  } else {
    playSong(currentSongIndex);
  }
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);

prevBtn.addEventListener("click", () => {
  currentSongIndex--;
  if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
  playSong(currentSongIndex);
});

nextBtn.addEventListener("click", () => {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) currentSongIndex = 0;
  playSong(currentSongIndex);
});

// Progress update
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent   = formatTime(audio.duration);
});

// Seek on progress bar
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

// Auto next song
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// Playlist
function showPlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      playSong(index);
    });
    playlist.appendChild(li);
  });
}

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Start
loadSong(currentSongIndex);
showPlaylist();// Settings Modal Functions
function showSettingsModal() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('settings-modal').classList.add('flex');
    
    // Load saved settings if any
    const settings = JSON.parse(localStorage.getItem('wavesSettings')) || {};
    if (settings.quality) document.getElementById('audio-quality').value = settings.quality;
    if (settings.normalize !== undefined) document.getElementById('normalize-volume').checked = settings.normalize;
    if (settings.darkMode !== undefined) document.getElementById('dark-mode').checked = settings.darkMode;
}

function hideSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
    document.getElementById('settings-modal').classList.remove('flex');
}

function saveSettings() {
    const settings = {
        quality: document.getElementById('audio-quality').value,
        normalize: document.getElementById('normalize-volume').checked,
        darkMode: document.getElementById('dark-mode').checked,
    };
    
    localStorage.setItem('wavesSettings', JSON.stringify(settings));
    
    // Apply changes (simple simulation)
    if (settings.normalize) {
        audio.volume = 0.8; // Dummy normalization
    }
    if (!settings.darkMode) {
        document.body.classList.add('light-mode'); // Add light mode CSS if you want
    } else {
        document.body.classList.remove('light-mode');
    }
    
    alert('Settings Saved! 🎧');
    hideSettingsModal();
}
