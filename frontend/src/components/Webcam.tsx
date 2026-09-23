import React from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle, ShieldAlert, CheckCircle2, Crosshair } from 'lucide-react';
import { CameraState } from '../types';

interface WebcamProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraState: CameraState;
  errorMessage: string | null;
  handDetected: boolean;
  handedness: string;
  landmarkCount: number;
  confidence: number;
  currentGesture?: string;
  detectedFingers?: string[];
  onStartCamera: () => void;
  onStopCamera: () => void;
}

export const Webcam: React.FC<WebcamProps> = ({
  videoRef,
  canvasRef,
  cameraState,
  errorMessage,
  handDetected,
  handedness,
  landmarkCount,
  confidence,
  currentGesture,
  detectedFingers = [],
  onStartCamera,
  onStopCamera,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Webcam Feed</h2>
            <p className="text-xs text-slate-500">Real-Time MediaPipe Hand Tracking</p>
          </div>
        </div>

        {/* Live Indicator pill */}
        <div className="flex items-center gap-2">
          {cameraState === 'active' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Camera Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Camera Off
            </span>
          )}
        </div>
      </div>

      {/* Video / Canvas Container */}
      <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            cameraState === 'active' ? 'block' : 'hidden'
          }`}
        />

        {/* MediaPipe Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100 ${
            cameraState === 'active' ? 'block' : 'hidden'
          }`}
        />

        {/* Live Detection HUD Badges */}
        {cameraState === 'active' && (
          <>
            {/* Top-Left: Sensor Metrics & Detected Fingers */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 shadow-md flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${handDetected ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
                <span>Hand: {handDetected ? `Detected (${handedness})` : 'Searching...'}</span>
              </div>
              {handDetected && (
                <>
                  <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 shadow-md flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Conf: {Math.round(confidence * 100)}%</span>
                    <span className="text-[10px] text-slate-500 font-normal">({landmarkCount} pts)</span>
                  </div>
                  {/* Extended Fingers indicator */}
                  <div className="glass-panel px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 shadow-md flex items-center gap-1.5">
                    <span className="text-slate-500 font-normal">Fingers:</span>
                    {detectedFingers.length > 0 ? (
                      <span className="font-bold text-emerald-700">{detectedFingers.join(', ')}</span>
                    ) : (
                      <span className="font-bold text-slate-600">Curled (Fist)</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Top-Right: Live Recognized Sign Tag */}
            {handDetected && currentGesture && currentGesture !== 'Ready' && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-slate-900/90 backdrop-blur-md border border-brand-400/60 shadow-xl px-4 py-2 rounded-xl text-center flex flex-col items-center gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-[10px] font-bold tracking-wider text-brand-400 uppercase">Live Detection</span>
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-teal-300">
                    {currentGesture}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{Math.round(confidence * 100)}% match</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Off State View */}
        {cameraState === 'off' && (
          <div className="text-center p-6 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <CameraOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Camera Inactive</h3>
            <p className="text-xs text-slate-400 mb-6">
              Click the "Start Camera" button below to enable real-time ISL gesture detection.
            </p>
            <button
              onClick={onStartCamera}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-600/30 transition-all duration-200"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          </div>
        )}

        {/* Loading State View */}
        {cameraState === 'starting' && (
          <div className="text-center p-6">
            <RefreshCw className="w-10 h-10 text-brand-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">Initializing Webcam & MediaPipe AI...</p>
            <p className="text-xs text-slate-400 mt-1">Please allow camera permissions if prompted.</p>
          </div>
        )}

        {/* Permission Denied View */}
        {cameraState === 'denied' && (
          <div className="text-center p-6 max-w-md bg-slate-900/95 backdrop-blur-md rounded-2xl m-4 border border-rose-500/40">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-rose-300 mb-2">Camera Permission Denied</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Camera permission was denied. Please allow camera access in your browser settings to use sign recognition.
            </p>
            <button
              onClick={onStartCamera}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* General Error View */}
        {cameraState === 'error' && (
          <div className="text-center p-6 max-w-md">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-amber-300 mb-1">Webcam Access Issue</h3>
            <p className="text-xs text-slate-300 mb-4">{errorMessage || 'Camera device could not be reached.'}</p>
            <button
              onClick={onStartCamera}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs text-slate-900 bg-white hover:bg-slate-100"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>

      {/* Panel Footer Controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">
          {cameraState === 'active' ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Live landmarks processing
            </span>
          ) : (
            <span>Ready to start camera</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {cameraState === 'active' ? (
            <button
              onClick={onStopCamera}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={onStartCamera}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Start Camera</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
