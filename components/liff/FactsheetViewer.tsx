import type { Factsheet, L10n, Lang, Product } from '@/lib/types';
import { pick, t } from '@/lib/i18n';
import SampleTag from '@/components/shared/SampleTag';

interface FactsheetViewerProps {
  product: Product;
  factsheet: Factsheet;
  disclaimer: L10n;
  lang: Lang;
}

const FIELD_ROWS: { label: L10n; key: 'entryAge' | 'premiumTerm' | 'coverage' | 'guaranteedBenefit' | 'taxDeduction' }[] = [
  { label: t('อายุรับประกัน', 'Entry age'), key: 'entryAge' },
  { label: t('ระยะเวลาชำระเบี้ย', 'Premium term'), key: 'premiumTerm' },
  { label: t('ความคุ้มครอง', 'Coverage'), key: 'coverage' },
  { label: t('ผลประโยชน์การันตี', 'Guaranteed benefit'), key: 'guaranteedBenefit' },
  { label: t('สิทธิลดหย่อนภาษี', 'Tax deduction'), key: 'taxDeduction' },
];

/** LIFF rendering of Q02 — embedded factsheet / PDF viewer placeholder. */
export default function FactsheetViewer({ product, factsheet, disclaimer, lang }: FactsheetViewerProps) {
  const altLang: Lang = lang === 'th' ? 'en' : 'th';
  return (
    <div className="flex flex-col gap-2">
      {/* Viewer toolbar */}
      <div className="flex items-center justify-between rounded-t-lg bg-slate-800 px-3 py-2 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-5 shrink-0 items-center justify-center rounded-sm bg-red-600 text-[6px] font-bold">
            PDF
          </div>
          <span className="truncate text-[11px]">{factsheet.fileName}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-[10px] text-white/80">
          <span>1 / 2</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M6 1v7M3 5.5L6 8.5 9 5.5M1.5 10.5h9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Document page (embedded-viewer placeholder) */}
      <div className="rounded-b-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="border-b-2 border-line pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-line-dark">TIPlife • Product Factsheet</p>
          <p className="mt-1 text-[15px] font-bold text-slate-900">
            {product.name}
            {product.isSample && <SampleTag />}
          </p>
          <p className="text-[10px] text-slate-500">
            {lang === 'th' ? 'แบบประกันบำนาญ (Annuity) • ปรับปรุงล่าสุด' : 'Annuity product • last updated'}{' '}
            {factsheet.updatedAt}
          </p>
        </div>
        <table className="mt-3 w-full text-[11.5px]">
          <tbody>
            {FIELD_ROWS.map((row) => (
              <tr key={row.key} className="border-b border-slate-100 align-top">
                <td className="w-[38%] py-2 pr-2">
                  <p className="font-semibold text-slate-700">{pick(row.label, lang)}</p>
                  <p className="text-[9px] uppercase tracking-wide text-slate-400">{pick(row.label, altLang)}</p>
                </td>
                <td className="py-2 leading-4.5 text-slate-700">{pick(factsheet[row.key], lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0 text-line-dark" aria-hidden>
            <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" />
            <path d="M3.5 5.7l1.4 1.4 2.6-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[9.5px] font-medium text-emerald-800">{pick(factsheet.retrievedNote, lang)}</p>
        </div>
      </div>

      <p className="px-1 text-[9.5px] leading-3.5 text-slate-500">{pick(disclaimer, lang)}</p>
    </div>
  );
}
