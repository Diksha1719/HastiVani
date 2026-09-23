import React from 'react';
import { Hand, Camera, Info, Sparkles, Volume2, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'translate' | 'features' | 'about';
  setActiveTab: (tab: 'home' | 'translate' | 'features' | 'about') => void;
  isBackendOffline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isBackendOffline }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Hand className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-800 via-brand-600 to-accent-600 bg-clip-text text-transparent">
                  HastVaani
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                  ISL AI
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
                Because Every Voice Deserves to Be Heard
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('translate')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'translate'
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              Translate
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'features'
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Action & Status */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${isBackendOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{isBackendOffline ? 'Client Demo Engine' : 'FastAPI Connected'}</span>
            </div>

            {/* Start Translating CTA Button */}
            <button
              onClick={() => setActiveTab('translate')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-brand-500"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Translating</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
