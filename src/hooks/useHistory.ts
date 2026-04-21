import { useState, useCallback, useEffect } from 'react';
import { PomodoroSession, TimerMode } from '../types/pomodoro';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function generateSeedHistory(): PomodoroSession[] {
  const now = Date.now();
  const sessions: PomodoroSession[] = [];
  const tasks = [
    { id: 'seed-1', text: 'Design system audit' },
    { id: 'seed-2', text: 'Write API documentation' },
    { id: 'seed-3', text: 'Code review: auth module' },
  ];

  // Create 5 completed focus sessions + breaks going back from "now"
  let cursor = now - 3 * 60 * 60 * 1000; // 3 hours ago

  for (let i = 0; i < 5; i++) {
    const task = tasks[i % tasks.length];
    const focusDuration = 25;
    const breakDuration = i === 3 ? 15 : 5;
    const breakType: TimerMode = i === 3 ? 'longBreak' : 'shortBreak';

    // Focus session
    sessions.push({
      id: `seed-focus-${i}`,
      type: 'focus',
      startedAt: cursor,
      completedAt: cursor + focusDuration * 60 * 1000,
      taskId: task.id,
      taskText: task.text,
      durationMinutes: focusDuration,
    });

    cursor += focusDuration * 60 * 1000;

    // Break session (skip break after last focus)
    if (i < 4) {
      sessions.push({
        id: `seed-break-${i}`,
        type: breakType,
        startedAt: cursor,
        completedAt: cursor + breakDuration * 60 * 1000,
        durationMinutes: breakDuration,
      });
      cursor += breakDuration * 60 * 1000;
    }
  }

  return sessions;
}

export function useHistory() {
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const key = `pomodoro-history-${getTodayKey()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Seed data for demo
    const seed = generateSeedHistory();
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  });

  useEffect(() => {
    const key = `pomodoro-history-${getTodayKey()}`;
    localStorage.setItem(key, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((session: Omit<PomodoroSession, 'id'>) => {
    const newSession: PomodoroSession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    setSessions(prev => [...prev, newSession]);
  }, []);

  const todayFocusSessions = sessions.filter(s => s.type === 'focus');
  const todayFocusMinutes = todayFocusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const todayPomodoroCount = todayFocusSessions.length;

  return {
    sessions,
    addSession,
    todayFocusSessions,
    todayFocusMinutes,
    todayPomodoroCount,
  };
}
