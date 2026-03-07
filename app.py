from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import os
import uuid

app = Flask(__name__)
CORS(app)

# Generated songs ke liye folder
SONGS_FOLDER = 'generated_songs'
if not os.path.exists(SONGS_FOLDER):
    os.makedirs(SONGS_FOLDER)

@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        genre = data.get('genre', 'pop')
        duration = data.get('duration', 15)
        
        # YAHAN REAL AI API LAGEGA
        # Abhi demo ke liye sample return kar rahe hain
        
        # Sample audio URL (aapki existing songs)
        sample_songs = [
            'Song1.mp3',
            'song2.mp3'
        ]
        
        import random
        sample_url = f"http://localhost:3000/{random.choice(sample_songs)}"
        
        return jsonify({
            'success': True,
            'audio_url': sample_url,
            'message': 'Song generated!'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_file(os.path.join(SONGS_FOLDER, filename))

if __name__ == '__main__':
    app.run(debug=True, port=5000)