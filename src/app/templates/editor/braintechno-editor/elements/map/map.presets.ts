import { ElementPreset } from '../../models/editor-block.model';

export const MAP_PRESETS: ElementPreset[] = [
{ key: 'standard', label: 'Standard', description: 'Standard map block', preview: 'Map' },
      { key: 'wide', label: 'Wide', description: 'Large map area', preview: 'Wide' },
      { key: 'compact', label: 'Compact', description: 'Compact map area', preview: 'Small' },
      { key: 'rounded', label: 'Rounded', description: 'Rounded map block', preview: 'Round' },
      { key: 'card', label: 'Card', description: 'Map inside a card', preview: 'Card' },
      { key: 'flush', label: 'Flush', description: 'Edge-to-edge map', preview: 'Full' },
      { key: 'office', label: 'Office Location', description: 'Map with location title feel', preview: 'Office' },
      { key: 'dark', label: 'Dark Frame', description: 'Dark framed location section', preview: 'Dark' }
];
