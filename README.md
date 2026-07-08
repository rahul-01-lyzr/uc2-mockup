# TIPlife AI Sales Assistant (UC2) — LINE OA / LIFF Mockup

Broker-facing mockup of the AI Sales Assistant rendered on **one LINE channel, two
surfaces**: LINE OA (Messaging API chat) and LINE LIFF (web view launched from the same
OA). The flow is fully conversational on both surfaces — the broker asks, the assistant
answers with structured content. Conversation and journey state (history, current step,
selected product, FNA input) are lifted into `app/page.tsx` and survive every switch.

All demo controls live in the **gear button** settings modal:

| Setting | Options | What it changes |
| --- | --- | --- |
| Screen | Mobile / Desktop / Full screen | LINE app phone frame ↔ LINE for PC window ↔ window filling the viewport (for presenting) |
| Language | ไทย / English | Broker queries + all assistant content (whole transcript re-renders) |
| Surface | LINE OA / LINE LIFF | Chat rendering ↔ web-app rendering of the same conversation |

Settings persist in `localStorage` (`tiplife-demo-config`).

## How to run

```bash
pnpm install   # or npm install
pnpm dev       # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Advance the demo with quick-reply chips, the rich menu (grid icon — mobile only, as in
real LINE), or by typing one of the 5 canned broker queries in Thai or English
(routing in `lib/demoScript.ts`).

## Is this buildable for real? Yes — the mapping

Every UI element corresponds to a documented LINE capability:

**LINE OA chat surface → [Messaging API](https://developers.line.biz/en/docs/messaging-api/)**

| Demo element | Real mechanism | Documented limit |
| --- | --- | --- |
| Product / comparison carousels | Flex Message `carousel` container | max 12 bubbles |
| Chips above the input | Quick reply buttons | max 13 items, labels ≤ 20 chars, **LINE mobile only** |
| Grid menu over the keyboard | Rich menu (image + tap areas via API) | mobile app only |
| Typed FNA answers | Webhook text + slot filling (NLU in production) | how desktop users answer, since chips don't show there |
| Typing dots | Loading animation endpoint | 5–60 s per call |
| "Open in LIFF" buttons | URI action → `https://liff.line.me/{liffId}` | — |
| Broker text in / answers out | Webhook `message` events + Reply/Push API | replyToken single-use |

**LINE LIFF surface → [LIFF v2](https://developers.line.biz/en/docs/liff/)**

The LIFF surface is a plain web app — this same Next.js app can be registered as the
LIFF app and served as-is. Forms, aligned tables, PDF viewers: anything web works.
Relevant SDK calls: `liff.init()`, `liff.getProfile()` / ID token (identify the broker),
`liff.sendMessages()` (post back into the chat when opened from it),
`liff.closeWindow()` (return to chat). LIFF opens on mobile (in-app), LINE for PC
(separate window), and external browsers via LINE Login.

**Shared state** — the webhook (chat) and the LIFF ID token resolve to the same LINE
`userId`, so both surfaces read/write one backend session.

**Demo-only conveniences (disclose to the client — not real chat behavior):**

1. The instant surface toggle — in production a chat button opens the LIFF window
   (URI action) and `liff.closeWindow()` returns to chat.
2. Language switch re-rendering **past** chat bubbles — sent LINE messages are
   immutable; in production the language preference applies to new messages only
   (the LIFF web view can re-render freely).
3. Reset clearing the visible chat history — bots cannot delete chat; in production
   a reset clears the backend session context only.

Production notes for thousands of users: the Messaging API is push-quota billed
(count pushes per month), reply messages are free, webhook handling should be
idempotent and queued, and the LIFF app is stateless web hosting behind the same
backend — standard horizontal scaling.

## Where things live

| Path | Purpose |
| --- | --- |
| `lib/types.ts` | Domain + UI state types (`Surface`, `Lang`, `ScreenMode`, `AssistantResponse`, …) |
| `lib/i18n.ts` | Bilingual string helpers (`t`, `pick`) + UI strings |
| `lib/mockData.ts` | **All placeholder content** (Thai + English) — swap for real on-shelf data here |
| `lib/assistantService.ts` | The integration boundary — async functions shaped like real API calls |
| `lib/demoScript.ts` | Q01–Q05 script, bilingual keyword router (`routeQuery`), verdicts |
| `components/chat/*` | LINE OA surface (bubbles, flex carousels, quick replies, rich menu) |
| `components/liff/*` | LINE LIFF surface (conversational web app with rich widgets) |
| `components/shared/*` | Device frames, LINE headers, settings modal |
| `app/page.tsx` | Shared assistant state + config store + surface switching |

## Replacing mocks with the GCP backend

Every function in `lib/assistantService.ts` is marked
`MOCK — replace with GCP backend call (read-only, backend-mediated per SDS)`.
Replace the body, keep the signature — no component changes needed.

| Function | Demo step | Real backing (target) | SDS interface |
| --- | --- | --- | --- |
| `getRetirementProducts()` | Q01 | Product catalogue (on-shelf retirement) | Internal product API — none of IF-01…IF-06 needed |
| `getFactsheet(productId)` | Q02 | Product document store (API-retrieved, not AI-generated) | Internal product API |
| `getComparison(productId)` | Q03 | AI Product Development KB (competitor data — pending BU approval) | Internal KB |
| `runFna(input)` | Q04 | FNA classification service → product group + recommendation | Internal; a real quote would then go through **IF-02 Quotation** |
| `getKbAnswer(topic)` | Q05 | After-service knowledge base (RAG over approved articles) | Internal KB |

None of this demo's 5 steps require the external SDS interfaces, but the pattern is the
same when they do: **IF-01 Customer/Policy** (customer & policy lookup), **IF-02
Quotation**, **IF-03 PDPA** (consent), **IF-04 AML/BL/MIB** (screening), **IF-06
Salesforce** (lead/opportunity write-back) would each get an `assistantService.ts`
function with a typed request/response, called from the same UI.

Free-text routing is also mocked: `routeQuery()` in `lib/demoScript.ts` keyword-matches
the 5 canned queries (Thai + English). Swap it for real NLU/LLM intent routing — the
contract stays `(text) => StepId | null`.

> All product names, premiums, benefits and competitor figures are **samples** (tagged
> "sample" in the UI) pending TIPlife on-shelf data.

---

Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
(Next.js App Router + TypeScript + Tailwind CSS v4).
