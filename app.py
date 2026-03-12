from flask import Flask, request, jsonify
from flask_cors import CORS
import replicate
import requests
import os
import uuid

app = Flask(__name__)
CORS(app)

# API Keys (Sign up on replicate.com for free)
REPLICATE_API_TOKEN = "r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP "  # Get from https://replicate.com
HF_TOKEN = "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 "  # Get from https://huggingface.co

@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        duration = int(data.get('duration', 30))
        
        # Option 1: Replicate API (Best Quality)
        if REPLICATE_API_TOKEN != "YOUR_REPLICATE_TOKEN":
            import replicate
            client = replicate.Client(api_token=REPLICATE_API_TOKEN)
            
            output = client.run(
                "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055e2e9e9ab3a72a4e6f5c4f6",
                input={
                    "prompt": prompt,
                    "duration": duration,
                    "temperature": 0.8
                }
            )
            
            return jsonify({
                'success': True,
                'audio_url': output,
                'message': 'Song generated!'
            })
        
        # Option 2: Hugging Face (Free)
        elif HF_TOKEN != "YOUR_HF_TOKEN":
            API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
            headers = {"Authorization": f"Bearer {HF_TOKEN}"}
            
            response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
            
            if response.status_code == 200:
                # Save audio file
                filename = f"generated_{uuid.uuid4()}.mp3"
                with open(f"static/{filename}", 'wb') as f:
                    f.write(response.content)
                
                return jsonify({
                    'success': True,
                    'audio_url': f"/static/{filename}",
                    'message': 'Song generated!'
                })
        
        # Option 3: Demo Mode (Always works)
        else:
            demos = [
                'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav',
                'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            ]
            import random
            return jsonify({
                'success': True,
                'audio_url': random.choice(demos),
                'message': 'Demo mode - Get API keys for real AI!'
            })
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/credits/<user_id>', methods=['GET'])
def get_credits(user_id):
    # Get user credits from database
    return jsonify({'credits': 50})

if __name__ == '__main__':
    os.makedirs('static', exist_ok=True)
    app.run(debug=True, port=5000)
