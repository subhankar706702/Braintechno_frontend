import { ElementPreset } from '../../models/editor-block.model';

export const STATS_PRESETS: ElementPreset[] = [
  { key: 'four', label: '4 Stats', description: 'Four balanced business metrics', preview: '4' },
  { key: 'three', label: '3 Stats', description: 'Three large metrics with breathing room', preview: '3' },
  { key: 'cards', label: 'Stat Cards', description: 'Metrics inside individual cards', preview: 'Card' },
  { key: 'dark', label: 'Dark Stats', description: 'High-contrast dark metric strip', preview: 'Dark' },
  { key: 'minimal', label: 'Minimal', description: 'Simple numbers with clean spacing', preview: 'Min' },
  { key: 'accent', label: 'Accent', description: 'Strong brand-accent numbers', preview: 'Accent' },
  { key: 'percent', label: 'Percent', description: 'Percentage-focused KPI display', preview: '%' },
  { key: 'business', label: 'Business KPIs', description: 'Clients, projects, years and support', preview: 'Biz' },
  { key: 'side-side', label: 'Side by Side', description: 'Metrics arranged in a clean horizontal row', preview: '↔' },
  { key: 'dropdown', label: 'Dropdown Mobile', description: 'Desktop grid with mobile accordion/dropdown', preview: '⌄' },
  { key: 'icon', label: 'Icon Stats', description: 'Metric cards led by an icon', preview: 'Icon' },
  { key: 'progress', label: 'Progress KPIs', description: 'Metrics shown with progress bars', preview: 'Bar' },
  { key: 'split', label: 'Split Highlight', description: 'Two-column highlighted KPI layout', preview: 'Split' },
  { key: 'featured', label: 'Featured + List', description: 'One featured metric with supporting stats', preview: 'Hero' },
  { key: 'photo-bg', label: 'Photo Background', description: 'Stats over a responsive background image', preview: 'Photo' }
];


export function repeatStatsItemTemplate(
  _editor: any,
  index: number,
  _key: string
): Record<string, any> {
  return {
    icon: 'monitoring',
    value: '100+',
    prefix: '',
    suffix: '',
    label: `Metric ${index + 1}`,
    text: '',
    progress: 0
  };
}