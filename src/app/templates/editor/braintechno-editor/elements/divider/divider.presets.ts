import { ElementPreset } from '../../models/editor-block.model';

export const DIVIDER_PRESETS: ElementPreset[] = [
{ key: 'line', label: 'Line', description: 'Simple divider line', preview: 'Line' },
      { key: 'accent', label: 'Accent', description: 'Brand color divider', preview: 'Pink' },
      { key: 'thick', label: 'Thick', description: 'Thicker divider', preview: 'Thick' },
      { key: 'dashed', label: 'Dashed', description: 'Dashed divider line', preview: 'Dash' },
      { key: 'dotted', label: 'Dotted', description: 'Dotted divider line', preview: 'Dot' },
      { key: 'soft', label: 'Soft', description: 'Soft gray divider', preview: 'Soft' },
      { key: 'short', label: 'Short Accent', description: 'Short centered divider', preview: 'Short' },
      { key: 'double', label: 'Double Line', description: 'Double line divider', preview: 'Double' }
];
