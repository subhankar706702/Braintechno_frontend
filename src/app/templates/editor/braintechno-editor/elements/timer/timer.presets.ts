import { ElementPreset } from '../../models/editor-block.model';

export const TIMER_PRESETS: ElementPreset[] = [
{ key: 'classic', label: 'Classic Countdown', description: 'Days, hours, minutes, seconds', preview: 'D:H:M:S' },
      { key: 'cards', label: 'Timer Cards', description: 'Separate number cards', preview: 'Cards' },
      { key: 'minimal', label: 'Minimal Timer', description: 'Simple inline countdown', preview: 'Min' },
      { key: 'dark', label: 'Dark Timer', description: 'Dark campaign countdown', preview: 'Dark' },
      { key: 'sale', label: 'Sale Countdown', description: 'Urgent sale countdown', preview: 'Sale' },
      { key: 'event', label: 'Event Countdown', description: 'Event launch countdown', preview: 'Event' },
      { key: 'pill', label: 'Pill Timer', description: 'Rounded timer units', preview: 'Pill' },
      { key: 'compact', label: 'Compact', description: 'Space-saving countdown', preview: 'Small' }
];
