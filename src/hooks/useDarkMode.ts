import { useState, useEffect, useCallback } from 'react';

type DarkModePreference = boolean | 'system';

export function useDarkMode() {
  const [preference, setPreference] = useState<DarkModePreference>(() => {
    const saved = localStorage.getItem('darkmode-preference');
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    return 'system';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolve = () => {
      if (preference === 'system') {
        setIsDark(mediaQuery.matches);
      } else {
        setIsDark(preference);
      }
    };

    resolve();

    const handler = () => resolve();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [preference]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('darkmode-preference', String(preference));
  }, [preference]);

  const toggle = useCallback(() => {
    setPreference(prev => {
      if (prev === 'system') return true;
      if (prev === true) return false;
      return 'system';
    });
  }, []);

  const set = useCallback((val: DarkModePreference) => {
    setPreference(val);
  }, []);

  return { isDark, preference, toggle, set };
}
