import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'ref-red-gold',
  name: 'Red Gold Wave',
  description: 'Layered wave header with warm metallic accent.',
  layout: 'wave',
  pdfStyle: 'wave',
  label: 'RED GOLD WAVE',
  typography: { family: 'helvetica', headingWeight: 'bold' },
  density: 'comfortable',
  previewClass: 'invoice-preview--ref-red-gold',
};

export default template;
