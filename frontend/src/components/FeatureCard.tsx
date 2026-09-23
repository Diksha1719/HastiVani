import React from 'react';
import { Zap, Hand, FileText, Volume2, Camera, HeartHandshake } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconType: 'realtime' | 'isl' | 'text' | 'voice' | 'camera' | 'accessible';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, iconType }) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'realtime':
        return <Zap className="w-6 h-6 text-brand-600" />;
      case 'isl':
        return <Hand className="w-6 h-6 text-indigo-600" />;
      case 'text':
        return <FileText className="w-6 h-6 text-teal-600" />;
      case 'voice':
        return <Volume2 className="w-6 h-6 text-purple-600" />;
      case 'camera':
        return <Camera className="w-6 h-6 text-blue-600" />;
      case 'accessible':
        return <HeartHandshake className="w-6 h-6 text-rose-600" />;
      default:
        return <Zap className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
          {renderIcon()}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-brand-600">HastVaani Feature</span>
        <span>ISL Tech</span>
      </div>
    </div>
  );
};
