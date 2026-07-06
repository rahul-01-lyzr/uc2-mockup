import { useEffect, useRef, useState } from 'react';
import type {
  AssistantResponse,
  ChatMessage,
  ChipAction,
  FnaInput,
  Lang,
  QuickReply,
  StepId,
} from '@/lib/types';
import { UI, pick } from '@/lib/i18n';
import ProductList from './ProductList';
import FactsheetViewer from './FactsheetViewer';
import ComparisonTable from './ComparisonTable';
import FnaForm from './FnaForm';
import RecommendationCard from './RecommendationCard';

interface LiffSurfaceProps {
  lang: Lang;
  conversation: ChatMessage[];
  currentStep: StepId | null;
  responses: Partial<Record<StepId, AssistantResponse>>;
  loading: boolean;
  fnaDraft: FnaInput;
  selectedProductId: string;
  suggestions: QuickReply[];
  onAction: (action: ChipAction) => void;
  onSendText: (text: string) => void;
  onSubmitFna: (input: FnaInput) => void;
  onSelectProduct: (productId: string) => void;
}

function LoadingRow({ lang }: { lang: Lang }) {
  return (
    <div className="flex items-center gap-2.5 py-2 text-slate-500">
      <svg width="18" height="18" viewBox="0 0 28 28" fill="none" className="animate-spin text-line" aria-hidden>
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
        <path d="M25 14A11 11 0 0014 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="text-[11px]">{pick(UI.liffLoading, lang)}</p>
    </div>
  );
}

/** Full-width web widget for each structured response kind. */
function ResponseWidget({
  response,
  lang,
  selectedProductId,
  onAction,
  onSelectProduct,
}: {
  response: AssistantResponse;
  lang: Lang;
  selectedProductId: string;
  onAction: (action: ChipAction) => void;
  onSelectProduct: (productId: string) => void;
}) {
  const runStep = (stepId: StepId, productId?: string) => onAction({ type: 'step', stepId, productId });
  switch (response.kind) {
    case 'products':
      return (
        <ProductList
          products={response.products}
          lang={lang}
          selectedProductId={selectedProductId}
          onSelect={onSelectProduct}
          onRunStep={runStep}
        />
      );
    case 'factsheet':
      return (
        <FactsheetViewer
          product={response.product}
          factsheet={response.factsheet}
          disclaimer={response.disclaimer}
          lang={lang}
        />
      );
    case 'comparison':
      return (
        <ComparisonTable
          product={response.product}
          competitorName={response.competitorName}
          rows={response.rows}
          footnote={response.footnote}
          lang={lang}
        />
      );
    case 'recommendation':
      return <RecommendationCard recommendation={response.recommendation} lang={lang} onRunStep={runStep} />;
    case 'kb': {
      const { answer } = response;
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <p className="text-[13px] font-bold text-slate-800">{pick(answer.title, lang)}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11.5px] leading-4.5 text-slate-700">
            {answer.steps.map((s) => (
              <li key={pick(s, 'en')}>{pick(s, lang)}</li>
            ))}
          </ol>
          <p className="mt-2 text-[11px] text-slate-600">
            <span className="font-semibold">{pick(UI.channelLabel, lang)}:</span> {pick(answer.channel, lang)}
          </p>
          <p className="text-[11px] text-slate-600">
            <span className="font-semibold">{pick(UI.processingLabel, lang)}:</span> {pick(answer.processingTime, lang)}
          </p>
          <p className="mt-2 border-t border-slate-100 pt-1.5 text-[9.5px] text-slate-400">{pick(answer.disclaimer, lang)}</p>
        </div>
      );
    }
  }
}

/**
 * LINE LIFF surface — the SAME conversation rendered as a web assistant.
 * Broker turns stay conversational; structured answers render as full-width
 * web widgets (lists, tables, forms, viewers) instead of chat bubbles.
 * In production this is a normal web app using the LIFF SDK (liff.init /
 * getProfile / sendMessages / closeWindow).
 */
export default function LiffSurface({
  lang,
  conversation,
  currentStep,
  responses,
  loading,
  fnaDraft,
  selectedProductId,
  suggestions,
  onAction,
  onSendText,
  onSubmitFna,
  onSelectProduct,
}: LiffSurfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation, loading, currentStep]);

  const fnaFormPending = currentStep === 'Q04' && !responses.Q04;

  const submitText = () => {
    const value = text.trim();
    if (!value || loading) return;
    onSendText(value);
    setText('');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-100">
      <div ref={scrollRef} className="slim-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[680px] space-y-3 p-3">
          {conversation.map((message) => {
            if (message.role === 'broker') {
              return (
                <div key={message.id} className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-line px-3.5 py-2 text-[12.5px] leading-4.5 text-white shadow-sm">
                    {pick(message.text, lang)}
                  </p>
                </div>
              );
            }
            if (message.kind === 'text') {
              return (
                <div key={message.id} className="flex">
                  <p className="max-w-[85%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3.5 py-2 text-[12.5px] leading-4.5 text-slate-700 shadow-sm">
                    {pick(message.text, lang)}
                  </p>
                </div>
              );
            }
            if (message.kind === 'menu') {
              return (
                <div key={message.id} className="flex">
                  <div className="max-w-[85%] overflow-hidden rounded-2xl rounded-tl-md border border-slate-200 bg-white shadow-sm">
                    <p className="px-3.5 py-2 text-[12.5px] leading-4.5 text-slate-700">{pick(message.text, lang)}</p>
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-3 py-2">
                      {message.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onAction(item.action)}
                          className="rounded-full border border-line/60 bg-white px-3 py-1 text-[12px] font-medium text-line-dark shadow-sm transition-colors hover:bg-emerald-50"
                        >
                          {pick(item.label, lang)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <ResponseWidget
                key={message.id}
                response={message.response}
                lang={lang}
                selectedProductId={selectedProductId}
                onAction={onAction}
                onSelectProduct={onSelectProduct}
              />
            );
          })}

          {fnaFormPending && !loading && (
            <FnaForm initial={fnaDraft} lang={lang} submitting={loading} onSubmit={onSubmitFna} />
          )}
          {loading && <LoadingRow lang={lang} />}
        </div>
      </div>

      {/* conversational input — same journey, web-style controls */}
      <div className="shrink-0 border-t border-slate-200 bg-white">
        {!loading && suggestions.length > 0 && (
          <div className="slim-scroll mx-auto flex w-full max-w-[680px] gap-1.5 overflow-x-auto px-3 py-1.5">
            {suggestions.map((reply) => (
              <button
                key={reply.id}
                type="button"
                onClick={() => onAction(reply.action)}
                className="shrink-0 rounded-full border border-line/60 bg-white px-3 py-1 text-[12px] font-medium text-line-dark shadow-sm transition-colors hover:bg-emerald-50"
              >
                {pick(reply.label, lang)}
              </button>
            ))}
          </div>
        )}
        <div className="mx-auto flex w-full max-w-[680px] items-center gap-2 px-3 py-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitText();
            }}
            placeholder={pick(UI.inputPlaceholder, lang)}
            className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-line focus:ring-1 focus:ring-line"
          />
          <button
            type="button"
            onClick={submitText}
            disabled={loading || text.trim().length === 0}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-line text-white transition-opacity disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M1 7L13 1 9.5 7 13 13 1 7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
