/** Shared contracts for all invoice designs. */
export type InvoiceTemplateId =
  'classic' |
  'minimal' |
  'basic-blue' |
  'mono' |
  'corporate' |
  'elegant' |
  'creative' |
  'sidebar' |
  'luxury' |
  'gradient' |
  'executive' |
  'signature' |
  'modern-pro' |
  'my-brand' |
  'design-studio' |
  'modern' |
  'gst' |
  'premium' |
  'ref-red-gold' |
  'ref-teal-clean' |
  'ref-green-classic' |
  'ref-proforma' |
  'ref-teal-wave' |
  'wave-corporate' |
  'green-minimal' |
  'navy-executive' |
  'royal-elegance' |
  'orange-creative' |
  'emerald-modern' |
  'slate-minimal' |
  'rose-premium' |
  'ocean-business' |
  'amber-luxe';

export type InvoiceTemplateLayout =
  | 'classic' | 'minimal' | 'band' | 'mono' | 'corporate' | 'elegant'
  | 'creative' | 'sidebar' | 'luxury' | 'gradient' | 'executive'
  | 'signature' | 'modern-pro' | 'brand' | 'studio' | 'modern' | 'gst'
  | 'premium' | 'wave' | 'clean' | 'proforma' | 'royal' | 'rose' | 'ocean' | 'luxe';

export type InvoicePdfStyle =
  | 'classic' | 'minimal' | 'band' | 'executive' | 'royal' | 'creative'
  | 'sidebar' | 'luxury' | 'luxe' | 'wave' | 'clean' | 'proforma' | 'modern' | 'rose' | 'ocean' | 'split';

export type InvoiceFontFamily = 'helvetica' | 'times' | 'courier'|'elegant';
export type InvoiceDensity = 'compact' | 'comfortable' | 'airy';

export interface InvoiceTemplateDefinition {
  readonly id: InvoiceTemplateId;
  readonly name: string;
  readonly description: string;
  readonly layout: InvoiceTemplateLayout;
  readonly pdfStyle: InvoicePdfStyle;
  readonly label: string;
  readonly typography: { readonly family: InvoiceFontFamily; readonly headingWeight: 'normal' | 'bold'; };
  readonly density: InvoiceDensity;
  readonly previewClass: string;
}
