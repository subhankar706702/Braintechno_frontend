import { ElementPreset } from '../../models/editor-block.model';

export const CHART_PRESETS: ElementPreset[] = [
{ key: 'bar', label: 'Bar Chart', description: 'Simple responsive bar chart', preview: 'Bar' },
      { key: 'line', label: 'Line Chart', description: 'Trend line style', preview: 'Line' },
      { key: 'donut', label: 'Donut Chart', description: 'Circular ratio visual', preview: 'Donut' },
      { key: 'progress', label: 'Progress Bars', description: 'Horizontal progress values', preview: 'Prog' },
      { key: 'cards', label: 'Metric Chart', description: 'Chart inside KPI card', preview: 'KPI' },
      { key: 'dark', label: 'Dark Chart', description: 'Dark analytics card', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Chart', description: 'Low-chrome chart style', preview: 'Min' },
      { key: 'accent', label: 'Accent Chart', description: 'Brand-accent chart', preview: 'Pink' }
];
