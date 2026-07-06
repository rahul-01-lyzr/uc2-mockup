import type { DemoConfig, Lang, ScreenMode, Surface } from '@/lib/types';

interface ConfigModalProps {
  open: boolean;
  config: DemoConfig;
  onChange: (patch: Partial<DemoConfig>) => void;
  onClose: () => void;
}

interface OptionDef<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

function OptionGroup<T extends string>({
  title,
  options,
  value,
  onSelect,
}: {
  title: string;
  options: OptionDef<T>[];
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className={`grid gap-2 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(opt.value)}
              className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                active
                  ? 'border-line bg-emerald-50 ring-1 ring-line'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`block text-[13px] font-semibold ${active ? 'text-line-dark' : 'text-slate-700'}`}>
                {opt.label}
              </span>
              {opt.hint && <span className="block text-[10px] leading-3.5 text-slate-500">{opt.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SCREEN_OPTIONS: OptionDef<ScreenMode>[] = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'fullscreen', label: 'Full screen' },
];

const LANG_OPTIONS: OptionDef<Lang>[] = [
  { value: 'th', label: 'ไทย' },
  { value: 'en', label: 'English' },
];

const SURFACE_OPTIONS: OptionDef<Surface>[] = [
  { value: 'oa', label: 'LINE OA', hint: 'Chat' },
  { value: 'liff', label: 'LINE LIFF', hint: 'Web view' },
];

/** What each surface can really do in production, per LINE docs. */
const CAPABILITY_SECTIONS: { title: string; notes: string[] }[] = [
  {
    title: 'LINE OA — chat (Messaging API)',
    notes: [
      'Flex Message bubbles & carousels (max 12 bubbles) — cards, buttons, gradients; buttons work on all devices.',
      'Quick replies: max 13 per message, labels ≤ 20 chars — mobile only, disappear after one tap.',
      'Rich menu (custom image, up to 20 tap areas, per-user assignable) — mobile only.',
      'Typed text via webhook + NLU, loading animation while responding.',
      'Sent messages are immutable — no re-rendering or deleting chat history.',
    ],
  },
  {
    title: 'LINE LIFF — web view',
    notes: [
      'A full web app (this same app): forms, aligned tables, document viewers, custom chat UI — no LINE constraints.',
      'Opened from chat buttons via its liff.line.me URL; LIFF browser on mobile, external browsers on desktop.',
      'SDK: liff.getProfile / sendMessages (post back into the chat) / closeWindow (return to chat).',
      'Free to re-render anytime — language switch, live updates, unlimited suggestions.',
    ],
  }
];

/** Demo settings: device frame, content language, and render surface. */
export default function ConfigModal({ open, config, onChange, onClose }: ConfigModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Demo settings"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-slate-800">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <OptionGroup
            title="Screen"
            options={SCREEN_OPTIONS}
            value={config.screen}
            onSelect={(screen) => onChange({ screen })}
          />
          <OptionGroup
            title="Language"
            options={LANG_OPTIONS}
            value={config.lang}
            onSelect={(lang) => onChange({ lang })}
          />
          <OptionGroup
            title="Surface"
            options={SURFACE_OPTIONS}
            value={config.surface}
            onSelect={(surface) => onChange({ surface })}
          />
        </div>

        <div className="mt-5 space-y-3">
          {CAPABILITY_SECTIONS.map((section) => (
            <div key={section.title} className="rounded-xl bg-slate-50 p-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">{section.title}</p>
              <ul className="space-y-1.5">
                {section.notes.map((note) => (
                  <li key={note} className="flex gap-1.5 text-[10.5px] leading-4 text-slate-600">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-line" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
