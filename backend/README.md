# HastVaani Backend

FastAPI backend service for real-time Indian Sign Language (ISL) gesture recognition.

## Features
- Hand Landmark Gesture Classification (21 MediaPipe points)
- Smart Geometric Demo Classifier for 11 ISL Gestures
- Automatic detection & loading of `.pkl` (Random Forest) or `.keras` (TensorFlow) trained models
- Health check & model status endpoints

## Requirements
- Python 3.9+ (Python 3.11 compatible)

## Setup & Running

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server with Uvicorn
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`
Interactive Swagger Docs: `http://localhost:8000/docs`
