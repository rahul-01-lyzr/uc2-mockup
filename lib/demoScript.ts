import type { DemoStep, L10n, QuickReply, StepId } from './types';
import { t } from './i18n';

/**
 * The 5-step broker demo script. Each step maps a canned broker query to
 * one assistantService call and carries the per-step surface verdict shown
 * by the dev-only EvalOverlay.
 *
 * Service mapping:
 *   Q01 → getRetirementProducts()
 *   Q02 → getFactsheet(productId)
 *   Q03 → getComparison(productId)
 *   Q04 → runFna(input)
 *   Q05 → getKbAnswer('tax-certificate')
 */

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'Q01',
    title: t('แบบประกันเพื่อการเกษียณ', 'Retirement products'),
    brokerQuery: t('มีประกันเพื่อการเกษียณอะไรบ้าง', 'What retirement products do we have?'),
    verdict: 'either',
    verdictLabel: 'Either',
    rationale:
      'A short list of 3 products works on both surfaces — a Flex carousel is fast in chat, and a card list is equally clear in LIFF.',
    keywords: ['เกษียณ', 'มีประกัน', 'retirement', 'products'],
  },
  {
    id: 'Q02',
    title: t('ขอ Factsheet', 'Product factsheet'),
    brokerQuery: t('ขอ factsheet ของ TIP Pension 85', 'Factsheet for TIP Pension 85, please'),
    verdict: 'either',
    verdictLabel: 'Either / slight Chat',
    rationale:
      'A single document card with an open link is quick in chat; the LIFF embedded viewer is nicer to read but the extra hop rarely pays off for one document.',
    keywords: ['factsheet', 'แฟคชีท', 'ข้อมูลแบบประกัน'],
  },
  {
    id: 'Q03',
    title: t('เปรียบเทียบคู่แข่ง', 'Competitor comparison'),
    brokerQuery: t('เทียบกับคู่แข่งของ TIP Pension 85', 'Compare TIP Pension 85 with the competitor'),
    verdict: 'liff',
    verdictLabel: 'LIFF wins',
    rationale:
      'A 6-dimension side-by-side needs aligned columns. A Flex Message carousel cannot keep rows level across bubbles — an HTML table in LIFF can.',
    keywords: ['เทียบ', 'เปรียบเทียบ', 'คู่แข่ง', 'compare', 'competitor', ' vs '],
  },
  {
    id: 'Q04',
    title: t('แนะนำแบบประกัน (FNA)', 'FNA recommendation'),
    brokerQuery: t(
      'แนะนำแบบประกันสำหรับ อายุ 34, เงินเดือน 40,000, เป็นหัวหน้าครอบครัว',
      'Recommend a plan for age 34, salary 40,000, head of household',
    ),
    verdict: 'liff',
    verdictLabel: 'LIFF wins',
    rationale:
      'Structured input costs 3+ chat turns (age → salary → household role) versus one LIFF form, and the structured recommendation card renders far better than a cramped bubble.',
    keywords: ['แนะนำ', 'หัวหน้าครอบครัว', 'recommend', 'fna', 'head of household'],
  },
  {
    id: 'Q05',
    title: t('หนังสือรับรองภาษี', 'Tax certificate (after-service)'),
    brokerQuery: t(
      'ขอหนังสือรับรองเบี้ยเพื่อลดหย่อนภาษี',
      'How does my customer request the premium certificate for tax deduction?',
    ),
    verdict: 'chat',
    verdictLabel: 'Chat wins',
    rationale:
      'One short KB answer — a conversational bubble is sufficient. Launching a full web view for a single paragraph is overkill.',
    keywords: ['ลดหย่อน', 'หนังสือรับรอง', 'ภาษี', 'tax', 'certificate', 'deduction'],
  },
];

export const DEMO_STEP_MAP = Object.fromEntries(
  DEMO_STEPS.map((s) => [s.id, s]),
) as Record<StepId, DemoStep>;

/**
 * Short chip labels for suggested queries.
 * HARD LIMIT: quick-reply action labels are max 20 characters per the
 * Messaging API spec. The full broker query is still sent as the message
 * text (message actions carry separate `label` and `text` fields).
 */
export const STEP_CHIP_LABELS: Record<StepId, L10n> = {
  Q01: t('แบบประกันเกษียณ', 'Retirement products'),
  Q02: t('Factsheet Pension 85', 'Factsheet Pension 85'),
  Q03: t('เทียบกับคู่แข่ง', 'Compare competitor'),
  Q04: t('แนะนำแบบประกัน (FNA)', 'Recommend plan (FNA)'),
  Q05: t('ขอหนังสือรับรองภาษี', 'Tax certificate'),
};

/**
 * MOCK query router — substring match (Thai + English) against the 5 canned
 * demo queries. Replace with real NLU / LLM intent routing; the contract
 * stays the same (free text in → StepId | null out).
 */
export function routeQuery(text: string): StepId | null {
  const q = text.trim().toLowerCase();
  if (!q) return null;
  // Most-specific intents first, so e.g. "เทียบ factsheet" resolves to Q03.
  const order: StepId[] = ['Q03', 'Q05', 'Q02', 'Q04', 'Q01'];
  for (const id of order) {
    if (DEMO_STEP_MAP[id].keywords.some((k) => q.includes(k))) return id;
  }
  return null;
}

const SUGGESTION_FLOW: Record<'start' | StepId, StepId[]> = {
  start: ['Q01', 'Q02', 'Q03', 'Q04', 'Q05'],
  Q01: ['Q02', 'Q03', 'Q04'],
  Q02: ['Q03', 'Q04', 'Q05'],
  Q03: ['Q04', 'Q05'],
  Q04: ['Q05', 'Q01'],
  Q05: ['Q01', 'Q04'],
};

/** Contextual quick-reply suggestions once a step has completed. */
export function nextSuggestions(after: StepId | null): QuickReply[] {
  const ids = SUGGESTION_FLOW[after ?? 'start'];
  return ids.map((stepId) => ({
    id: `suggest-${after ?? 'start'}-${stepId}`,
    label: STEP_CHIP_LABELS[stepId],
    action: { type: 'step', stepId },
  }));
}
