import { ElementPreset } from '../../models/editor-block.model';

export const HTML_PRESETS: ElementPreset[] = [
{ key: 'blank', label: 'Blank HTML', description: 'Start with a blank custom HTML block', preview: '<>' },
      { key: 'notice', label: 'Notice Box', description: 'Simple custom notice markup', preview: 'HTML' },
      { key: 'table', label: 'HTML Table', description: 'Editable table markup', preview: 'Table' },
      { key: 'badge', label: 'Badge Row', description: 'Custom badge markup', preview: 'Tags' },
      { key: 'embed', label: 'Embed Area', description: 'Paste supported embed markup', preview: 'Embed' },
      { key: 'custom-card', label: 'Custom Card', description: 'Custom HTML card starter', preview: 'Card' },
      { key: 'list', label: 'Custom List', description: 'HTML list starter', preview: 'List' },
      { key: 'code', label: 'Code Block', description: 'Preformatted code-style block', preview: 'Code' }
];
