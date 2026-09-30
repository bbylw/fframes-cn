import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react/dist/ssr';

type State = 'idle' | 'copied' | 'failed';

const LABELS: Record<State, string> = {
  idle: '复制命令',
  copied: '已复制',
  failed: '复制失败，请手动选择',
};

function Glyph({ state }: { state: State }) {
  if (state === 'copied') {
    return <CheckIcon size={16} weight="bold" className="text-[#4ade80]" aria-hidden="true" />;
  }
  if (state === 'failed') {
    return <CopyIcon size={16} className="text-accent-ink" aria-hidden="true" />;
  }
  return <CopyIcon size={16} aria-hidden="true" />;
}

/**
 * The code is read from the rendered panel on click rather than passed in as a
 * prop, so a long listing is not serialised into the page a second time.
 */
export default function CopyCommand() {
  const [state, setState] = useState<State>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduce = useReducedMotion();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (button: HTMLButtonElement) => {
    clearTimeout(timer.current);
    const source = button.closest('[data-copy-source]')?.querySelector('code');
    const text = source?.textContent ?? '';
    if (!text) return;
    let next: State = 'copied';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      next = 'failed';
    }
    setState(next);
    timer.current = setTimeout(() => setState('idle'), next === 'failed' ? 2600 : 1600);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={(event) => void copy(event.currentTarget)}
        aria-label={LABELS[state]}
        className="grid h-8 w-8 cursor-pointer place-items-center rounded-tile border-0 bg-transparent text-code-muted transition-[background-color,color] duration-150 ease-out hover:bg-white/12 hover:text-code-fg active:scale-[0.94]"
      >
        {/* The markup is identical on server and client on purpose. Reduced
            motion only shortens the duration, it never changes the tree. */}
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={state}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: reduce === true ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="grid place-items-center"
          >
            <Glyph state={state} />
          </motion.span>
        </AnimatePresence>
      </button>
      <p aria-live="polite" className="sr-only">
        {state === 'copied' ? '代码已复制到剪贴板' : ''}
      </p>
    </>
  );
}
