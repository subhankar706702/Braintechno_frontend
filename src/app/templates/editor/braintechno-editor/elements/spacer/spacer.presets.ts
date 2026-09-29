import { ElementPreset } from '../../models/editor-block.model';

export const SPACER_PRESETS: ElementPreset[] = [
{ key: 'xs', label: 'Extra Small', description: '16px spacing', preview: '16' },
      { key: 'sm', label: 'Small', description: '32px spacing', preview: '32' },
      { key: 'md', label: 'Medium', description: '48px spacing', preview: '48' },
      { key: 'lg', label: 'Large', description: '72px spacing', preview: '72' },
      { key: 'xl', label: 'Extra Large', description: '96px spacing', preview: '96' },
      { key: 'xxl', label: 'XX Large', description: '128px spacing', preview: '128' },
      { key: 'huge', label: 'Huge', description: '160px spacing', preview: '160' },
      { key: 'custom', label: 'Custom', description: 'Start at 64px and edit', preview: 'Custom' }
];
