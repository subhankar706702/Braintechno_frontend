import { ElementPreset } from '../../models/editor-block.model';

export const CONTACT_PRESETS: ElementPreset[] = [
{ key: 'card', label: 'Contact Card', description: 'Full contact information card', preview: 'Card' },
      { key: 'minimal', label: 'Minimal', description: 'Simple contact details', preview: 'Min' },
      { key: 'soft', label: 'Soft', description: 'Soft background contact card', preview: 'Soft' },
      { key: 'center', label: 'Centered', description: 'Centered contact details', preview: 'Center' },
      { key: 'border', label: 'Bordered', description: 'Bordered contact card', preview: 'Border' },
      { key: 'dark', label: 'Dark', description: 'Dark contact card', preview: 'Dark' },
      { key: 'split', label: 'Split Contact', description: 'Details with strong heading', preview: 'Split' },
      { key: 'office', label: 'Office Card', description: 'Office address-focused style', preview: 'Office' }
];
