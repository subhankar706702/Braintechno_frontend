import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'ref-green-classic',
  name: 'Green Classic',
  description: 'Classic green title band and structured totals.',
  layout: 'band',
  pdfStyle: 'band',
  label: 'GREEN CLASSIC',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--ref-green-classic',
};

export default template;
