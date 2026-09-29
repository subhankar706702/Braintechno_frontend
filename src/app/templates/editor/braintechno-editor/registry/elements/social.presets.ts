import { ElementPreset } from '../../models/editor-block.model';

export const SOCIAL_PRESETS: ElementPreset[] = [
{ key: 'logo-only', label: 'Logo Only', description: 'Social logo without text', preview: 'Logo' },
      { key: 'logo-name', label: 'Logo + Name', description: 'Logo with social name', preview: 'L+N' },
      { key: 'logo-round', label: 'Logo Round', description: 'Round social logo style', preview: '◯' },
      { key: 'logo-square', label: 'Logo Square', description: 'Square social logo style', preview: '□' },
      { key: 'logo-hover', label: 'Logo Hover', description: 'Logo with hover interaction', preview: 'Hover' },
      { key: 'logo-url-left', label: 'Left + URL', description: 'Logo, name and URL aligned left', preview: 'L+URL' },
      { key: 'logo-url-center', label: 'Center + URL', description: 'Logo, name and URL centered', preview: 'C+URL' },
      { key: 'logo-url-right', label: 'Right + URL', description: 'Logo, name and URL aligned right', preview: 'R+URL' },
      { key: 'logo-circle-name', label: 'Circle + Name', description: 'Circle logo with social name', preview: '◯+N' },
      { key: 'logo-square-name', label: 'Square + Name', description: 'Square logo with social name', preview: '□+N' },
      { key: 'logo-card', label: 'Logo Cards', description: 'Social links as cards', preview: 'Cards' },
      { key: 'logo-outline', label: 'Logo Outline', description: 'Outlined social links', preview: 'Outline' },
      { key: 'logo-soft', label: 'Logo Soft', description: 'Soft background social links', preview: 'Soft' },
      { key: 'logo-dark', label: 'Logo Dark', description: 'Dark premium social links', preview: 'Dark' },
      { key: 'logo-footer', label: 'Logo Footer', description: 'Compact footer social layout', preview: 'Footer' }
];
