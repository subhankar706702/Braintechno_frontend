import { ElementPreset } from '../../models/editor-block.model';

export const HEADING_PRESETS: ElementPreset[] = [
{ key: 'hero', label: 'Hero Heading', description: 'Large bold centered title', preview: 'H1' },
      { key: 'section-title', label: 'Section Title', description: 'Clean left aligned title', preview: 'H2' },
      { key: 'center', label: 'Centered', description: 'Balanced centered heading', preview: 'H2' },
      { key: 'accent', label: 'Accent', description: 'Brand color heading', preview: 'Pink' },
      { key: 'compact', label: 'Compact', description: 'Smaller compact heading', preview: 'H3' },
      { key: 'display', label: 'Display', description: 'Extra large display title', preview: 'XL' },
      { key: 'eyebrow', label: 'Eyebrow + Title', description: 'Small label above strong title', preview: 'Tag' },
      { key: 'underline', label: 'Underline', description: 'Heading with accent underline', preview: 'Line' },
      { key: 'serif', label: 'Editorial', description: 'Editorial style large title', preview: 'Edit' },
      { key: 'gradient', label: 'Gradient', description: 'Modern gradient title', preview: 'Grad' }
];
