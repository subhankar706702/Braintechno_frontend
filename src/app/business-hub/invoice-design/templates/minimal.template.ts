import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Quiet typography with generous whitespace.',
  layout: 'minimal',
  pdfStyle: 'minimal',
  label: 'MINIMAL',
  typography: { family: 'helvetica', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--minimal',
};

export default template;
