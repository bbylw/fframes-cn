import { useCallback, useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr';

type Theme = 'light' | 'dark';

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('fframes-theme', theme);
  } catch {
    /* private mode, the inline boot script will simply fall back to the system */
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === 'dark' ? 'dark' : 'light');
    setReady(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      apply(next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到浅色' : '切换到深色'}
      aria-pressed={ready ? theme === 'dark' : undefined}
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-control-line bg-transparent text-ink-2 transition-[background-color,color,border-color] duration-150 ease-out hover:bg-ghost hover:text-ink active:scale-[0.94] dark:hover:bg-ghost"
    >
      <span className="grid place-items-center">
        {theme === 'dark' ? (
          <SunIcon size={17} aria-hidden="true" />
        ) : (
          <MoonIcon size={17} aria-hidden="true" />
        )}
      </span>
    </button>
  );
}
