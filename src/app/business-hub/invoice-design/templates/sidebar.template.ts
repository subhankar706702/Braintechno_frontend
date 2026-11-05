import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'sidebar',
  name: 'Sidebar',
  description: 'Vertical brand rail with aligned content.',
  layout: 'sidebar',
  pdfStyle: 'sidebar',
  label: 'SIDEBAR',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'compact',
  previewClass: 'invoice-preview--sidebar',
};

export default template;
