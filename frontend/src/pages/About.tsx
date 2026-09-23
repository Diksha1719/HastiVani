import React from 'react';
import { HeartHandshake, ShieldCheck, Cpu, Code2, Sparkles, Layers, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 border border-brand-200 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>About HastVaani</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Empowering Accessibility Through AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          HastVaani is designed to make communication more inclusive by using artificial intelligence and computer vision to recognize Indian Sign Language (ISL) gestures.
        </p>
      </div>

      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-accent-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <HeartHandshake className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Our Mission</h2>
          <blockquote className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-white mb-4">
            "To bridge communication gaps and create a more inclusive world where every voice can be understood."
          </blockquote>
          <p className="text-xs text-slate-300">
            Designed specifically for Indian Sign Language (ISL) gestures and community representation.
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Why Indian Sign Language (ISL)?</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Indian Sign Language is a rich, distinct sign language system used by millions of Deaf and hard-of-hearing individuals across South Asia. Unlike Western sign languages (such as ASL), ISL has its own unique grammar, hand shapes, and regional variations. HastVaani is built specifically with ISL gesture structures in mind.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Modular Machine Learning Pipeline</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The system extracts 21 three-dimensional hand landmarks in real time using MediaPipe Hands. Landmarks are normalized and classified using a Python FastAPI backend service layer. The architecture supports plugging in Scikit-Learn Random Forest (`.pkl`) or TensorFlow (`.keras`) models seamlessly.
          </p>
        </div>
      </div>

      {/* Tech Stack Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-teal-400" />
          <h3 className="text-xl font-bold">Technology Stack</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-medium block mb-1">Frontend Framework</span>
            <span className="font-bold text-white text-sm">React 18 + Vite</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-medium block mb-1">Language & Styling</span>
            <span className="font-bold text-white text-sm">TypeScript + Tailwind CSS</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-medium block mb-1">Computer Vision</span>
            <span className="font-bold text-white text-sm">MediaPipe + OpenCV</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-medium block mb-1">Backend API</span>
            <span className="font-bold text-white text-sm">Python FastAPI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
