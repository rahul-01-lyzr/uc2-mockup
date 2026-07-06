import { useState } from 'react';

interface ChatInputBarProps {
  placeholder: string;
  disabled: boolean;
  /** Rich menus only exist in the LINE mobile app (per Messaging API docs). */
  showMenuButton: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onSend: (text: string) => void;
}

/** LINE chat input bar: rich-menu toggle (mobile only), free-text input, send. */
export default function ChatInputBar({
  placeholder,
  disabled,
  showMenuButton,
  menuOpen,
  onToggleMenu,
  onSend,
}: ChatInputBarProps) {
  const [text, setText] = useState('');

  const submit = () => {
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText('');
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-2 py-1.5">
      {showMenuButton && (
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={menuOpen ? 'Close rich menu' : 'Open rich menu'}
          aria-expanded={menuOpen}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            menuOpen ? 'bg-line text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <rect x="1" y="1" width="6" height="6" rx="1.2" />
            <rect x="9" y="1" width="6" height="6" rx="1.2" />
            <rect x="1" y="9" width="6" height="6" rx="1.2" />
            <rect x="9" y="9" width="6" height="6" rx="1.2" />
          </svg>
        </button>
      )}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder={placeholder}
        className="h-8 min-w-0 flex-1 rounded-full bg-slate-100 px-3 text-[13px] outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-line"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || text.trim().length === 0}
        aria-label="Send message"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-line text-white transition-opacity disabled:opacity-30"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
          <path d="M1 7L13 1 9.5 7 13 13 1 7z" />
        </svg>
      </button>
    </div>
  );
}
