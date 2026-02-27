// Firebase Config (अपना config डालो - Firebase Console से copy)
const firebaseConfig = {
  apiKey: "AIzaSy...your-api-key...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "1:your-app-id:web:your-web-id"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Global variables
let songs = [];
let currentSongIndex = -1;
let isPlaying = false;
const audio = document.getElementById('audio-player');

// Load songs from Firestore
async function loadAllSongs() {
  try {
    const snapshot = await db.collection('songs')
      .orderBy('uploadedAt', 'desc')
      .get();

    songs = [];
    snapshot.forEach(doc => {
      songs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderSongs('popular-songs-grid', songs);
    renderSongs('made-for-you', songs.slice(0, 5));
  } catch (error) {
    console.error("Load error:", error);
    alert("Songs load nahi hue – internet check karo");
  }
}

// Upload Song
async function uploadSong() {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) return alert("MP3 file चुनो!");

  const title = document.getElementById('upload-title').value.trim() || "New Song";
  const artist = document.getElementById('upload-artist').value.trim() || "Unknown";

  try {
    const fileName = `${title}-${artist}-${Date.now()}.mp3`;
    const storageRef = storage.ref(`songs/${fileName}`);
    await storageRef.put(file);
    const audioUrl = await storageRef.getDownloadURL();

    await db.collection('songs').add({
      title,
      artist,
      audio: audioUrl,
      cover: "https://picsum.photos/300/300",
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Song uploaded and saved! 🎵");
    hideUploadModal();
    loadAllSongs();  // Refresh list
    fileInput.value = '';
  } catch (error) {
    console.error(error);
    alert("Upload fail: " + error.message);
  }
}

// Render songs (simple version – तुम्हारा पुराना render function अगर है तो replace)
function renderSongs(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  list.forEach((song, index) => {
    const card = document.createElement('div');
    card.className = 'song-card bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer p-4';
    card.innerHTML = `
      <img src="${song.cover}" class="w-full rounded-lg mb-2">
      <p class="font-semibold">${song.title}</p>
      <p class="text-sm text-zinc-400">${song.artist}</p>
    `;
    card.onclick = () => playSong(index);
    container.appendChild(card);
  });
}

// Play, toggle, download etc. functions (तुम्हारे पुराने वाले रख सकते हो या ये यूज करो)
function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  audio.src = song.audio;
  audio.play();
  isPlaying = true;
  document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
  // बाकी UI update...
}

function togglePlay() {
  if (isPlaying) audio.pause();
  else audio.play();
  isPlaying = !isPlaying;
  // UI change...
}

function downloadCurrentSong() {
  if (currentSongIndex === -1) return alert("No song!");
  const song = songs[currentSongIndex];
  const link = document.createElement('a');
  link.href = song.audio;
  link.download = `${song.title}.mp3`;
  link.click();
}

// Modal functions (show/hide)
function showUploadModal() { document.getElementById('upload-modal').classList.remove('hidden'); }
function hideUploadModal() { document.getElementById('upload-modal').classList.add('hidden'); }

// Page load
window.onload = () => {
  loadAllSongs();
};
</script>
