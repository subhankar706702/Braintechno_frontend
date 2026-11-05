import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'basic-blue',
  name: 'Basic Blue',
  description: 'Straightforward blue-accented business layout.',
  layout: 'band',
  pdfStyle: 'band',
  label: 'BASIC BLUE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--basic-blue',
};

export default template;
