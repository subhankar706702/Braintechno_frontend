import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'creative',
  name: 'Creative',
  description: 'Expressive blocks and prominent invoice title.',
  layout: 'creative',
  pdfStyle: 'creative',
  label: 'CREATIVE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--creative',
};

export default template;
