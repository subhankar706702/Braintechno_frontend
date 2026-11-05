import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'ref-teal-clean',
  name: 'Teal Corporate',
  description: 'Clean teal header and restrained table styling.',
  layout: 'clean',
  pdfStyle: 'minimal',
  label: 'TEAL CORPORATE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--ref-teal-clean',
};

export default template;
