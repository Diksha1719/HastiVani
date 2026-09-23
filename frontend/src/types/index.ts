export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

export interface RecognitionRequest {
  landmarks: LandmarkPoint[];
  handedness?: string;
}

export interface RecognitionResponse {
  gesture: string;
  translation: string;
  confidence: number;
  hand_detected: boolean;
  mode: 'demo' | 'model' | string;
  detected_fingers?: string[];
}

export interface ModelStatusResponse {
  model_loaded: boolean;
  mode: 'demo' | 'model' | string;
  model_type: string;
  available_gestures: string[];
  message: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  gesture: string;
  translation: string;
  confidence: number;
}

export interface SpeechSettings {
  enabled: boolean;
  rate: number;      // 0.5 to 1.5
  volume: number;    // 0 to 1
  autoSpeak: boolean;
}

export type CameraState = 'off' | 'starting' | 'active' | 'denied' | 'error';

export interface WordToken {
  id: string;
  gesture: string;
  timestamp: string;
  confidence: number;
}

export interface SentenceComposeResponse {
  sentence: string;
  tokens: string[];
  alternatives: string[];
  is_question?: boolean;
}

export interface SentenceSettings {
  dwellTimeMs: number; // 700, 900, 1200
  autoFinalizeOnPause: boolean;
  pauseThresholdMs: number; // e.g. 2500ms
  autoSpeakSentence: boolean;
}
