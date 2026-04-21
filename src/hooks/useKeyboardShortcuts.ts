import { useEffect, useCallback, useState } from 'react';

interface ShortcutHandlers {
  onToggleTimer: () => void;
  onSkip: () => void;
  onReset: () => void;
  onNewTask: () => void;
  onToggleDeepFocus: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (e.key) {
      case ' ':
        e.preventDefault();
        handlers.onToggleTimer();
        break;
      case 's':
      case 'S':
        if (!e.metaKey && !e.ctrlKey) {
          handlers.onSkip();
        }
        break;
      case 'r':
      case 'R':
        if (!e.metaKey && !e.ctrlKey) {
          handlers.onReset();
        }
        break;
      case 'n':
      case 'N':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handlers.onNewTask();
        }
        break;
      case 'f':
      case 'F':
        if (!e.metaKey && !e.ctrlKey) {
          handlers.onToggleDeepFocus();
        }
        break;
      case '?':
        setShowCheatSheet(prev => !prev);
        break;
      case 'Escape':
        setShowCheatSheet(false);
        break;
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showCheatSheet, setShowCheatSheet };
}

export const SHORTCUTS = [
  { key: 'Space', description: 'Start / Pause timer' },
  { key: 'S', description: 'Skip to next session' },
  { key: 'R', description: 'Reset current timer' },
  { key: 'N', description: 'Add new task' },
  { key: 'F', description: 'Toggle deep focus mode' },
  { key: '?', description: 'Show / hide shortcuts' },
  { key: 'Esc', description: 'Close any panel' },
];
