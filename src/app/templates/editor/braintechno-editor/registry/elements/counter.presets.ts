import { ElementPreset } from '../../models/editor-block.model';

export const COUNTER_PRESETS: ElementPreset[] = [
{ key: 'number', label: 'Big Number', description: 'Large animated number', preview: '100+' },
      { key: 'card', label: 'Counter Card', description: 'Number inside a card', preview: 'Card' },
      { key: 'soft', label: 'Soft Counter', description: 'Soft background statistic', preview: 'Soft' },
      { key: 'dark', label: 'Dark Counter', description: 'Dark metric card', preview: 'Dark' },
      { key: 'compact', label: 'Compact Metric', description: 'Small inline metric', preview: 'Mini' },
      { key: 'accent', label: 'Accent Metric', description: 'Brand accent statistic', preview: 'Pink' },
      { key: 'percentage', label: 'Percentage', description: 'Percentage metric', preview: '98%' },
      { key: 'money', label: 'Currency Metric', description: 'Revenue/value counter', preview: '₹' }
];
