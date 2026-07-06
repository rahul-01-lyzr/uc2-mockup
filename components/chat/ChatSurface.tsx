import { useEffect, useRef, useState } from 'react';
import type {
  AssistantResponse,
  ChatMessage,
  ChipAction,
  KbAnswer,
  Lang,
  Product,
  QuickReply,
  Recommendation,
} from '@/lib/types';
import { UI, fmt, pick } from '@/lib/i18n';
import SampleTag from '@/components/shared/SampleTag';
import MessageBubble from './MessageBubble';
import FlexCarousel from './FlexCarousel';
import QuickReplies from './QuickReplies';
import RichMenu from './RichMenu';
import ChatInputBar from './ChatInputBar';

interface ChatSurfaceProps {
  lang: Lang;
  conversation: ChatMessage[];
  loading: boolean;
  /** Quick replies shown above the input (from the latest message or flow suggestions). */
  suggestions: QuickReply[];
  /** Quick replies and rich menus display on LINE for iOS/Android only — not LINE for PC. */
  showMobileOnlyControls: boolean;
  onAction: (action: ChipAction) => void;
  onSendText: (text: string) => void;
  /** Simulates tapping a LIFF URI action inside chat — flips to the web-view surface. */
  onOpenLiff: () => void;
  onReset: () => void;
}

/* ------------------------------------------------------------------ */
/* Flex-message renderers (per response kind)                          */
/* In production each of these is a Flex Message JSON payload sent via */
/* the Messaging API reply/push endpoints.                             */
/* ------------------------------------------------------------------ */

function ProductFlexCard({
  product,
  lang,
  onAction,
}: {
  product: Product;
  lang: Lang;
  onAction: (action: ChipAction) => void;
}) {
  return (
    <div className="w-[200px] shrink-0 snap-start overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex h-14 items-center justify-center bg-gradient-to-br from-line to-emerald-700 text-[13px] font-bold tracking-wide text-white">
        {product.name.replace('TIP ', '')}
      </div>
      <div className="px-3 py-2">
        <p className="text-[12px] font-semibold leading-4 text-slate-800">
          {product.name}
          {product.isSample && <SampleTag />}
        </p>
        <p className="mt-1 line-clamp-3 text-[11px] leading-4 text-slate-600">{pick(product.positioning, lang)}</p>
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-slate-100">
        <button
          type="button"
          onClick={() => onAction({ type: 'step', stepId: 'Q02', productId: product.id })}
          className="py-2 text-[11px] font-semibold text-line-dark hover:bg-emerald-50"
        >
          {pick(UI.factsheetButton, lang)}
        </button>
        <button
          type="button"
          onClick={() => onAction({ type: 'step', stepId: 'Q03', productId: product.id })}
          className="border-l border-slate-100 py-2 text-[11px] font-semibold text-line-dark hover:bg-emerald-50"
        >
          {pick(UI.compareButton, lang)}
        </button>
      </div>
    </div>
  );
}

function ProductsView({
  response,
  lang,
  onAction,
}: {
  response: Extract<AssistantResponse, { kind: 'products' }>;
  lang: Lang;
  onAction: (action: ChipAction) => void;
}) {
  return (
    <div className="space-y-1.5">
      <MessageBubble role="assistant" lang={lang}>
        {pick(response.intro, lang)}
      </MessageBubble>
      <MessageBubble role="assistant" lang={lang} variant="flex">
        <FlexCarousel>
          {response.products.map((p) => (
            <ProductFlexCard key={p.id} product={p} lang={lang} onAction={onAction} />
          ))}
        </FlexCarousel>
      </MessageBubble>
    </div>
  );
}

