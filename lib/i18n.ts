import type { L10n, Lang } from './types';

/** Shorthand constructor for a bilingual string. */
export const t = (th: string, en: string): L10n => ({ th, en });

/** Resolve a bilingual string for the active language. */
export const pick = (l10n: L10n, lang: Lang): string => l10n[lang];

/** Tiny template helper: fmt('A vs {b}', { b: 'X' }) → 'A vs X'. */
export const fmt = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');

/** UI chrome strings rendered inside the LINE frame (both surfaces). */
export const UI = {
  /* chat */
  inputPlaceholder: t('ข้อความ', 'Message'),
  read: t('อ่านแล้ว', 'Read'),
  restartDemo: t('เริ่มใหม่', 'Restart'),
  factsheetButton: t('Factsheet', 'Factsheet'),
  compareButton: t('เปรียบเทียบ', 'Compare'),
  openFactsheetLiff: t('เปิดเอกสาร (LIFF)', 'Open document (LIFF)'),
  comparisonIntro: t('เปรียบเทียบ {a} กับ {b} ครับ', 'Comparing {a} vs {b}.'),
  openLiffTable: t('ดูตารางเต็มใน LIFF', 'View full table in LIFF'),
  openLiffDetails: t('ดูรายละเอียดใน LIFF', 'View details in LIFF'),
  recommendLabel: t('แนะนำ:', 'Recommended:'),
  channelLabel: t('ช่องทาง', 'Channels'),
  processingLabel: t('ระยะเวลาดำเนินการ', 'Processing time'),

  /* liff */
  liffLoading: t('กำลังเรียกข้อมูล…', 'Loading…'),
  productsHeading: t('แบบประกันเพื่อการเกษียณ', 'Retirement products'),
  comparisonHeading: t('เปรียบเทียบผลิตภัณฑ์', 'Product comparison'),
  comparisonSub: t('{a} vs {b}', '{a} vs {b}'),
  dimensionCol: t('มิติ', 'Dimension'),

  /* FNA form */
  fnaTitle: t('ประเมินความต้องการลูกค้า (FNA)', 'Customer needs assessment (FNA)'),
  fnaAge: t('อายุลูกค้า (ปี)', 'Customer age (years)'),
  fnaSalary: t('เงินเดือน (บาท/เดือน)', 'Monthly salary (THB)'),
  fnaRole: t('บทบาทในครอบครัว', 'Household role'),
  fnaRoleHead: t('หัวหน้าครอบครัว', 'Head of household'),
  fnaRoleMember: t('สมาชิกครอบครัว', 'Family member'),
  fnaSubmit: t('ขอคำแนะนำ', 'Get recommendation'),
  fnaSubmitting: t('กำลังประเมิน…', 'Assessing…'),
  fnaResult: t('ผลการประเมิน FNA', 'FNA result'),
  fnaRecommended: t('แบบประกันที่แนะนำ', 'Recommended product'),
  fnaRationale: t('เหตุผลประกอบ', 'Rationale'),
  requestFactsheet: t('ขอ Factsheet', 'Get factsheet'),
  compareCompetitor: t('เทียบคู่แข่ง', 'Compare'),
  ageShort: t('อายุ', 'Age'),
  salaryShort: t('เงินเดือน', 'Salary'),
  bahtUnit: t('บาท', 'THB'),
  yearsUnit: t('ปี', 'yrs'),
} as const;

/** Broker-side conversation strings built at runtime. */
export const CONVERSATION = {
  greeting: t(
    'สวัสดีครับ ผมคือ TIPlife AI Assistant ผู้ช่วยสำหรับตัวแทน/นายหน้า สอบถามข้อมูลแบบประกัน เปรียบเทียบคู่แข่ง หรือขอคำแนะนำจาก FNA ได้เลยครับ',
    "Hello, I'm the TIPlife AI Assistant for agents and brokers. Ask about products, competitor comparisons, or an FNA recommendation.",
  ),
  fallback: t(
    'ขออภัยครับ ผมยังไม่เข้าใจคำถามนี้ ลองเลือกจากตัวเลือกด้านล่างได้ครับ',
    "Sorry, I don't understand that yet — try one of the options below.",
  ),
  serviceError: t(
    'ขออภัยครับ ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง',
    'Sorry, something went wrong. Please try again.',
  ),
  askAge: t('รับทราบครับ ขอทราบอายุของลูกค้าก่อนครับ', "Noted — first, the customer's age please."),
  askSalary: t('ขอบคุณครับ รายได้ต่อเดือนของลูกค้าครับ', "Thank you. The customer's monthly income?"),
  askRole: t(
    'คำถามสุดท้ายครับ ลูกค้าเป็นหัวหน้าครอบครัวหรือไม่ครับ',
    'Last question — is the customer the head of household?',
  ),
  productsIntro: t(
    'ตอนนี้ TIPlife มีแบบประกันเพื่อการเกษียณบนเชลฟ์ 3 แบบครับ',
    'TIPlife currently has 3 retirement products on shelf.',
  ),
} as const;
