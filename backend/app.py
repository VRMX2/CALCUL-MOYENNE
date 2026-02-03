from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS
CORS(app)

# Configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY")

def get_best_model(api_key):
    print("🔄 Fetching available AI models...")
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        response = requests.get(url)
        
        if response.status_code != 200:
            print(f"⚠️ Could not list models (Error {response.status_code}). Defaulting to 'gemini-pro'.")
            return "gemini-pro"

        data = response.json()
        models = data.get('models', [])
        
        # Filter for models that support content generation
        generation_models = [
            m['name'].replace('models/', '') 
            for m in models 
            if 'generateContent' in m.get('supportedGenerationMethods', [])
        ]
        
        print(f"📋 Available generation models: {', '.join(generation_models)}")

        # Preference list
        preferences = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ]

        for pref in preferences:
            for model in generation_models:
                if pref in model:
                    print(f"✅ Selected Model: {model}")
                    return model
        
        # Fallback to first available
        if generation_models:
            print(f"⚠️ Preferred models not found. Using: {generation_models[0]}")
            return generation_models[0]
            
        return "gemini-pro"

    except Exception as e:
        print(f"❌ Error during model selection: {e}")
        return "gemini-pro"

print("==================================================")
if not API_KEY:
    print("❌ ERROR: GEMINI_API_KEY is missing in .env file!")
    # Use a dummy key to prevent immediate crash, though calls will fail
    API_KEY = "MISSING_KEY"
else:
    print(f"✅ API Key loaded: {API_KEY[:4]}...{API_KEY[-4:]}")

MODEL_NAME = get_best_model(API_KEY)
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}"
print(f"✅ Target URL: {GEMINI_URL.replace(API_KEY, 'HIDDEN')}")
print("==================================================")

@app.route('/analyze', methods=['POST'])
def analyze_grades():
    print("📩 Received analysis request")
    try:
        data = request.json
        if not data:
            print("❌ No data provided in request")
            return jsonify({"error": "No data provided"}), 400

        grades = data.get('grades', [])
        overview = data.get('overview', {})
        print(f"📊 Processing {len(grades)} grades...")
        
        # Construct the prompt
        grades_text = "\n".join([f"- {g['name']}: {g['value']}/20 (Coef: {g['coef']})" for g in grades])
        
        prompt_text = f"""
        You are an expert academic advisor for a Computer Science student.
        Here is the student's performance for Semester 1:
        
        Overview:
        - Average: {overview.get('average', 'N/A')}/20
        - Highest: {overview.get('highest', 'N/A')}/20
        - Lowest: {overview.get('lowest', 'N/A')}/20
        
        Grades (Module: Grade/20, Coefficient):
        {grades_text}
        
        Please provide a brief, motivating analysis:
        1. Identify strengths and weaknesses.
        2. If the average is below 10, give a triage plan to pass.
        3. If the average is good, suggest how to excel further.
        4. Keep it concise, friendly, and professional. Use emojis.
        5. Format using Markdown.
        """
        
        # Call Gemini API directly via REST
        payload = {
            "contents": [{
                "parts": [{"text": prompt_text}]
            }]
        }
        
        print(f"🚀 Sending request to Gemini ({GEMINI_URL.replace(API_KEY, 'HIDDEN')})...")
        response = requests.post(GEMINI_URL, json=payload, headers={"Content-Type": "application/json"})
        
        print(f"📥 Gemini Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Gemini API Error: {response.text}")
            # Return 502 for upstream errors so we know it's not our 404
            return jsonify({"error": f"Gemini API Error: {response.text}"}), 502
            
        result = response.json()
        
        try:
            analysis_text = result['candidates'][0]['content']['parts'][0]['text']
            print("✅ Analysis generated successfully")
            return jsonify({"analysis": analysis_text})
        except (KeyError, IndexError) as e:
            print(f"❌ Error parsing API response structure: {result}")
            return jsonify({"error": "Failed to parse AI response"}), 500

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(debug=True, port=5000)
