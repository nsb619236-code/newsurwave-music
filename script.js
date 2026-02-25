import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const playlist = document.getElementById("playlist");

let songs = [];
let currentSong = 0;
let isPlaying = false;

async function loadSongs() {
  const querySnapshot = await getDocs(collection(db, "songs"));
  querySnapshot.forEach((doc) => {
    songs.push(doc.data());
  });
  showPlaylist();
  loadSong(0);
}

function loadSong(index) {
  const song = songs[index];
  title.innerText = song.title;
  artist.innerText = song.artist;
  audio.src = song.audioUrl;
  cover.src = song.imageUrl;
}

function playSong() {
  audio.play();
  playBtn.innerText = "⏸";
  isPlaying = true;
}

function pauseSong() {
  audio.pause();
  playBtn.innerText = "▶";
  isPlaying = false;
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", () => {
  currentSong++;
  if (currentSong >= songs.length) currentSong = 0;
  loadSong(currentSong);
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentSong--;
  if (currentSong < 0) currentSong = songs.length - 1;
  loadSong(currentSong);
  playSong();
});

audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  document.getElementById("currentTime").innerText =
    formatTime(currentTime);
  document.getElementById("duration").innerText =
    formatTime(duration);
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener("ended", () => nextBtn.click());

function showPlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerText = song.title;
    li.addEventListener("click", () => {
      currentSong = index;
      loadSong(index);
      playSong();
    });
    playlist.appendChild(li);
  });
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

loadSongs();
