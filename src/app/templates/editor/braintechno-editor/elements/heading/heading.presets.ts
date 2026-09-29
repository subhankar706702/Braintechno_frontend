export interface HeadingPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
}

/** Exactly 15 selectable Heading styles. */
export const HEADING_PRESETS: HeadingPreset[] = [
  { key: 'hero', label: 'Hero Heading', description: 'Large landing-page heading', preview: 'H1' },
  { key: 'section-title', label: 'Section Title', description: 'Strong left-aligned section heading', preview: 'H2' },
  { key: 'center', label: 'Centered', description: 'Balanced centered title with support line', preview: 'Center' },
  { key: 'accent', label: 'Accent', description: 'Brand-accent heading', preview: 'Accent' },
  { key: 'compact', label: 'Compact', description: 'Small clean heading for tight sections', preview: 'H3' },
  { key: 'display', label: 'Display', description: 'Oversized editorial title', preview: 'XL' },
  { key: 'eyebrow', label: 'Eyebrow + Title', description: 'Small label above a strong title', preview: 'Tag' },
  { key: 'underline', label: 'Underline', description: 'Heading with accent underline', preview: 'Line' },
  { key: 'serif', label: 'Editorial Serif', description: 'Serif-led editorial typography', preview: 'Serif' },
  { key: 'gradient', label: 'Gradient', description: 'Modern gradient headline treatment', preview: 'Grad' },
  { key: 'numbered', label: 'Numbered', description: 'Number badge with heading', preview: '01' },
  { key: 'icon', label: 'Icon Heading', description: 'Icon badge with heading', preview: 'Icon' },
  { key: 'split', label: 'Split', description: 'Heading left with copy and link right', preview: 'Split' },
  { key: 'highlight', label: 'Highlight', description: 'Highlight a word or phrase in the title', preview: 'Mark' },
  { key: 'image', label: 'Image Background', description: 'Heading over a background image', preview: 'Image' }
];
