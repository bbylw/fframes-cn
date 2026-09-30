import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { installBlocks, troubleshooting } from '../../data/site';

const tabs = [
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'windows', label: 'Windows' },
  { id: 'codecs', label: '编解码器' },
  { id: 'fixes', label: '排错' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const PANEL_CLASS =
  'overflow-hidden rounded-panel border border-white/10 bg-code px-4 py-3.5 text-[0.8125rem] leading-[1.75] text-code-fg break-words whitespace-pre-wrap shadow-[inset_0_1px_0_rgb(255_255_255/0.07)]';

function Code({ lines }: { lines: readonly string[] }) {
  return (
    <pre className={PANEL_CLASS}>
      <code>
        {lines.map((line, index) => (
          <span key={index} className="block whitespace-pre">
            {line === '' ? '\u00a0' : line}
          </span>
        ))}
      </code>
    </pre>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[70ch] flex-col gap-4">{children}</div>;
}

function Prose({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-ink-2">{children}</p>;
}

function content(id: TabId): ReactNode {
  if (id === 'macos') {
    return (
      <Body>
        <Prose>
          macOS 会下载预编译的 Skia 与 ffmpeg 构建，你只需要装上 Homebrew 这一层的系统依赖。
        </Prose>
        <Code lines={installBlocks.macos} />
      </Body>
    );
  }
  if (id === 'linux') {
    return (
      <Body>
        <Prose>arm64 与 x86_64 都会下载预编译构建，所链接的系统编码器必须已经装好。</Prose>
        <div className="flex flex-col gap-1.5">
          <p className="text-[14px] font-medium text-ink">debian 系发行版</p>
          <Code lines={installBlocks.linuxDebian} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[14px] font-medium text-ink">arch 系发行版</p>
          <Code lines={installBlocks.linuxArch} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[14px] font-medium text-ink">nix 用户</p>
          <Code lines={installBlocks.linuxNix} />
        </div>
      </Body>
    );
  }
  if (id === 'windows') {
    return (
      <Body>
        <Prose>
          在 Windows 上 ffmpeg 不从源码编译。fframes
          改为链接一个预编译的 FFmpeg 9.0 共享构建，并且需要 LLVM 供 bindgen 使用。
        </Prose>
        <Code lines={installBlocks.windows} />
        <Prose>
          也可以用 vcpkg install ffmpeg 代替 FFMPEG_DIR。编解码器来自预编译构建，所以请把
          h264、h265 这样的编解码器特性关掉：它们会要求从源码构建 ffmpeg，而 Windows
          上不支持这种方式。
        </Prose>
      </Body>
    );
  }
  if (id === 'codecs') {
    return (
      <Body>
        <Prose>fframes crate 的 Cargo 特性决定链接哪些编解码器和硬件加速库。</Prose>
        <Code lines={installBlocks.codecs} />
        <Prose>
          编解码器和其他系统库的全部构建与链接都借助 ffmpeg 的构建系统，因此排错时请参考 ffmpeg 编译指南。
        </Prose>
      </Body>
    );
  }
  return (
    <ul className="flex max-w-[70ch] flex-col gap-6">
      {troubleshooting.map((item) => (
        <li key={item.problem} className="border-t border-line pt-4">
          <p className="text-[15px] font-medium text-ink">{item.problem}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{item.fix}</p>
        </li>
      ))}
    </ul>
  );
}

export default function PlatformTabs() {
  const [active, setActive] = useState<TabId>('macos');
  const baseId = useId();
  const reduce = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    const next = tabs[target];
    if (!next) return;
    event.preventDefault();
    setActive(next.id);
    buttons.current[target]?.focus();
  };

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="按平台查看安装说明"
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[14.5px] transition-[background-color,color,border-color] duration-150 ease-out active:scale-[0.98] ${
                selected
                  ? 'border-transparent bg-invert text-invert-fg'
                  : 'border-control-line text-ink-2 hover:bg-ghost hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`} tabIndex={0}>
        {/* No exit animation: mode="wait" stacked an exit and an enter, which
            made every tab switch feel like it lagged a step behind. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce === true ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6"
          >
            {content(active)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
