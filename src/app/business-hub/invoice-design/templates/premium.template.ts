import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'premium',
  name: 'Premium',
  description: 'Premium spacing, typography and amount emphasis.',
  layout: 'premium',
  pdfStyle: 'executive',
  label: 'PREMIUM',
  typography: { family: 'times', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--premium',
};

export default template;
