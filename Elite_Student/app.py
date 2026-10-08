import os
import requests
import base64
import urllib.parse
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Elite Student AI V3.0 ---
app = Flask(__name__, static_folder='gui', static_url_path='')
CORS(app) 

# Initialize Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MAIN_MODEL = "llama-3.1-8b-instant"

# --- API Endpoints ---

@app.route('/api/chat', methods=['POST', 'OPTIONS'], strict_slashes=False)
def chat():
    data = request.json
    user_message = data.get('message', '')
    try:
        completion = client.chat.completions.create(
            model=MAIN_MODEL,
            messages=[{"role": "user", "content": user_message}],
            max_tokens=1024,
            temperature=0.7
        )
        return jsonify({"response": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/essay', methods=['POST', 'OPTIONS'], strict_slashes=False)
def generate_essay():
    data = request.json
    topic = data.get('topic', '')
    length = data.get('length', '')
    tone = data.get('tone', '')
    try:
        prompt = f"Write a {length} college-level essay about '{topic}'. The tone should be {tone}. Formatting: use markdown."
        completion = client.chat.completions.create(
            model=MAIN_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048,
            temperature=0.7
        )
        return jsonify({"response": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/qa', methods=['POST', 'OPTIONS'], strict_slashes=False)
def answer_question():
    data = request.json
    question = data.get('question', '')
    try:
        completion = client.chat.completions.create(
            model=MAIN_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert academic tutor for college students."},
                {"role": "user", "content": question}
            ],
            max_tokens=1024,
            temperature=0.5
        )
        return jsonify({"response": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-image', methods=['POST', 'OPTIONS'], strict_slashes=False)
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        
        encoded_prompt = urllib.parse.quote(prompt)
        seed = os.urandom(4).hex()
        
        # --- Attempt 1: Hugging Face (FLUX) ---
        hf_token = os.getenv('HF_TOKEN')
        if hf_token:
            try:
                hf_url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
                headers = {"Authorization": f"Bearer {hf_token}"}
                hf_resp = requests.post(hf_url, headers=headers, json={"inputs": prompt}, timeout=25)
                
                if hf_resp.status_code == 200:
                    encoded_img = base64.b64encode(hf_resp.content).decode('utf-8')
                    return jsonify({"image_url": f"data:image/png;base64,{encoded_img}"})
            except: pass

        # --- Attempt 2: Pollinations AI (Fallback) ---
        try:
            poll_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?nologo=true&seed={seed}&width=1024&height=1024"
            poll_resp = requests.get(poll_url, timeout=20)
            if poll_resp.status_code == 200:
                encoded_img = base64.b64encode(poll_resp.content).decode('utf-8')
                return jsonify({"image_url": f"data:image/png;base64,{encoded_img}"})
        except: pass

        return jsonify({"error": "Both image providers are busy. Please try again in a moment."}), 500
    except Exception as e:
        return jsonify({"error": f"Image Lab System Error: {str(e)}"}), 500

# --- Web Interface ---

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
