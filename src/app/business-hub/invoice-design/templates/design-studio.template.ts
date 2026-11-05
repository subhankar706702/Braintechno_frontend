import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';

const template: InvoiceTemplateDefinition = {
  id: 'design-studio',
  name: 'Design Studio',
  description: 'Editorial composition with creative accents.',
  layout: 'studio',
  pdfStyle: 'creative',
  label: 'DESIGN STUDIO',
  typography: { family: 'times', headingWeight: 'bold' },
  density: 'airy',
  previewClass: 'invoice-preview--design-studio',
};

export default template;
