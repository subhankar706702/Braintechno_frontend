import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'luxury',
  name: 'Luxury',
  description: 'Premium editorial hierarchy with fine rules.',
  layout: 'luxury',
  pdfStyle: 'luxe',
  label: 'LUXURY',
  typography: { family: 'times', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--luxury',
};

export default template;
