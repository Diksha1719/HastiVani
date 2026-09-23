import os
import math
import numpy as np
import logging
from typing import List, Dict, Tuple, Any, Optional
from app.config import settings

logger = logging.getLogger("hastvaani.gesture_classifier")

class ISLGestureClassifier:
    """
    Gesture classification service supporting both:
    1. Pre-trained ML Models (Random Forest .pkl / TensorFlow .keras)
    2. Smart Geometric ISL Demo Classifier
    """
    def __init__(self):
        self.model_loaded = False
        self.model_type = "demo"
        self.model = None
        self._load_model()

    def _load_model(self):
        """Attempts to load a trained model from backend/models/"""
        model_pkl = settings.MODEL_PATH_PKL
        model_keras = settings.MODEL_PATH_KERAS

        if os.path.exists(model_pkl):
            try:
                import joblib
                self.model = joblib.load(model_pkl)
                self.model_loaded = True
                self.model_type = "random_forest"
                logger.info(f"Loaded Random Forest model from {model_pkl}")
                return
            except Exception as e:
                logger.error(f"Failed to load pkl model: {e}")

        if os.path.exists(model_keras):
            try:
                import tensorflow as tf
                self.model = tf.keras.models.load_model(model_keras)
                self.model_loaded = True
                self.model_type = "tensorflow"
                logger.info(f"Loaded TensorFlow model from {model_keras}")
                return
            except Exception as e:
                logger.error(f"Failed to load keras model: {e}")

        # Fallback to Demo Mode
        self.model_loaded = False
        self.model_type = "demo"
        logger.info("No pre-trained model file found. Running in Demo Classifier mode.")

    def classify(self, landmarks: List[Dict[str, float]]) -> Tuple[str, str, float, str, List[str]]:
        """
        Classifies 21 hand landmarks into an ISL Gesture.
        Returns: (gesture_name, translation, confidence, mode, detected_fingers)
        """
        if not landmarks or len(landmarks) < 21:
            return "No Hand", "No hand gesture detected", 0.0, self.model_type, []

        # If a trained model is loaded, predict using model
        if self.model_loaded and self.model is not None:
            try:
                feature_vector = self._extract_feature_vector(landmarks)
                if self.model_type == "random_forest":
                    prediction = self.model.predict([feature_vector])[0]
                    probs = self.model.predict_proba([feature_vector])[0]
                    confidence = float(np.max(probs))
                    gesture = str(prediction)
                    return gesture, self._get_translation(gesture), round(confidence, 2), "model", []
                elif self.model_type == "tensorflow":
                    probs = self.model.predict(np.array([feature_vector]), verbose=0)[0]
                    idx = np.argmax(probs)
                    confidence = float(probs[idx])
                    gesture = settings.GESTURES[idx] if idx < len(settings.GESTURES) else "Unknown"
                    return gesture, self._get_translation(gesture), round(confidence, 2), "model", []
            except Exception as e:
                logger.error(f"Model prediction error, falling back to geometric demo: {e}")

        # Otherwise use smart geometric demo classifier
        gesture, confidence, active_fingers = self._classify_geometric(landmarks)
        return gesture, self._get_translation(gesture), round(confidence, 2), "demo", active_fingers

    def _extract_feature_vector(self, landmarks: List[Dict[str, float]]) -> List[float]:
        """Extracts normalized (x, y, z) coordinates centered at wrist (landmark 0)."""
        wrist = landmarks[0]
        features = []
        for lm in landmarks:
            features.extend([
                lm['x'] - wrist['x'],
                lm['y'] - wrist['y'],
                lm.get('z', 0.0) - wrist.get('z', 0.0)
            ])
        return features

    def _classify_geometric(self, landmarks: List[Dict[str, float]]) -> Tuple[str, float]:
        """
        Scale-invariant, mutually exclusive geometric classifier for 14 ISL Gestures:
        0: Wrist
        Thumb: 1 (CMC), 2 (MCP), 3 (IP), 4 (Tip)
        Index: 5 (MCP), 6 (PIP), 7 (DIP), 8 (Tip)
        Middle: 9 (MCP), 10 (PIP), 11 (DIP), 12 (Tip)
        Ring: 13 (MCP), 14 (PIP), 15 (DIP), 16 (Tip)
        Pinky: 17 (MCP), 18 (PIP), 19 (DIP), 20 (Tip)
        """
        pts = np.array([[lm['x'], lm['y'], lm.get('z', 0.0)] for lm in landmarks])

        wrist = pts[0]
        thumb_cmc, thumb_mcp, thumb_ip, thumb_tip = pts[1], pts[2], pts[3], pts[4]
        index_mcp, index_pip, index_dip, index_tip = pts[5], pts[6], pts[7], pts[8]
        middle_mcp, middle_pip, middle_dip, middle_tip = pts[9], pts[10], pts[11], pts[12]
        ring_mcp, ring_pip, ring_dip, ring_tip = pts[13], pts[14], pts[15], pts[16]
        pinky_mcp, pinky_pip, pinky_dip, pinky_tip = pts[17], pts[18], pts[19], pts[20]

        # Palm scale: distance from wrist to middle MCP (invariant to finger curling)
        palm_scale = float(np.linalg.norm(middle_mcp - wrist))
        if palm_scale < 0.01:
            palm_scale = 0.1

        # Hand orientation vector: Wrist -> Middle MCP
        hand_vec = middle_mcp - wrist
        # In normalized screen coordinates, y=0 is top, y=1 is bottom
        is_horizontal = abs(hand_vec[0]) > abs(hand_vec[1]) * 0.85
        is_upright = hand_vec[1] < -0.02 and not is_horizontal

        # Scale-invariant finger extension test
        def is_finger_extended(tip, pip, mcp, dip):
            d_tip_wrist = np.linalg.norm(tip - wrist)
            d_pip_wrist = np.linalg.norm(pip - wrist)
            d_tip_mcp = np.linalg.norm(tip - mcp)
            d_pip_mcp = np.linalg.norm(pip - mcp)

            extended_dist = (d_tip_wrist > 1.18 * d_pip_wrist) and (d_tip_mcp > 1.05 * d_pip_mcp)
            if is_upright:
                return extended_dist and (tip[1] < pip[1])
            return extended_dist

        index_ext = is_finger_extended(index_tip, index_pip, index_mcp, index_dip)
        middle_ext = is_finger_extended(middle_tip, middle_pip, middle_mcp, middle_dip)
        ring_ext = is_finger_extended(ring_tip, ring_pip, ring_mcp, ring_dip)
        pinky_ext = is_finger_extended(pinky_tip, pinky_pip, pinky_mcp, pinky_dip)

        # Thumb state
        d_thumb_tip_wrist = np.linalg.norm(thumb_tip - wrist)
        d_thumb_mcp_wrist = np.linalg.norm(thumb_mcp - wrist)
        d_thumb_index_mcp = np.linalg.norm(thumb_tip - index_mcp) / palm_scale
        d_thumb_middle_mcp = np.linalg.norm(thumb_tip - middle_mcp) / palm_scale

        thumb_up = (
            (thumb_tip[1] < thumb_ip[1] < thumb_mcp[1]) and
            (thumb_tip[1] < index_mcp[1] - 0.04 * palm_scale) and
            (d_thumb_tip_wrist > 1.08 * d_thumb_mcp_wrist)
        )

        thumb_ext = (
            d_thumb_index_mcp > 0.55 and
            (d_thumb_tip_wrist > 1.05 * d_thumb_mcp_wrist)
        )

        thumb_spread = (d_thumb_index_mcp > 0.70)
        thumb_tucked = (d_thumb_middle_mcp < 0.65 or d_thumb_index_mcp < 0.48)

        # Normalized distances between tips
        d_thumb_index = np.linalg.norm(thumb_tip - index_tip) / palm_scale
        d_thumb_middle = np.linalg.norm(thumb_tip - middle_tip) / palm_scale
        d_thumb_ring = np.linalg.norm(thumb_tip - ring_tip) / palm_scale
        d_thumb_pinky = np.linalg.norm(thumb_tip - pinky_tip) / palm_scale

        avg_tips_dist = (d_thumb_index + d_thumb_middle + d_thumb_ring + d_thumb_pinky) / 4.0
        num_main_ext = sum([index_ext, middle_ext, ring_ext, pinky_ext])

        # Cup/C-Shape check for Please
        def is_curved_cup(tip, pip, mcp):
            d_tw = np.linalg.norm(tip - wrist)
            d_pw = np.linalg.norm(pip - wrist)
            return 0.90 * d_pw < d_tw < 1.20 * d_pw and tip[1] < mcp[1]

        is_c_shape = (
            is_curved_cup(index_tip, index_pip, index_mcp) and
            is_curved_cup(middle_tip, middle_pip, middle_mcp) and
            is_curved_cup(ring_tip, ring_pip, ring_mcp) and
            not index_ext and not middle_ext
        )

        active_fingers = []
        if thumb_up or thumb_ext or thumb_spread:
            active_fingers.append("Thumb")
        if index_ext:
            active_fingers.append("Index")
        if middle_ext:
            active_fingers.append("Middle")
        if ring_ext:
            active_fingers.append("Ring")
        if pinky_ext:
            active_fingers.append("Pinky")

        # --- EVALUATION OF 14 MUTUALLY EXCLUSIVE GESTURES ---

        # 1. Food: All 5 fingertips pinched together pointing upward/inward
        if avg_tips_dist < 0.42 and d_thumb_index < 0.38 and d_thumb_middle < 0.40:
            return "Food", 0.97, active_fingers

        # 2. OK: Thumb and Index tips touching in an O-ring, remaining 3 fingers extended
        if d_thumb_index < 0.32 and middle_ext and ring_ext and pinky_ext:
            return "OK", 0.96, active_fingers

        # 3. Good: ONLY Thumb extended up, all 4 fingers curled
        if thumb_up and num_main_ext == 0:
            return "Good", 0.98, active_fingers

        # 4. Help: Shaka / Call sign (Thumb and Pinky extended, Middle 3 curled)
        if thumb_ext and pinky_ext and not index_ext and not middle_ext and not ring_ext:
            return "Help", 0.96, active_fingers

        # 5. No: "L" Shape (Thumb & Index extended at 90 deg, Middle, Ring, Pinky curled)
        if thumb_ext and index_ext and not middle_ext and not ring_ext and not pinky_ext:
            return "No", 0.96, active_fingers

        # 5b. I Love You: Index + Pinky extended UP with front facing camera, Middle + Ring curled inside, Thumb extended outside
        is_front_facing = (
            is_upright and
            (middle_tip[1] > middle_pip[1] - 0.05 * palm_scale) and
            (ring_tip[1] > ring_pip[1] - 0.05 * palm_scale)
        )
        if (
            index_ext and
            pinky_ext and
            not middle_ext and
            not ring_ext and
            (thumb_ext or thumb_spread) and
            not thumb_tucked and
            is_front_facing
        ):
            return "I Love You", 0.97, active_fingers

        # 6. You: ONLY Index finger extended straight, Thumb and other 3 curled
        if index_ext and not middle_ext and not ring_ext and not pinky_ext and not thumb_up:
            return "You", 0.97, active_fingers

        # 7. I: ONLY Pinky finger extended up (ISL manual alphabet 'I'), other 4 curled
        if pinky_ext and not index_ext and not middle_ext and not ring_ext and not thumb_up:
            return "I", 0.97, active_fingers

        # 8. Yes: V-Sign / Peace (Index + Middle extended up, Ring, Pinky, Thumb curled)
        if index_ext and middle_ext and not ring_ext and not pinky_ext:
            return "Yes", 0.96, active_fingers

        # 9. Water: "W" Sign (3 fingers: Index + Middle + Ring extended, Pinky curled)
        if index_ext and middle_ext and ring_ext and not pinky_ext:
            return "Water", 0.96, active_fingers

        # 10. Stop: Open Palm held horizontally (fingers pointing sideways like a wall/barrier)
        if num_main_ext >= 3 and is_horizontal:
            return "Stop", 0.95, active_fingers

        # 11. Thank You: Flat 4-Hand (B-Sign: 4 fingers upright together, Thumb tucked across palm)
        if num_main_ext == 4 and (thumb_tucked or not thumb_spread) and not is_horizontal:
            return "Thank You", 0.95, active_fingers

        # 12. Hello: Open 5 Hand Spread (All 5 fingers extended & spread wide vertically)
        if num_main_ext == 4 and thumb_spread and not is_horizontal:
            return "Hello", 0.96, active_fingers

        # 13. Please: Cupped "C" Handshape (Fingers curved forward forming a C cup)
        if is_c_shape:
            return "Please", 0.93, active_fingers

        # 14. Sorry: Solid closed fist (All 5 fingers curled)
        if num_main_ext == 0 and not thumb_up and not thumb_ext:
            return "Sorry", 0.95, active_fingers

        # Fallback to Ready rather than a false positive
        return "Ready", 0.50, active_fingers

    def _get_translation(self, gesture: str) -> str:
        translations = {
            "Hello": "Hello! Welcome.",
            "Thank You": "Thank you very much.",
            "Yes": "Yes, I agree.",
            "No": "No, thank you.",
            "Help": "I need assistance/help.",
            "Please": "Please, if you could.",
            "Sorry": "I am sorry.",
            "Water": "I would like some water.",
            "Food": "I need food / hungry.",
            "Good": "That is good / well done.",
            "Stop": "Stop / Please wait.",
            "I": "I / Me.",
            "You": "You / Yourself.",
            "OK": "Everything is okay.",
            "I Love You": "I love you.",
            "Ready": "Position hand in front of camera."
        }
        return translations.get(gesture, f"Sign: {gesture}")

gesture_classifier = ISLGestureClassifier()
