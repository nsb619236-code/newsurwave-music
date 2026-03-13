from flask import Flask, request, jsonify
from flask_cors import CORS
import replicate
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Get Replicate API token from environment
REPLICATE_API_TOKEN = os.environ.get("r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP ")

@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        duration = int(data.get('duration', 30))
        
        print(f"🎵 Generating song: {prompt[:50]}...")
        
        # Check if token is configured
        if not REPLICATE_API_TOKEN or REPLICATE_API_TOKEN == "r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP ":
            return jsonify({
                'success': False,
                'error': 'Replicate API token not configured. Please add your token to .env file',
                'demo': True
            }), 500
        
        # Initialize Replicate client
        client = replicate.Client(api_token=REPLICATE_API_TOKEN)
        
        # Generate music using MusicGen model
        output = client.run(
            "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055e2e9e9ab3a72a4e6f5c4f6",
            input={
                "prompt": prompt,
                "duration": duration,
                "temperature": 0.8,
                "top_p": 0.9,
                "repetition_penalty": 1.1
            }
        )
        
        print(f"✅ Generated: {output}")
        
        return jsonify({
            'success': True,
            'audio_url': output,
            'message': 'Song generated successfully!'
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    token_status = "✅ Configured" if REPLICATE_API_TOKEN and REPLICATE_API_TOKEN != "your_token_here" else "❌ Not configured"
    return jsonify({
        'status': 'healthy',
        'token': token_status,
        'message': 'Suno AI Clone Backend is running'
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🎵 SUNO AI CLONE BACKEND")
    print("=" * 50)
    
    if REPLICATE_API_TOKEN and REPLICATE_API_TOKEN != "r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP  ":
        print(f"✅ Replicate API Token: {REPLICATE_API_TOKEN[:10]}...")
    else:
        print("❌ Replicate API Token not configured!")
        print("📝 Please add your token to backend/.env file")
    
    print("📡 Server: http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, port=5000)
