import { LandmarkPoint, RecognitionResponse, ModelStatusResponse, SentenceComposeResponse } from '../types';
import { composeSentenceLocally } from './sentenceComposer';

const API_BASE = '/api';

export const checkHealth = async (): Promise<{ status: string; project?: string }> => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline' };
  }
};

export const getModelStatus = async (): Promise<ModelStatusResponse | null> => {
  try {
    const res = await fetch(`${API_BASE}/model-status`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend model-status API unavailable:', err);
    return null;
  }
};

export const recognizeGesture = async (
  landmarks: LandmarkPoint[],
  handedness: string = 'Right'
): Promise<RecognitionResponse | null> => {
  try {
    const res = await fetch(`${API_BASE}/recognize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landmarks, handedness }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Recognition failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Backend recognition API error or offline:', err);
    return null;
  }
};

export const composeSentence = async (tokens: string[]): Promise<SentenceComposeResponse> => {
  try {
    const res = await fetch(`${API_BASE}/compose-sentence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokens }),
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Graceful offline fallback to local client grammar composer
    return composeSentenceLocally(tokens);
  }
};
