import { ElementPreset } from '../../models/editor-block.model';

export const BUTTON_PRESETS: ElementPreset[] = [
{ key: 'primary', label: 'Primary', description: 'Solid brand CTA', preview: 'Primary' },
      { key: 'outline', label: 'Outline', description: 'Border-only button', preview: 'Outline' },
      { key: 'pill', label: 'Pill', description: 'Fully rounded CTA', preview: 'Pill' },
      { key: 'full', label: 'Full Width', description: 'Wide block button', preview: 'Full' },
      { key: 'soft', label: 'Soft', description: 'Light brand background', preview: 'Soft' },
      { key: 'dark', label: 'Dark', description: 'Dark premium CTA', preview: 'Dark' },
      { key: 'gradient', label: 'Gradient', description: 'Modern gradient action', preview: 'Grad' },
      { key: 'glass', label: 'Glass', description: 'Soft translucent button', preview: 'Glass' },
      { key: 'icon-left', label: 'Icon Left', description: 'CTA with leading icon feel', preview: 'Icon' },
      { key: 'danger', label: 'Alert CTA', description: 'Strong red attention button', preview: 'Alert' }
];
