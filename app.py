from flask import Flask, request, jsonify
from flask_cors import CORS
import replicate
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get token from environment
REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")

@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        duration = int(data.get('duration', 15))
        
        print(f"🎵 Generating: {prompt[:50]}...")
        
        # Check token
        if not REPLICATE_API_TOKEN or REPLICATE_API_TOKEN == "r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP ":
            return jsonify({
                'success': False,
                'error': 'API token not configured',
                'demo': True
            }), 500
        
        # Initialize client
        client = replicate.Client(api_token=REPLICATE_API_TOKEN)
        
        # ✅ NEW WORKING MODEL - Updated December 2024
        output = client.run(
            "meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
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
            'message': 'Song generated!'
        })
        
    except replicate.exceptions.ReplicateError as e:
        print(f"❌ Replicate Error: {e}")
        if "404" in str(e):
            return jsonify({
                'success': False,
                'error': 'Model not found. Using demo mode.',
                'demo': True
            }), 200  # Return 200 with demo flag
        return jsonify({'success': False, 'error': str(e)}), 500
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'token': '✅' if REPLICATE_API_TOKEN else '❌',
        'message': 'Server running'
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🎵 AI MUSIC GENERATOR")
    print("=" * 50)
    if REPLICATE_API_TOKEN:
        print(f"✅ Token: {REPLICATE_API_TOKEN[:10]}...")
    else:
        print("❌ No token found")
    print("📡 http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)
