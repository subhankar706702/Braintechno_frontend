import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'signature',
  name: 'Signature',
  description: 'Personalized sidebar-led invoice layout.',
  layout: 'signature',
  pdfStyle: 'sidebar',
  label: 'SIGNATURE',
  typography: { family: 'times', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--signature',
};

export default template;
