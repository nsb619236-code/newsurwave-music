<script>
    async function generateMusic() {
        const prompt = document.getElementById('prompt').value;
        const status = document.getElementById('status');
        const audio = document.getElementById('audioPlayer');

        if (!prompt) {
            alert("Kripya prompt likhein!");
            return;
        }
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
        // 1. Apni API Key yahan dalein
        const API_TOKEN = "APKI_HUGGING_FACE_TOKEN_YAHAN_DAREIN"; 
        // 2. Model ID (Example: facebook/musicgen-small)
        const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small";

        status.innerText = "⏳ Hugging Face AI gaana bana raha hai... Isme 1 minute tak lag sakta hai.";
        audio.style.display = "none";

        try {
            const response = await fetch(MODEL_URL, {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            });

            if (!response.ok) {
                throw new Error("API Connection mein dikat aayi hai.");
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            
            status.innerHTML = "✅ Gaana taiyaar hai!";
            audio.src = audioUrl;
            audio.style.display = "block";
            audio.play();

        } catch (error) {
            console.error(error);
            status.innerText = "❌ Error: " + error.message;
        }
    }
</script>
