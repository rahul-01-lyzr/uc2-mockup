import type { ComparisonRow, Factsheet, KbAnswer, L10n, Product } from './types';
import { t } from './i18n';

/**
 * ALL CONTENT IN THIS FILE IS SAMPLE / PLACEHOLDER DATA.
 * Product names, premiums, benefits and competitor figures are invented for
 * the demo and must be replaced with TIPlife on-shelf data before any
 * client-facing use. Every product carries `isSample: true`, which renders
 * a visible "SAMPLE" tag in both surfaces.
 */

export const COMPETITOR_NAME = 'Competitor A';

export const PRODUCTS: Product[] = [
  {
    id: 'tip-retire-9060',
    name: 'TIP Retire 90/60',
    positioning: t(
      'จ่ายเบี้ยสั้นถึงอายุ 60 รับบำนาญยาวถึงอายุ 90 เหมาะกับผู้ต้องการกระแสเงินสดหลังเกษียณระยะยาว',
      'Short pay-to-60, annuity payout to age 90 — for long post-retirement income.',
    ),
    isSample: true,
  },
  {
    id: 'tip-pension-85',
    name: 'TIP Pension 85',
    positioning: t(
      'บำนาญการันตีถึงอายุ 85 พร้อมสิทธิลดหย่อนภาษีเต็มเกณฑ์ จุดขายหลักสำหรับกลุ่มมนุษย์เงินเดือน',
      'Guaranteed annuity to 85 with full pension tax deductibility — the salaried-segment flagship.',
    ),
    isSample: true,
  },
  {
    id: 'tip-secure-retirement',
    name: 'TIP Secure Retirement',
    positioning: t(
      'เน้นเงินก้อนคืน ณ วันเกษียณ ควบคู่ความคุ้มครองชีวิตระหว่างทาง เหมาะกับผู้เริ่มวางแผนช้า',
      'Lump-sum at retirement plus life protection en route — for late starters.',
    ),
    isSample: true,
  },
];

export const DEFAULT_PRODUCT_ID = 'tip-pension-85';

export const FACTSHEETS: Record<string, Factsheet> = {
  'tip-retire-9060': {
    productId: 'tip-retire-9060',
    fileName: 'TIP_Retire_90-60_Factsheet.pdf',
    fileSize: '1.1 MB',
    entryAge: t('20 – 50 ปี', '20 – 50 years'),
    premiumTerm: t('ชำระเบี้ยถึงอายุ 60', 'Pay to age 60'),
    coverage: t(
      'ความคุ้มครองชีวิต 110% ของเบี้ยสะสม ก่อนเริ่มรับบำนาญ',
      'Life cover of 110% of premiums paid, before the annuity starts',
    ),
    guaranteedBenefit: t(
      'บำนาญปีละ 12% ของทุนประกัน การันตีตั้งแต่อายุ 60 – 90',
      'Guaranteed annuity of 12% of sum assured per year, age 60 – 90',
    ),
    taxDeduction: t(
      'ลดหย่อนได้ตามเกณฑ์เบี้ยบำนาญ สูงสุด 200,000 บาท (รวมเกณฑ์ปกติ 100,000 บาท)',
      'Deductible under the pension rule up to THB 200,000 (plus THB 100,000 standard rule)',
    ),
    retrievedNote: t('ดึงข้อมูลผ่าน product API — ไม่ได้สร้างโดย AI', 'Retrieved via product API — not AI-generated'),
    updatedAt: '2026-06-01 (sample)',
  },
  'tip-pension-85': {
    productId: 'tip-pension-85',
    fileName: 'TIP_Pension_85_Factsheet.pdf',
    fileSize: '1.2 MB',
    entryAge: t('20 – 55 ปี', '20 – 55 years'),
    premiumTerm: t('ชำระเบี้ยถึงอายุ 60', 'Pay to age 60'),
    coverage: t(
      'ความคุ้มครองชีวิต 105% ของเบี้ยสะสม ก่อนเริ่มรับบำนาญ',
      'Life cover of 105% of premiums paid, before the annuity starts',
    ),
    guaranteedBenefit: t(
      'บำนาญปีละ 15% ของทุนประกัน การันตีตั้งแต่อายุ 60 – 85',
      'Guaranteed annuity of 15% of sum assured per year, age 60 – 85',
    ),
    taxDeduction: t(
      'ลดหย่อนได้สูงสุด 100,000 บาท และเบี้ยบำนาญเพิ่มอีกไม่เกิน 200,000 บาท ตามเกณฑ์สรรพากร',
      'Deductible up to THB 100,000, plus up to THB 200,000 under the Revenue Department pension rule',
    ),
    retrievedNote: t('ดึงข้อมูลผ่าน product API — ไม่ได้สร้างโดย AI', 'Retrieved via product API — not AI-generated'),
    updatedAt: '2026-06-15 (sample)',
  },
  'tip-secure-retirement': {
    productId: 'tip-secure-retirement',
    fileName: 'TIP_Secure_Retirement_Factsheet.pdf',
    fileSize: '0.9 MB',
    entryAge: t('25 – 58 ปี', '25 – 58 years'),
    premiumTerm: t('ชำระเบี้ย 10 ปี', '10-year premium term'),
    coverage: t('ความคุ้มครองชีวิต 100% ของทุนประกัน ตลอดสัญญา', 'Life cover of 100% of sum assured for the full term'),
    guaranteedBenefit: t(
      'เงินก้อนคืน 150% ของทุนประกัน ณ อายุ 60',
      'Guaranteed lump sum of 150% of sum assured at age 60',
    ),
    taxDeduction: t(
      'ลดหย่อนได้ตามเกณฑ์เบี้ยประกันชีวิตปกติ สูงสุด 100,000 บาท',
      'Deductible under the standard life premium rule, up to THB 100,000',
    ),
    retrievedNote: t('ดึงข้อมูลผ่าน product API — ไม่ได้สร้างโดย AI', 'Retrieved via product API — not AI-generated'),
    updatedAt: '2026-05-20 (sample)',
  },
};

