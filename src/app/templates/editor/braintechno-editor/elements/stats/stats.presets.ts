import { ElementPreset } from '../../models/editor-block.model';

export const STATS_PRESETS: ElementPreset[] = [
{ key: 'four', label: '4 Stats', description: 'Four business metrics', preview: '4' },
      { key: 'three', label: '3 Stats', description: 'Three large metrics', preview: '3' },
      { key: 'cards', label: 'Stat Cards', description: 'Metrics inside cards', preview: 'Card' },
      { key: 'dark', label: 'Dark Stats', description: 'Dark metric strip', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Stats', description: 'Simple numeric metrics', preview: 'Min' },
      { key: 'accent', label: 'Accent Stats', description: 'Brand-accent numbers', preview: 'Pink' },
      { key: 'percent', label: 'Percent Stats', description: 'Percentage metrics', preview: '%' },
      { key: 'business', label: 'Business Stats', description: 'Clients, projects and years', preview: 'Biz' }
];