function FactsheetView({
  response,
  lang,
  onOpenLiff,
}: {
  response: Extract<AssistantResponse, { kind: 'factsheet' }>;
  lang: Lang;
  onOpenLiff: () => void;
}) {
  const { product, factsheet, disclaimer } = response;
  const rows = [
    { label: factsheet.entryAge, key: 'entryAge' },
    { label: factsheet.premiumTerm, key: 'premiumTerm' },
    { label: factsheet.guaranteedBenefit, key: 'guaranteedBenefit' },
    { label: factsheet.taxDeduction, key: 'taxDeduction' },
  ];
  return (
    <MessageBubble role="assistant" lang={lang} variant="flex">
      <div className="max-w-[min(85%,26rem)] space-y-1.5">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5">
            <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-red-600 text-[8px] font-bold text-white">
              PDF
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-slate-800">{factsheet.fileName}</p>
              <p className="text-[10px] text-slate-500">
                {factsheet.fileSize} • {pick(factsheet.retrievedNote, lang)}
              </p>
            </div>
          </div>
          <div className="space-y-1 px-3 py-2 text-[11px] leading-4 text-slate-700">
            <p className="font-semibold text-slate-800">
              {product.name}
              {product.isSample && <SampleTag />}
            </p>
            {rows.map((row) => (
              <p key={row.key}>{pick(row.label, lang)}</p>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenLiff}
            className="w-full border-t border-slate-100 py-2 text-[11px] font-semibold text-line-dark hover:bg-emerald-50"
          >
            {pick(UI.openFactsheetLiff, lang)}
          </button>
          {/* disclaimer lives inside the bubble — chat has no free-floating text */}
          <p className="border-t border-slate-100 px-3 py-1.5 text-[8.5px] leading-3 text-slate-400">
            {pick(disclaimer, lang)}
          </p>
        </div>
      </div>
    </MessageBubble>
  );
}

function ComparisonView({
  response,
  lang,
  onOpenLiff,
}: {
  response: Extract<AssistantResponse, { kind: 'comparison' }>;
  lang: Lang;
  onOpenLiff: () => void;
}) {
  const { product, competitorName, rows, footnote } = response;
  const columns = [
    { title: product.name, values: rows.map((r) => ({ label: r.dimension, value: r.tip })) },
    { title: competitorName, values: rows.map((r) => ({ label: r.dimension, value: r.competitor })) },
  ];
  return (
    <div className="space-y-1.5">
      <MessageBubble role="assistant" lang={lang}>
        {fmt(pick(UI.comparisonIntro, lang), { a: product.name, b: competitorName })}
      </MessageBubble>
      <MessageBubble role="assistant" lang={lang} variant="flex">
        <div className="space-y-1.5">
          {/* Intentionally cramped: one Flex bubble per company, rows drift out
              of alignment across bubbles — the honest chat-surface limitation. */}
          <FlexCarousel>
            {columns.map((col) => (
              <div key={col.title} className="w-[190px] shrink-0 snap-start overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-white">
                  {col.title}
                  <SampleTag />
                </div>
                <div className="divide-y divide-slate-100">
                  {col.values.map((v) => (
                    <div key={pick(v.label, 'en')} className="px-3 py-1.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        {pick(v.label, lang)}
                      </p>
                      <p className="text-[11px] leading-4 text-slate-700">{pick(v.value, lang)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </FlexCarousel>
          {/* Closing bubble: footnote in the body + URI action to the LIFF app */}
          <div className="w-[240px] overflow-hidden rounded-xl bg-white shadow-sm">
            <p className="px-3 py-2 text-[8.5px] leading-3 text-slate-400">{pick(footnote, lang)}</p>
            <button
              type="button"
              onClick={onOpenLiff}
              className="w-full border-t border-slate-100 py-2 text-center text-[11px] font-semibold text-line-dark hover:bg-emerald-50"
            >
              {pick(UI.openLiffTable, lang)}
            </button>
          </div>
        </div>
      </MessageBubble>
    </div>
  );
}

function RecommendationChatView({
  recommendation,
  lang,
  onOpenLiff,
}: {
  recommendation: Recommendation;
  lang: Lang;
  onOpenLiff: () => void;
}) {
  return (
    <div className="space-y-1.5">
      {/* Everything squeezed into one dense bubble — the honest chat-surface
          rendering of a structured recommendation. */}
      <MessageBubble role="assistant" lang={lang}>
        <div className="space-y-1 text-[11px] leading-4">
          <p className="font-bold">{pick(recommendation.productGroup, lang)}</p>
          <p>
            {pick(UI.recommendLabel, lang)} <span className="font-bold">{recommendation.product.name}</span>
            {recommendation.product.isSample && <SampleTag />}
          </p>
          <ul className="list-disc space-y-0.5 pl-4 text-slate-700">
            {recommendation.rationale.map((r) => (
              <li key={pick(r, 'en')}>{pick(r, lang)}</li>
            ))}
          </ul>
          <p className="pt-0.5 text-[9px] leading-3 text-slate-400">{pick(recommendation.disclaimer, lang)}</p>
          <button type="button" onClick={onOpenLiff} className="text-[10px] font-semibold text-line-dark underline">
            {pick(UI.openLiffDetails, lang)}
          </button>
        </div>
      </MessageBubble>
    </div>
  );
}

function KbView({ answer, lang }: { answer: KbAnswer; lang: Lang }) {
  return (
    <MessageBubble role="assistant" lang={lang}>
      <div className="space-y-1.5 text-[12px] leading-5">
        <p className="font-bold">{pick(answer.title, lang)}</p>
        <ol className="list-decimal space-y-1 pl-4 text-slate-700">
          {answer.steps.map((s) => (
            <li key={pick(s, 'en')}>{pick(s, lang)}</li>
          ))}
        </ol>
        <p className="text-[11px] text-slate-600">
          <span className="font-semibold">{pick(UI.channelLabel, lang)}:</span> {pick(answer.channel, lang)}
        </p>
        <p className="text-[11px] text-slate-600">
          <span className="font-semibold">{pick(UI.processingLabel, lang)}:</span> {pick(answer.processingTime, lang)}
        </p>
        <p className="border-t border-slate-100 pt-1 text-[9px] leading-3 text-slate-400">
          {pick(answer.disclaimer, lang)}
        </p>
      </div>
    </MessageBubble>
  );
}

function ResponseView({
  response,
  lang,
  onAction,
  onOpenLiff,
}: {
  response: AssistantResponse;
  lang: Lang;
  onAction: (action: ChipAction) => void;
  onOpenLiff: () => void;
}) {
  switch (response.kind) {
    case 'products':
      return <ProductsView response={response} lang={lang} onAction={onAction} />;
    case 'factsheet':
      return <FactsheetView response={response} lang={lang} onOpenLiff={onOpenLiff} />;
    case 'comparison':
      return <ComparisonView response={response} lang={lang} onOpenLiff={onOpenLiff} />;
    case 'recommendation':
      return <RecommendationChatView recommendation={response.recommendation} lang={lang} onOpenLiff={onOpenLiff} />;
    case 'kb':
      return <KbView answer={response.answer} lang={lang} />;
  }
}

function TypingIndicator({ lang }: { lang: Lang }) {
  return (
    <MessageBubble role="assistant" lang={lang}>
      <span className="flex items-center gap-1 py-0.5" aria-label="Assistant is responding">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
      </span>
    </MessageBubble>
  );
}

/* ------------------------------------------------------------------ */
/* Surface                                                             */
/* ------------------------------------------------------------------ */

/** LINE OA chat surface — renders the shared conversation as Messaging-API-style UI. */
export default function ChatSurface({
  lang,
  conversation,
  loading,
  suggestions,
  showMobileOnlyControls,
  onAction,
  onSendText,
  onOpenLiff,
  onReset,
}: ChatSurfaceProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation, loading]);

  const handleAction = (action: ChipAction) => {
    setMenuOpen(false);
    onAction(action);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-chatbg">
      <div ref={scrollRef} className="slim-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto py-3">
        {conversation.map((message) => {
          if (message.role === 'broker') {
            return (
              <MessageBubble key={message.id} role="broker" lang={lang}>
                {pick(message.text, lang)}
              </MessageBubble>
            );
          }
          if (message.kind === 'text') {
            return (
              <MessageBubble key={message.id} role="assistant" lang={lang}>
                {pick(message.text, lang)}
              </MessageBubble>
            );
          }
          if (message.kind === 'menu') {
            // Flex bubble: body text + button footer — works on mobile and LINE for PC.
            return (
              <MessageBubble key={message.id} role="assistant" lang={lang} variant="flex">
                <div className="max-w-[min(85%,17rem)] overflow-hidden rounded-2xl rounded-tl-md bg-white shadow-sm">
                  <p className="px-3 py-2 text-[13px] leading-5 text-slate-800">{pick(message.text, lang)}</p>
                  <div className="divide-y divide-slate-100 border-t border-slate-100">
                    {message.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAction(item.action)}
                        className="block w-full py-2 text-center text-[12px] font-semibold text-line-dark hover:bg-emerald-50"
                      >
                        {pick(item.label, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              </MessageBubble>
            );
          }
          return (
            <ResponseView
              key={message.id}
              response={message.response}
              lang={lang}
              onAction={handleAction}
              onOpenLiff={onOpenLiff}
            />
          );
        })}
        {loading && <TypingIndicator lang={lang} />}
      </div>

      <div className="shrink-0 bg-white/95">
        {!loading && showMobileOnlyControls && (
          <QuickReplies replies={suggestions} lang={lang} disabled={loading} onAction={handleAction} />
        )}
        <ChatInputBar
          placeholder={pick(UI.inputPlaceholder, lang)}
          disabled={loading}
          showMenuButton={showMobileOnlyControls}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onSend={(text) => {
            setMenuOpen(false);
            onSendText(text);
          }}
        />
        {menuOpen && showMobileOnlyControls && <RichMenu lang={lang} onAction={handleAction} onReset={onReset} />}
      </div>
    </div>
  );
}
