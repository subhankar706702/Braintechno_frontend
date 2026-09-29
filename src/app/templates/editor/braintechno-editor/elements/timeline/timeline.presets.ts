import { ElementPreset } from '../../models/editor-block.model';

export const TIMELINE_PRESETS: ElementPreset[] = [
  { key: 'classic-vertical', label: 'Classic Vertical', description: 'Centered vertical timeline with alternating milestones.', preview: 'Classic' },
  { key: 'left-aligned', label: 'Left Aligned', description: 'Timeline rail on the left with a clean content column.', preview: 'Left' },
  { key: 'right-aligned', label: 'Right Aligned', description: 'Timeline rail on the right with content flowing beside it.', preview: 'Right' },
  { key: 'alternating', label: 'Alternating', description: 'Milestones alternate from left to right around the main rail.', preview: 'Alt' },
  { key: 'cards', label: 'Card Timeline', description: 'Each milestone is presented in its own card.', preview: 'Cards' },
  { key: 'minimal', label: 'Minimal', description: 'Lightweight date and title treatment with minimal decoration.', preview: 'Min' },
  { key: 'numbered', label: 'Numbered', description: 'Large numbered markers create a clear step sequence.', preview: '01 02' },
  { key: 'icon', label: 'Icon Timeline', description: 'Icon-led milestones with a strong visual marker.', preview: 'Icons' },
  { key: 'date-badge', label: 'Date Badge', description: 'Prominent date badges pair with the timeline content.', preview: 'Dates' },
  { key: 'process', label: 'Process Steps', description: 'Business workflow with status-aware milestones.', preview: 'Flow' },
  { key: 'milestone', label: 'Milestones', description: 'Large milestone moments with optional badges and status.', preview: 'Mile' },
  { key: 'image', label: 'Image Timeline', description: 'Timeline entries with supporting images and actions.', preview: 'Image' },
  { key: 'featured', label: 'Featured Timeline', description: 'First milestone is highlighted while others remain compact.', preview: 'Feature' },
  { key: 'horizontal', label: 'Horizontal', description: 'Desktop-first horizontal timeline that becomes vertical on mobile.', preview: 'Horiz' },
  { key: 'scrollable', label: 'Scrollable', description: 'Horizontally scrollable milestone sequence with status markers.', preview: 'Scroll' }
];
