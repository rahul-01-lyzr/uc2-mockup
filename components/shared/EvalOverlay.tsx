import type { DemoStep, Verdict } from '@/lib/types';

interface EvalOverlayProps {
  step: DemoStep | null;
  onDismiss: () => void;
}

const VERDICT_STYLE: Record<Verdict, { chip: string; border: string }> = {
  chat: { chip: 'bg-emerald-100 text-emerald-800', border: 'border-l-emerald-500' },
  liff: { chip: 'bg-blue-100 text-blue-800', border: 'border-l-blue-500' },
  either: { chip: 'bg-slate-200 text-slate-700', border: 'border-l-slate-400' },
};

/**
 * Dev-only banner: which surface wins the current step, and why.
 * Hidden by default; toggled from the dev controls on the page chrome.
 */
export default function EvalOverlay({ step, onDismiss }: EvalOverlayProps) {
  if (!step) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-lg border border-dashed border-slate-300 bg-white/70 px-4 py-2 text-center text-xs text-slate-500">
        <span className="mr-2 rounded-sm bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">dev</span>
        Surface evaluation — run a step (Q01 – Q05) to see the verdict.
      </div>
    );
  }
  const style = VERDICT_STYLE[step.verdict];
  return (
    <div
      className={`mx-auto flex w-full max-w-xl items-start gap-3 rounded-lg border border-slate-200 border-l-4 bg-white px-4 py-2.5 shadow-sm ${style.border}`}
    >
      <span className="mt-0.5 rounded-sm bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">dev</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-800">
            {step.id} — {step.title.en}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${style.chip}`}>{step.verdictLabel}</span>
        </div>
        <p className="mt-0.5 text-[11px] leading-4 text-slate-600">{step.rationale}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss evaluation banner"
        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
