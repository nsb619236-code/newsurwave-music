async function generateMusic() {
    const prompt = document.getElementById('prompt').value;
    const status = document.getElementById('status');
    const audio = document.getElementById('audioPlayer');

    if (!prompt) {
        alert("Kripya kuch likhein!");
        return;
    }

    // --- YAHAN APNI DETAIL BHARIYE ---
    const API_TOKEN = "// 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,
    const MODEL_ID = "facebook/musicgen-small"; // Ye model fast aur muft hai
    // ---------------------------------

    status.innerText = "⏳ Hugging Face AI gaana bana raha hai... (Isme 30-60 seconds lag sakte hain)";
    audio.style.display = "none";

    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL_ID}`,
            {
                headers: { 
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "API ne kaam nahi kiya");
        }

        // Response ko audio file (blob) mein badalna
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        status.innerText = "✅ Gaana taiyaar hai! Enjoy 🎵";
        audio.src = url;
        audio.style.display = "block";
        audio.play();

    } catch (error) {
        console.error("Error details:", error);
        status.innerText = "❌ Error: " + error.message;
    }
}
