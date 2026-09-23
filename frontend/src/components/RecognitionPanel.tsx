import React from 'react';
import { Activity, Sparkles, AlertCircle, Layers } from 'lucide-react';
import { ModelStatusResponse } from '../types';

interface RecognitionPanelProps {
  currentGesture: string;
  translationText: string;
  confidence: number;
  activeMode: 'demo' | 'model' | string;
  isBackendOffline: boolean;
  modelStatus: ModelStatusResponse | null;
  cameraActive: boolean;
}

export const RecognitionPanel: React.FC<RecognitionPanelProps> = ({
  currentGesture,
  translationText,
  confidence,
  activeMode,
  isBackendOffline,
  modelStatus,
  cameraActive,
}) => {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Recognition Results</h2>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {cameraActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                🟢 Recognizing
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                ⚪ Idle
              </span>
            )}
          </div>
        </div>


        {activeMode === 'model' && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
            <Layers className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">Trained Model Active: </span>
              <span>Model loaded ({modelStatus?.model_type || 'Custom Model'}).</span>
            </div>
          </div>
        )}

        {isBackendOffline && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Recognition service is currently operating in offline mode.</span>
          </div>
        )}

        {/* Main Gesture Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-inner relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Detected Sign
          </span>

          <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-teal-300 mb-3 uppercase min-h-[3.5rem] flex items-center">
            {currentGesture || 'READY'}
          </h3>

          <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Translation</span>
              <p className="text-sm font-semibold text-teal-200">{translationText}</p>
            </div>

            {/* Confidence pill */}
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Confidence</span>
              <span className="text-lg font-extrabold text-white">{confidencePercent}%</span>
            </div>
          </div>
        </div>

        {/* Confidence Meter Bar */}
        <div className="space-y-1.5 mb-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Confidence Accuracy</span>
            <span>{confidencePercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(confidencePercent, 5)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
