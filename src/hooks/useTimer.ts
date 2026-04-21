import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerMode, TimerSettings, DEFAULT_SETTINGS } from '../types/pomodoro';

interface UseTimerReturn {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  mode: TimerMode;
  pomodorosCompleted: number;
  settings: TimerSettings;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  setMode: (mode: TimerMode) => void;
  updateSettings: (settings: TimerSettings) => void;
}

export function useTimer(onPomodoroComplete?: () => void): UseTimerReturn {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('pomodoro-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [mode, setModeState] = useState<TimerMode>('focus');
  const [pomodorosCompleted, setPomodorosCompleted] = useState(() => {
    return parseInt(localStorage.getItem('pomodoros-completed') || '0', 10);
  });

  const getModeTime = useCallback((m: TimerMode, s: TimerSettings) => {
    switch (m) {
      case 'focus': return s.focus * 60;
      case 'shortBreak': return s.shortBreak * 60;
      case 'longBreak': return s.longBreak * 60;
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => getModeTime(mode, settings));
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoros-completed', pomodorosCompleted.toString());
  }, [pomodorosCompleted]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playSound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const frequencies = [523.25, 659.25, 783.99];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.2 + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.2 + 0.4);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.4);
      });
    } catch {
      // Audio not available
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    playSound();

    if (mode === 'focus') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      onPomodoroComplete?.();

      const nextMode = newCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      setModeState(nextMode);
      setTimeLeft(getModeTime(nextMode, settings));

      if (settings.autoStartBreaks) {
        setTimeout(() => {
          setIsRunning(true);
        }, 500);
      }
    } else {
      setModeState('focus');
      setTimeLeft(getModeTime('focus', settings));

      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          setIsRunning(true);
        }, 500);
      }
    }
  }, [mode, pomodorosCompleted, settings, clearTimer, getModeTime, onPomodoroComplete, playSound]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, handleTimerComplete, clearTimer]);

  // Update document title
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Break' : 'Long Break';
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} — ${modeLabel} | Focusflow`;
  }, [timeLeft, mode]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setTimeLeft(getModeTime(mode, settings));
  }, [mode, settings, clearTimer, getModeTime]);

  const skip = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    if (mode === 'focus') {
      const nextMode = (pomodorosCompleted + 1) % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      setModeState(nextMode);
      setTimeLeft(getModeTime(nextMode, settings));
    } else {
      setModeState('focus');
      setTimeLeft(getModeTime('focus', settings));
    }
  }, [mode, pomodorosCompleted, settings, clearTimer, getModeTime]);

  const setMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false);
    clearTimer();
    setModeState(newMode);
    setTimeLeft(getModeTime(newMode, settings));
  }, [settings, clearTimer, getModeTime]);

  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    if (!isRunning) {
      setTimeLeft(getModeTime(mode, newSettings));
    }
  }, [isRunning, mode, getModeTime]);

  const totalTime = getModeTime(mode, settings);

  return {
    timeLeft,
    totalTime,
    isRunning,
    mode,
    pomodorosCompleted,
    settings,
    start,
    pause,
    reset,
    skip,
    setMode,
    updateSettings,
  };
}
