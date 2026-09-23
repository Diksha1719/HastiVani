import React from 'react';
import { Volume2, VolumeX, Square, RotateCcw, Sliders } from 'lucide-react';
import { SpeechSettings } from '../types';

interface SpeechControlsProps {
  currentGesture: string;
  translationText: string;
  speechSettings: SpeechSettings;
  setSpeechSettings: React.Dispatch<React.SetStateAction<SpeechSettings>>;
  onSpeak: (text: string) => void;
  onStop: () => void;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  currentGesture,
  translationText,
  speechSettings,
  setSpeechSettings,
  onSpeak,
  onStop,
}) => {
  const toggleSpeech = () => {
    setSpeechSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
    if (speechSettings.enabled) {
      onStop();
    }
  };

  const handleSpeakClick = () => {
    if (currentGesture && currentGesture !== 'Ready' && currentGesture !== 'No Hand') {
      onSpeak(currentGesture);
    } else {
      onSpeak('No sign currently detected');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
            <Volume2 className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Speech Controls</h2>
        </div>

        {/* Speech ON/OFF Toggle */}
        <button
          onClick={toggleSpeech}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            speechSettings.enabled
              ? 'bg-teal-50 text-teal-700 border border-teal-200'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
          aria-label="Toggle text to speech"
        >
          {speechSettings.enabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Voice ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>Voice Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Speak Button */}
        <button
          onClick={handleSpeakClick}
          disabled={!speechSettings.enabled}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 disabled:opacity-50 shadow-md transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span>🔊 Speak</span>
        </button>

        {/* Replay Button */}
        <button
          onClick={handleSpeakClick}
          disabled={!speechSettings.enabled}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay</span>
        </button>

        {/* Stop Speech Button */}
        <button
          onClick={onStop}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>⏹ Stop Speech</span>
        </button>
      </div>

      {/* Auto-Speak Checkbox & Speed slider */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
          <input
            type="checkbox"
            checked={speechSettings.autoSpeak}
            onChange={(e) => setSpeechSettings((prev) => ({ ...prev, autoSpeak: e.target.checked }))}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <span>Auto-speak newly recognized signs</span>
        </label>

        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Speed:</span>
          <select
            value={speechSettings.rate}
            onChange={(e) => setSpeechSettings((prev) => ({ ...prev, rate: parseFloat(e.target.value) }))}
            className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
          >
            <option value="0.75">0.75x Slow</option>
            <option value="1.0">1.0x Normal</option>
            <option value="1.25">1.25x Fast</option>
          </select>
        </div>
      </div>
    </div>
  );
};
