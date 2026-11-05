import type { InvoiceDensity, InvoiceFontFamily } from './invoice-design.types';
export interface InvoiceTypographyTokens { family: InvoiceFontFamily; headingWeight: 'normal' | 'bold'; titleSize: number; sectionSize: number; bodySize: number; metaSize: number; letterSpacing: string; }
export function getInvoiceTypography(family: InvoiceFontFamily, weight: 'normal' | 'bold', density: InvoiceDensity): InvoiceTypographyTokens {
  const scale = density === 'compact' ? .94 : density === 'airy' ? 1.06 : 1;
  return { family, headingWeight: weight, titleSize: 22 * scale, sectionSize: 10 * scale, bodySize: 9 * scale, metaSize: 7 * scale, letterSpacing: density === 'airy' ? '.08em' : density === 'compact' ? '.02em' : '.045em' };
}
