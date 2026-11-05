import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'modern',
  name: 'Modern',
  description: 'Contemporary layout with a clean title band.',
  layout: 'modern',
  pdfStyle: 'executive',
  label: 'MODERN',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--modern',
};

export default template;
