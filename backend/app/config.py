import os
from pydantic import BaseModel

class Settings:
    PROJECT_NAME: str = "HastVaani Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Model Configuration
    MODEL_TYPE: str = os.getenv("MODEL_TYPE", "demo")  # options: demo, random_forest, tensorflow
    MODEL_PATH_PKL: str = os.getenv("MODEL_PATH_PKL", "models/gesture_model.pkl")
    MODEL_PATH_KERAS: str = os.getenv("MODEL_PATH_KERAS", "models/gesture_model.keras")
    
    # Supported ISL Gestures
    GESTURES = [
        "Hello",
        "Thank You",
        "Yes",
        "No",
        "Help",
        "Please",
        "Sorry",
        "Water",
        "Food",
        "Good",
        "Stop",
        "I",
        "You",
        "OK",
        "I Love You"
    ]

settings = Settings()
