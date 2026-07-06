import type { Lang, Recommendation, StepId } from '@/lib/types';
import { UI, pick } from '@/lib/i18n';
import SampleTag from '@/components/shared/SampleTag';

interface RecommendationCardProps {
  recommendation: Recommendation;
  lang: Lang;
  onRunStep: (stepId: StepId, productId?: string) => void;
}

/** LIFF rendering of the FNA result — structured card vs the cramped chat bubble. */
export default function RecommendationCard({ recommendation, lang, onRunStep }: RecommendationCardProps) {
  const { productGroup, product, rationale, input, disclaimer } = recommendation;
  const roleLabel =
    input.householdRole === 'member' ? pick(UI.fnaRoleMember, lang) : pick(UI.fnaRoleHead, lang);
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-line to-emerald-700 px-4 py-3 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">{pick(UI.fnaResult, lang)}</p>
          <p className="text-[14px] font-bold leading-5">{pick(productGroup, lang)}</p>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{pick(UI.fnaRecommended, lang)}</p>
          <p className="text-[16px] font-bold text-slate-900">
            {product.name}
            {product.isSample && <SampleTag />}
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-600">{pick(product.positioning, lang)}</p>
        </div>

        <div className="px-4 py-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{pick(UI.fnaRationale, lang)}</p>
          <ul className="space-y-1.5">
            {rationale.map((reason) => (
              <li key={pick(reason, 'en')} className="flex items-start gap-2 text-[11.5px] leading-4.5 text-slate-700">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0 text-line-dark" aria-hidden>
                  <circle cx="6" cy="6" r="5.5" fill="currentColor" fillOpacity="0.12" />
                  <path d="M3.8 6.2l1.5 1.5 3-3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {pick(reason, lang)}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50 px-4 py-2 text-[10px] text-slate-500">
          <span>
            {pick(UI.ageShort, lang)}: {input.age ?? '—'} {pick(UI.yearsUnit, lang)}
          </span>
          <span>
            {pick(UI.salaryShort, lang)}: {input.monthlySalary?.toLocaleString('en-US') ?? '—'} {pick(UI.bahtUnit, lang)}
          </span>
          <span>{roleLabel}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onRunStep('Q02', product.id)}
          className="flex-1 rounded-lg bg-line py-2 text-[12px] font-semibold text-white hover:bg-line-dark"
        >
          {pick(UI.requestFactsheet, lang)}
        </button>
        <button
          type="button"
          onClick={() => onRunStep('Q03', product.id)}
          className="flex-1 rounded-lg border border-line py-2 text-[12px] font-semibold text-line-dark hover:bg-emerald-50"
        >
          {pick(UI.compareCompetitor, lang)}
        </button>
      </div>

      <p className="px-1 text-[9.5px] leading-3.5 text-slate-500">{pick(disclaimer, lang)}</p>
    </div>
  );
}
