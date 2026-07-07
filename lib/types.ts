/**
 * Shared domain types for the TIPlife AI Sales Assistant (UC2) demo.
 *
 * One LINE channel, two render surfaces: 'oa' (Messaging API chat) and
 * 'liff' (LIFF web view launched from the same OA). Both render the same
 * assistant state — these types are the contract between them.
 *
 * Everything here maps to real LINE capabilities:
 *  - OA chat UI  → Messaging API (Flex Messages, quick replies, rich menu)
 *  - LIFF UI     → a standard web app opened via https://liff.line.me/{liffId}
 *  - shared state→ backend session keyed by LINE userId (webhook + LIFF ID token)
 */

/**
 * Render surface of the one LINE channel:
 *  - 'oa'   → OA chat with rich Flex content (carousels, buttons, quick replies)
 *  - 'liff' → LIFF web view
 *  - 'text' → OA chat, plain text only (no Flex) — the least-effort formatting option
 */
export type Surface = 'oa' | 'liff' | 'text';

export type Lang = 'th' | 'en';

/** Demo device frame: LINE mobile app, LINE for PC window, or full screen. */
export type ScreenMode = 'mobile' | 'desktop' | 'fullscreen';

export interface DemoConfig {
  surface: Surface;
  lang: Lang;
  screen: ScreenMode;
}

/** A bilingual string — rendered via pick(l10n, lang). */
export interface L10n {
  th: string;
  en: string;
}

export type StepId = 'Q01' | 'Q02' | 'Q03' | 'Q04' | 'Q05';

export interface Product {
  id: string;
  /** SAMPLE name — swap for real TIPlife on-shelf product names. */
  name: string;
  positioning: L10n;
  isSample: boolean;
}

export interface Factsheet {
  productId: string;
  fileName: string;
  fileSize: string;
  entryAge: L10n;
  premiumTerm: L10n;
  coverage: L10n;
  guaranteedBenefit: L10n;
  taxDeduction: L10n;
  /** Provenance — factsheet fields are retrieved via API, not AI-generated. */
  retrievedNote: L10n;
  updatedAt: string;
}

export interface ComparisonRow {
  dimension: L10n;
  tip: L10n;
  competitor: L10n;
}

export type HouseholdRole = 'head' | 'member';

export interface FnaInput {
  age: number | null;
  monthlySalary: number | null;
  householdRole: HouseholdRole | null;
}

export type FnaField = keyof FnaInput;

export interface Recommendation {
  productGroup: L10n;
  product: Product;
  rationale: L10n[];
  input: FnaInput;
  disclaimer: L10n;
}

export interface KbAnswer {
  topic: string;
  title: L10n;
  steps: L10n[];
  channel: L10n;
  processingTime: L10n;
  disclaimer: L10n;
}

/** Structured assistant reply — the shape both surfaces render from. */
export type AssistantResponse =
  | { kind: 'products'; intro: L10n; products: Product[] }
  | { kind: 'factsheet'; product: Product; factsheet: Factsheet; disclaimer: L10n }
  | {
      kind: 'comparison';
      product: Product;
      competitorName: string;
      rows: ComparisonRow[];
      footnote: L10n;
    }
  | { kind: 'recommendation'; recommendation: Recommendation }
  | { kind: 'kb'; answer: KbAnswer };

/* ------------------------------------------------------------------ */
/* UI-level shared state                                               */
/* ------------------------------------------------------------------ */

/** Action a tappable chip / button dispatches into the shared state. */
export type ChipAction =
  | { type: 'step'; stepId: StepId; productId?: string }
  | { type: 'fna'; patch: Partial<FnaInput> };

export interface QuickReply {
  id: string;
  label: L10n;
  action: ChipAction;
}

export type ChatMessage =
  | { id: string; role: 'broker'; text: L10n }
  | { id: string; role: 'assistant'; kind: 'text'; text: L10n; quickReplies?: QuickReply[] }
  /** Flex bubble with buttons — the device-safe menu (quick replies are mobile-only). */
  | { id: string; role: 'assistant'; kind: 'menu'; text: L10n; items: QuickReply[] }
  | { id: string; role: 'assistant'; kind: 'response'; stepId: StepId; response: AssistantResponse };

export interface DemoStep {
  id: StepId;
  title: L10n;
  brokerQuery: L10n;
  /** Lowercase substrings (Thai + English) matched by the demo text router. */
  keywords: string[];
}
