import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'gst',
  name: 'GST',
  description: 'Tax-focused layout with clear GST information.',
  layout: 'gst',
  pdfStyle: 'band',
  label: 'GST',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'compact',
  previewClass: 'invoice-preview--gst',
};

export default template;
