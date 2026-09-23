import cv2
import numpy as np
import mediapipe as mp
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger("hastvaani.hand_detector")

class MediaPipeHandDetector:
    """
    MediaPipe Hands detection service for processing image frames server-side.
    """
    def __init__(self, max_num_hands: int = 2, min_detection_confidence: float = 0.5, min_tracking_confidence: float = 0.5):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Processes an OpenCV BGR frame image and returns extracted landmarks.
        """
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb_frame)

            if not results.multi_hand_landmarks:
                return {
                    "hand_detected": False,
                    "landmarks": [],
                    "handedness": None,
                    "count": 0
                }

            all_hands = []
            for i, hand_landmarks in enumerate(results.multi_hand_landmarks):
                handedness_label = "Right"
                if results.multi_handedness and i < len(results.multi_handedness):
                    handedness_label = results.multi_handedness[i].classification[0].label

                landmarks = []
                for lm in hand_landmarks.landmark:
                    landmarks.append({
                        "x": float(lm.x),
                        "y": float(lm.y),
                        "z": float(lm.z)
                    })
                all_hands.append({
                    "landmarks": landmarks,
                    "handedness": handedness_label
                })

            primary_hand = all_hands[0]
            return {
                "hand_detected": True,
                "landmarks": primary_hand["landmarks"],
                "handedness": primary_hand["handedness"],
                "count": len(all_hands),
                "all_hands": all_hands
            }
        except Exception as e:
            logger.error(f"Error in MediaPipe frame processing: {e}")
            return {
                "hand_detected": False,
                "landmarks": [],
                "handedness": None,
                "count": 0,
                "error": str(e)
            }

hand_detector_service = MediaPipeHandDetector()
