import { ElementPreset } from '../../models/editor-block.model';

export const FOOTER_PRESETS: ElementPreset[] = [
{ key: 'simple', label: 'Simple Footer', description: 'Brand and copyright', preview: 'Foot' },
      { key: 'columns', label: '4 Column Footer', description: 'Links and contact columns', preview: '4 Col' },
      { key: 'dark', label: 'Dark Footer', description: 'Dark site footer', preview: 'Dark' },
      { key: 'newsletter', label: 'Newsletter Footer', description: 'Email signup and links', preview: 'Mail' },
      { key: 'contact', label: 'Contact Footer', description: 'Contact details and links', preview: 'Contact' },
      { key: 'minimal', label: 'Minimal Footer', description: 'Compact minimal footer', preview: 'Min' },
      { key: 'social', label: 'Social Footer', description: 'Social links focused footer', preview: 'Share' },
      { key: 'business', label: 'Business Footer', description: 'Business info and navigation', preview: 'Biz' }
];
