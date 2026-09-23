import React, { useState } from 'react';
import {
  Hand,
  ThumbsUp,
  HelpCircle,
  Smile,
  Droplets,
  Utensils,
  OctagonX,
  CheckCircle,
  XCircle,
  Compass,
  Sparkles,
  Info,
  Heart,
} from 'lucide-react';

interface GestureItem {
  name: string;
  category: 'Fingers' | 'Pinches' | 'Special';
  fingersCount: string;
  description: string;
  fingerDetails: string;
  handShape: string;
  icon: React.ReactNode;
  badgeColor: string;
}

export const GestureGuide: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const gestures: GestureItem[] = [
    // 1 Finger / 0 Finger
    {
      name: 'Good',
      category: 'Fingers',
      fingersCount: '1 Finger (Thumb)',
      description: 'Thumbs Up: Fist with only thumb pointing straight up',
      fingerDetails: 'Thumb UP, all 4 fingers curled tightly into palm',
      handShape: 'Thumbs Up',
      icon: <ThumbsUp className="w-5 h-5 text-emerald-600" />,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'You',
      category: 'Fingers',
      fingersCount: '1 Finger (Index)',
      description: 'Pointing Up: Only index finger extended upwards',
      fingerDetails: 'Index extended UP, thumb & other 3 fingers curled',
      handShape: 'Index Pointing',
      icon: <Hand className="w-5 h-5 text-blue-600" />,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'I',
      category: 'Fingers',
      fingersCount: '1 Finger (Pinky)',
      description: 'ISL Manual "I": Only pinky finger extended straight up',
      fingerDetails: 'Pinky extended UP, thumb and 3 fingers in a fist',
      handShape: 'Pinky Only',
      icon: <Hand className="w-5 h-5 text-purple-600" />,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      name: 'Sorry',
      category: 'Fingers',
      fingersCount: '0 Fingers (Fist)',
      description: 'Closed Fist: All 5 fingers curled into a solid fist',
      fingerDetails: 'All 5 fingers curled tight into palm',
      handShape: 'Solid Closed Fist',
      icon: <Smile className="w-5 h-5 text-slate-600" />,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },

    // 2 Fingers
    {
      name: 'Yes',
      category: 'Fingers',
      fingersCount: '2 Fingers (V-Sign)',
      description: 'Peace / V-Sign: Index and Middle extended spread in a V',
      fingerDetails: 'Index + Middle extended UP, Ring, Pinky & Thumb curled',
      handShape: 'Peace / "V" Shape',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'No',
      category: 'Fingers',
      fingersCount: '2 Fingers (L-Sign)',
      description: '"L" Angle: Thumb & Index extended at 90° angle',
      fingerDetails: 'Thumb pointing out & Index pointing UP (L shape)',
      handShape: '"L" / Gun Shape',
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      name: 'Help',
      category: 'Fingers',
      fingersCount: '2 Fingers (Shaka)',
      description: 'Shaka / Call Sign: Thumb and Pinky extended outwards',
      fingerDetails: 'Thumb & Pinky extended, middle 3 fingers curled',
      handShape: 'Thumb + Pinky',
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },

    // 3, 4, 5 Fingers
    {
      name: 'I Love You',
      category: 'Fingers',
      fingersCount: '3 Fingers (ILY)',
      description: 'I Love You: Index and Pinky extended UP with front facing camera, Thumb extended outside',
      fingerDetails: 'Index & Pinky extended UP, Thumb extended OUT, Middle & Ring curled inside',
      handShape: 'ILY / "🤟" Sign',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      name: 'Water',
      category: 'Fingers',
      fingersCount: '3 Fingers (W-Sign)',
      description: '"W" Sign: Index, Middle, and Ring extended up',
      fingerDetails: 'Index + Middle + Ring extended UP, Pinky & Thumb curled',
      handShape: '"W" / 3 Fingers',
      icon: <Droplets className="w-5 h-5 text-cyan-600" />,
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      name: 'Thank You',
      category: 'Fingers',
      fingersCount: '4 Fingers (B-Sign)',
      description: 'Flat 4-Hand: 4 fingers straight up together, Thumb tucked',
      fingerDetails: 'Index, Middle, Ring, Pinky upright, Thumb tucked across palm',
      handShape: '4 Fingers Up (Flat)',
      icon: <Smile className="w-5 h-5 text-teal-600" />,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      name: 'Hello',
      category: 'Fingers',
      fingersCount: '5 Fingers (Spread)',
      description: 'Open 5 Hand: All 5 fingers extended and spread wide vertically',
      fingerDetails: 'All 5 fingers spread apart facing camera upright',
      handShape: 'Open 5 Palm Spread',
      icon: <Hand className="w-5 h-5 text-indigo-600" />,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      name: 'Stop',
      category: 'Special',
      fingersCount: 'Horizontal Palm',
      description: 'Blade Barrier: Open flat palm turned horizontally (fingers sideways)',
      fingerDetails: 'Hand rotated 90°, fingers pointing sideways to camera',
      handShape: 'Horizontal Hand',
      icon: <OctagonX className="w-5 h-5 text-red-600" />,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },

    // Pinches & Shapes
    {
      name: 'OK',
      category: 'Pinches',
      fingersCount: 'O-Ring Pinch',
      description: 'OK Sign: Thumb and Index tips touching in a ring, 3 fingers up',
      fingerDetails: 'Thumb tip & Index tip form a circle; Middle, Ring, Pinky UP',
      handShape: 'Thumb-Index Loop',
      icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      name: 'Food',
      category: 'Pinches',
      fingersCount: 'All-Tips Pinch',
      description: 'Indian Food Sign: All 5 fingertips pinched together pointing up',
      fingerDetails: 'Thumb and all 4 fingertips gathered together (eating morsel)',
      handShape: '5-Finger Morsel',
      icon: <Utensils className="w-5 h-5 text-orange-600" />,
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      name: 'Please',
      category: 'Special',
      fingersCount: 'Cupped "C" Hand',
      description: 'Polite Request: Fingers curved together forming a gentle "C" cup',
      fingerDetails: 'Fingers curved forward together (like holding a cup)',
      handShape: 'Curved "C" Cup',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const filteredGestures =
    filter === 'all' ? gestures : gestures.filter((g) => g.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-brand-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Supported ISL Gestures & Signs</h2>
            <p className="text-xs text-slate-500">
              Each gesture has a distinct, 100% unique finger configuration for accurate detection
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/80 p-1 rounded-xl">
          {['all', 'fingers', 'pinches', 'special'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === cat
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 flex items-center gap-2.5 text-xs text-brand-900">
        <Info className="w-4 h-4 text-brand-600 shrink-0" />
        <span>
          <strong>Pro Tip:</strong> Hold your hand clearly in the webcam frame. The real-time HUD on the camera will show exactly which fingers are detected!
        </span>
      </div>

      {/* Gestures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredGestures.map((g) => (
          <div
            key={g.name}
            className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-brand-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Title & Icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                    {g.icon}
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">{g.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${g.badgeColor}`}>
                  {g.fingersCount}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{g.description}</p>
            </div>

            {/* Finger Shape Detail Pill */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-normal">Shape:</span>
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50/80 px-2 py-0.5 rounded-md border border-brand-200/60">
                {g.handShape}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
