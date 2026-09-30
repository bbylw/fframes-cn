import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/ssr';
import {
  exampleCategories,
  exampleRepoBase,
  examples,
  type ExampleCategory,
  type ExampleEntry,
  type ExampleGroup,
} from '../../data/site';

function cardTone(group: ExampleGroup) {
  if (group === 'shaders') return 'bg-accent-soft';
  if (group === 'showcase') return 'bg-surface-2';
  return 'bg-surface';
}

/** The launch video gets the whole first row, poster on the left. */
function FeaturedCard({ example }: { example: ExampleEntry }) {
  return (
    <a
      href={`${exampleRepoBase}/${example.name}`}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface-2 transition-[border-color] duration-200 ease-out hover:border-accent-line lg:flex-row"
    >
      {example.poster ? (
        <img
          src={example.poster}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="block aspect-[2/1] w-full object-cover lg:aspect-auto lg:w-1/2 lg:shrink-0"
        />
      ) : null}
      <span className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <span className="flex items-center justify-between gap-2">
          <code className="font-mono text-[15px] text-ink">{example.name}</code>
            <ArrowSquareOutIcon
              size={16}
              className="shrink-0 text-ink-3 transition-colors duration-150 group-hover:text-accent-ink"
              aria-hidden="true"
            />
        </span>
        <span className="max-w-[46ch] text-[15px] leading-relaxed text-ink-2">{example.body}</span>
        <span className="mt-auto flex flex-col gap-1.5 pt-4">
          <span className="font-mono text-[12.5px] text-ink-2">just run {example.name}</span>
          <span className="font-mono text-[12.5px] text-ink-2">just render {example.name}</span>
        </span>
      </span>
    </a>
  );
}

export default function ExampleFilter() {
  const [active, setActive] = useState<ExampleCategory>('all');
  const reduce = useReducedMotion();
  const visible = active === 'all' ? examples : examples.filter((item) => item.group === active);
  const featured = visible.find((item) => item.poster);
  const rest = visible.filter((item) => !item.poster);

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label="按类别筛选示例"
        className="scroll-fade flex gap-2 overflow-x-auto border-b border-line pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {exampleCategories.map((category) => {
          const isActive = category.id === active;
          const count =
            category.id === 'all'
              ? examples.length
              : examples.filter((item) => item.group === category.id).length;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              aria-pressed={isActive}
              className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[14.5px] transition-[background-color,color,border-color] duration-150 ease-out active:scale-[0.98] ${
                isActive
                  ? 'border-transparent bg-invert text-invert-fg'
                  : 'border-control-line text-ink-2 hover:bg-ghost hover:text-ink'
              }`}
            >
              {category.label}
              <span
                className={`ml-1.5 font-mono text-[12.5px] ${isActive ? 'opacity-70' : 'text-ink-3'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* No AnimatePresence here on purpose: popLayout kept filtered out cards
          mounted and invisible. Survivors get a FLIP reflow from `layout`,
          newcomers get an entry, and everything else unmounts cleanly. */}
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featured ? (
          <motion.li
            key={featured.name}
            layout={!reduce}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce === true ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <FeaturedCard example={featured} />
          </motion.li>
        ) : null}

        {rest.map((example, index) => (
          <motion.li
            key={example.name}
            layout={!reduce}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce === true ? 0 : 0.32,
              delay: reduce === true ? 0 : Math.min(index, 6) * 0.03,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <a
              href={`${exampleRepoBase}/${example.name}`}
              target="_blank"
              rel="noreferrer noopener"
              className={`group flex h-full flex-col gap-2 rounded-card border border-line p-4 transition-[border-color] duration-200 ease-out hover:border-accent-line ${cardTone(example.group)}`}
            >
              <span className="flex items-center justify-between gap-2">
                <code className="font-mono text-[13.5px] text-ink">{example.name}</code>
                <ArrowSquareOutIcon
                  size={15}
                  className="shrink-0 text-ink-3 transition-colors duration-150 group-hover:text-accent-ink"
                  aria-hidden="true"
                />
              </span>
              <span className="text-[14px] leading-relaxed text-ink-2">{example.body}</span>
            </a>
          </motion.li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        当前显示 {visible.length} 个示例。
      </p>
    </div>
  );
}
