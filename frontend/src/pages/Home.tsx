import React from 'react';
import { Hero } from '../components/Hero';
import { FeatureCard } from '../components/FeatureCard';
import { GestureGuide } from '../components/GestureGuide';
import { Camera, Sparkles, Heart, Shield, ArrowRight } from 'lucide-react';

interface HomeProps {
  onStartTranslating: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartTranslating }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <Hero onStartTranslating={onStartTranslating} />

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Designed for Accessibility & Speed
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            HastVaani bridges the gap between sign language users and non-sign language users using cutting-edge computer vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Real-Time Recognition"
            description="Detect hand gestures instantly using AI and computer vision models with high confidence."
            iconType="realtime"
          />
          <FeatureCard
            title="Indian Sign Language"
            description="Designed specifically to support Indian Sign Language (ISL) gestures and cultural expressions."
            iconType="isl"
          />
          <FeatureCard
            title="Text Translation"
            description="Convert recognized hand gestures into clear, meaningful English text instantly."
            iconType="text"
          />
          <FeatureCard
            title="Voice Output"
            description="Convert translated text into audible speech using integrated text-to-speech synthesis."
            iconType="voice"
          />
          <FeatureCard
            title="Camera-Based Detection"
            description="Use your computer or mobile webcam directly without requiring extra expensive hardware."
            iconType="camera"
          />
          <FeatureCard
            title="Accessible Communication"
            description="Help improve communication between sign language users and non-sign language users everywhere."
            iconType="accessible"
          />
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-2">Simple 4-Step Process</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4">How HastVaani Translates ISL</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Experience seamless hand landmark tracking to text and voice conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-teal-400 block mb-2">01</span>
              <h4 className="font-bold text-base mb-1">Open Camera</h4>
              <p className="text-xs text-slate-300">Grant webcam access and click Start Recognition.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-teal-400 block mb-2">02</span>
              <h4 className="font-bold text-base mb-1">Extract Landmarks</h4>
              <p className="text-xs text-slate-300">MediaPipe extracts 21 precise 3D hand landmarks in real-time.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-teal-400 block mb-2">03</span>
              <h4 className="font-bold text-base mb-1">AI Classification</h4>
              <p className="text-xs text-slate-300">FastAPI backend classifies the ISL gesture geometry.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-teal-400 block mb-2">04</span>
              <h4 className="font-bold text-base mb-1">Text & Speech</h4>
              <p className="text-xs text-slate-300">Text appears instantly on screen and is spoken aloud.</p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="text-sm text-slate-200">Ready to test sign recognition?</span>
            </div>
            <button
              onClick={onStartTranslating}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Launch Translator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ISL Supported Gestures Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GestureGuide />
      </section>
    </div>
  );
};
