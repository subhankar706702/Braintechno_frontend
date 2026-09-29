import { ElementPreset } from '../../models/editor-block.model';

export const TABS_PRESETS: ElementPreset[] = [
  { key: 'simple', label: 'Classic Tabs', description: 'Clean horizontal tabs with a simple active state', preview: 'Tabs' },
  { key: 'pills', label: 'Pill Tabs', description: 'Rounded pill navigation with soft active background', preview: 'Pill' },
  { key: 'underline', label: 'Underline Tabs', description: 'Editorial tabs with a strong active underline', preview: 'Line' },
  { key: 'boxes', label: 'Box Tabs', description: 'Each tab is a separate outlined box', preview: 'Box' },
  { key: 'cards', label: 'Card Tabs', description: 'Tabs inside a bordered card container', preview: 'Card' },
  { key: 'vertical-left', label: 'Vertical Left', description: 'Tabs on the left with content on the right', preview: 'Left' },
  { key: 'vertical-right', label: 'Vertical Right', description: 'Tabs on the right with content on the left', preview: 'Right' },
  { key: 'icon', label: 'Icon Tabs', description: 'Icon plus title navigation', preview: 'Icon' },
  { key: 'icon-only', label: 'Icon Only', description: 'Compact icon navigation for dense layouts', preview: 'Icons' },
  { key: 'numbered', label: 'Numbered Tabs', description: '01, 02, 03 style navigation', preview: '01' },
  { key: 'segmented', label: 'Segmented Tabs', description: 'Connected segmented-control navigation', preview: 'Seg' },
  { key: 'scrollable', label: 'Scrollable Tabs', description: 'Wide tab row designed for horizontal scrolling', preview: '↔' },
  { key: 'dropdown', label: 'Dropdown / Accordion', description: 'Compact selector that becomes accordion-friendly on mobile', preview: '⌄' },
  { key: 'image', label: 'Image Tabs', description: 'Thumbnail-led tabs with visual content', preview: 'Img' },
  { key: 'feature', label: 'Feature Tabs', description: 'Large content area with media and CTA', preview: 'Feat' }
];
