import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'classic',
  name: 'Classic',
  description: 'Balanced traditional invoice layout.',
  layout: 'classic',
  pdfStyle: 'classic',
  label: 'CLASSIC',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--classic',
};

export default template;
