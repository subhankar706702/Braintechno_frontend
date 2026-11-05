import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'my-brand',
  name: 'My Brand',
  description: 'Brand-forward layout for custom business identity.',
  layout: 'brand',
  pdfStyle: 'creative',
  label: 'MY BRAND',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--my-brand',
};

export default template;
