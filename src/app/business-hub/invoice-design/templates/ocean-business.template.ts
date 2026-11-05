import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'ocean-business',
  name: 'Ocean Business',
  description: 'Ocean split header and compact business panels.',
  layout: 'ocean',
  pdfStyle: 'wave',
  label: 'OCEAN BUSINESS',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--ocean-business',
};

export default template;
