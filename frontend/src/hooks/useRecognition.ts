import { useState, useCallback, useRef, useEffect } from 'react';
import {
  LandmarkPoint,
  RecognitionResponse,
  HistoryItem,
  SpeechSettings,
  ModelStatusResponse,
  WordToken,
  SentenceSettings,
} from '../types';
import { recognizeGesture, getModelStatus, composeSentence } from '../services/api';
import { composeSentenceLocally } from '../services/sentenceComposer';

export function useRecognition() {
  const [currentGesture, setCurrentGesture] = useState<string>('Ready');
  const [translationText, setTranslationText] = useState<string>('Position your hand in front of the camera');
  const [confidence, setConfidence] = useState<number>(0.0);
  const [activeMode, setActiveMode] = useState<'demo' | 'model' | string>('demo');
  const [isBackendOffline, setIsBackendOffline] = useState<boolean>(false);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);

  const [detectedFingers, setDetectedFingers] = useState<string[]>([]);

  // History & Speech Settings
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    enabled: true,
    rate: 1.0,
    volume: 1.0,
    autoSpeak: false, // Default false for individual signs so sentences aren't interrupted
  });

  // Sentence Builder State
  const [sentenceTokens, setSentenceTokens] = useState<WordToken[]>([]);
  const [composedSentence, setComposedSentence] = useState<string>(
    'Position hand and hold a sign to form words into a sentence.'
  );
  const [sentenceAlternatives, setSentenceAlternatives] = useState<string[]>([]);
  const [sentenceSettings, setSentenceSettings] = useState<SentenceSettings>({
    dwellTimeMs: 900,
    autoFinalizeOnPause: true,
    pauseThresholdMs: 2500,
    autoSpeakSentence: true,
  });

  // Temporal Dwell / Holding State
  const [dwellGesture, setDwellGesture] = useState<string>('');
  const [dwellProgress, setDwellProgress] = useState<number>(0);

  // Refs for stateful timing without triggering re-renders
  const lastSpokenGestureRef = useRef<string>('');
  const lastApiCallTimeRef = useRef<number>(0);
  const dwellCandidateRef = useRef<string>('');
  const dwellStartTimeRef = useRef<number>(0);
  const dwellCommittedRef = useRef<boolean>(false);
  const lastHandSeenTimeRef = useRef<number>(Date.now());
  const sentenceFinalizedRef = useRef<boolean>(false);
  const sentenceTokensRef = useRef<WordToken[]>([]);
  sentenceTokensRef.current = sentenceTokens;

  // Check model status from backend on mount
  const fetchModelStatus = useCallback(async () => {
    const status = await getModelStatus();
    if (status) {
      setModelStatus(status);
      setActiveMode(status.mode);
      setIsBackendOffline(false);
    } else {
      setIsBackendOffline(true);
      setActiveMode('demo');
    }
  }, []);

  useEffect(() => {
    fetchModelStatus();
    const interval = setInterval(fetchModelStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchModelStatus]);

  // Speech Synthesis Helper
  const speakText = useCallback(
    (text: string) => {
      if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechSettings.rate;
      utterance.volume = speechSettings.volume;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en-US')) || voices[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [speechSettings.rate, speechSettings.volume]
  );

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Sentence synthesis recompute
  const refreshComposedSentence = useCallback(async (tokens: WordToken[]) => {
    const rawTokens = tokens.map((t) => t.gesture);
    if (rawTokens.length === 0) {
      setComposedSentence('Position hand and hold a sign to form words into a sentence.');
      setSentenceAlternatives([]);
      return;
    }

    try {
      const res = await composeSentence(rawTokens);
      setComposedSentence(res.sentence);
      setSentenceAlternatives(res.alternatives || []);
    } catch {
      const fallback = composeSentenceLocally(rawTokens);
      setComposedSentence(fallback.sentence);
      setSentenceAlternatives(fallback.alternatives || []);
    }
  }, []);

  // Add word token to sentence queue
  const addWordToken = useCallback(
    async (gestureName: string, conf: number = 0.9) => {
      if (!gestureName || gestureName === 'Ready' || gestureName === 'No Hand') return;

      const newToken: WordToken = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        gesture: gestureName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        confidence: conf,
      };

      setSentenceTokens((prev) => {
        const next = [...prev, newToken];
        refreshComposedSentence(next);
        return next;
      });

      sentenceFinalizedRef.current = false;
    },
    [refreshComposedSentence]
  );

  // Remove a word token
  const removeWordToken = useCallback(
    (id: string) => {
      setSentenceTokens((prev) => {
        const next = prev.filter((t) => t.id !== id);
        refreshComposedSentence(next);
        return next;
      });
    },
    [refreshComposedSentence]
  );

  // Remove last word token (Backspace)
  const removeLastToken = useCallback(() => {
    setSentenceTokens((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      refreshComposedSentence(next);
      return next;
    });
  }, [refreshComposedSentence]);

  // Clear entire sentence
  const clearSentence = useCallback(() => {
    setSentenceTokens([]);
    setComposedSentence('Position hand and hold a sign to form words into a sentence.');
    setSentenceAlternatives([]);
    sentenceFinalizedRef.current = false;
    dwellCandidateRef.current = '';
    dwellStartTimeRef.current = 0;
    dwellCommittedRef.current = false;
    setDwellProgress(0);
    setDwellGesture('');
  }, []);

  // Load sample phrase for testing
  const loadSamplePhrase = useCallback(
    (tokens: string[]) => {
      const wordTokens: WordToken[] = tokens.map((g, idx) => ({
        id: `${Date.now()}-${idx}`,
        gesture: g,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        confidence: 0.95,
      }));
      setSentenceTokens(wordTokens);
      refreshComposedSentence(wordTokens);
      sentenceFinalizedRef.current = false;
    },
    [refreshComposedSentence]
  );

  // Speak the composed sentence
  const speakSentence = useCallback(
    (overrideText?: string) => {
      const textToSpeak = overrideText || composedSentence;
      if (textToSpeak && !textToSpeak.includes('Position hand')) {
        speakText(textToSpeak);
      }
    },
    [composedSentence, speakText]
  );

  // Inactivity / Silence auto-finalizer loop
  useEffect(() => {
    if (!sentenceSettings.autoFinalizeOnPause) return;

    const checkInterval = setInterval(() => {
      const tokens = sentenceTokensRef.current;
      if (tokens.length >= 2 && !sentenceFinalizedRef.current) {
        const timeSinceHand = Date.now() - lastHandSeenTimeRef.current;
        if (timeSinceHand > sentenceSettings.pauseThresholdMs) {
          sentenceFinalizedRef.current = true;
          if (sentenceSettings.autoSpeakSentence && speechSettings.enabled) {
            speakSentence();
          }
        }
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [
    sentenceSettings.autoFinalizeOnPause,
    sentenceSettings.pauseThresholdMs,
    sentenceSettings.autoSpeakSentence,
    speechSettings.enabled,
    speakSentence,
  ]);

  // Process Landmarks
  const processLandmarks = useCallback(
    async (landmarks: LandmarkPoint[], handedness: string = 'Right') => {
      const now = Date.now();
      if (now - lastApiCallTimeRef.current < 200) return;
      lastApiCallTimeRef.current = now;

      let res = await recognizeGesture(landmarks, handedness);

      if (!res) {
        setIsBackendOffline(true);
        res = fallbackLocalClassifier(landmarks);
      } else {
        setIsBackendOffline(false);
      }

      if (res && res.gesture) {
        const detectedSign = res.gesture;
        setCurrentGesture(detectedSign);
        setTranslationText(res.translation);
        setConfidence(res.confidence);
        setActiveMode(res.mode);
        if (res.detected_fingers) {
          setDetectedFingers(res.detected_fingers);
        }

        const isValidSign = detectedSign !== 'Ready' && detectedSign !== 'No Hand';

        if (isValidSign) {
          lastHandSeenTimeRef.current = now;

          // Temporal Dwell Logic
          if (dwellCandidateRef.current === detectedSign) {
            if (!dwellCommittedRef.current) {
              const elapsed = now - dwellStartTimeRef.current;
              const progress = Math.min(100, Math.round((elapsed / sentenceSettings.dwellTimeMs) * 100));
              setDwellProgress(progress);
              setDwellGesture(detectedSign);

              if (progress >= 100) {
                dwellCommittedRef.current = true;
                addWordToken(detectedSign, res.confidence);

                // Flash completion
                setTimeout(() => {
                  setDwellProgress(0);
                  setDwellGesture('');
                }, 350);
              }
            }
          } else {
            // New candidate sign started
            dwellCandidateRef.current = detectedSign;
            dwellStartTimeRef.current = now;
            dwellCommittedRef.current = false;
            setDwellGesture(detectedSign);
            setDwellProgress(0);
          }

          // Single sign auto-speak (if enabled)
          if (detectedSign !== lastSpokenGestureRef.current) {
            lastSpokenGestureRef.current = detectedSign;

            if (speechSettings.enabled && speechSettings.autoSpeak) {
              speakText(detectedSign);
            }

            // Add to single sign history log
            const newItem: HistoryItem = {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              gesture: detectedSign,
              translation: res.translation,
              confidence: res.confidence,
            };

            setHistory((prev) => [newItem, ...prev.filter((h) => h.gesture !== detectedSign || prev.indexOf(h) > 0)].slice(0, 10));
          }
        } else {
          // Hand removed or resting
          dwellCandidateRef.current = '';
          dwellStartTimeRef.current = 0;
          dwellCommittedRef.current = false;
          setDwellProgress(0);
          setDwellGesture('');
        }
      }
    },
    [sentenceSettings.dwellTimeMs, addWordToken, speechSettings.enabled, speechSettings.autoSpeak, speakText]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    currentGesture,
    translationText,
    confidence,
    activeMode,
    isBackendOffline,
    modelStatus,
    detectedFingers,
    history,
    speechSettings,
    setSpeechSettings,
    processLandmarks,
    speakText,
    stopSpeech,
    clearHistory,
    fetchModelStatus,
    // Sentence Builder additions
    sentenceTokens,
    composedSentence,
    sentenceAlternatives,
    sentenceSettings,
    setSentenceSettings,
    dwellGesture,
    dwellProgress,
    addWordToken,
    removeWordToken,
    removeLastToken,
    clearSentence,
    speakSentence,
    loadSamplePhrase,
  };
}

// Scale-invariant, mutually exclusive client fallback classifier for all 14 gestures
export function fallbackLocalClassifier(landmarks: LandmarkPoint[]): RecognitionResponse {
  if (!landmarks || landmarks.length < 21) {
    return {
      gesture: 'Ready',
      translation: 'Place hand in front of camera',
      confidence: 0.5,
      hand_detected: false,
      mode: 'demo',
      detected_fingers: [],
    };
  }

  const wrist = landmarks[0];
  const thumbCmc = landmarks[1], thumbMcp = landmarks[2], thumbIp = landmarks[3], thumbTip = landmarks[4];
  const indexMcp = landmarks[5], indexPip = landmarks[6], indexDip = landmarks[7], indexTip = landmarks[8];
  const middleMcp = landmarks[9], middlePip = landmarks[10], middleDip = landmarks[11], middleTip = landmarks[12];
  const ringMcp = landmarks[13], ringPip = landmarks[14], ringDip = landmarks[15], ringTip = landmarks[16];
  const pinkyMcp = landmarks[17], pinkyPip = landmarks[18], pinkyDip = landmarks[19], pinkyTip = landmarks[20];

  const dist = (p1: LandmarkPoint, p2: LandmarkPoint) =>
    Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));

  let palmScale = dist(middleMcp, wrist);
  if (palmScale < 0.01) palmScale = 0.1;

  const handVecX = middleMcp.x - wrist.x;
  const handVecY = middleMcp.y - wrist.y;
  const isHorizontal = Math.abs(handVecX) > Math.abs(handVecY) * 0.85;
  const isUpright = handVecY < -0.02 && !isHorizontal;

  const isFingerExtended = (tip: LandmarkPoint, pip: LandmarkPoint, mcp: LandmarkPoint) => {
    const dTipWrist = dist(tip, wrist);
    const dPipWrist = dist(pip, wrist);
    const dTipMcp = dist(tip, mcp);
    const dPipMcp = dist(pip, mcp);

    const extendedDist = dTipWrist > 1.18 * dPipWrist && dTipMcp > 1.05 * dPipMcp;
    if (isUpright) {
      return extendedDist && tip.y < pip.y;
    }
    return extendedDist;
  };

  const indexExt = isFingerExtended(indexTip, indexPip, indexMcp);
  const middleExt = isFingerExtended(middleTip, middlePip, middleMcp);
  const ringExt = isFingerExtended(ringTip, ringPip, ringMcp);
  const pinkyExt = isFingerExtended(pinkyTip, pinkyPip, pinkyMcp);

  const dThumbTipWrist = dist(thumbTip, wrist);
  const dThumbMcpWrist = dist(thumbMcp, wrist);
  const dThumbIndexMcp = dist(thumbTip, indexMcp) / palmScale;
  const dThumbMiddleMcp = dist(thumbTip, middleMcp) / palmScale;

  const thumbUp =
    thumbTip.y < thumbIp.y &&
    thumbIp.y < thumbMcp.y &&
    thumbTip.y < indexMcp.y - 0.04 * palmScale &&
    dThumbTipWrist > 1.08 * dThumbMcpWrist;

  const thumbExt = dThumbIndexMcp > 0.55 && dThumbTipWrist > 1.05 * dThumbMcpWrist;
  const thumbSpread = dThumbIndexMcp > 0.70;
  const thumbTucked = dThumbMiddleMcp < 0.65 || dThumbIndexMcp < 0.48;

  const dThumbIndex = dist(thumbTip, indexTip) / palmScale;
  const dThumbMiddle = dist(thumbTip, middleTip) / palmScale;
  const dThumbRing = dist(thumbTip, ringTip) / palmScale;
  const dThumbPinky = dist(thumbTip, pinkyTip) / palmScale;

  const avgTipsDist = (dThumbIndex + dThumbMiddle + dThumbRing + dThumbPinky) / 4.0;
  const numMainExt = (indexExt ? 1 : 0) + (middleExt ? 1 : 0) + (ringExt ? 1 : 0) + (pinkyExt ? 1 : 0);

  const isCurvedCup = (tip: LandmarkPoint, pip: LandmarkPoint, mcp: LandmarkPoint) => {
    const dTw = dist(tip, wrist);
    const dPw = dist(pip, wrist);
    return 0.90 * dPw < dTw && dTw < 1.20 * dPw && tip.y < mcp.y;
  };

  const isCShape =
    isCurvedCup(indexTip, indexPip, indexMcp) &&
    isCurvedCup(middleTip, middlePip, middleMcp) &&
    isCurvedCup(ringTip, ringPip, ringMcp) &&
    !indexExt &&
    !middleExt;

  const detectedFingers: string[] = [];
  if (thumbUp || thumbExt || thumbSpread) detectedFingers.push('Thumb');
  if (indexExt) detectedFingers.push('Index');
  if (middleExt) detectedFingers.push('Middle');
  if (ringExt) detectedFingers.push('Ring');
  if (pinkyExt) detectedFingers.push('Pinky');

  const makeRes = (gesture: string, translation: string, confidence: number): RecognitionResponse => ({
    gesture,
    translation,
    confidence,
    hand_detected: true,
    mode: 'demo',
    detected_fingers: detectedFingers,
  });

  // 1. Food (All 5 tips pinched together)
  if (avgTipsDist < 0.42 && dThumbIndex < 0.38 && dThumbMiddle < 0.40) {
    return makeRes('Food', 'I need food / hungry.', 0.97);
  }

  // 2. OK (Thumb + Index loop, remaining 3 extended)
  if (dThumbIndex < 0.32 && middleExt && ringExt && pinkyExt) {
    return makeRes('OK', 'Everything is okay.', 0.96);
  }

  // 3. Good (Thumbs up)
  if (thumbUp && numMainExt === 0) {
    return makeRes('Good', 'That is good / well done.', 0.98);
  }

  // 4. Help (Shaka: Thumb + Pinky)
  if (thumbExt && pinkyExt && !indexExt && !middleExt && !ringExt) {
    return makeRes('Help', 'I need assistance/help.', 0.96);
  }

  // 5. No (L-Shape: Thumb + Index)
  if (thumbExt && indexExt && !middleExt && !ringExt && !pinkyExt) {
    return makeRes('No', 'No, thank you.', 0.96);
  }

  // 5b. I Love You (Index + Pinky UP with front facing camera, Middle + Ring curled inside, Thumb extended outside)
  const isFrontFacing =
    isUpright &&
    indexTip.y < indexPip.y &&
    pinkyTip.y < pinkyPip.y &&
    middleTip.y > middlePip.y - 0.05 * palmScale &&
    ringTip.y > ringPip.y - 0.05 * palmScale;

  if (
    indexExt &&
    pinkyExt &&
    !middleExt &&
    !ringExt &&
    (thumbExt || thumbSpread) &&
    !thumbTucked &&
    isFrontFacing
  ) {
    return makeRes('I Love You', 'I love you.', 0.97);
  }

  // 6. You (Index only)
  if (indexExt && !middleExt && !ringExt && !pinkyExt && !thumbUp) {
    return makeRes('You', 'You / Yourself.', 0.97);
  }

  // 7. I (Pinky only)
  if (pinkyExt && !indexExt && !middleExt && !ringExt && !thumbUp) {
    return makeRes('I', 'I / Me.', 0.97);
  }

  // 8. Yes (Index + Middle V-shape)
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    return makeRes('Yes', 'Yes, I agree.', 0.96);
  }

  // 9. Water (Index + Middle + Ring)
  if (indexExt && middleExt && ringExt && !pinkyExt) {
    return makeRes('Water', 'I would like some water.', 0.96);
  }

  // 10. Stop (Horizontal palm)
  if (numMainExt >= 3 && isHorizontal) {
    return makeRes('Stop', 'Stop / Please wait.', 0.95);
  }

  // 11. Thank You (Flat 4 hand, thumb tucked)
  if (numMainExt === 4 && (thumbTucked || !thumbSpread) && !isHorizontal) {
    return makeRes('Thank You', 'Thank you very much.', 0.95);
  }

  // 12. Hello (Open 5 spread)
  if (numMainExt === 4 && thumbSpread && !isHorizontal) {
    return makeRes('Hello', 'Hello! Welcome.', 0.96);
  }

  // 13. Please (Cupped C shape)
  if (isCShape) {
    return makeRes('Please', 'Please, if you could.', 0.93);
  }

  // 14. Sorry (Closed fist)
  if (numMainExt === 0 && !thumbUp && !thumbExt) {
    return makeRes('Sorry', 'I am sorry.', 0.95);
  }

  return {
    gesture: 'Ready',
    translation: 'Position hand clearly in front of camera',
    confidence: 0.50,
    hand_detected: true,
    mode: 'demo',
    detected_fingers: detectedFingers,
  };
}
