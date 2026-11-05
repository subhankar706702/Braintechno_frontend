import type { InvoiceDensity } from './invoice-design.types';
export interface InvoiceSpacingTokens { pageMargin: number; sectionGap: number; rowPadding: number; panelPadding: number; }
export function getInvoiceSpacing(density: InvoiceDensity): InvoiceSpacingTokens {
  if (density === 'compact') return { pageMargin: 12, sectionGap: 7, rowPadding: 2.4, panelPadding: 7 };
  if (density === 'airy') return { pageMargin: 18, sectionGap: 13, rowPadding: 4.2, panelPadding: 12 };
  return { pageMargin: 15, sectionGap: 10, rowPadding: 3.2, panelPadding: 9 };
}
