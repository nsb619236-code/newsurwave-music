const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Fake AI song generator
app.post("/generate-song", (req, res) => {
    const { prompt } = req.body;

    const lyrics = `
🎶 ${prompt} 🎶

Verse:
Dil ke jazbaat keh na sake,
Tere bina hum reh na sake...

Chorus:
Tu hi mera sapna hai,
Tu hi mera apna hai...
`;

    res.json({
        lyrics,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
