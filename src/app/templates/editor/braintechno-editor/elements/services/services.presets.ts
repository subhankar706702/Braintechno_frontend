import { ElementPreset } from '../../models/editor-block.model';

export const SERVICES_PRESETS: ElementPreset[] = [
{ key: 'three', label: '3 Cards', description: 'Three balanced service cards', preview: '3' },
      { key: 'four', label: '4 Compact', description: 'Four compact service cards', preview: '4' },
      { key: 'icons', label: 'Icon Services', description: 'Icon-first services with clean content', preview: 'Icon' },
      { key: 'image-cards', label: 'Image Services', description: 'Large image-led service cards', preview: 'Img' },
      { key: 'minimal', label: 'Minimal List', description: 'Simple text and action service list', preview: 'List' },
      { key: 'dark', label: 'Dark Premium', description: 'High contrast premium services', preview: 'Dark' },
      { key: 'numbers', label: 'Numbered Process', description: 'Services presented like steps', preview: '01' },
      { key: 'split', label: 'Split Media', description: 'Image and content split layout', preview: 'Split' },
      { key: 'soft', label: 'Soft Cards', description: 'Soft tinted service cards', preview: 'Soft' },
      { key: 'horizontal', label: 'Left Right Scroll', description: 'Horizontal scrollable service cards', preview: '↔' },
      { key: 'showcase', label: 'Featured Showcase', description: 'One featured service with compact items', preview: 'Show' },
      { key: 'booking', label: 'Bookable Services', description: 'Service cards with booking actions', preview: 'Book' },
      { key: 'commands', label: 'Command Actions', description: 'Call, WhatsApp, email and direct actions', preview: 'Cmd' },
      { key: 'links', label: 'Link Services', description: 'Clean service links and arrows', preview: '→' },
      { key: 'dropdown', label: 'Mobile Dropdown', description: 'Desktop cards that become dropdown list on mobile', preview: '⌄' }
];
