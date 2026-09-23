import React from 'react';
import { History, Trash2, Volume2, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface RecognitionHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSpeak: (text: string) => void;
}

export const RecognitionHistory: React.FC<RecognitionHistoryProps> = ({
  history,
  onClearHistory,
  onSpeak,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Recognition History</h2>
            <p className="text-xs text-slate-500">Latest 10 timestamped ISL gestures detected</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Table */}
      {history.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium">No history recorded yet.</p>
          <p className="text-xs text-slate-400 mt-1">Start camera and perform gestures to populate the history log.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200/80 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Detected Sign</th>
                <th className="py-3 px-4">Translation</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-xs font-mono text-slate-500">{item.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-brand-900">{item.gesture}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{item.translation}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSpeak(item.gesture)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                      title={`Speak "${item.gesture}"`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
