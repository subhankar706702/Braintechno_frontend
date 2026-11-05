import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'elegant',
  name: 'Elegant',
  description: 'Refined typography with restrained accent rules.',
  layout: 'elegant',
  pdfStyle: 'royal',
  label: 'ELEGANT',
  typography: { family: 'times', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--elegant',
};

export default template;