/** Comparison vs Competitor A — keyed by TIP product id. SAMPLE figures. */
export const COMPARISONS: Record<string, ComparisonRow[]> = {
  'tip-pension-85': [
    {
      dimension: t('เบี้ยประกัน', 'Premium'),
      tip: t('24,000 บาท/ปี (อายุ 34, ทุน 200,000)', 'THB 24,000/yr (age 34, SA 200,000)'),
      competitor: t('26,500 บาท/ปี (เงื่อนไขเดียวกัน)', 'THB 26,500/yr (same basis)'),
    },
    {
      dimension: t('ความคุ้มครอง', 'Coverage'),
      tip: t('105% ของเบี้ยสะสม ก่อนเริ่มรับบำนาญ', '105% of premiums paid, pre-annuity'),
      competitor: t('100% ของทุนประกัน ก่อนเริ่มรับบำนาญ', '100% of sum assured, pre-annuity'),
    },
    {
      dimension: t('ผลตอบแทนการันตี', 'Guaranteed return'),
      tip: t('บำนาญ 15%/ปี ของทุนประกัน อายุ 60 – 85 (การันตีทั้งหมด)', 'Annuity 15%/yr of SA, age 60 – 85 (fully guaranteed)'),
      competitor: t('บำนาญ 12%/ปี อายุ 60 – 85 + เงินปันผลแบบไม่การันตี', 'Annuity 12%/yr, age 60 – 85 + non-guaranteed dividend'),
    },
    {
      dimension: t('สิทธิลดหย่อนภาษี', 'Tax benefit'),
      tip: t('สูงสุด 300,000 บาท (รวมเกณฑ์เบี้ยบำนาญ)', 'Up to THB 300,000 (incl. pension rule)'),
      competitor: t('สูงสุด 300,000 บาท (รวมเกณฑ์เบี้ยบำนาญ)', 'Up to THB 300,000 (incl. pension rule)'),
    },
    {
      dimension: t('จุดเด่น', 'Pros'),
      tip: t(
        'การันตีเต็มจำนวน • เบี้ยต่ำกว่า • บริการหลังการขายผ่าน LINE OA',
        'Fully guaranteed • lower premium • after-sales service via LINE OA',
      ),
      competitor: t('มีโอกาสรับปันผลเพิ่มหากพอร์ตลงทุนทำผลงานดี', 'Upside from dividends if the portfolio performs'),
    },
    {
      dimension: t('ข้อจำกัด', 'Cons'),
      tip: t('ไม่มีส่วนร่วมเงินปันผล', 'No dividend participation'),
      competitor: t('ผลตอบแทนส่วนหนึ่งไม่การันตี • เบี้ยสูงกว่า', 'Part of the return is not guaranteed • higher premium'),
    },
  ],
  'tip-retire-9060': [
    {
      dimension: t('เบี้ยประกัน', 'Premium'),
      tip: t('27,800 บาท/ปี (อายุ 34, ทุน 200,000)', 'THB 27,800/yr (age 34, SA 200,000)'),
      competitor: t('26,500 บาท/ปี (แบบใกล้เคียง)', 'THB 26,500/yr (closest plan)'),
    },
    {
      dimension: t('ความคุ้มครอง', 'Coverage'),
      tip: t('110% ของเบี้ยสะสม ก่อนเริ่มรับบำนาญ', '110% of premiums paid, pre-annuity'),
      competitor: t('100% ของทุนประกัน ก่อนเริ่มรับบำนาญ', '100% of sum assured, pre-annuity'),
    },
    {
      dimension: t('ผลตอบแทนการันตี', 'Guaranteed return'),
      tip: t('บำนาญ 12%/ปี อายุ 60 – 90 (การันตีทั้งหมด)', 'Annuity 12%/yr, age 60 – 90 (fully guaranteed)'),
      competitor: t('บำนาญ 12%/ปี อายุ 60 – 85 + ปันผลไม่การันตี', 'Annuity 12%/yr, age 60 – 85 + non-guaranteed dividend'),
    },
    {
      dimension: t('สิทธิลดหย่อนภาษี', 'Tax benefit'),
      tip: t('สูงสุด 300,000 บาท (รวมเกณฑ์เบี้ยบำนาญ)', 'Up to THB 300,000 (incl. pension rule)'),
      competitor: t('สูงสุด 300,000 บาท (รวมเกณฑ์เบี้ยบำนาญ)', 'Up to THB 300,000 (incl. pension rule)'),
    },
    {
      dimension: t('จุดเด่น', 'Pros'),
      tip: t('รับบำนาญยาวถึงอายุ 90 • การันตีเต็มจำนวน', 'Payout to age 90 • fully guaranteed'),
      competitor: t('มีโอกาสรับปันผลเพิ่ม', 'Dividend upside'),
    },
    {
      dimension: t('ข้อจำกัด', 'Cons'),
      tip: t('เบี้ยสูงกว่าเล็กน้อย • ไม่มีส่วนร่วมปันผล', 'Slightly higher premium • no dividends'),
      competitor: t('จ่ายบำนาญสั้นกว่า • ผลตอบแทนไม่การันตีบางส่วน', 'Shorter payout • partly non-guaranteed'),
    },
  ],
  'tip-secure-retirement': [
    {
      dimension: t('เบี้ยประกัน', 'Premium'),
      tip: t('32,000 บาท/ปี (ชำระ 10 ปี, ทุน 200,000)', 'THB 32,000/yr (10-year pay, SA 200,000)'),
      competitor: t('26,500 บาท/ปี (ชำระถึงอายุ 60)', 'THB 26,500/yr (pay to age 60)'),
    },
    {
      dimension: t('ความคุ้มครอง', 'Coverage'),
      tip: t('100% ของทุนประกัน ตลอดสัญญา', '100% of sum assured, full term'),
      competitor: t('100% ของทุนประกัน ก่อนเริ่มรับบำนาญ', '100% of sum assured, pre-annuity'),
    },
    {
      dimension: t('ผลตอบแทนการันตี', 'Guaranteed return'),
      tip: t('เงินก้อน 150% ของทุนประกัน ณ อายุ 60 (การันตี)', 'Lump sum of 150% of SA at age 60 (guaranteed)'),
      competitor: t('บำนาญ 12%/ปี อายุ 60 – 85 + ปันผลไม่การันตี', 'Annuity 12%/yr, age 60 – 85 + non-guaranteed dividend'),
    },
    {
      dimension: t('สิทธิลดหย่อนภาษี', 'Tax benefit'),
      tip: t('สูงสุด 100,000 บาท (เกณฑ์เบี้ยชีวิตปกติ)', 'Up to THB 100,000 (standard life rule)'),
      competitor: t('สูงสุด 300,000 บาท (รวมเกณฑ์เบี้ยบำนาญ)', 'Up to THB 300,000 (incl. pension rule)'),
    },
    {
      dimension: t('จุดเด่น', 'Pros'),
      tip: t('ชำระเบี้ยสั้น 10 ปี • เงินก้อนแน่นอน', '10-year pay • certain lump sum'),
      competitor: t('สิทธิลดหย่อนแบบบำนาญ • กระแสเงินสดรายปี', 'Pension deduction • annual cash flow'),
    },
    {
      dimension: t('ข้อจำกัด', 'Cons'),
      tip: t('ไม่เข้าเกณฑ์ลดหย่อนแบบบำนาญ', 'Not eligible for the pension deduction rule'),
      competitor: t('ผลตอบแทนไม่การันตีบางส่วน', 'Partly non-guaranteed return'),
    },
  ],
};

