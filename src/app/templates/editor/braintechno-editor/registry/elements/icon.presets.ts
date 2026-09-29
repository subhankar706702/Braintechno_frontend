import { ElementPreset } from '../../models/editor-block.model';

export const ICON_PRESETS: ElementPreset[] = [
{ key: 'circle', label: 'Circle Icon', description: 'Icon inside circular badge', preview: '○' },
      { key: 'square', label: 'Square Icon', description: 'Icon inside rounded square', preview: '□' },
      { key: 'plain', label: 'Plain Icon', description: 'Standalone Material icon', preview: 'Icon' },
      { key: 'accent', label: 'Accent', description: 'Brand accent icon', preview: 'Pink' },
      { key: 'soft', label: 'Soft Badge', description: 'Soft background icon', preview: 'Soft' },
      { key: 'dark', label: 'Dark Badge', description: 'Dark premium badge', preview: 'Dark' },
      { key: 'large', label: 'Large Feature', description: 'Large feature icon', preview: 'XL' },
      { key: 'icon-label', label: 'Icon + Label', description: 'Icon paired with short label', preview: 'I+T' }
];
