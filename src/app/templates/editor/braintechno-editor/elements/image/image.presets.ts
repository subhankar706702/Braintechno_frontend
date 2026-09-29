import { ElementPreset } from '../../models/editor-block.model';

export const IMAGE_PRESETS: ElementPreset[] = [
{ key: 'banner', label: 'Banner', description: 'Full width banner image', preview: 'Banner' },
      { key: 'rounded', label: 'Rounded', description: 'Rounded image block', preview: 'Round' },
      { key: 'card', label: 'Card Image', description: 'Image inside a card frame', preview: 'Card' },
      { key: 'compact', label: 'Compact', description: 'Compact centered image', preview: 'Small' },
      { key: 'shadow', label: 'Shadow', description: 'Raised visual style', preview: 'Lift' },
      { key: 'square', label: 'Square', description: 'Square media image', preview: '1:1' },
      { key: 'portrait', label: 'Portrait', description: 'Portrait ratio visual', preview: '3:4' },
      { key: 'circle', label: 'Circle', description: 'Circular profile style', preview: '○' },
      { key: 'bordered', label: 'Bordered', description: 'Crisp bordered image', preview: 'Box' },
      { key: 'full-bleed', label: 'Full Bleed', description: 'Edge-to-edge image', preview: 'Full' }
];
