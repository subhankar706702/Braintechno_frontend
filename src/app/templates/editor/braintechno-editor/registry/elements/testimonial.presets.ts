import { ElementPreset } from '../../models/editor-block.model';

export const TESTIMONIAL_PRESETS: ElementPreset[] = [
{ key: 'single', label: 'Single Review', description: 'Focused testimonial card', preview: '1' },
      { key: 'three', label: '3 Reviews', description: 'Three review cards', preview: '3' },
      { key: 'quote', label: 'Quote Review', description: 'Large quote layout', preview: 'Quote' },
      { key: 'rating', label: 'Rating Review', description: 'Stars and customer review', preview: '5★' },
      { key: 'dark', label: 'Dark Review', description: 'Dark testimonial section', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Review', description: 'Simple text review', preview: 'Min' },
      { key: 'profile', label: 'Profile Review', description: 'Avatar placeholder and review', preview: 'User' },
      { key: 'featured', label: 'Featured Review', description: 'Prominent highlighted quote', preview: 'Best' }
];
