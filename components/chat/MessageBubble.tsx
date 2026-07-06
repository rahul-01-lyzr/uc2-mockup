import type { ReactNode } from 'react';
import type { Lang } from '@/lib/types';
import { UI, pick } from '@/lib/i18n';

interface MessageBubbleProps {
  role: 'broker' | 'assistant';
  lang: Lang;
  children: ReactNode;
  /** 'flex' renders full-width content (carousels) beside the avatar instead of a bubble. */
  variant?: 'bubble' | 'flex';
}

function AssistantAvatar() {
  return (
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-line text-[9px] font-bold text-white">
      TIP
    </div>
  );
}

/** LINE-style message row: broker green/right, assistant white/left. */
export default function MessageBubble({ role, lang, children, variant = 'bubble' }: MessageBubbleProps) {
  if (role === 'broker') {
    return (
      <div className="flex items-end justify-end gap-1.5 px-3">
        <span className="pb-0.5 text-right text-[9px] leading-3 text-white/85">
          {pick(UI.read, lang)}
          <br />
          9:41
        </span>
        <div className="max-w-[min(75%,26rem)] rounded-2xl rounded-br-md bg-line px-3 py-2 text-[13px] leading-5 text-white shadow-sm">
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'flex') {
    return (
      <div className="flex items-start gap-1.5 pl-3">
        <AssistantAvatar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-1.5 px-3">
      <AssistantAvatar />
      <div className="max-w-[min(78%,26rem)] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[13px] leading-5 text-slate-800 shadow-sm">
        {children}
      </div>
      <span className="self-end pb-0.5 text-[9px] text-white/85">9:41</span>
    </div>
  );
}
