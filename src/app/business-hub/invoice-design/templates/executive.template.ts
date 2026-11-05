import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'executive',
  name: 'Executive',
  description: 'Formal executive header and compact metadata.',
  layout: 'executive',
  pdfStyle: 'executive',
  label: 'EXECUTIVE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'compact',
  previewClass: 'invoice-preview--executive',
};

export default template;
