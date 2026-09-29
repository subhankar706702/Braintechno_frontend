export interface TextPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
}

export const TEXT_PRESETS: TextPreset[] = [
  { key: 'paragraph', label: 'Paragraph', description: 'Standard readable body copy', preview: 'P' },
  { key: 'lead', label: 'Lead Text', description: 'Large introductory copy', preview: 'Lead' },
  { key: 'muted', label: 'Muted Text', description: 'Soft secondary information', preview: 'Muted' },
  { key: 'quote', label: 'Quote', description: 'Quote with accent rule and quotation mark', preview: 'Quote' },
  { key: 'note', label: 'Info Note', description: 'Information panel with optional icon', preview: 'Info' },
  { key: 'center', label: 'Centered', description: 'Balanced centered body copy', preview: 'Center' },
  { key: 'callout', label: 'Callout', description: 'Strong bordered callout message', preview: 'Callout' },
  { key: 'success', label: 'Success', description: 'Positive status / confirmation message', preview: '✓' },
  { key: 'warning', label: 'Warning', description: 'Attention / warning message', preview: '!' },
  { key: 'two-column', label: 'Two Column', description: 'Magazine-style two-column copy', preview: '2C' },
  { key: 'highlight', label: 'Highlight', description: 'Highlight a selected phrase inside text', preview: 'Hi' },
  { key: 'checklist', label: 'Checklist', description: 'Multiple points with check icons', preview: '✓✓' },
  { key: 'quote-card', label: 'Quote Card', description: 'Quote with author and source details', preview: 'Card' },
  { key: 'numeric', label: 'Numeric Highlight', description: 'Large number with supporting message', preview: '123' },
  { key: 'expandable', label: 'Read More', description: 'Expandable long-form text block', preview: 'More' }
];
