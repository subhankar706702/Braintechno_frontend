import { ElementPreset } from '../../models/editor-block.model';

export const TEAM_PRESETS: ElementPreset[] = [
  { key: 'classic-grid', label: 'Classic Team Grid', description: 'Balanced team profile grid with photo and role', preview: 'Grid' },
  { key: 'cards', label: 'Team Cards', description: 'Premium cards with image, bio and details', preview: 'Cards' },
  { key: 'minimal', label: 'Minimal Team', description: 'Clean people list with compact profile treatment', preview: 'Min' },
  { key: 'list', label: 'Team List', description: 'Horizontal profile rows for detailed teams', preview: 'List' },
  { key: 'alternating', label: 'Alternating Team', description: 'Profile story blocks alternating left and right', preview: 'Alt' },
  { key: 'featured', label: 'Featured + Grid', description: 'One highlighted member followed by smaller profiles', preview: 'Featured' },
  { key: 'portrait', label: 'Large Portrait', description: 'Large editorial-style portrait profiles', preview: 'Portrait' },
  { key: 'circular', label: 'Circular Team', description: 'Circle portraits with centered profile content', preview: 'Circle' },
  { key: 'social-bar', label: 'Social Bar', description: 'Profiles with a dedicated social action row', preview: 'Social' },
  { key: 'overlay', label: 'Photo Overlay', description: 'Profile information layered over the portrait', preview: 'Overlay' },
  { key: 'split', label: 'Team Split', description: 'Large introduction area paired with profile cards', preview: 'Split' },
  { key: 'slider', label: 'Team Slider', description: 'Horizontal swipe and scroll team profiles', preview: 'Slider' },
  { key: 'departments', label: 'Departments', description: 'Team organized visually by department badges', preview: 'Dept' },
  { key: 'journey', label: 'Team Journey', description: 'Member journey and experience focused layout', preview: 'Journey' },
  { key: 'executive', label: 'Executive Premium', description: 'High-contrast premium leadership presentation', preview: 'Exec' }
];
