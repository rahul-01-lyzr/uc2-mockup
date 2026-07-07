import type { AssistantResponse, L10n, Lang } from '@/lib/types';
import { UI, pick } from '@/lib/i18n';
import MessageBubble from './MessageBubble';

interface PlainResponseViewProps {
  response: AssistantResponse;
  lang: Lang;
  onOpenLiff: () => void;
}

/**
 * Plain-text rendering of a structured response — how the SAME LINE OA bot
 * would reply if it sent only text messages (no Flex cards, carousels, or
 * buttons). One text bubble; a LIFF hand-off shown as a tappable text link
 * where the web view genuinely adds value.
 */

const FACTSHEET_FIELDS: { label: L10n; key: 'entryAge' | 'premiumTerm' | 'coverage' | 'guaranteedBenefit' | 'taxDeduction' }[] = [
  { label: UI.factsheetEntryAge, key: 'entryAge' },
  { label: UI.factsheetPremiumTerm, key: 'premiumTerm' },
  { label: UI.factsheetCoverage, key: 'coverage' },
  { label: UI.factsheetGuaranteedBenefit, key: 'guaranteedBenefit' },
  { label: UI.factsheetTaxDeduction, key: 'taxDeduction' },
];

/** Build the plain-text body (+ optional LIFF link label) for a response. */
function buildPlainText(
  response: AssistantResponse,
  lang: Lang,
): { body: string; liffLabel?: L10n } {
  const sample = ` ${pick(UI.plainSampleTag, lang)}`;
  const L = (s: L10n) => pick(s, lang);

  switch (response.kind) {
    case 'products': {
      const lines = response.products.map(
        (p, i) => `${i + 1}. ${p.name}${p.isSample ? sample : ''}\n   ${L(p.positioning)}`,
      );
      return { body: `${L(response.intro)}\n\n${lines.join('\n\n')}` };
    }
    case 'factsheet': {
      const { product, factsheet, disclaimer } = response;
      const fields = FACTSHEET_FIELDS.map((f) => `${L(f.label)}: ${L(factsheet[f.key])}`);
      const body = [
        `${product.name}${product.isSample ? sample : ''}`,
        ...fields,
        '',
        L(factsheet.retrievedNote),
        L(disclaimer),
      ].join('\n');
      return { body, liffLabel: UI.openFactsheetLiff };
    }
    case 'comparison': {
      const { product, competitorName, rows, footnote } = response;
      const header = `${product.name} vs ${competitorName}${sample}`;
      const blocks = rows.map(
        (r) => `${L(r.dimension)}\n- ${product.name}: ${L(r.tip)}\n- ${competitorName}: ${L(r.competitor)}`,
      );
      return { body: `${header}\n\n${blocks.join('\n\n')}\n\n${L(footnote)}`, liffLabel: UI.openLiffTable };
    }
    case 'recommendation': {
      const { productGroup, product, rationale, disclaimer } = response.recommendation;
      const reasons = rationale.map((r) => `- ${L(r)}`).join('\n');
      const body = [
        L(productGroup),
        `${L(UI.recommendLabel)} ${product.name}${product.isSample ? sample : ''}`,
        '',
        reasons,
        '',
        L(disclaimer),
      ].join('\n');
      return { body, liffLabel: UI.openLiffDetails };
    }
    case 'kb': {
      const { answer } = response;
      const steps = answer.steps.map((s, i) => `${i + 1}. ${L(s)}`).join('\n');
      const body = [
        L(answer.title),
        '',
        steps,
        '',
        `${L(UI.channelLabel)}: ${L(answer.channel)}`,
        `${L(UI.processingLabel)}: ${L(answer.processingTime)}`,
        '',
        L(answer.disclaimer),
      ].join('\n');
      return { body };
    }
  }
}

export default function PlainResponseView({ response, lang, onOpenLiff }: PlainResponseViewProps) {
  const { body, liffLabel } = buildPlainText(response, lang);
  return (
    <MessageBubble role="assistant" lang={lang}>
      <span className="whitespace-pre-line text-[13px] leading-5">{body}</span>
      {liffLabel && (
        <button
          type="button"
          onClick={onOpenLiff}
          className="mt-1.5 block text-[12px] font-semibold text-line-dark underline"
        >
          {pick(liffLabel, lang)}
        </button>
      )}
    </MessageBubble>
  );
}

/** Plain-text rendering of a menu message (greeting / fallback) — no buttons. */
export function PlainMenuView({ text, items, lang }: { text: L10n; items: { id: string; label: L10n }[]; lang: Lang }) {
  const body = [
    pick(text, lang),
    '',
    pick(UI.plainMenuHint, lang),
    ...items.map((it) => `• ${pick(it.label, lang)}`),
  ].join('\n');
  return (
    <MessageBubble role="assistant" lang={lang}>
      <span className="whitespace-pre-line text-[13px] leading-5">{body}</span>
    </MessageBubble>
  );
}