export const COMPARISON_FOOTNOTE: L10n = t(
  'ข้อมูลคู่แข่งจาก AI Product Development KB — รออนุมัติจาก BU และเป็นตัวอย่าง (sample) เพื่อการสาธิตเท่านั้น',
  'Competitor data sourced from the AI Product Development KB — pending BU approval. Sample data for demo purposes only.',
);

export const FACTSHEET_DISCLAIMER: L10n = t(
  'ข้อมูล factsheet ดึงจากระบบผลิตภัณฑ์ผ่าน API (ไม่ได้สร้างโดย AI) • สรุปโดย AI อาจคลาดเคลื่อน โปรดยึดเอกสารฉบับเต็มเป็นหลัก',
  'Factsheet fields are retrieved from the product system via API (not AI-generated). AI summaries may contain errors — the full document prevails.',
);

export const RECOMMENDATION_DISCLAIMER: L10n = t(
  'คำแนะนำนี้สร้างโดย AI เพื่อสนับสนุนการทำงานของตัวแทน/นายหน้าเท่านั้น ไม่ใช่คำแนะนำต่อลูกค้าโดยตรง — โปรดประเมินความเหมาะสม (suitability) ตามหลัก market conduct ของ คปภ.',
  'This AI-assisted recommendation supports the agent/broker only and is not direct advice to the customer — assess suitability per OIC market-conduct rules.',
);

