import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'gradient',
  name: 'Gradient',
  description: 'High-impact full-width header treatment.',
  layout: 'gradient',
  pdfStyle: 'executive',
  label: 'GRADIENT',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--gradient',
};

export default template;
