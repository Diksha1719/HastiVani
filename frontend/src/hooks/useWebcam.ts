import { useRef, useState, useCallback, useEffect } from 'react';
import { CameraState, LandmarkPoint } from '../types';

export function useWebcam(onLandmarksDetected?: (landmarks: LandmarkPoint[], handedness: string) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>('off');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [handedness, setHandedness] = useState<string>('Right');
  const [landmarkCount, setLandmarkCount] = useState<number>(0);

  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Initialize MediaPipe Hands
  const initMediaPipe = useCallback(async () => {
    try {
      // Dynamic import or window MediaPipe loading
      if (typeof window !== 'undefined' && (window as any).Hands) {
        const mpHands = new (window as any).Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        mpHands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        mpHands.onResults((results: any) => {
          drawCanvasResults(results);
        });

        handsRef.current = mpHands;
      }
    } catch (err) {
      console.warn('MediaPipe initialization warning:', err);
    }
  }, []);

  // Draw hand landmarks on HTML5 Canvas
  const drawCanvasResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      const primaryLandmarks = results.multiHandLandmarks[0];
      setLandmarkCount(primaryLandmarks.length);

      let detectedHandedness = 'Right';
      if (results.multiHandedness && results.multiHandedness[0]) {
        detectedHandedness = results.multiHandedness[0].label;
      }
      setHandedness(detectedHandedness);

      // Convert to normalized format
      const formattedLandmarks: LandmarkPoint[] = primaryLandmarks.map((lm: any) => ({
        x: lm.x,
        y: lm.y,
        z: lm.z || 0
      }));

      if (onLandmarksDetected) {
        onLandmarksDetected(formattedLandmarks, detectedHandedness);
      }

      // Draw Connection Lines & Nodes
      if (typeof window !== 'undefined' && (window as any).drawConnectors && (window as any).drawLandmarks) {
        const drawConnectors = (window as any).drawConnectors;
        const drawLandmarks = (window as any).drawLandmarks;
        const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
            color: '#6366F1', // Indigo line
            lineWidth: 4
          });
          drawLandmarks(ctx, landmarks, {
            color: '#14B8A6', // Teal dot
            fillColor: '#2DD4BF',
            lineWidth: 2,
            radius: 5
          });
        }
      } else {
        // Fallback custom Canvas drawing for hand skeleton
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = '#2DD4BF';
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 3;

        // Connections mapping for 21 points
        const connections = [
          [0,1],[1,2],[2,3],[3,4], // Thumb
          [0,5],[5,6],[6,7],[7,8], // Index
          [5,9],[9,10],[10,11],[11,12], // Middle
          [9,13],[13,14],[14,15],[15,16], // Ring
          [13,17],[17,18],[18,19],[19,20],[0,17] // Pinky & Palm
        ];

        for (const [start, end] of connections) {
          const p1 = primaryLandmarks[start];
          const p2 = primaryLandmarks[end];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x * w, p1.y * h);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.stroke();
          }
        }

        for (const lm of primaryLandmarks) {
          ctx.beginPath();
          ctx.arc(lm.x * w, lm.y * h, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    } else {
      setHandDetected(false);
      setLandmarkCount(0);
    }
    ctx.restore();
  }, [onLandmarksDetected]);

  // Start Webcam
  const startCamera = async () => {
    setCameraState('starting');
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState('active');

      // Load MediaPipe scripts dynamically if not loaded
      if (typeof window !== 'undefined' && !(window as any).Hands) {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
      }

      await initMediaPipe();

      // Start continuous processing loop
      const processLoop = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 640;
            canvasRef.current.height = videoRef.current.videoHeight || 480;
          }

          if (handsRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        }
        animFrameIdRef.current = requestAnimationFrame(processLoop);
      };

      processLoop();

    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera permission was denied. Please allow camera access to use sign recognition.');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to access webcam. Please verify your camera device.');
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setHandDetected(false);
    setLandmarkCount(0);
    setCameraState('off');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    cameraState,
    errorMessage,
    handDetected,
    handedness,
    landmarkCount,
    startCamera,
    stopCamera
  };
}

// Utility script loader
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}
