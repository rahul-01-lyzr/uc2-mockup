import type { ReactNode } from 'react';
import type { ScreenMode, Surface } from '@/lib/types';
import LineHeader, { LIFF_URL, OA_NAME } from './LineHeader';

interface DeviceFrameProps {
  screen: ScreenMode;
  surface: Surface;
  children: ReactNode;
}

function TrafficLights() {
  return (
    <span className="flex gap-1.5" aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
    </span>
  );
}

function VerifiedBadge() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-label="Verified OA">
      <circle cx="6.5" cy="6.5" r="6" fill="#0f83ff" />
      <path d="M3.8 6.7l1.8 1.8 3.6-3.8" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const windowSize = (full: boolean) =>
  full
    ? 'h-full w-full flex-1'
    : 'h-[660px] w-[960px] max-w-full shrink-0 rounded-xl border border-slate-300 shadow-2xl';

/** LINE for PC window: dark icon rail + chat list + chat pane. */
function DesktopOaFrame({ full, children }: { full: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col overflow-hidden bg-white ${windowSize(full)}`}>
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <TrafficLights />
        <span className="text-[11px] font-semibold text-slate-500">LINE</span>
      </div>
      <div className="flex min-h-0 flex-1">
        {/* icon rail */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-4 bg-slate-800 py-3 text-slate-400">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-line text-[8px] font-bold text-white">B</div>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className="text-white" aria-label="Chats">
            <path d="M9 1C4.6 1 1 4 1 7.7c0 2.1 1.2 4 3 5.2-.1.5-.5 1.7-.6 2 0 0-.1.2.1.3h.3c.4-.1 2.2-1 3.1-1.5.7.1 1.3.2 2.1.2 4.4 0 8-3 8-6.7S13.4 1 9 1z" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="Contacts">
            <circle cx="9" cy="6" r="3.2" />
            <path d="M2.5 16c.8-3 3.4-4.5 6.5-4.5s5.7 1.5 6.5 4.5" strokeLinecap="round" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="Settings">
            <circle cx="9" cy="9" r="2.5" />
            <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4" strokeLinecap="round" />
          </svg>
        </div>
        {/* chat list */}
        <div className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white sm:flex">
          <div className="p-2.5">
            <div className="rounded-md bg-slate-100 px-2.5 py-1.5 text-[11px] text-slate-400">Search</div>
          </div>
          <div className="flex items-center gap-2.5 border-l-2 border-line bg-emerald-50/60 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-line text-[9px] font-bold text-white">
              TIP
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-[12px] font-semibold text-slate-800">
                {OA_NAME} <VerifiedBadge />
              </p>
              <p className="truncate text-[10px] text-slate-500">AI Sales Assistant (UC2)</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 opacity-60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[9px] font-bold text-white">
              TIP
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-slate-700">TIPlife Claims</p>
              <p className="truncate text-[10px] text-slate-500">Official Account</p>
            </div>
          </div>
        </div>
        {/* chat pane */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
              {OA_NAME} <VerifiedBadge />
            </span>
            <div className="ml-auto flex items-center gap-3 text-slate-400">
              <svg width="15" height="15" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <circle cx="7" cy="7" r="5.5" />
                <path d="M11.5 11.5L16 16" strokeLinecap="round" />
              </svg>
              <svg width="15" height="13" viewBox="0 0 16 14" fill="currentColor" aria-hidden>
                <rect x="0" y="0" width="16" height="2" rx="1" />
                <rect x="0" y="6" width="16" height="2" rx="1" />
                <rect x="0" y="12" width="16" height="2" rx="1" />
              </svg>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** LIFF on desktop: separate window (LINE for PC) / external browser via LINE Login. */
function DesktopLiffFrame({ full, children }: { full: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col overflow-hidden bg-white ${windowSize(full)}`}>
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <TrafficLights />
        <div className="flex items-center gap-1.5 rounded-t-md bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-line text-[6px] font-bold text-white">T</span>
          TIPlife Broker Portal
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-1.5">
        <svg width="9" height="11" viewBox="0 0 8 10" fill="currentColor" className="text-slate-400" aria-hidden>
          <rect x="0" y="4" width="8" height="6" rx="1" />
          <path d="M1.5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
        <span className="flex-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">{LIFF_URL}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * Device chrome around the active surface.
 * Mobile = LINE app phone frame; desktop = LINE for PC (OA) or a separate
 * LIFF window — matching how each surface really presents per LINE docs.
 * Fullscreen = the desktop window filling the viewport for presentations.
 */
export default function DeviceFrame({ screen, surface, children }: DeviceFrameProps) {
  if (screen === 'desktop' || screen === 'fullscreen') {
    const full = screen === 'fullscreen';
    return surface === 'oa' ? (
      <DesktopOaFrame full={full}>{children}</DesktopOaFrame>
    ) : (
      <DesktopLiffFrame full={full}>{children}</DesktopLiffFrame>
    );
  }
  return (
    <div className="flex h-[720px] w-[380px] shrink-0 flex-col overflow-hidden rounded-[2.6rem] border-[10px] border-slate-900 bg-white shadow-2xl">
      <LineHeader surface={surface} />
      {children}
    </div>
  );
}
