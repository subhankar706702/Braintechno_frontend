import { ElementPreset } from '../../models/editor-block.model';

export const FAQ_PRESETS: ElementPreset[] = [
{ key: 'accordion', label: 'Accordion FAQ', description: 'Expandable FAQ list', preview: 'FAQ' },
      { key: 'cards', label: 'FAQ Cards', description: 'Questions in cards', preview: 'Cards' },
      { key: 'two-column', label: '2 Column FAQ', description: 'Two-column questions', preview: '2 Col' },
      { key: 'minimal', label: 'Minimal FAQ', description: 'Simple question list', preview: 'Min' },
      { key: 'dark', label: 'Dark FAQ', description: 'Dark FAQ section', preview: 'Dark' },
      { key: 'support', label: 'Support FAQ', description: 'Support-oriented questions', preview: 'Help' },
      { key: 'product', label: 'Product FAQ', description: 'Product-related questions', preview: 'Prod' },
      { key: 'service', label: 'Service FAQ', description: 'Service-related questions', preview: 'Svc' }
];
