import { ElementPreset } from '../../models/editor-block.model';

export const TABS_PRESETS: ElementPreset[] = [
{ key: 'simple', label: 'Simple Tabs', description: 'Three simple tabs', preview: 'Tabs' },
      { key: 'pills', label: 'Pill Tabs', description: 'Rounded pill navigation', preview: 'Pill' },
      { key: 'underline', label: 'Underline Tabs', description: 'Underline active tab', preview: 'Line' },
      { key: 'cards', label: 'Card Tabs', description: 'Tabs in card container', preview: 'Card' },
      { key: 'dark', label: 'Dark Tabs', description: 'Dark tab section', preview: 'Dark' },
      { key: 'services', label: 'Service Tabs', description: 'Tabbed service content', preview: 'Svc' },
      { key: 'features', label: 'Feature Tabs', description: 'Tabbed product features', preview: 'Feat' },
      { key: 'compact', label: 'Compact Tabs', description: 'Small compact tabs', preview: 'Small' }
];
