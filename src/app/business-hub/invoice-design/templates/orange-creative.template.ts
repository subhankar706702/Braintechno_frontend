import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'orange-creative',
  name: 'Orange Creative',
  description: 'Creative rounded header and angled accent block.',
  layout: 'creative',
  pdfStyle: 'split',
  label: 'ORANGE CREATIVE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--orange-creative',
};

export default template;
