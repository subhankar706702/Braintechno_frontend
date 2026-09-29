import { ElementPreset } from '../../models/editor-block.model';

export const LINK_PRESETS: ElementPreset[] = [
{ key: 'inline', label: 'Inline Link', description: 'Simple text link', preview: 'Link' },
      { key: 'arrow', label: 'Arrow Link', description: 'Link with forward arrow', preview: '→' },
      { key: 'underline', label: 'Underline', description: 'Classic underlined link', preview: 'Line' },
      { key: 'pill', label: 'Link Pill', description: 'Compact pill link', preview: 'Pill' },
      { key: 'card', label: 'Link Card', description: 'Title and URL card', preview: 'Card' },
      { key: 'download', label: 'Download Link', description: 'Download style action', preview: 'Down' },
      { key: 'external', label: 'External Link', description: 'External destination link', preview: 'Ext' },
      { key: 'email', label: 'Email Link', description: 'Email action link', preview: '@' }
];
