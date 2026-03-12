from flask import Flask, request, jsonify
from flask_cors import CORS
import replicate
import os

# Environment se token lo
REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")

# Agar environment mein nahi hai to direct paste karo (backup)
if not REPLICATE_API_TOKEN or REPLICATE_API_TOKEN == "YOUR_TOKEN_HERE":
    REPLICATE_API_TOKEN = "r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP "  # YAHAN PASTE KAREIN

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        duration = int(data.get('duration', 15))
        
        print(f"🎵 Generating: {prompt[:50]}...")
        
        # Initialize client
        client = replicate.Client(api_token=REPLICATE_API_TOKEN)
        
        # Call Replicate API
        output = client.run(
            "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055e2e9e9ab3a72a4e6f5c4f6",
            input={
                "prompt": prompt,
                "duration": duration,
                "temperature": 0.8
            }
        )
        
        print(f"✅ Success! URL: {output}")
        
        return jsonify({
            'success': True,
            'audio_url': output,
            'message': 'Song generated!'
        })
        
    except replicate.exceptions.ReplicateError as e:
        print(f"❌ Replicate Error: {e}")
        return jsonify({'success': False, 'error': f"Replicate API error: {str(e)}"}), 500
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    token_status = "✅ Configured" if REPLICATE_API_TOKEN and REPLICATE_API_TOKEN.startswith("r8_") else "❌ Missing"
    return jsonify({
        'status': 'ok',
        'token': token_status,
        'message': 'Server is running'
    })

if __name__ == '__main__':
    print("🚀 Starting AI Music Generator Server...")
    if REPLICATE_API_TOKEN and REPLICATE_API_TOKEN.startswith("r8_"):
        print(f"✅ Replicate token configured: {REPLICATE_API_TOKEN[:8]}...")
    else:
        print("❌ Replicate token missing! Real songs will not work.")
    print("📡 Server: http://localhost:5000")
    app.run(debug=True, port=5000)
