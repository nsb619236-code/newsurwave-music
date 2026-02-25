const songs = [
  {
    title: "Sky Dreams",
    artist: "WaveBeats",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/id/1015/500/500"
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

let currentSong = 0;
let isPlaying = false;

function loadSong(index) {
  const song = songs[index];
  title.innerText = song.title;
  artist.innerText = song.artist;
  audio.src = song.audio;
  cover.src = song.cover;
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

loadSong(currentSong);
showPlaylist();
function playSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;
    const song = songs[index];

    // Pehle purana audio stop + reset karo (mobile pe zaroori)
    audio.pause();
    audio.currentTime = 0;
    audio.src = song.audio;
    audio.load();  // Mobile browsers ke liye bahut important

    // Ab play try karo
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Success – play shuru ho gaya
                isPlaying = true;
                playBtn.innerHTML = `<i class="fas fa-pause text-2xl"></i>`;
                playerCover.classList.add('rotating');
                updatePlayerUI();
                startProgress();
            })
            .catch(err => {
                // Fail hone pe (mobile pe common: NotAllowedError ya AbortError)
                console.log("Play failed:", err.message);
                isPlaying = false;
                playBtn.innerHTML = `<i class="fas fa-play text-2xl ml-0.5"></i>`;
                playerCover.classList.remove('rotating');

                // User ko hint do (sirf pehli baar ya jab fail ho)
                if (err.name === 'NotAllowedError') {
                    alert("Mobile pe play karne ke liye bottom wale Play button ko tap karo ya page pe pehle kahin touch karo.");
                }
            });
    }

    // Chahe play ho ya na ho, UI to update kar do
    updatePlayerUI();
}
