let audio = document.getElementById("audio");
let title = document.getElementById("title");
let cover = document.getElementById("cover");
let playlist = document.getElementById("playlist");

let currentSong = 0;

let songs = [
{
    name: "Song 1",
    file: "songs/song1.mp3",
    cover: "images/cover1.jpg"
},
{
    name: "Song 2",
    file: "songs/song2.mp3",
    cover: "images/cover2.jpg"
}
];

function loadSong(index){
    audio.src = songs[index].file;
    title.innerText = songs[index].name;
    cover.src = songs[index].cover;
    audio.load();
}

function playPause(){
    if(audio.paused){
        audio.play();
    }else{
        audio.pause();
    }
}

function nextSong(){
    currentSong++;
    if(currentSong >= songs.length){
        currentSong = 0;
    }
    loadSong(currentSong);
    audio.play();
}

function prevSong(){
    currentSong--;
    if(currentSong < 0){
        currentSong = songs.length - 1;
    }
    loadSong(currentSong);
    audio.play();
}

audio.addEventListener("ended", nextSong);

function showPlaylist(){
    playlist.innerHTML="";
    songs.forEach((song,index)=>{
        let li=document.createElement("li");
        li.innerText=song.name;
        li.onclick=function(){
            currentSong=index;
            loadSong(index);
            audio.play();
        };
        playlist.appendChild(li);
    });
}

function addSong(){
    let name=document.getElementById("songName").value;
    let file=document.getElementById("songFile").value;
    let coverImg=document.getElementById("songCover").value;

    if(name==""||file==""||coverImg==""){
        alert("Sab field bharo");
        return;
    }

    songs.push({
        name:name,
        file:file,
        cover:coverImg
    });

    showPlaylist();

    document.getElementById("songName").value="";
    document.getElementById("songFile").value="";
    document.getElementById("songCover").value="";
}

loadSong(currentSong);
showPlaylist();

