# HastVaani – Indian Sign Language to Text & Speech

> **Tagline:** *Because Every Voice Deserves to Be Heard*

**HastVaani** is an AI-powered, real-time Indian Sign Language (ISL) recognition system. It bridges the communication gap between sign language users and non-sign language speakers by capturing hand gestures through a webcam, extracting 21 3D hand landmarks using MediaPipe, and translating gestures into **Text** and **Speech** in real time.

---

## 🌟 Features

- 📹 **Real-Time Webcam Recognition**: High-performance browser camera access with live visual overlay.
- 🖐️ **21 Hand Landmark Tracking**: Powered by MediaPipe Hands for landmark coordinate extraction.
- 🇮🇳 **Indian Sign Language (ISL) Focused**: Specifically designed for ISL gesture representations.
- 💬 **Instant Text Translation**: Translates detected signs into meaningful English text.
- 🔊 **Voice Output (Speech Synthesis)**: Integrated text-to-speech with auto-speak, volume, and playback speed controls.
- 📋 **Recognition History Log**: Stores the last 10 timestamped predictions with deduplication.
- ⚡ **FastAPI AI Backend Service**: Restful API backend with modular ML model loading architecture.
- 🧪 **Smart Demo Mode**: Built-in geometric classifier enabling full UI prototyping and demonstration out of the box.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons |
| **Computer Vision** | MediaPipe Hands, OpenCV (Python), Canvas API |
| **Backend API** | Python 3.9+, FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | NumPy, Scikit-Learn (Random Forest), TensorFlow/Keras support |
| **Audio** | Web Speech Synthesis API |

---

## 📂 Project Structure

```
HastVaani/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entrypoint
│   │   ├── config.py            # Global backend settings & constants
│   │   ├── routers/
│   │   │   └── recognition.py   # Health, model-status, and recognition endpoints
│   │   ├── services/
│   │   │   ├── hand_detector.py # MediaPipe Python frame processing
│   │   │   ├── gesture_classifier.py # ISL Gesture classifier & model loader
│   │   │   └── speech_service.py # Speech helper service
│   │   └── models/
│   │       └── schemas.py       # Pydantic data schemas
│   ├── models/                  # Directory to drop trained gesture_model.pkl / .keras
│   ├── requirements.txt         # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── Webcam.tsx
│   │   │   ├── RecognitionPanel.tsx
│   │   │   ├── SpeechControls.tsx
│   │   │   ├── RecognitionHistory.tsx
│   │   │   └── GestureGuide.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Translate.tsx
│   │   │   └── About.tsx
│   │   ├── services/
│   │   │   └── api.ts           # Backend API client wrapper
│   │   ├── hooks/
│   │   │   ├── useWebcam.ts     # WebRTC & MediaPipe canvas hook
│   │   │   └── useRecognition.ts # API syncing & speech hook
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .env.example
└── README.md
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18 or higher) & npm
- Python 3.9 / 3.10 / 3.11

---

### 1️⃣ Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows**:
     ```cmd
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The backend will start at `http://localhost:8000` (API documentation available at `http://localhost:8000/docs`).*

---

### 2️⃣ Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install Node package dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🖐️ Supported ISL Gestures (Initial Prototype)

HastVaani currently supports the following 11 core ISL gestures out of the box:

1. 👋 **Hello** – Open palm raised facing camera
2. 🙏 **Thank You** – Flat open hand pointing outward
3. ✌️ **Yes** – Index & Middle finger extended up
4. 🤏 **No** – Index & Middle close snap gesture
5. 🙋 **Help** – Raised hand with thumb pointing up
6. 🖐️ **Please** – Flat palm or pinky finger extension
7. ✊ **Sorry** – Fist gesture with tucked thumb
8. 💧 **Water** – 'W' shape (Index, Middle, Ring extended)
9. 🍲 **Food** – All 5 fingertips pinched together
10. 👍 **Good** – Classic Thumbs Up
11. ✋ **Stop** – Open palm pushed directly forward
12. 🤟 **I Love You** – Index & Pinky extended UP with front facing camera, Thumb extended outside, Middle & Ring curled inside

---

## 🤖 Trained Model Integration Guide

To plug in a real custom trained Machine Learning model:

1. Train a model on ISL landmark features (21 points × 3 = 63 inputs).
2. Save the trained model file inside `backend/models/`:
   - `gesture_model.pkl` (Scikit-Learn Random Forest / SVM)
   - OR `gesture_model.keras` (TensorFlow / Keras neural network)
3. Update `.env` or set `MODEL_TYPE=random_forest` or `MODEL_TYPE=tensorflow`.
4. Restart the FastAPI server. The system will automatically detect and load your trained model!

---

## 🌐 API Endpoints

- `GET /api/health` – Returns backend server status (`{"status": "ok"}`).
- `GET /api/model-status` – Returns active mode (`demo` vs `model`) and model details.
- `POST /api/recognize` – Accepts 21 hand landmark points `[{x, y, z}, ...]` and returns gesture prediction and confidence score.

---

## 📄 License
Created for college demonstration and accessibility research.
