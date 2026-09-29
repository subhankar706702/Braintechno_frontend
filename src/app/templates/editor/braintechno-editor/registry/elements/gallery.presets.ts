import { ElementPreset } from '../../models/editor-block.model';

export const GALLERY_PRESETS: ElementPreset[] = [
{ key: 'two', label: '2 Columns', description: 'Two image columns', preview: '2' },
      { key: 'three', label: '3 Columns', description: 'Three image columns', preview: '3' },
      { key: 'four', label: '4 Columns', description: 'Four image columns', preview: '4' },
      { key: 'spacious', label: 'Spacious', description: 'Large image gaps', preview: 'Gap' },
      { key: 'compact', label: 'Compact', description: 'Tight image gaps', preview: 'Tight' },
      { key: 'rounded', label: 'Rounded', description: 'Rounded gallery tiles', preview: 'Round' },
      { key: 'masonry', label: 'Masonry Look', description: 'Editorial gallery treatment', preview: 'Masonry' },
      { key: 'bordered', label: 'Bordered', description: 'Framed image collection', preview: 'Frame' },
      { key: 'showcase', label: 'Showcase', description: 'Large first visual feel', preview: 'Show' },
      { key: 'minimal', label: 'Minimal', description: 'Clean gallery without chrome', preview: 'Min' }
];
