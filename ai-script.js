async function generateMusic() {
    const promptInput = document.getElementById('prompt');
    const statusBox = document.getElementById('status-box');
    const audio = document.getElementById('audioPlayer');
    const btn = document.getElementById('genBtn');

    if (!promptInput.value.trim()) {
        alert("Prompt likhna zaroori hai!");
        return;
    }

    // --- APNA TOKEN YAHAN DALEIN ---
    const HF_TOKEN = " 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"; // DOOBARA CHECK KAREIN
    const MODEL_ID = "facebook/musicgen-small";

    btn.disabled = true;
    statusBox.innerHTML = '<div class="loader"></div> AI Loading... (Pehli baar mein time lagta hai)';

    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL_ID}`,
            {
                headers: { 
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                    "x-use-cache": "false" // Naya response lene ke liye
                },
                method: "POST",
                body: JSON.stringify({ inputs: promptInput.value }),
            }
        );

        // Agar model load ho raha hai (Status 503)
        if (response.status === 503) {
            statusBox.innerHTML = "⏳ Model load ho raha hai... 20 sec baad fir click karein.";
            return;
        }

        if (!response.ok) {
            throw new Error("API Token check karein ya Internet connection.");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        statusBox.innerHTML = "✅ Gaana taiyaar hai!";
        audio.src = audioUrl;
        audio.style.display = "block";
        audio.play();

    } catch (error) {
        statusBox.innerHTML = "❌ Error: " + error.message;
        console.error(error);
    } finally {
        btn.disabled = false;
    }
}
