import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'ref-teal-wave',
  name: 'Teal Wave',
  description: 'Curved teal header with layered footer accents.',
  layout: 'wave',
  pdfStyle: 'wave',
  label: 'TEAL WAVE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--ref-teal-wave',
};

export default template;
