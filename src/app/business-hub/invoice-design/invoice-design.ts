import { createColorPalette as createModularColorPalette } from './core/invoice-color.math';

import { jsPDF } from 'jspdf';

/**
 * Additional invoice designs inspired by the supplied reference images.
 * Existing invoice templates are intentionally kept separate and unchanged.
 */
export type AddedInvoiceTemplateId =
  | 'ref-red-gold'
  | 'ref-teal-clean'
  | 'ref-green-classic'
  | 'ref-proforma'
  | 'ref-teal-wave'
  | 'wave-corporate'
  | 'green-minimal'
  | 'navy-executive'
  | 'royal-elegance'
  | 'orange-creative'
  | 'emerald-modern'
  | 'slate-minimal'
  | 'rose-premium'
  | 'ocean-business'
  | 'amber-luxe';

export interface InvoiceThemePalette {
  primary: string;
  primaryDark: string;
  primaryDeep: string;
  primarySoft: string;
  primaryTint: string;
  secondary: string;
  secondarySoft: string;
  accent: string;
  ink: string;
  muted: string;
  paper: string;
  border: string;
}

export interface AddedInvoiceTemplateOption {
  id: AddedInvoiceTemplateId;
  name: string;
  description: string;
}

export const ADDED_INVOICE_TEMPLATE_OPTIONS: ReadonlyArray<AddedInvoiceTemplateOption> = [
  { id: 'ref-red-gold', name: 'Red Gold Wave', description: 'Reference design with layered red waves and gold accents.' },
  { id: 'ref-teal-clean', name: 'Teal Corporate', description: 'Reference design with a bold teal header and clean invoice body.' },
  { id: 'ref-green-classic', name: 'Green Classic', description: 'Reference design with a fresh green banner and structured totals.' },
  { id: 'ref-proforma', name: 'Proforma Classic', description: 'Reference proforma layout with compact business and shipping details.' },
  { id: 'ref-teal-wave', name: 'Teal Wave', description: 'Reference-inspired teal brand layout with curved color sections.' },
  { id: 'wave-corporate', name: 'Wave Corporate', description: 'Layered corporate header and matching footer.' },
  { id: 'green-minimal', name: 'Green Minimal', description: 'Light green accents with generous white space.' },
  { id: 'navy-executive', name: 'Navy Executive', description: 'Formal navy header with a strong invoice identity.' },
  { id: 'royal-elegance', name: 'Royal Elegance', description: 'Refined split header with elegant accent rules.' },
  { id: 'orange-creative', name: 'Orange Creative', description: 'Energetic angled blocks and highlighted totals.' },
  { id: 'emerald-modern', name: 'Emerald Modern', description: 'Modern emerald bands and softly tinted table rows.' },
  { id: 'slate-minimal', name: 'Slate Minimal', description: 'Monochrome-inspired layout with restrained color.' },
  { id: 'rose-premium', name: 'Rose Premium', description: 'Soft rose panels with a premium invoice hierarchy.' },
  { id: 'ocean-business', name: 'Ocean Business', description: 'Ocean-inspired split header and compact information panels.' },
  { id: 'amber-luxe', name: 'Amber Luxe', description: 'Warm accent lines and a premium amount panel.' },
];

const ADDED_TEMPLATE_IDS = new Set<string>(
  ADDED_INVOICE_TEMPLATE_OPTIONS.map(option => option.id),
);

export function isAddedInvoiceTemplate(value: string): value is AddedInvoiceTemplateId {
  return ADDED_TEMPLATE_IDS.has(String(value || '').toLowerCase());
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeHex(input: string): string {
  const value = String(input || '').trim();
  const short = /^#([0-9a-f]{3})$/i.exec(value);

  if (short) {
    return `#${short[1].split('').map(char => char + char).join('')}`.toUpperCase();
  }

  return /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : '#D93645';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = normalizeHex(hex).slice(1);

  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map(value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function mix(colorA: string, colorB: string, amount: number): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const t = clamp(amount, 0, 1);

  return rgbToHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]);
}

export function createInvoicePalette(primaryColor: string): InvoiceThemePalette {
  const palette = createModularColorPalette(primaryColor);
  return {
    primary: palette.primary,
    primaryDark: palette.primaryDark,
    primaryDeep: palette.primaryDeep,
    primarySoft: palette.primarySoft,
    primaryTint: palette.primaryTint,
    secondary: palette.secondary,
    secondarySoft: palette.secondarySoft,
    accent: palette.accent,
    ink: palette.ink,
    muted: palette.muted,
    paper: palette.paper,
    border: palette.border,
  };
}

function setFill(pdf: jsPDF, color: string): void {
  pdf.setFillColor(...hexToRgb(color));
}

function setDraw(pdf: jsPDF, color: string): void {
  pdf.setDrawColor(...hexToRgb(color));
}

function addWave(pdf: jsPDF, width: number, y: number, height: number, color: string, offset = 0): void {
  setFill(pdf, color);
  pdf.triangle(0, y + height, width * 0.42, y + offset, width, y + height, 'F');
  pdf.rect(0, y + height * 0.72, width, height * 0.28, 'F');
}

