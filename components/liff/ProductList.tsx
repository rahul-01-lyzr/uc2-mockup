import type { Lang, Product, StepId } from '@/lib/types';
import { UI, pick } from '@/lib/i18n';
import SampleTag from '@/components/shared/SampleTag';

interface ProductListProps {
  products: Product[];
  lang: Lang;
  selectedProductId: string;
  onSelect: (productId: string) => void;
  onRunStep: (stepId: StepId, productId?: string) => void;
}

/** LIFF rendering of Q01 — vertical selectable product cards. */
export default function ProductList({ products, lang, selectedProductId, onSelect, onRunStep }: ProductListProps) {
  return (
    <div className="space-y-2.5">
      <p className="text-[13px] font-semibold text-slate-800">{pick(UI.productsHeading, lang)}</p>
      {products.map((product) => {
        const selected = product.id === selectedProductId;
        return (
          <div
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(product.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(product.id);
            }}
            className={`cursor-pointer rounded-xl border bg-white p-3 shadow-sm transition-all ${
              selected ? 'border-line ring-1 ring-line' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-bold text-slate-800">
                  {product.name}
                  {product.isSample && <SampleTag />}
                </p>
                <p className="mt-1 text-[12px] leading-4.5 text-slate-600">{pick(product.positioning, lang)}</p>
              </div>
              <span
                className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                  selected ? 'border-line bg-line' : 'border-slate-300'
                }`}
                aria-hidden
              >
                {selected && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5l2 2 4-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </div>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRunStep('Q02', product.id);
                }}
                className="flex-1 rounded-lg bg-line py-1.5 text-[11px] font-semibold text-white hover:bg-line-dark"
              >
                {pick(UI.factsheetButton, lang)}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRunStep('Q03', product.id);
                }}
                className="flex-1 rounded-lg border border-line py-1.5 text-[11px] font-semibold text-line-dark hover:bg-emerald-50"
              >
                {pick(UI.compareCompetitor, lang)}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
