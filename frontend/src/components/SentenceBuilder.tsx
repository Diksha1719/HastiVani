import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Volume2,
  Delete,
  Trash2,
  Copy,
  Check,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { WordToken, SentenceSettings } from '../types';

interface SentenceBuilderProps {
  tokens: WordToken[];
  composedSentence: string;
  alternatives: string[];
  currentGesture: string;
  dwellGesture: string;
  dwellProgress: number;
  sentenceSettings: SentenceSettings;
  setSentenceSettings: React.Dispatch<React.SetStateAction<SentenceSettings>>;
  onAddWord: (gesture: string) => void;
  onRemoveWord: (id: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpeak: (text?: string) => void;
  onLoadSample: (tokens: string[]) => void;
}

const SAMPLE_PHRASES = [
  { label: 'Need Assistance', tokens: ['Hello', 'I', 'Help', 'Please'] },
  { label: 'Request Water', tokens: ['Water', 'Please'] },
  { label: 'Request Food', tokens: ['Food', 'Please'] },
  { label: 'Polite Agreement', tokens: ['Yes', 'Thank You'] },
  { label: 'Everything OK', tokens: ['OK', 'Thank You'] },
  { label: 'Appreciation', tokens: ['You', 'Good', 'Thank You'] },
  { label: 'Express Love', tokens: ['I Love You', 'Thank You'] },
];

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  tokens,
  composedSentence,
  alternatives,
  currentGesture,
  dwellGesture,
  dwellProgress,
  sentenceSettings,
  setSentenceSettings,
  onAddWord,
  onRemoveWord,
  onBackspace,
  onClear,
  onSpeak,
  onLoadSample,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleCopy = () => {
    if (composedSentence && !composedSentence.includes('Position hand')) {
      navigator.clipboard.writeText(composedSentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCurrentSignValid =
    currentGesture && currentGesture !== 'Ready' && currentGesture !== 'No Hand';

  const isPlaceholder = composedSentence.includes('Position hand');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Whole Sentence Detection</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Continuous AI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hold gestures in front of the camera to accumulate words into polished English sentences.
            </p>
          </div>
        </div>

        {/* Quick Settings & Word Count */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {tokens.length} {tokens.length === 1 ? 'sign' : 'signs'} detected
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Sentence Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Settings Drawer */}
      {showSettings && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-fadeIn">
          <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Continuous Signing Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Dwell hold speed */}
            <div>
              <label className="font-medium text-slate-600 block mb-1">Hold Duration to Confirm Sign:</label>
              <select
                value={sentenceSettings.dwellTimeMs}
                onChange={(e) =>
                  setSentenceSettings((prev) => ({ ...prev, dwellTimeMs: parseInt(e.target.value) }))
                }
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="700">Fast (0.7s) - Fluent signers</option>
                <option value="900">Balanced (0.9s) - Recommended</option>
                <option value="1300">Relaxed (1.3s) - Beginners</option>
              </select>
            </div>

            {/* Auto-finalize checkbox */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={sentenceSettings.autoFinalizeOnPause}
                  onChange={(e) =>
                    setSentenceSettings((prev) => ({
                      ...prev,
                      autoFinalizeOnPause: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>Auto-speak when hands rest (2.5s pause)</span>
              </label>
            </div>

            {/* Auto speak sentence toggle */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={sentenceSettings.autoSpeakSentence}
                  onChange={(e) =>
                    setSentenceSettings((prev) => ({
                      ...prev,
                      autoSpeakSentence: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>Auto-narrate finalized sentences</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Live Hold Progress Bar (Dwell Indicator) */}
      {dwellProgress > 0 && dwellGesture && (
        <div className="p-3 rounded-xl bg-indigo-50/90 border border-indigo-200/80 space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              Holding Sign: <strong className="text-indigo-700 uppercase">"{dwellGesture}"</strong>
            </span>
            <span className="font-bold text-indigo-600">{dwellProgress}%</span>
          </div>
          <div className="w-full h-2 bg-indigo-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${dwellProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Formulated Sentence Display Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Synthesized English Sentence
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              disabled={isPlaceholder}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Large Sentence Text */}
        <p
          className={`text-xl sm:text-2xl font-bold tracking-tight leading-relaxed min-h-[3.25rem] flex items-center ${
            isPlaceholder ? 'text-slate-400 italic text-base sm:text-lg font-normal' : 'text-white'
          }`}
        >
          {composedSentence}
        </p>

        {/* Alternatives / Subtitle */}
        {alternatives.length > 0 && !isPlaceholder && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Alternative phrasing:</span>
            <span className="text-teal-300 font-semibold italic">"{alternatives[0]}"</span>
          </div>
        )}

        {/* Primary Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onSpeak()}
            disabled={isPlaceholder}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 disabled:opacity-40 shadow-md transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak Sentence</span>
          </button>

          {isCurrentSignValid && (
            <button
              onClick={() => onAddWord(currentGesture)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/10 hover:bg-white/20 transition-colors"
              title="Manually commit the active detected sign without waiting for timer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add "{currentGesture}" Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Word Tokens Chain */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Sign Tokens Sequence (in order):</span>
          {tokens.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={onBackspace}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Remove last sign"
              >
                <Delete className="w-3 h-3" />
                <span>Backspace</span>
              </button>
              <button
                onClick={onClear}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Clear all tokens"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {tokens.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-1.5 py-6">
            <HelpCircle className="w-5 h-5 text-slate-300" />
            <span>No signs added to sentence yet.</span>
            <span className="text-[11px] text-slate-400">
              Hold any gesture in front of the camera or click a sample phrase below.
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            {tokens.map((token, idx) => (
              <React.Fragment key={token.id}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-800 hover:border-indigo-300 transition-all group">
                  <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{token.gesture}</span>
                  <button
                    onClick={() => onRemoveWord(token.id)}
                    className="ml-1 text-slate-400 hover:text-rose-600 rounded p-0.5 transition-colors"
                    title={`Remove ${token.gesture}`}
                  >
                    ×
                  </button>
                </div>
                {idx < tokens.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Quick Sample Phrases */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
            Quick Demo Phrases (Click to test grammar synthesis):
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_PHRASES.map((phrase) => (
            <button
              key={phrase.label}
              onClick={() => onLoadSample(phrase.tokens)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <span>{phrase.label}:</span>
              <span className="font-bold text-slate-900">[{phrase.tokens.join(', ')}]</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
