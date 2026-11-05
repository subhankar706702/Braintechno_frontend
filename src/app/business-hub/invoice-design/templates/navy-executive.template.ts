import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'navy-executive',
  name: 'Navy Executive',
  description: 'Formal navy title bar and executive hierarchy.',
  layout: 'executive',
  pdfStyle: 'band',
  label: 'NAVY EXECUTIVE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'compact',
  previewClass: 'invoice-preview--navy-executive',
};

export default template;
