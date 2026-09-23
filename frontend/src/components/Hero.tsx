import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Video, Volume2, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onStartTranslating: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartTranslating }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-50/60 via-slate-50 to-white">
      {/* Decorative background glows */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-100/80 text-brand-800 border border-brand-200 shadow-sm mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI-Powered Indian Sign Language Translation</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            HastVaani
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-700 via-indigo-600 to-accent-600 bg-clip-text text-transparent mb-6">
            Because Every Voice Deserves to Be Heard
          </p>

          {/* Description */}
          <blockquote className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            HastVaani is a real-time AI-powered system that translates Indian Sign Language gestures into text and speech, enabling faster, more inclusive, and accessible communication.
          </blockquote>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartTranslating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Start Translating</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Real-Time Webcam</h4>
                <p className="text-[11px] text-slate-500">21 Hand Landmarks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center text-accent-700">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Text & Voice Output</h4>
                <p className="text-[11px] text-slate-500">Instant Speech Synthesis</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Indian Sign Language</h4>
                <p className="text-[11px] text-slate-500">Specially Designed for ISL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
