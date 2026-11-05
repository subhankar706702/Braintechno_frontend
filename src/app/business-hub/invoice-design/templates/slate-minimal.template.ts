import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'slate-minimal',
  name: 'Slate Minimal',
  description: 'Neutral monochrome-inspired minimal layout.',
  layout: 'minimal',
  pdfStyle: 'minimal',
  label: 'SLATE MINIMAL',
  typography: { family: 'courier', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--slate-minimal',
};

export default template;
