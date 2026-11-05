import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'modern-pro',
  name: 'Modern Pro',
  description: 'Professional modern header and clear totals.',
  layout: 'modern-pro',
  pdfStyle: 'executive',
  label: 'MODERN PRO',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--modern-pro',
};

export default template;
