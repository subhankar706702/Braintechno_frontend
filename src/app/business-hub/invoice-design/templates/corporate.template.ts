import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'corporate',
  name: 'Corporate',
  description: 'Strong corporate header and structured sections.',
  layout: 'corporate',
  pdfStyle: 'executive',
  label: 'CORPORATE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--corporate',
};

export default template;