/** Draws the first-page header for one of the 15 added templates. */
export function drawAddedInvoiceHeader(
  pdf: jsPDF,
  template: AddedInvoiceTemplateId,
  primaryColor: string,
  pageWidth: number,
  margin: number,
): number {
  const palette = createInvoicePalette(primaryColor);
  const dark = palette.primaryDark;
  const deep = palette.primaryDeep;
  const soft = palette.primarySoft;
  const accent = palette.accent;
  const headerHeight = template === 'ref-red-gold' || template === 'ref-teal-wave' || template === 'wave-corporate' ? 31 : 25;

  switch (template) {
    case 'ref-red-gold':
      setFill(pdf, deep);
      pdf.rect(0, 0, pageWidth, headerHeight, 'F');
      addWave(pdf, pageWidth, 0, headerHeight, palette.primary, 4);
      setFill(pdf, accent);
      pdf.triangle(0, 28, pageWidth * 0.3, 24, pageWidth * 0.58, 31, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(21);
      pdf.text('INVOICE', pageWidth - margin, 16, { align: 'right' });
      return 39;

    case 'ref-teal-clean':
      setFill(pdf, palette.primary);
      pdf.rect(0, 0, pageWidth, 36, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text('INVOICE', margin, 24);
      return 43;

    case 'ref-green-classic':
      setFill(pdf, palette.primary);
      pdf.rect(margin, 10, pageWidth - margin * 2, 19, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('INVOICE', margin + 6, 22);
      return 38;

    case 'ref-proforma':
      pdf.setTextColor(...hexToRgb(deep));
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('PRO FORMA INVOICE', margin, 17);
      setDraw(pdf, palette.primary);
      pdf.setLineWidth(0.7);
      pdf.line(margin, 22, pageWidth - margin, 22);
      return 30;

    case 'ref-teal-wave':
    case 'wave-corporate':
      setFill(pdf, deep);
      pdf.rect(0, 0, pageWidth, headerHeight, 'F');
      addWave(pdf, pageWidth, 0, headerHeight, palette.primary, 2);
      setFill(pdf, palette.secondary);
      pdf.triangle(pageWidth * 0.52, 29, pageWidth * 0.83, 22, pageWidth, 31, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('INVOICE', margin, 18);
      return 39;

    case 'green-minimal':
    case 'slate-minimal':
      setFill(pdf, soft);
      pdf.rect(0, 0, pageWidth, 4, 'F');
      pdf.setTextColor(...hexToRgb(deep));
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text('INVOICE', margin, 20);
      setDraw(pdf, palette.primary);
      pdf.line(margin, 25, pageWidth - margin, 25);
      return 33;

    case 'navy-executive':
    case 'ocean-business':
      setFill(pdf, deep);
      pdf.rect(0, 0, pageWidth, 28, 'F');
      setFill(pdf, palette.primary);
      pdf.rect(0, 26, pageWidth * 0.36, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('INVOICE', margin, 18);
      return 38;

    case 'royal-elegance':
    case 'amber-luxe':
      pdf.setTextColor(...hexToRgb(deep));
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(23);
      pdf.text('INVOICE', margin, 20);
      setDraw(pdf, accent);
      pdf.setLineWidth(1.1);
      pdf.line(margin, 25, pageWidth - margin, 25);
      setFill(pdf, palette.primary);
      pdf.circle(pageWidth - margin - 3, 14, 3, 'F');
      return 34;

    case 'orange-creative':
    case 'rose-premium':
      setFill(pdf, palette.primary);
      pdf.roundedRect(margin, 7, pageWidth - margin * 2, 23, 4, 4, 'F');
      setFill(pdf, dark);
      pdf.triangle(pageWidth - margin - 24, 7, pageWidth - margin, 7, pageWidth - margin, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('INVOICE', margin + 6, 22);
      return 39;

    case 'emerald-modern':
      setFill(pdf, soft);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      setFill(pdf, palette.primary);
      pdf.rect(0, 0, 6, 30, 'F');
      pdf.setTextColor(...hexToRgb(deep));
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(21);
      pdf.text('INVOICE', margin + 2, 19);
      return 37;

    default:
      setFill(pdf, palette.primary);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('INVOICE', margin, 10);
      return 25;
  }
}

/** Adds a matching design footer on each PDF page. */
export function drawAddedInvoiceFooter(
  pdf: jsPDF,
  template: AddedInvoiceTemplateId,
  primaryColor: string,
  pageWidth: number,
  pageHeight: number,
): void {
  const palette = createInvoicePalette(primaryColor);
  const y = pageHeight - 8;

  if (template === 'ref-red-gold' || template === 'ref-teal-wave' || template === 'wave-corporate') {
    setFill(pdf, palette.primaryDeep);
    pdf.rect(0, pageHeight - 9, pageWidth, 9, 'F');
    setFill(pdf, palette.primary);
    pdf.triangle(0, pageHeight - 9, pageWidth * 0.55, pageHeight - 12, pageWidth, pageHeight - 9, 'F');
    setFill(pdf, palette.accent);
    pdf.rect(0, pageHeight - 1.8, pageWidth, 1.8, 'F');
    return;
  }

  if (template === 'ref-teal-clean' || template === 'ref-green-classic' || template === 'navy-executive' || template === 'ocean-business') {
    setFill(pdf, palette.primary);
    pdf.rect(0, pageHeight - 5, pageWidth, 5, 'F');
    return;
  }

  setDraw(pdf, palette.primary);
  pdf.setLineWidth(0.45);
  pdf.line(14, y, pageWidth - 14, y);
}


// Modular design architecture (33 registered templates).
export { INVOICE_DESIGNS, INVOICE_TEMPLATE_OPTIONS, getInvoiceTemplateDesign, isInvoiceTemplateId } from './core/invoice-design.registry';
export { adjustBrightness, getContrastColor, getContrastRatio, hexToRgb as invoiceHexToRgb, mixColor, normalizeHex, relativeLuminance, rgbToHex } from './core/invoice-color.math';
export { getInvoiceTypography } from './core/invoice-typography';
export { getInvoiceSpacing } from './core/invoice-spacing';
export { invoiceCssVariables, getInvoiceTemplateClass } from './core/invoice-style.utils';
export type { InvoiceTemplateDefinition, InvoiceTemplateId, InvoiceTemplateLayout, InvoicePdfStyle } from './core/invoice-design.types';
