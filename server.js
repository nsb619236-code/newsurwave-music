const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,"../public")));

let songsDB = [];

app.post("/api/generate", async (req,res)=>{

const {title,prompt,userId} = req.body;

if(!title || !prompt){
return res.json({success:false});
}

const demoAudio =
"https://cdn.pixabay.com/download/audio/2022/03/15/audio_4e6f6a89f6.mp3";

const song = {
id: Date.now(),
title,
prompt,
audio: demoAudio,
userId
};

songsDB.push(song);

setTimeout(()=>{
res.json({
success:true,
audio_url:demoAudio,
song
});
},2000)

});

app.get("/api/library/:userId",(req,res)=>{

const userSongs = songsDB.filter(
song => song.userId === req.params.userId
)

res.json(userSongs);

});

const PORT = 5000;

app.listen(PORT,()=>{
console.log("Server running http://localhost:5000")
});
