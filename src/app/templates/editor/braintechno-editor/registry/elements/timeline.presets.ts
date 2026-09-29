import { ElementPreset } from '../../models/editor-block.model';

export const TIMELINE_PRESETS: ElementPreset[] = [
{ key: 'steps', label: 'Steps', description: 'Numbered process steps', preview: '1-2-3' },
      { key: 'vertical', label: 'Vertical Timeline', description: 'Vertical milestone list', preview: 'Vert' },
      { key: 'horizontal', label: 'Horizontal Steps', description: 'Horizontal process', preview: 'Horiz' },
      { key: 'cards', label: 'Step Cards', description: 'Steps shown as cards', preview: 'Cards' },
      { key: 'dark', label: 'Dark Timeline', description: 'Dark process section', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Steps', description: 'Clean lightweight steps', preview: 'Min' },
      { key: 'process', label: 'Work Process', description: 'Business process layout', preview: 'Work' },
      { key: 'roadmap', label: 'Roadmap', description: 'Roadmap milestone layout', preview: 'Road' }
];
