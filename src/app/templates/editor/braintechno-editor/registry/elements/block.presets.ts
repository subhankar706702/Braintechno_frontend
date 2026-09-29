import { ElementPreset } from '../../models/editor-block.model';

export const BLOCK_PRESETS: ElementPreset[] = [
{ key: 'one', label: '1 Slot', description: 'Blank full-width drop zone', preview: '1' },
      { key: 'two', label: '2 Slots', description: 'Drop different elements side by side', preview: '2' },
      { key: 'three', label: '3 Slots', description: 'Three blank element zones', preview: '3' },
      { key: 'four', label: '4 Slots', description: 'Four equal blank zones', preview: '4' },
      { key: 'two-two', label: '2 + 2 Slots', description: 'Four zones in two rows', preview: '2x2' },
      { key: 'three-three', label: '3 + 3 Slots', description: 'Six zones in two rows', preview: '3x2' },
      { key: 'media-form', label: 'Media + Form', description: 'Two slots prepared for media and form', preview: 'M+F' },
      { key: 'text-media', label: 'Text + Media', description: 'Content and media split', preview: 'T+M' }
];
