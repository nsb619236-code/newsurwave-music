
<script>
const audioPlayer = document.getElementById("audioPlayer");
const songUpload = document.getElementById("songUpload");
const posterUpload = document.getElementById("posterUpload");

songUpload.addEventListener("change", function(){
    const file = this.files[0];
    if(file){
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        audioPlayer.play();
        alert("Song Uploaded & Playing!");
    }
});

posterUpload.addEventListener("change", function(){
    const file = this.files[0];
    if(file){
        const url = URL.createObjectURL(file);
        document.querySelector(".cover-art").style.backgroundImage = `url(${url})`;
        document.querySelector(".cover-art").style.backgroundSize = "cover";
        document.querySelector(".cover-art").innerHTML = "";
        alert("Poster Uploaded!");
    }
});
</script>
const UNSPLASH_KEY = "f7rgPa7m5QOuti0APoXGZtqUI6oDFFzeYylqRTVm8nY"; // ← ये बदल दो
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
function renderPlaylists() {
  const container = document.getElementById('playlists');
  container.innerHTML = '';
  playlists.forEach(pl => {
    const card = document.createElement('div');
    card.className = 'card bg-gray-800 p-6 rounded-xl cursor-pointer';
    card.innerHTML = `
      <h4 class="font-bold text-xl">${pl.name}</h4>
      <p class="text-sm text-gray-400">${pl.songs.length} songs</p>
    `;
    card.onclick = () => showPlaylistSongs(pl);
    container.appendChild(card);
  });
}

function showPlaylistSongs(playlist) {
  document.getElementById('playlist-title').textContent = playlist.name;
  const list = document.getElementById('playlist-songs-list');
  list.innerHTML = '';
  playlist.songs.forEach(song => {
    const div = document.createElement('div');
    div.className = 'bg-gray-700 p-4 rounded-lg flex justify-between items-center';
    div.innerHTML = `
      <div>
        <p class="font-medium">${song.title}</p>
        <p class="text-sm text-gray-400">${song.artist}</p>
      </div>
      <button onclick="playSong({title: '${song.title}', artist: '${song.artist}', audio: '${song.audio}'})" class="text-cyan-400">
        <i class="fas fa-play"></i>
      </button>
    `;
    list.appendChild(div);
  });
  document.getElementById('playlist-songs').classList.remove('hidden');
}

// Create new playlist
function createPlaylist() {
  const name = prompt("Playlist का नाम डालो:");
  if (name) {
    playlists.push({ name, songs: [] });
    localStorage.setItem('playlists', JSON.stringify(playlists));
    renderPlaylists();
    alert("Playlist बन गई!");
  }
}

// Initial render
renderPlaylists();
// renderSongs function में card HTML में ये add करो
div.innerHTML = `
  <p class="font-bold">${song.title}</p>
  <p class="text-sm text-gray-400">${song.artist}</p>
  <button onclick="addToPlaylist('${song.title}', '${song.artist}', '${song.audio}')" class="mt-2 text-cyan-400 hover:text-cyan-300">
    <i class="fas fa-plus-circle text-xl"></i> Add to Playlist
  </button>
`;
// Upload Song
await db.collection('songs').add({
  title,
  artist,
  audio: songUrl, // URL.createObjectURL
  cover: coverUrl,
  uploadedAt: new Date()
});
async function uploadSong() {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    alert("MP3 file चुनो!");
    return;
  }

  function loadData(){
let savedSongs = localStorage.getItem('songs');
if(savedSongs){
songs = JSON.parse(savedSongs);
} else {
songs = [];
}
// Add sample songs if no songs
if(songs.length === 0){
songs = [...sampleSongs];
saveSongs();
}
  }
    const title = document.getElementById('upload-title').value.trim() || "New Song";
  const artist = document.getElementById('upload-artist').value.trim() || "Unknown";

  // Step 1: Unsplash से random music cover generate
  let coverUrl = "https://picsum.photos/300/300"; // fallback

  try {
    const res = await fetch(`https://api.unsplash.com/photos/random?query=music,wave,beat&orientation=squarish&client_id=${UNSPLASH_KEY}`);
    const data = await res.json();
    if (data.urls?.regular) {
      coverUrl = data.urls.regular; // high quality image
      console.log("Unsplash cover:", coverUrl);
    }
  } catch (err) {
    console.log("Unsplash error, using fallback:", err);
  }

  // Step 2: Local file URL create
  const songUrl = URL.createObjectURL(file);

  // Step 3: New song object
    function saveSongs(){
let songsToSave = songs.filter(s => !sampleSongs.find(sample => sample.id === s.id));
localStorage.setItem('songs', JSON.stringify(songsToSave));
    }
  const newSong = {
    title,
    artist,
    audio: songUrl,
    cover: coverUrl
  };

  // Add to library / liked songs
  likedSongs.push(newSong);
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));

  alert(`"${title}" by ${artist} uploaded! Cover auto-generated from Unsplash 🎨`);

  // Refresh library view
  renderLibrary();

  // Clear inputs
  fileInput.value = '';
  document.getElementById('upload-title').value = '';
  document.getElementById('upload-artist').value = '';
}

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
function togglePlay(){
    if(audioPlayer.paused){
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
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
</script>saveSongs(); // Delete ke baad save
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
saveSongs(); // Upload ke baad save
  if (success) {
    alert("Song saved!");
    await loadAllSongs(); // list update
  }
}

// Page load पर call
window.onload = () => {
  loadAllSongs();
};
function addToPlaylist(title, artist, audio) {
  if (!playlists.length) {
    alert("पहले कोई playlist बनाओ!");
    return;
  }

  // पहली playlist में add कर दो (या prompt से पूछो)
  const playlistName = prompt("किस playlist में add करना है?", playlists[0].name);
  const playlist = playlists.find(p => p.name === playlistName);

  if (playlist) {
    playlist.songs.push({ title, artist, audio });
    localStorage.setItem('playlists', JSON.stringify(playlists));
    alert(`"${title}" added to "${playlistName}"!`);
  } else {
    alert("Playlist नहीं मिली");
  }
  const snapshot = await db.collection('songs').get();
snapshot.forEach(doc => songs.push(doc.data()));
}
