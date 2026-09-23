from typing import List, Optional
from pydantic import BaseModel, Field

class LandmarkPoint(BaseModel):
    x: float = Field(..., description="Normalized X coordinate (0.0 - 1.0)")
    y: float = Field(..., description="Normalized Y coordinate (0.0 - 1.0)")
    z: float = Field(default=0.0, description="Normalized Z coordinate")

class RecognitionRequest(BaseModel):
    landmarks: List[LandmarkPoint] = Field(..., description="Array of 21 hand landmarks")
    handedness: Optional[str] = Field(default="Right", description="Right or Left hand")

class RecognitionResponse(BaseModel):
    gesture: str = Field(..., description="Recognized ISL gesture name")
    translation: str = Field(..., description="Human friendly translation text")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")
    hand_detected: bool = Field(default=True, description="Whether hand was detected")
    mode: str = Field(..., description="Classifier mode (demo or model)")
    detected_fingers: Optional[List[str]] = Field(default_factory=list, description="List of detected extended fingers")

class ModelStatusResponse(BaseModel):
    model_loaded: bool
    mode: str
    model_type: str
    available_gestures: List[str]
    message: str

class HealthResponse(BaseModel):
    status: str
    project: str

class SentenceComposeRequest(BaseModel):
    tokens: List[str] = Field(..., description="Ordered list of recognized sign language gesture names")

class SentenceComposeResponse(BaseModel):
    sentence: str = Field(..., description="Grammatically smoothed English sentence")
    tokens: List[str] = Field(..., description="Input gesture tokens")
    alternatives: List[str] = Field(default_factory=list, description="Alternative sentence suggestions")
    is_question: bool = Field(default=False, description="Whether sentence was formulated as a question")
