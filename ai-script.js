async function generateSong() {
    const prompt = document.getElementById("prompt").value;

    const res = await fetch("/generate-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    document.getElementById("lyrics").innerText = data.lyrics;
    document.getElementById("audio").src = data.audio;
}
