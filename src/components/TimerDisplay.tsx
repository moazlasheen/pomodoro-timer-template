import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerMode } from '../types/pomodoro';
import ProgressRing from './ProgressRing';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const MODE_COLORS: Record<TimerMode, string> = {
  focus: '#C4553A',
  shortBreak: '#7A8B6F',
  longBreak: '#4A7B8C',
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  mode,
  onStart,
  onPause,
  onReset,
  onSkip,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / totalTime;
  const color = MODE_COLORS[mode];

  const ringSize = 180;

  return (
    <div className="flex flex-col items-center gap-8 fade-in-up">
      {/* Timer Ring */}
      <div
        className={`relative flex items-center justify-center ${isRunning ? 'breathing' : ''}`}
        style={{ width: ringSize * 2, height: ringSize * 2 }}
        role="timer"
        aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
      >
        <ProgressRing
          radius={ringSize}
          stroke={6}
          progress={progress}
          color={color}
          trackColor="#E6DFD3"
        />

        {/* Inner content */}
        <div className="relative z-10 flex flex-col items-center">
          <span
            className="font-mono text-7xl md:text-8xl font-bold tracking-tight text-charcoal tabular-nums"
            style={{ letterSpacing: '-0.02em' }}
          >
            {String(minutes).padStart(2, '0')}
            <span className={`${isRunning ? 'pulse-dot' : ''}`}>:</span>
            {String(seconds).padStart(2, '0')}
          </span>
          <span
            className="mt-2 text-sm font-display font-medium uppercase tracking-[0.2em]"
            style={{ color }}
          >
            {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-parchment hover:bg-sand transition-colors duration-200"
          aria-label="Reset timer"
        >
          <RotateCcw size={18} className="text-warm-gray group-hover:text-charcoal transition-colors" />
        </button>

        <button
          onClick={isRunning ? onPause : onStart}
          className="flex items-center justify-center w-16 h-16 rounded-full text-cream transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: color }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
        </button>

        <button
          onClick={onSkip}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-parchment hover:bg-sand transition-colors duration-200"
          aria-label="Skip to next session"
        >
          <SkipForward size={18} className="text-warm-gray group-hover:text-charcoal transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;
