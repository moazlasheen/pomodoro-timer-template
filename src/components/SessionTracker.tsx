import React from 'react';
import { TimerMode } from '../types/pomodoro';

interface SessionTrackerProps {
  pomodorosCompleted: number;
  longBreakInterval: number;
  mode: TimerMode;
}

const MODE_COLORS: Record<TimerMode, string> = {
  focus: '#C4553A',
  shortBreak: '#7A8B6F',
  longBreak: '#4A7B8C',
};

const SessionTracker: React.FC<SessionTrackerProps> = ({
  pomodorosCompleted,
  longBreakInterval,
  mode,
}) => {
  const currentInCycle = pomodorosCompleted % longBreakInterval;

  return (
    <div className="flex items-center gap-2 fade-in-up" aria-label={`${pomodorosCompleted} pomodoros completed`}>
      {Array.from({ length: longBreakInterval }).map((_, i) => {
        const isFilled = i < currentInCycle;
        const isCurrent = i === currentInCycle && mode === 'focus';
        return (
          <div
            key={i}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${isFilled ? '' : isCurrent ? 'ring-2 ring-offset-2 ring-offset-cream' : 'bg-sand'}
            `}
            style={{
              backgroundColor: isFilled ? MODE_COLORS.focus : isCurrent ? MODE_COLORS.focus + '40' : undefined,
              ringColor: isCurrent ? MODE_COLORS.focus : undefined,
            }}
          />
        );
      })}
      <span className="text-xs font-mono text-soft-gray ml-1">
        #{pomodorosCompleted}
      </span>
    </div>
  );
};

export default SessionTracker;
