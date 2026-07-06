import type {
  ComparisonRow,
  Factsheet,
  FnaInput,
  KbAnswer,
  L10n,
  Product,
  Recommendation,
} from './types';
import { t } from './i18n';
import {
  COMPARISONS,
  COMPARISON_FOOTNOTE,
  COMPETITOR_NAME,
  FACTSHEETS,
  KB_ANSWERS,
  PRODUCTS,
  PRODUCT_GROUP_2,
  RECOMMENDATION_DISCLAIMER,
} from './mockData';

/**
 * Integration boundary for the AI Sales Assistant (UC2).
 *
 * Every function is async and returns exactly the shape the UI consumes,
 * so the mock bodies can be swapped for real GCP backend calls without
 * touching any component. See README for the SDS interface mapping.
 *
 * In production this module is called from BOTH surfaces the same way:
 * the Messaging API webhook handler (OA chat) and the LIFF web app hit the
 * same backend endpoints, authenticated to the same LINE userId.
 */

const MOCK_LATENCY_MS = 750;

const simulateNetwork = () =>
  new Promise<void>((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

function getProductOrThrow(productId: string): Product {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) throw new Error(`Unknown product: ${productId}`);
  return product;
}

// MOCK — replace with GCP backend call (read-only, backend-mediated per SDS).
// Real source: product catalogue service (on-shelf retirement products).
export async function getRetirementProducts(): Promise<Product[]> {
  await simulateNetwork();
  return PRODUCTS;
}

// MOCK — replace with GCP backend call (read-only, backend-mediated per SDS).
// Real source: product document store; factsheet fields are API-retrieved,
// never AI-generated.
export async function getFactsheet(
  productId: string,
): Promise<{ product: Product; factsheet: Factsheet }> {
  await simulateNetwork();
  const product = getProductOrThrow(productId);
  const factsheet = FACTSHEETS[productId];
  if (!factsheet) throw new Error(`No factsheet for product: ${productId}`);
  return { product, factsheet };
}

// MOCK — replace with GCP backend call (read-only, backend-mediated per SDS).
// Real source: AI Product Development KB (competitor data — pending BU approval).
export async function getComparison(productId: string): Promise<{
  product: Product;
  competitorName: string;
  rows: ComparisonRow[];
  footnote: L10n;
}> {
  await simulateNetwork();
  const product = getProductOrThrow(productId);
  const rows = COMPARISONS[productId];
  if (!rows) throw new Error(`No comparison data for product: ${productId}`);
  return { product, competitorName: COMPETITOR_NAME, rows, footnote: COMPARISON_FOOTNOTE };
}

// MOCK — replace with GCP backend call (read-only, backend-mediated per SDS).
// Demo classifier: working-age customer + household-protection need +
// tax-relief motive → Product Group 2 (Retirement & tax-deductible savings).
export async function runFna(input: FnaInput): Promise<Recommendation> {
  await simulateNetwork();
  const product = getProductOrThrow('tip-pension-85');
  const age = input.age ?? 34;
  const salary = (input.monthlySalary ?? 40000).toLocaleString('en-US');
  const isHead = input.householdRole !== 'member';
  return {
    productGroup: PRODUCT_GROUP_2,
    product,
    rationale: [
      t(
        `${isHead ? 'หัวหน้าครอบครัว' : 'สมาชิกครอบครัว'} — ต้องการความคุ้มครองรายได้ของครอบครัวควบคู่กับการออม (household-protection need)`,
        `${isHead ? 'Head of household' : 'Family member'} — needs family income protection alongside savings (household-protection need)`,
      ),
      t(
        `อายุ ${age} ปี — ระยะเวลาสะสมยาว เหมาะกับแบบบำนาญระยะยาว (long accumulation horizon)`,
        `Age ${age} — a long accumulation horizon suits a long-term annuity`,
      ),
      t(
        `รายได้ ${salary} บาท/เดือน — ฐานภาษีที่ได้ประโยชน์ชัดเจนจากค่าลดหย่อนเบี้ยบำนาญ (tax relief at this salary band)`,
        `Income THB ${salary}/month — a clear tax benefit from the pension premium deduction at this salary band`,
      ),
    ],
    input,
    disclaimer: RECOMMENDATION_DISCLAIMER,
  };
}

// MOCK — replace with GCP backend call (read-only, backend-mediated per SDS).
// Real source: after-service knowledge base (RAG over approved KB articles).
export async function getKbAnswer(topic: string): Promise<KbAnswer> {
  await simulateNetwork();
  const answer = KB_ANSWERS[topic];
  if (!answer) throw new Error(`No KB answer for topic: ${topic}`);
  return answer;
}
