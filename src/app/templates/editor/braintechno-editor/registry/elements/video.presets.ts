import { ElementPreset } from '../../models/editor-block.model';

export const VIDEO_PRESETS: ElementPreset[] = [
{ key: 'youtube', label: 'YouTube', description: 'Responsive YouTube embed', preview: 'YT' },
      { key: 'wide', label: 'Wide Video', description: '16:9 wide player', preview: '16:9' },
      { key: 'rounded', label: 'Rounded Player', description: 'Rounded video frame', preview: 'Round' },
      { key: 'card', label: 'Video Card', description: 'Video inside bordered card', preview: 'Card' },
      { key: 'portrait', label: 'Portrait Reel', description: '9:16 short video layout', preview: '9:16' },
      { key: 'direct', label: 'Direct MP4', description: 'HTML5 video URL player', preview: 'MP4' },
      { key: 'autoplay', label: 'Autoplay Muted', description: 'Muted autoplay hero video', preview: 'Auto' },
      { key: 'minimal', label: 'Minimal', description: 'Simple clean player', preview: 'Min' }
];
