import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'mono',
  name: 'Mono',
  description: 'Monochrome invoice with compact information hierarchy.',
  layout: 'mono',
  pdfStyle: 'minimal',
  label: 'MONO',
  typography: { family: 'courier', headingWeight: 'bold' },
  density: 'compact',
  previewClass: 'invoice-preview--mono',
};

export default template;
