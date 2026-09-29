import { ElementPreset } from '../../models/editor-block.model';

export const PRICING_PRESETS: ElementPreset[] = [
{ key: 'three', label: '3 Plans', description: 'Three pricing cards', preview: '3' },
      { key: 'featured', label: 'Featured Plan', description: 'Highlight middle plan', preview: 'Best' },
      { key: 'single', label: 'Single Plan', description: 'One focused pricing card', preview: '1' },
      { key: 'two', label: '2 Plans', description: 'Two comparison plans', preview: '2' },
      { key: 'dark', label: 'Dark Pricing', description: 'Dark pricing cards', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Pricing', description: 'Low-chrome pricing layout', preview: 'Min' },
      { key: 'monthly', label: 'Monthly Plans', description: 'Monthly pricing labels', preview: '/mo' },
      { key: 'service', label: 'Service Pricing', description: 'Service/package pricing', preview: 'Svc' }
];