export const PRODUCT_GROUP_2: L10n = t(
  'กลุ่มผลิตภัณฑ์ 2 — เกษียณและการออมแบบลดหย่อนภาษี',
  'Product Group 2 — Retirement & tax-deductible savings',
);

export const KB_ANSWERS: Record<string, KbAnswer> = {
  'tax-certificate': {
    topic: 'tax-certificate',
    title: t(
      'การขอหนังสือรับรองการชำระเบี้ยประกันภัย (เพื่อลดหย่อนภาษี)',
      'Requesting a premium payment certificate (for tax deduction)',
    ),
    steps: [
      t(
        'แจ้งความประสงค์ผ่าน LINE OA นี้ (เมนู "บริการหลังการขาย") หรือ TIPlife Call Center (sample)',
        'Submit the request via this LINE OA ("After-sales service" menu) or the TIPlife Call Center (sample)',
      ),
      t(
        'เตรียมเลขที่กรมธรรม์ และเลขบัตรประชาชนของลูกค้า เพื่อยืนยันตัวตน',
        "Have the customer's policy number and citizen ID ready for identity verification",
      ),
      t(
        'เลือกช่องทางรับเอกสาร: e-Document (PDF ทางอีเมล) หรือไปรษณีย์ตามที่อยู่ในกรมธรรม์',
        'Choose delivery: e-Document (PDF by email) or post to the address on the policy',
      ),
    ],
    channel: t('LINE OA • Call Center • สาขา (sample)', 'LINE OA • Call Center • Branch (sample)'),
    processingTime: t(
      'e-Document ภายใน 1 – 2 วันทำการ • ไปรษณีย์ 5 – 7 วันทำการ (sample)',
      'e-Document within 1 – 2 business days • post 5 – 7 business days (sample)',
    ),
    disclaimer: t(
      'คำตอบจากคลังความรู้บริการหลังการขาย (KB) — โปรดตรวจสอบเงื่อนไขล่าสุดกับ TIPlife ก่อนแจ้งลูกค้า',
      'Answer from the after-sales knowledge base (KB) — verify current conditions with TIPlife before advising the customer.',
    ),
  },
};

/** Demo prefill for the FNA form / quick replies (from the Q04 broker query). */
export const FNA_DEMO_DEFAULTS = {
  age: 34,
  monthlySalary: 40000,
  householdRole: 'head' as const,
};
