import React from 'react';
import { TimerMode } from '../types/pomodoro';
import { Brain, Coffee, Sunset } from 'lucide-react';

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

const modes: { key: TimerMode; label: string; icon: React.ReactNode }[] = [
  { key: 'focus', label: 'Focus', icon: <Brain size={16} /> },
  { key: 'shortBreak', label: 'Short Break', icon: <Coffee size={16} /> },
  { key: 'longBreak', label: 'Long Break', icon: <Sunset size={16} /> },
];

const MODE_COLORS: Record<TimerMode, string> = {
  focus: '#C4553A',
  shortBreak: '#7A8B6F',
  longBreak: '#4A7B8C',
};

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-parchment rounded-full" role="tablist" aria-label="Timer mode">
      {modes.map(({ key, label, icon }) => {
        const isActive = mode === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onModeChange(key)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-display font-medium
              transition-all duration-200
              ${isActive
                ? 'text-cream shadow-md'
                : 'text-warm-gray hover:text-charcoal'
              }
            `}
            style={isActive ? { backgroundColor: MODE_COLORS[key] } : {}}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;
