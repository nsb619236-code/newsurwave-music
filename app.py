from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app) # Frontend aur Backend alag ports pe chalane ke liye

@app.route('/generate', methods=['POST'])
def generate_song():
    data = request.json
    prompt = data.get('prompt', '')
    
    print(f"Received Prompt: {prompt}")

    # --- YAHAN AI INTEGRATION HOGA ---
    # Abhi Suno ka official API public nahi hai, isliye hum dummy sound return kar rahe hain.
    # Jab API milegi, to aap yahan 'requests' library se Suno ko call karoge.
    
    # Example: Dummy audio file ka URL (Real mein yahan AI ka generated audio URL aayega)
    dummy_audio_url = "r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP "
    
    # Simulating delay (AI ko time lagta hai)
    # import time
    # time.sleep(2) 

    response = {
        "status": "success",
        "prompt": prompt,
        "audio_url": dummy_audio_url
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
