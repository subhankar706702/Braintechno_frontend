import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'emerald-modern',
  name: 'Emerald Modern',
  description: 'Modern emerald side rail and soft table surfaces.',
  layout: 'modern',
  pdfStyle: 'band',
  label: 'EMERALD MODERN',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--emerald-modern',
};

export default template;
