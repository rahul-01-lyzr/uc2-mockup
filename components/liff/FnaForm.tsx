import { useState } from 'react';
import type { FnaInput, HouseholdRole, Lang } from '@/lib/types';
import { UI, pick } from '@/lib/i18n';
import { FNA_DEMO_DEFAULTS } from '@/lib/mockData';

interface FnaFormProps {
  /** Draft collected so far (possibly mid-chat) — merged over demo defaults. */
  initial: FnaInput;
  lang: Lang;
  submitting: boolean;
  onSubmit: (input: FnaInput) => void;
}

/** LIFF rendering of Q04 — one clean form instead of 3+ chat turns. */
export default function FnaForm({ initial, lang, submitting, onSubmit }: FnaFormProps) {
  const [age, setAge] = useState<number>(initial.age ?? FNA_DEMO_DEFAULTS.age);
  const [salary, setSalary] = useState<number>(initial.monthlySalary ?? FNA_DEMO_DEFAULTS.monthlySalary);
  const [role, setRole] = useState<HouseholdRole>(initial.householdRole ?? FNA_DEMO_DEFAULTS.householdRole);

  const roleOptions: { value: HouseholdRole; label: string }[] = [
    { value: 'head', label: pick(UI.fnaRoleHead, lang) },
    { value: 'member', label: pick(UI.fnaRoleMember, lang) },
  ];

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitting) onSubmit({ age, monthlySalary: salary, householdRole: role });
      }}
    >
      <p className="text-[14px] font-bold text-slate-800">{pick(UI.fnaTitle, lang)}</p>

      <label className="block">
        <span className="text-[12px] font-semibold text-slate-700">{pick(UI.fnaAge, lang)}</span>
        <input
          type="number"
          min={20}
          max={70}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-line focus:ring-1 focus:ring-line"
        />
      </label>

      <label className="block">
        <span className="text-[12px] font-semibold text-slate-700">{pick(UI.fnaSalary, lang)}</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-line focus:ring-1 focus:ring-line"
        />
      </label>

      <fieldset>
        <legend className="text-[12px] font-semibold text-slate-700">{pick(UI.fnaRole, lang)}</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={role === opt.value}
              onClick={() => setRole(opt.value)}
              className={`rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors ${
                role === opt.value
                  ? 'border-line bg-emerald-50 text-line-dark'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-line py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-line-dark disabled:opacity-60"
      >
        {submitting && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin" aria-hidden>
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
            <path d="M12.5 7A5.5 5.5 0 007 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {submitting ? pick(UI.fnaSubmitting, lang) : pick(UI.fnaSubmit, lang)}
      </button>
    </form>
  );
}
