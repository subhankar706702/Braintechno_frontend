import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'ref-proforma',
  name: 'Proforma Classic',
  description: 'Pro forma document with compact metadata.',
  layout: 'proforma',
  pdfStyle: 'split',
  label: 'PROFORMA CLASSIC',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'compact',
  previewClass: 'invoice-preview--ref-proforma',
};

export default template;
