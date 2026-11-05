import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'green-minimal',
  name: 'Green Minimal',
  description: 'Airy minimal layout with a fine green rule.',
  layout: 'minimal',
  pdfStyle: 'minimal',
  label: 'GREEN MINIMAL',
  typography: { family: 'helvetica', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--green-minimal',
};

export default template;
