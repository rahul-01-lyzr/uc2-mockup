'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import type {
  AssistantResponse,
  ChatMessage,
  ChipAction,
  DemoConfig,
  FnaField,
  FnaInput,
  L10n,
  QuickReply,
  StepId,
} from '@/lib/types';
import {
  getComparison,
  getFactsheet,
  getKbAnswer,
  getRetirementProducts,
  runFna,
} from '@/lib/assistantService';
import { DEMO_STEP_MAP, nextSuggestions, routeQuery } from '@/lib/demoScript';
import { CONVERSATION, t } from '@/lib/i18n';
import { DEFAULT_PRODUCT_ID, FACTSHEET_DISCLAIMER, FNA_DEMO_DEFAULTS, PRODUCTS } from '@/lib/mockData';
import EvalOverlay from '@/components/shared/EvalOverlay';
import ConfigModal from '@/components/shared/ConfigModal';
import DeviceFrame from '@/components/shared/DeviceFrame';
import ChatSurface from '@/components/chat/ChatSurface';
import LiffSurface from '@/components/liff/LiffSurface';

/** Omit that distributes over each member of a discriminated union. */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

/* ------------------------------------------------------------------ */
/* Demo config store — localStorage-backed so it survives reloads.     */
/* Exposed via useSyncExternalStore so hydration stays consistent.     */
/* ------------------------------------------------------------------ */

const CONFIG_STORAGE_KEY = 'tiplife-demo-config';
const DEFAULT_CONFIG: DemoConfig = { surface: 'oa', lang: 'th', screen: 'mobile' };

let cachedConfig: DemoConfig | null = null;
const configListeners = new Set<() => void>();

const subscribeConfig = (listener: () => void) => {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
};

const readConfig = (): DemoConfig => {
  if (cachedConfig) return cachedConfig;
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    cachedConfig = raw ? { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<DemoConfig>) } : DEFAULT_CONFIG;
  } catch {
    cachedConfig = DEFAULT_CONFIG;
  }
  return cachedConfig;
};

const writeConfig = (patch: Partial<DemoConfig>) => {
  cachedConfig = { ...readConfig(), ...patch };
  window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cachedConfig));
  configListeners.forEach((listener) => listener());
};

/* ------------------------------------------------------------------ */
/* FNA multi-turn script (the deliberate chat-surface friction)        */
/* ------------------------------------------------------------------ */

const EMPTY_FNA: FnaInput = { age: null, monthlySalary: null, householdRole: null };

const FNA_FIELD_ORDER: FnaField[] = ['age', 'monthlySalary', 'householdRole'];

const nextFnaField = (input: FnaInput): FnaField | null =>
  FNA_FIELD_ORDER.find((field) => input[field] === null) ?? null;

const FNA_QUESTIONS: Record<FnaField, { text: L10n; chips: { label: L10n; patch: Partial<FnaInput> }[] }> = {
  age: {
    text: CONVERSATION.askAge,
    chips: [
      {
        label: t(`${FNA_DEMO_DEFAULTS.age} ปี`, `${FNA_DEMO_DEFAULTS.age} years`),
        patch: { age: FNA_DEMO_DEFAULTS.age },
      },
    ],
  },
  monthlySalary: {
    text: CONVERSATION.askSalary,
    chips: [
      {
        label: t(
          `${FNA_DEMO_DEFAULTS.monthlySalary.toLocaleString('en-US')} บาท`,
          `THB ${FNA_DEMO_DEFAULTS.monthlySalary.toLocaleString('en-US')}`,
        ),
        patch: { monthlySalary: FNA_DEMO_DEFAULTS.monthlySalary },
      },
    ],
  },
  householdRole: {
    text: CONVERSATION.askRole,
    chips: [
      { label: t('หัวหน้าครอบครัว', 'Head of household'), patch: { householdRole: 'head' } },
      { label: t('สมาชิกครอบครัว', 'Family member'), patch: { householdRole: 'member' } },
    ],
  },
};

/**
 * Parse a typed FNA answer (quick replies don't display on LINE for PC,
 * so typed answers must work — in production this is the NLU slot filler).
 */
const parseFnaAnswer = (field: FnaField, text: string): Partial<FnaInput> | null => {
  if (field === 'householdRole') {
    if (/หัวหน้า|head/i.test(text)) return { householdRole: 'head' };
    if (/สมาชิก|member/i.test(text)) return { householdRole: 'member' };
    return null;
  }
  const num = Number((text.match(/[\d,]+/)?.[0] ?? '').replace(/,/g, ''));
  if (!Number.isFinite(num) || num <= 0) return null;
  if (field === 'age') return num >= 18 && num <= 70 ? { age: num } : null;
  return num >= 1000 ? { monthlySalary: num } : null;
};

