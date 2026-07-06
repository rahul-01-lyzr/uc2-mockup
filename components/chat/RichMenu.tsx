import type { ChipAction, Lang, StepId } from '@/lib/types';
import { DEMO_STEP_MAP } from '@/lib/demoScript';
import { UI, pick } from '@/lib/i18n';

interface RichMenuProps {
  lang: Lang;
  onAction: (action: ChipAction) => void;
  onReset: () => void;
}

const TILE_ICONS: Record<StepId, React.ReactNode> = {
  Q01: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2" y="3" width="16" height="4" rx="1" />
      <rect x="2" y="9" width="16" height="4" rx="1" />
      <rect x="2" y="15" width="10" height="3" rx="1" />
    </svg>
  ),
  Q02: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 2h7l4 4v12H5z" strokeLinejoin="round" />
      <path d="M12 2v4h4M8 10h5M8 13h5" strokeLinecap="round" />
    </svg>
  ),
  Q03: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2" y="3" width="7" height="14" rx="1" />
      <rect x="11" y="3" width="7" height="14" rx="1" />
      <path d="M4 7h3M13 7h3M4 10h3M13 10h3" strokeLinecap="round" />
    </svg>
  ),
  Q04: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="2" width="14" height="16" rx="2" />
      <path d="M7 7h6M7 10h6M7 13l1.5 1.5L12 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Q05: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 2h12v16l-2-1.5L12 18l-2-1.5L8 18l-2-1.5L4 18z" strokeLinejoin="round" />
      <path d="M7 6h6M7 9h6M7 12h4" strokeLinecap="round" />
    </svg>
  ),
};

const TILE_ORDER: StepId[] = ['Q01', 'Q02', 'Q03', 'Q04', 'Q05'];

/**
 * LINE OA rich menu — the tappable grid that replaces the keyboard area.
 * In production this is an image with up to 20 tap areas configured via the
 * Messaging API rich menu endpoints. Mobile app only per LINE docs.
 */
export default function RichMenu({ lang, onAction, onReset }: RichMenuProps) {
  return (
    <div className="grid shrink-0 grid-cols-3 gap-px border-t border-slate-200 bg-slate-200">
      {TILE_ORDER.map((stepId) => (
        <button
          key={stepId}
          type="button"
          onClick={() => onAction({ type: 'step', stepId })}
          className="flex h-20 flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-white to-emerald-50 px-1 text-line-dark transition-colors hover:to-emerald-100"
        >
          {TILE_ICONS[stepId]}
          <span className="text-center text-[10px] font-medium leading-3 text-slate-700">
            {pick(DEMO_STEP_MAP[stepId].title, lang)}
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="flex h-20 flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-white to-slate-50 px-1 text-slate-500 transition-colors hover:to-slate-100"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M17 10a7 7 0 11-2-4.9M15 2v3.5h-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-center text-[10px] font-medium leading-3">{pick(UI.restartDemo, lang)}</span>
      </button>
    </div>
  );
}
