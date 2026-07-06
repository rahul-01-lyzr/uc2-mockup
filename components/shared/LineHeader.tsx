import type { Surface } from '@/lib/types';

export const OA_NAME = 'TIPlife AI Assistant';
export const LIFF_TITLE = 'TIPlife Broker Portal';
/** Real LIFF URL format: https://liff.line.me/{liffId} — id issued per LIFF app. */
export const LIFF_URL = 'liff.line.me/2007881500-AbCdEfGh';

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pb-0.5 pt-2 text-[10px] font-semibold text-white">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" aria-hidden>
          <rect x="0" y="6" width="2" height="4" rx="0.5" />
          <rect x="3.3" y="4" width="2" height="6" rx="0.5" />
          <rect x="6.6" y="2" width="2" height="8" rx="0.5" />
          <rect x="9.9" y="0" width="2" height="10" rx="0.5" />
        </svg>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="14" height="9" rx="2" stroke="currentColor" />
          <rect x="2" y="2" width="10" height="6" rx="1" fill="currentColor" />
          <rect x="15.5" y="3" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

function OaHeader() {
  return (
    <div className="flex items-center gap-2 px-3 pb-2.5 pt-1.5 text-white">
      <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden>
        <path d="M8 1L1 8l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-line">
        TIP
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="truncate text-[15px] font-semibold">{OA_NAME}</span>
        {/* LINE verified-account badge */}
        <svg width="13" height="13" viewBox="0 0 13 13" aria-label="Verified OA">
          <circle cx="6.5" cy="6.5" r="6" fill="#0f83ff" />
          <path d="M3.8 6.7l1.8 1.8 3.6-3.8" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex items-center gap-3.5">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="currentColor" aria-hidden>
          <path d="M3.6 1.4c.5-.5 1.3-.4 1.7.1l1.5 2c.4.5.3 1.2-.1 1.6l-.9.9c.5 1.1 2.1 2.7 3.2 3.2l.9-.9c.4-.4 1.1-.5 1.6-.1l2 1.5c.5.4.6 1.2.1 1.7l-1 1c-.5.5-1.2.7-1.9.5-2-.6-4-1.9-5.6-3.5C3.5 7.8 2.2 5.8 1.6 3.8c-.2-.7 0-1.4.5-1.9l1.5-.5z" />
        </svg>
        <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor" aria-hidden>
          <rect x="0" y="0" width="16" height="2" rx="1" />
          <rect x="0" y="6" width="16" height="2" rx="1" />
          <rect x="0" y="12" width="16" height="2" rx="1" />
        </svg>
      </div>
    </div>
  );
}

function LiffHeader() {
  return (
    <>
      <div className="flex items-center gap-2 px-3 pb-2.5 pt-1.5 text-white">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Close LIFF">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="min-w-0 flex-1 text-center">
          <span className="truncate text-[15px] font-semibold">{LIFF_TITLE}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="8" cy="2.5" r="1.6" />
          <circle cx="8" cy="8" r="1.6" />
          <circle cx="8" cy="13.5" r="1.6" />
        </svg>
      </div>
      <div className="flex items-center justify-center gap-1.5 bg-slate-100 py-1 text-[10px] text-slate-500">
        <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" aria-hidden>
          <rect x="0" y="4" width="8" height="6" rx="1" />
          <path d="M1.5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
        {LIFF_URL}
      </div>
    </>
  );
}

/**
 * Green LINE top bar. Same channel either way — the OA variant shows the
 * chat header, the LIFF variant shows the in-app web-view header.
 */
export default function LineHeader({ surface }: { surface: Surface }) {
  return (
    <div className="shrink-0 bg-line">
      <StatusBar />
      {surface === 'oa' ? <OaHeader /> : <LiffHeader />}
    </div>
  );
}
