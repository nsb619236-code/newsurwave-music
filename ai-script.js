let currentSong=null;

async function generateSong(){

const title=document.getElementById("title").value;
const prompt=document.getElementById("prompt").value;

document.getElementById("status").innerText="Generating...";

const res = await fetch("/api/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title,
prompt,
userId:"demoUser"
})
})

const data = await res.json();

if(data.success){

currentSong=data.song;

document.getElementById("player").src=data.audio_url;

document.getElementById("status").innerText="Song Ready";

}else{

document.getElementById("status").innerText="Error";

}

}

function saveSong(){

if(!currentSong){
alert("Generate song first");
return;
}

let library = JSON.parse(localStorage.getItem("songs") || "[]");

library.push(currentSong);

localStorage.setItem("songs",JSON.stringify(library));

alert("Saved!");

}

function goLibrary(){

window.location="library.html";

}
