import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'wave-corporate',
  name: 'Wave Corporate',
  description: 'Corporate wave header with strong contrast.',
  layout: 'wave',
  pdfStyle: 'wave',
  label: 'WAVE CORPORATE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--wave-corporate',
};

export default template;
