export interface LinkPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
}

export const LINK_PRESETS: LinkPreset[] = [
  { key: 'text', label: 'Simple Text', description: 'Clean inline text link', preview: 'Learn more' },
  { key: 'underline', label: 'Underline', description: 'Classic underlined link', preview: 'View details' },
  { key: 'arrow', label: 'Arrow Link', description: 'Text link with forward arrow', preview: 'Explore →' },
  { key: 'chevron', label: 'Chevron Link', description: 'Compact navigation-style link', preview: 'Details ›' },
  { key: 'pill', label: 'Pill Link', description: 'Soft rounded pill link', preview: 'Visit page' },
  { key: 'outline', label: 'Outline', description: 'Bordered button-like link', preview: 'Open link' },
  { key: 'soft', label: 'Soft Button', description: 'Filled soft-color link', preview: 'Get started' },
  { key: 'card', label: 'Link Card', description: 'Card-style clickable link block', preview: 'Read more' },
  { key: 'icon-left', label: 'Icon Left', description: 'Icon followed by link text', preview: '↗  Website' },
  { key: 'icon-right', label: 'Icon Right', description: 'Link text followed by icon', preview: 'Website  ↗' },
  { key: 'external', label: 'External Link', description: 'External-link indicator with clear hierarchy', preview: 'Open website ↗' },
  { key: 'download', label: 'Download', description: 'File download link style', preview: '↓ Download' },
  { key: 'contact', label: 'Contact Action', description: 'Contact-oriented link with action icon', preview: 'Contact us' },
  { key: 'anchor', label: 'Section Anchor', description: 'Jump-to-section navigation link', preview: '# Pricing' },
  { key: 'stacked', label: 'Stacked URL', description: 'Label plus visible destination URL', preview: 'Website\nbraintechno.com' }
];
