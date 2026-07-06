import type { ComparisonRow, L10n, Lang, Product } from '@/lib/types';
import { UI, fmt, pick } from '@/lib/i18n';
import SampleTag from '@/components/shared/SampleTag';

interface ComparisonTableProps {
  product: Product;
  competitorName: string;
  rows: ComparisonRow[];
  footnote: L10n;
  lang: Lang;
}

/** LIFF rendering of Q03 — the properly aligned comparison table chat can't do. */
export default function ComparisonTable({ product, competitorName, rows, footnote, lang }: ComparisonTableProps) {
  const altLang: Lang = lang === 'th' ? 'en' : 'th';
  return (
    <div>
      <p className="text-[13px] font-semibold text-slate-800">{pick(UI.comparisonHeading, lang)}</p>
      <p className="mb-2 text-[10px] text-slate-500">
        {fmt(pick(UI.comparisonSub, lang), { a: product.name, b: competitorName })}
      </p>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-800 text-left text-white">
              <th className="w-[26%] px-2.5 py-2 font-semibold">{pick(UI.dimensionCol, lang)}</th>
              <th className="w-[37%] border-l border-slate-600 bg-line/90 px-2.5 py-2 font-semibold">
                {product.name}
                <SampleTag />
              </th>
              <th className="w-[37%] border-l border-slate-600 px-2.5 py-2 font-semibold">
                {competitorName}
                <SampleTag />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={pick(row.dimension, 'en')} className={`align-top ${i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                <td className="px-2.5 py-2">
                  <p className="font-semibold text-slate-700">{pick(row.dimension, lang)}</p>
                  <p className="text-[9px] uppercase tracking-wide text-slate-400">{pick(row.dimension, altLang)}</p>
                </td>
                <td className="border-l border-slate-100 bg-emerald-50/40 px-2.5 py-2 leading-4 text-slate-700">
                  {pick(row.tip, lang)}
                </td>
                <td className="border-l border-slate-100 px-2.5 py-2 leading-4 text-slate-700">
                  {pick(row.competitor, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 px-1 text-[9.5px] leading-3.5 text-slate-500">{pick(footnote, lang)}</p>
    </div>
  );
}
