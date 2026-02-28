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
// renderSongs function में card HTML में ये add करो
div.innerHTML = `
  <p class="font-bold">${song.title}</p>
  <p class="text-sm text-gray-400">${song.artist}</p>
  <button onclick="addToPlaylist('${song.title}', '${song.artist}', '${song.audio}')" class="mt-2 text-cyan-400 hover:text-cyan-300">
    <i class="fas fa-plus-circle text-xl"></i> Add to Playlist
  </button>
`;
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
}let songs = []; // खाली array – Firestore से भरेगी

// Page load पर songs लोड करो
window.onload = () => {
  loadAllSongs();
};

// Firestore से गाने लोड करो
async function loadAllSongs() {
  try {
    const snapshot = await db.collection('Songs').orderBy('uploadedAt', 'desc').get();
    songs = [];
    snapshot.forEach(doc => {
      songs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log("Loaded songs from Firestore:", songs.length); // console में चेक करो
    renderSongs('popular-songs-grid', songs);
    renderSongs('made-for-you', songs.slice(0, 5));
    renderSongs('library-grid', songs); // Library में भी दिखाओ
  } catch (error) {
    console.error("Firestore load error:", error);
  }
}

// Upload के बाद list refresh
async function uploadSong() {
  // ... तुम्हारा upload code (Storage + Firestore add)

  // Success होने पर
  alert("Song uploaded and saved!");
  await loadAllSongs(); // तुरंत refresh
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
function switchTab(tab) {
  // ... existing code for active class

  const contentArea = document.getElementById('main-content');
  contentArea.innerHTML = ''; // पुराना content clear

  if (tab === 0) { // Home
    // Home content (hero + made for you + popular)
    contentArea.innerHTML = /* तुम्हारा home HTML */;
    renderSongs('popular-songs-grid', songs);
    renderSongs('made-for-you', songs.slice(0, 5));
  } else if (tab === 2) { // Your Library
    contentArea.innerHTML = `
      <div class="px-12 py-10">
        <h2 class="text-3xl font-bold mb-6">Your Library</h2>
        <div id="library-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"></div>
      </div>
    `;
    renderSongs('library-grid', songs); // यहीं songs दिखेंगे
  }
  // Search tab के लिए भी add कर सकते हो
}
// Firebase init (head में SDK add है तो ये काम करेगा)
const firebaseConfig = {
  // अपना config डालो (Firebase Console से copy)
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "1:your-app-id:web:your-web-id"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load songs from Firestore
async function loadAllSongs() {
  try {
    const snapshot = await db.collection('Songs').orderBy('uploadedAt', 'desc').get();
    const firestoreSongs = [];
    snapshot.forEach(doc => {
      firestoreSongs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // पुरानी example songs + new Firestore songs merge
    songs = [...songs, ...firestoreSongs];
    console.log("Total songs:", songs.length);

    // Render all sections
    renderSongs('popular-songs-grid', songs);
    renderSongs('made-for-you', songs.slice(0, 5));
    renderSongs('library-grid', songs); // Library में भी
  } catch (error) {
    console.error("Firestore load error:", error);
  }
}

// Upload के बाद refresh
async function uploadSong() {
  // ... तुम्हारा upload code (Storage + Firestore add)

  if (success) {
    alert("Song saved!");
    await loadAllSongs(); // list update
  }
}

// Page load पर call
window.onload = () => {
  loadAllSongs();
};
