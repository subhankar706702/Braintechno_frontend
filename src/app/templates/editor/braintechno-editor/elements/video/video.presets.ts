export interface VideoPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
}

export const VIDEO_PRESETS: VideoPreset[] = [
  { key: 'wide', label: 'Wide', description: 'Wide cinematic presentation', preview: '21:9' },
  { key: 'rounded', label: 'Rounded', description: 'Clean rounded video frame', preview: 'Round' },
  { key: 'card', label: 'Card', description: 'Video inside a soft content card', preview: 'Card' },
  { key: 'shadow', label: 'Shadow', description: 'Elevated video with soft depth', preview: 'Lift' },
  { key: 'full-bleed', label: 'Full Bleed', description: 'Edge-to-edge wide video', preview: 'Full' },
  { key: 'portrait', label: 'Portrait', description: 'Vertical mobile-first video', preview: '9:16' },
  { key: 'square', label: 'Square', description: 'Square social video layout', preview: '1:1' },
  { key: 'cinema', label: 'Cinema', description: 'Ultra-wide cinematic frame', preview: '2.35:1' },
  { key: 'dark', label: 'Dark', description: 'Dark premium video presentation', preview: 'Dark' },
  { key: 'minimal', label: 'Minimal', description: 'Minimal frame with low chrome', preview: 'Clean' },
  { key: 'bordered', label: 'Bordered', description: 'Defined frame around the video', preview: 'Frame' },
  { key: 'poster', label: 'Poster', description: 'Poster-first presentation before play', preview: 'Poster' },
  { key: 'floating', label: 'Floating', description: 'Compact elevated floating video', preview: 'Float' },
  { key: 'compact', label: 'Compact', description: 'Smaller centered video', preview: 'Small' },
  { key: 'theater', label: 'Theater', description: 'Large focused theater-style presentation', preview: 'Focus' }
];
