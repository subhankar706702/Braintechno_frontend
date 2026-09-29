import { ElementPreset } from '../../models/editor-block.model';

export const TEXT_PRESETS: ElementPreset[] = [
{ key: 'paragraph', label: 'Paragraph', description: 'Standard body copy', preview: 'P' },
      { key: 'lead', label: 'Lead Text', description: 'Large introductory copy', preview: 'Lead' },
      { key: 'muted', label: 'Muted Text', description: 'Soft secondary copy', preview: 'Muted' },
      { key: 'quote', label: 'Quote', description: 'Highlighted quotation', preview: 'Quote' },
      { key: 'note', label: 'Note', description: 'Soft information note', preview: 'Note' },
      { key: 'center', label: 'Centered', description: 'Centered body text', preview: 'Center' },
      { key: 'callout', label: 'Callout', description: 'Strong bordered callout', preview: 'Call' },
      { key: 'success', label: 'Success Note', description: 'Positive status message', preview: 'OK' },
      { key: 'warning', label: 'Warning Note', description: 'Attention message', preview: '!' },
      { key: 'two-column', label: 'Two Column Copy', description: 'Magazine-like copy treatment', preview: '2 Col' }
];
