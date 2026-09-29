import { ElementPreset } from '../../models/editor-block.model';

export const SECTION_PRESETS: ElementPreset[] = [
{ key: 'one', label: '1 Div', description: 'Single full-width section', preview: '1' },
      { key: 'two', label: '2 Div', description: 'Two equal columns', preview: '2' },
      { key: 'three', label: '3 Div', description: 'Three equal columns', preview: '3' },
      { key: 'four', label: '4 Div', description: 'Four equal columns', preview: '4' },
      { key: 'two-two', label: '2 + 2 Div', description: 'Two columns on two rows', preview: '2x2' },
      { key: 'three-three', label: '3 + 3 Div', description: 'Three columns on two rows', preview: '3x2' },
      { key: 'hero-split', label: 'Hero Split', description: 'Text and visual split section', preview: 'Hero' },
      { key: 'feature-grid', label: 'Feature Grid', description: 'Four compact feature cards', preview: 'Grid' },
      { key: 'content-aside', label: 'Content + Aside', description: 'Wide content with narrow aside', preview: '70/30' },
      { key: 'aside-content', label: 'Aside + Content', description: 'Narrow aside with wide content', preview: '30/70' }
];
