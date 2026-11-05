import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'royal-elegance',
  name: 'Royal Elegance',
  description: 'Elegant editorial title with refined accent rules.',
  layout: 'royal',
  pdfStyle: 'luxury',
  label: 'ROYAL ELEGANCE',
  typography: { family: 'times', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--royal-elegance',
};

export default template;
