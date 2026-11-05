import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'rose-premium',
  name: 'Rose Premium',
  description: 'Soft premium panel with refined spacing.',
  layout: 'rose',
  pdfStyle: 'luxury',
  label: 'ROSE PREMIUM',
  typography: { family: 'times', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--rose-premium',
};

export default template;
