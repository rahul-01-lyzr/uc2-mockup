import type { ChipAction, Lang, QuickReply } from '@/lib/types';
import { pick } from '@/lib/i18n';

interface QuickRepliesProps {
  replies: QuickReply[];
  lang: Lang;
  disabled: boolean;
  onAction: (action: ChipAction) => void;
}

/**
 * LINE quick-reply chips pinned above the input bar.
 * Real Messaging API constraint: max 13 items per message.
 */
export default function QuickReplies({ replies, lang, disabled, onAction }: QuickRepliesProps) {
  if (replies.length === 0) return null;
  return (
    <div className="slim-scroll flex gap-1.5 overflow-x-auto px-3 py-1.5">
      {replies.slice(0, 13).map((reply) => (
        <button
          key={reply.id}
          type="button"
          disabled={disabled}
          onClick={() => onAction(reply.action)}
          className="shrink-0 rounded-full border border-line/60 bg-white px-3 py-1 text-[12px] font-medium text-line-dark shadow-sm transition-colors hover:bg-emerald-50 disabled:opacity-50"
        >
          {pick(reply.label, lang)}
        </button>
      ))}
    </div>
  );
}
