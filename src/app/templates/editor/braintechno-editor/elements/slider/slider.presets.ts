export interface SliderPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
}

/**
 * Slider presets are intentionally layout-driven. The renderer uses the
 * preset key to switch structure, spacing and content placement — not just
 * colours.
 */
export const SLIDER_PRESETS: SliderPreset[] = [
  { key: 'hero', label: 'Hero', description: 'Full visual hero with bottom overlay content', preview: 'Hero' },
  { key: 'fullscreen', label: 'Fullscreen', description: 'Tall viewport-style visual story', preview: 'Full' },
  { key: 'banner', label: 'Wide Banner', description: 'Shallow campaign banner carousel', preview: 'Banner' },
  { key: 'card', label: 'Card', description: 'Image card with content below', preview: 'Card' },
  { key: 'split', label: 'Split', description: 'Text panel beside a large image', preview: 'Split' },
  { key: 'center', label: 'Centered', description: 'Centered visual with generous whitespace', preview: 'Center' },
  { key: 'fade', label: 'Fade', description: 'Cross-fading single-image presentation', preview: 'Fade' },
  { key: 'zoom', label: 'Zoom', description: 'Subtle active-slide zoom treatment', preview: 'Zoom' },
  { key: 'ken-burns', label: 'Ken Burns', description: 'Slow cinematic pan and zoom', preview: 'KB' },
  { key: 'parallax', label: 'Parallax', description: 'Deep image crop with layered movement', preview: 'Para' },
  { key: 'coverflow', label: 'Coverflow', description: 'Center-focused card carousel', preview: '3D' },
  { key: 'product', label: 'Product', description: 'Product image with clean purchase content', preview: 'Shop' },
  { key: 'portfolio', label: 'Portfolio', description: 'Large work preview with project metadata', preview: 'Work' },
  { key: 'testimonial', label: 'Testimonial', description: 'Quote-led testimonial layout', preview: 'Quote' },
  { key: 'logos', label: 'Logo Strip', description: 'Brand/logo-first presentation', preview: 'Logo' },
  { key: 'vertical', label: 'Vertical', description: 'Narrow tall visual slide', preview: 'Vert' },
  { key: 'thumbnail', label: 'Thumbnails', description: 'Main slide with selectable thumbnail rail', preview: 'Thumb' },
  { key: 'filmstrip', label: 'Filmstrip', description: 'Main visual with filmstrip navigation', preview: 'Film' },
  { key: 'centered-cards', label: 'Centered Cards', description: 'Focused centre card with neighbouring cards', preview: '3' },
  { key: 'multi-card', label: 'Multi Card', description: 'Multiple cards visible at the same time', preview: 'Multi' },
  { key: 'editorial', label: 'Editorial', description: 'Asymmetric magazine-style composition', preview: 'Edit' },
  { key: 'polaroid', label: 'Polaroid', description: 'Photo-card with white paper caption area', preview: 'Photo' },
  { key: 'framed', label: 'Framed', description: 'Clean image with visible frame treatment', preview: 'Frame' },
  { key: 'minimal', label: 'Minimal', description: 'Image-first slider with restrained controls', preview: 'Min' },
  { key: 'dark', label: 'Dark Premium', description: 'Dark presentation with strong contrast', preview: 'Dark' },
  { key: 'gradient', label: 'Gradient Overlay', description: 'Strong gradient overlay for readable captions', preview: 'Grad' },
  { key: 'glass', label: 'Glass', description: 'Frosted glass content panel over image', preview: 'Glass' },
  { key: 'bordered', label: 'Bordered', description: 'Simple framed slider without heavy chrome', preview: 'Border' },
  { key: 'offer', label: 'Offer', description: 'Campaign/discount focused promotional slider', preview: 'Offer' },
  { key: 'story', label: 'Story', description: 'Storytelling slide with chapter-style content', preview: 'Story' }
];