const fnaPatchDisplay = (patch: Partial<FnaInput>): L10n => {
  if (patch.age != null) return t(`${patch.age} ปี`, `${patch.age} years`);
  if (patch.monthlySalary != null) {
    const amount = patch.monthlySalary.toLocaleString('en-US');
    return t(`${amount} บาท`, `THB ${amount}`);
  }
  return patch.householdRole === 'member'
    ? t('สมาชิกครอบครัว', 'Family member')
    : t('หัวหน้าครอบครัว', 'Head of household');
};

/** Broker query text for a step, adjusted for the product actually chosen. */
function brokerQueryFor(stepId: StepId, productId: string): L10n {
  const productName = PRODUCTS.find((p) => p.id === productId)?.name ?? '';
  if (stepId === 'Q02') return t(`ขอ factsheet ของ ${productName}`, `Factsheet for ${productName}, please`);
  if (stepId === 'Q03') return t(`เทียบกับคู่แข่งของ ${productName}`, `Compare ${productName} with the competitor`);
  return DEMO_STEP_MAP[stepId].brokerQuery;
}

/** Greeting as a Flex menu bubble — buttons work on mobile AND LINE for PC. */
const greetingMessage = (): ChatMessage => ({
  id: 'greeting',
  role: 'assistant',
  kind: 'menu',
  text: CONVERSATION.greeting,
  items: nextSuggestions(null),
});

