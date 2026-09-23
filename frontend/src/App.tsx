import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Translate } from './pages/Translate';
import { About } from './pages/About';
import { checkHealth } from './services/api';
import { Hand, Heart, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'translate' | 'features' | 'about'>('home');
  const [isBackendOffline, setIsBackendOffline] = useState<boolean>(false);

  useEffect(() => {
    const verifyBackend = async () => {
      const res = await checkHealth();
      setIsBackendOffline(res.status === 'offline');
    };
    verifyBackend();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendOffline={isBackendOffline}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home onStartTranslating={() => setActiveTab('translate')} />
        )}
        {activeTab === 'features' && (
          <Home onStartTranslating={() => setActiveTab('translate')} />
        )}
        {activeTab === 'translate' && <Translate />}
        {activeTab === 'about' && <About />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white font-bold shadow-md">
                <Hand className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">HastVaani</span>
                <p className="text-xs text-slate-400">Because Every Voice Deserves to Be Heard</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
              <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => setActiveTab('translate')} className="hover:text-white transition-colors">Sign Recognition</button>
              <button onClick={() => setActiveTab('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">About</button>
            </div>

            {/* Copyright */}
            <div className="text-xs text-slate-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} HastVaani AI Project.</p>
              <p className="flex items-center justify-center md:justify-end gap-1 mt-1 text-[11px]">
                <span>Built with</span>
                <Heart className="w-3 h-3 text-rose-500 fill-current inline" />
                <span>for Indian Sign Language Accessibility.</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
