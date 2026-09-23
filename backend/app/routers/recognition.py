from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    RecognitionRequest,
    RecognitionResponse,
    ModelStatusResponse,
    HealthResponse,
    SentenceComposeRequest,
    SentenceComposeResponse
)
from app.services.gesture_classifier import gesture_classifier
from app.services.sentence_composer import sentence_composer
from app.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return HealthResponse(
        status="ok",
        project=settings.PROJECT_NAME
    )

@router.get("/model-status", response_model=ModelStatusResponse, tags=["Recognition"])
async def get_model_status():
    """Returns current AI model status (trained model loaded vs demo classifier mode)."""
    loaded = gesture_classifier.model_loaded
    mode = "model" if loaded else "demo"
    model_type = gesture_classifier.model_type
    
    message = (
        f"Active Model: {model_type.upper()} model loaded."
        if loaded
        else "A trained ISL model has not yet been loaded. Using geometric demo classifier."
    )

    return ModelStatusResponse(
        model_loaded=loaded,
        mode=mode,
        model_type=model_type,
        available_gestures=settings.GESTURES,
        message=message
    )

@router.post("/recognize", response_model=RecognitionResponse, tags=["Recognition"])
async def recognize_gesture(request: RecognitionRequest):
    """
    Accepts 21 normalized hand landmark points from MediaPipe and classifies the ISL gesture.
    """
    if not request.landmarks or len(request.landmarks) < 21:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exactly 21 hand landmark coordinates are required."
        )

    # Convert landmarks to list of dicts for classifier
    lm_list = [{"x": p.x, "y": p.y, "z": p.z} for p in request.landmarks]

    gesture, translation, confidence, mode, detected_fingers = gesture_classifier.classify(lm_list)

    return RecognitionResponse(
        gesture=gesture,
        translation=translation,
        confidence=confidence,
        hand_detected=True,
        mode=mode,
        detected_fingers=detected_fingers
    )

@router.post("/compose-sentence", response_model=SentenceComposeResponse, tags=["Sentence Composition"])
async def compose_sentence(request: SentenceComposeRequest):
    """
    Accepts an ordered sequence of detected ISL sign tokens and constructs
    a natural, grammatically correct English sentence with alternatives.
    """
    if not request.tokens:
        return SentenceComposeResponse(
            sentence="Position hand to form signs.",
            tokens=[],
            alternatives=[],
            is_question=False
        )

    sentence, alternatives, is_question = sentence_composer.compose(request.tokens)

    return SentenceComposeResponse(
        sentence=sentence,
        tokens=request.tokens,
        alternatives=alternatives,
        is_question=is_question
    )
