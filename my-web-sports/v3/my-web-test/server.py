from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv
import requests
import time
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)

# -----------------------------
# 🤖 Gemini API
# -----------------------------
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API 키 없음 (.env 확인)")

client = genai.Client(api_key=api_key)

last_request_time = 0

@app.route("/")
def home():
    return "서버 살아있음 ✅"

@app.route("/chat", methods=["POST"])
def chat():
    global last_request_time

    try:
        now = time.time()

        # 🔥 요청 제한 완화 (3초 → 1초)
        if now - last_request_time < 1:
            return jsonify({"reply": "⏳ 너무 빠르게 요청하고 있습니다. 잠시만 기다려주세요."})

        last_request_time = now

        data = request.get_json()

        if not data:
            return jsonify({"error": "요청 없음"}), 400

        user_input = data.get("message", "").strip()

        if not user_input:
            return jsonify({"error": "메시지 없음"}), 400

        # 🔥 입력 길이 제한
        user_input = user_input[:300]

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_input
        )

        return jsonify({"reply": response.text})

    except Exception as e:
        print("🔥 Gemini ERROR:", e)

        # 🔥 실제 Gemini 429 처리
        if "429" in str(e):
            return jsonify({"reply": "⚠️ 요청이 너무 많습니다. 5초 후 다시 시도해주세요."})

        return jsonify({"error": str(e)}), 500


# -----------------------------
# ⚽ 스포츠 API (ESPN)
# -----------------------------
@app.route("/sports/<category>")
def sports(category):

    # 🔥 미국 시간 보정 (중요)
    now = datetime.utcnow() - timedelta(hours=5)
    today = now.strftime("%Y%m%d")

    if category == "baseball":
        url = f"https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates={today}"
    elif category == "basketball":
        url = f"https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates={today}"
    else:
        return jsonify({"error": "invalid category"}), 400

    try:
        headers = {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
        }

        res = requests.get(url, headers=headers, timeout=10)

        print("요청 URL:", url)
        print("상태 코드:", res.status_code)

        if res.status_code != 200:
            return jsonify({
                "error": "ESPN API 오류",
                "status": res.status_code
            }), 500

        return jsonify(res.json())

    except Exception as e:
        print("🔥 스포츠 API 오류:", e)
        return jsonify({"error": "API 실패"}), 500


if __name__ == "__main__":
    app.run(debug=True)