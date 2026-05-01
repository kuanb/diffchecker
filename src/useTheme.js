import { useEffect, useState } from 'react';

const COOKIE_NAME = 'diffchecker-theme';
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function writeCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

function systemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveTheme(preference) {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemPrefersDark() ? 'dark' : 'light';
}

function readInitialPreference() {
  const stored = readCookie(COOKIE_NAME);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export function useTheme() {
  const [preference, setPreference] = useState(readInitialPreference);
  const [resolved, setResolved] = useState(() => resolveTheme(readInitialPreference()));

  useEffect(() => {
    setResolved(resolveTheme(preference));
    if (preference === 'system') {
      writeCookie(COOKIE_NAME, 'system');
    } else {
      writeCookie(COOKIE_NAME, preference);
    }
  }, [preference]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  useEffect(() => {
    if (preference !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolved(systemPrefersDark() ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  const cycle = () => {
    setPreference((p) => (p === 'system' ? 'dark' : p === 'dark' ? 'light' : 'system'));
  };

  return { preference, resolved, setPreference, cycle };
}