export default function Home() {
  /* ---- demo config (surface / language / screen) ---- */
  const config = useSyncExternalStore(subscribeConfig, readConfig, () => DEFAULT_CONFIG);
  const { surface, lang, screen } = config;

  /* ---- shared assistant state (lifted here so it survives the toggle) ---- */
  const [conversation, setConversation] = useState<ChatMessage[]>(() => [greetingMessage()]);
  const [currentStep, setCurrentStep] = useState<StepId | null>(null);
  const [responses, setResponses] = useState<Partial<Record<StepId, AssistantResponse>>>({});
  const [selectedProductId, setSelectedProductId] = useState<string>(DEFAULT_PRODUCT_ID);
  const [fnaInput, setFnaInput] = useState<FnaInput>(EMPTY_FNA);
  const [fnaPromptedField, setFnaPromptedField] = useState<FnaField | null>(null);
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [evalEnabled, setEvalEnabled] = useState(false);
  const [evalDismissed, setEvalDismissed] = useState(false);

  const messageId = useRef(0);

  const append = useCallback((message: DistributiveOmit<ChatMessage, 'id'>) => {
    setConversation((prev) => [...prev, { ...message, id: `m${messageId.current++}` } as ChatMessage]);
  }, []);

  /* ---- FNA chat multi-turn ---- */
  const askFnaQuestion = (field: FnaField) => {
    const q = FNA_QUESTIONS[field];
    append({
      role: 'assistant',
      kind: 'text',
      text: q.text,
      quickReplies: q.chips.map((chip, i) => ({
        id: `fna-${field}-${i}`,
        label: chip.label,
        action: { type: 'fna', patch: chip.patch },
      })),
    });
    setFnaPromptedField(field);
  };

  const changeConfig = (patch: Partial<DemoConfig>) => {
    const previousSurface = readConfig().surface;
    writeConfig(patch);
    // Flipping back to chat mid-FNA: resume the multi-turn where the form left off.
    const next = patch.surface;
    if (
      next === 'oa' &&
      previousSurface !== 'oa' &&
      currentStep === 'Q04' &&
      !responses.Q04 &&
      !loading
    ) {
      const missing = nextFnaField(fnaInput);
      if (missing && fnaPromptedField !== missing) askFnaQuestion(missing);
    }
  };

  const completeFna = async (input: FnaInput) => {
    setLoading(true);
    try {
      const recommendation = await runFna(input);
      const response: AssistantResponse = { kind: 'recommendation', recommendation };
      setResponses((prev) => ({ ...prev, Q04: response }));
      append({ role: 'assistant', kind: 'response', stepId: 'Q04', response });
    } finally {
      setLoading(false);
    }
  };

  const applyFnaPatch = async (patch: Partial<FnaInput>, display?: L10n) => {
    append({ role: 'broker', text: display ?? fnaPatchDisplay(patch) });
    const updated: FnaInput = { ...fnaInput, ...patch };
    setFnaInput(updated);
    setFnaPromptedField(null);
    const missing = nextFnaField(updated);
    if (missing) askFnaQuestion(missing);
    else await completeFna(updated);
  };

  /** LIFF form submit — one shot, then recorded into the shared conversation. */
  const submitFnaForm = async (input: FnaInput) => {
    setFnaInput(input);
    setFnaPromptedField(null);
    const amount = input.monthlySalary?.toLocaleString('en-US') ?? '—';
    const roleTh = input.householdRole === 'member' ? 'สมาชิกครอบครัว' : 'หัวหน้าครอบครัว';
    const roleEn = input.householdRole === 'member' ? 'family member' : 'head of household';
    append({
      role: 'broker',
      text: t(
        `กรอกแบบฟอร์ม FNA (LIFF): อายุ ${input.age} • เงินเดือน ${amount} บาท • ${roleTh}`,
        `Submitted the FNA form (LIFF): age ${input.age} • salary THB ${amount} • ${roleEn}`,
      ),
    });
    await completeFna(input);
  };

  /* ---- step runner (single entry point for both surfaces) ---- */
  const fetchStepResponse = async (stepId: Exclude<StepId, 'Q04'>, productId: string): Promise<AssistantResponse> => {
    switch (stepId) {
      case 'Q01': {
        const products = await getRetirementProducts();
        return { kind: 'products', intro: CONVERSATION.productsIntro, products };
      }
      case 'Q02': {
        const { product, factsheet } = await getFactsheet(productId);
        return { kind: 'factsheet', product, factsheet, disclaimer: FACTSHEET_DISCLAIMER };
      }
      case 'Q03': {
        const comparison = await getComparison(productId);
        return { kind: 'comparison', ...comparison };
      }
      case 'Q05': {
        const answer = await getKbAnswer('tax-certificate');
        return { kind: 'kb', answer };
      }
    }
  };

  const runStep = async (stepId: StepId, options?: { productId?: string; viaText?: string }) => {
    if (loading) return;
    // Typed canned queries name TIP Pension 85 explicitly; chips/cards pass their own product.
    const productId = options?.productId ?? (options?.viaText ? DEFAULT_PRODUCT_ID : selectedProductId);
    if (options?.productId) setSelectedProductId(options.productId);

    append({
      role: 'broker',
      text: options?.viaText ? t(options.viaText, options.viaText) : brokerQueryFor(stepId, productId),
    });
    setCurrentStep(stepId);
    setEvalDismissed(false);

    if (stepId === 'Q04') {
      // Restart the FNA journey: chat collects turn by turn, LIFF shows the form.
      setFnaInput(EMPTY_FNA);
      setFnaPromptedField(null);
      setResponses((prev) => {
        const rest = { ...prev };
        delete rest.Q04;
        return rest;
      });
      if (readConfig().surface === 'oa') askFnaQuestion('age');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchStepResponse(stepId, productId);
      setResponses((prev) => ({ ...prev, [stepId]: response }));
      append({ role: 'assistant', kind: 'response', stepId, response });
    } catch {
      append({ role: 'assistant', kind: 'text', text: CONVERSATION.serviceError });
    } finally {
      setLoading(false);
    }
  };

  const handleChipAction = (action: ChipAction) => {
    if (action.type === 'step') void runStep(action.stepId, { productId: action.productId });
    else void applyFnaPatch(action.patch);
  };

  const handleSendText = (text: string) => {
    // Mid-FNA in chat: typed answers fill the pending slot.
    if (readConfig().surface === 'oa' && currentStep === 'Q04' && !responses.Q04) {
      const missing = nextFnaField(fnaInput);
      if (missing) {
        const patch = parseFnaAnswer(missing, text);
        if (patch) {
          void applyFnaPatch(patch, t(text, text));
        } else {
          append({ role: 'broker', text: t(text, text) });
          askFnaQuestion(missing);
        }
        return;
      }
    }
    // MOCK routing — swap routeQuery() for real NLU/LLM intent detection.
    const stepId = routeQuery(text);
    if (stepId) {
      void runStep(stepId, { viaText: text });
    } else {
      append({ role: 'broker', text: t(text, text) });
      // Fallback carries the menu as Flex buttons so "options below" is true on every device.
      append({ role: 'assistant', kind: 'menu', text: CONVERSATION.fallback, items: nextSuggestions(null) });
    }
  };

  const resetDemo = () => {
    setConversation([greetingMessage()]);
    setCurrentStep(null);
    setResponses({});
    setSelectedProductId(DEFAULT_PRODUCT_ID);
    setFnaInput(EMPTY_FNA);
    setFnaPromptedField(null);
    setLoading(false);
    setEvalDismissed(false);
  };

  /* ---- quick replies: latest message's chips, else flow suggestions ---- */
  const lastMessage = conversation[conversation.length - 1];
  const suggestions: QuickReply[] =
    lastMessage && lastMessage.role === 'assistant' && lastMessage.kind === 'text' && lastMessage.quickReplies
      ? lastMessage.quickReplies
      : lastMessage && lastMessage.role === 'assistant' && lastMessage.kind === 'menu'
        ? lastMessage.items
        : currentStep === 'Q04' && !responses.Q04
          ? []
          : nextSuggestions(currentStep);

  const evalStep = currentStep ? DEMO_STEP_MAP[currentStep] : null;
  const isFullscreen = screen === 'fullscreen';

  const gearButton = (
    <button
      type="button"
      onClick={() => setConfigOpen(true)}
      aria-label="Open demo settings"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-700"
    >
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="9" cy="9" r="2.5" />
        <path
          d="M9 1.8l.9 1.9 2.1-.4 1 1.9 2 .5-.3 2.1L16.2 9l-1.5 1.5.3 2.1-2 .5-1 1.9-2.1-.4-.9 1.6-.9-1.6-2.1.4-1-1.9-2-.5.3-2.1L1.8 9l1.5-1.7-.3-2.1 2-.5 1-1.9 2.1.4z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {!isFullscreen && (
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 pb-2 pt-5 sm:px-10">
          <div>
            <h1 className="text-base font-bold text-slate-800">TIPlife AI Sales Assistant</h1>
            <p className="text-[11px] text-slate-500">
              {surface === 'oa' ? 'LINE OA' : 'LINE LIFF'} · {screen === 'mobile' ? 'Mobile' : 'Desktop'} ·{' '}
              {lang === 'th' ? 'ไทย' : 'English'}
            </p>
          </div>
          {gearButton}
        </header>
      )}

      {!isFullscreen && evalEnabled && !evalDismissed && (
        <div className="px-6 pb-1 pt-2">
          <EvalOverlay step={evalStep} onDismiss={() => setEvalDismissed(true)} />
        </div>
      )}

      {/* Device frame */}
      <main
        className={
          isFullscreen ? 'fixed inset-0 z-40 flex' : 'flex flex-1 items-center justify-center px-4 py-5'
        }
      >
        <DeviceFrame screen={screen} surface={surface}>
          {surface === 'oa' ? (
            <ChatSurface
              lang={lang}
              conversation={conversation}
              loading={loading}
              suggestions={suggestions}
              showMobileOnlyControls={screen === 'mobile'}
              onAction={handleChipAction}
              onSendText={handleSendText}
              onOpenLiff={() => changeConfig({ surface: 'liff' })}
              onReset={resetDemo}
            />
          ) : (
            <LiffSurface
              lang={lang}
              conversation={conversation}
              currentStep={currentStep}
              responses={responses}
              loading={loading}
              fnaDraft={fnaInput}
              selectedProductId={selectedProductId}
              suggestions={suggestions}
              onAction={handleChipAction}
              onSendText={handleSendText}
              onSubmitFna={(input) => void submitFnaForm(input)}
              onSelectProduct={setSelectedProductId}
            />
          )}
        </DeviceFrame>
      </main>

      {isFullscreen && <div className="fixed right-4 top-4 z-40">{gearButton}</div>}

      {!isFullscreen && (
        <footer className="flex flex-wrap items-center justify-between gap-2 px-6 pb-4 sm:px-10">
          <p className="text-[10px] text-slate-400">Sample data — pending TIPlife on-shelf products.</p>
          {/* Dev controls */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEvalEnabled((on) => !on);
                setEvalDismissed(false);
              }}
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                evalEnabled
                  ? 'border-slate-700 bg-slate-800 text-white'
                  : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400'
              }`}
            >
              Eval overlay: {evalEnabled ? 'on' : 'off'}
            </button>
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 hover:border-slate-400"
            >
              Reset demo
            </button>
          </div>
        </footer>
      )}

      <ConfigModal open={configOpen} config={config} onChange={changeConfig} onClose={() => setConfigOpen(false)} />
    </div>
  );
}
