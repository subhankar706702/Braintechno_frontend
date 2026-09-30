import { EditorBlock } from '../../models/editor-block.model';
import { createSliderAction, createSliderItem, SliderItem } from './slider.repeat';

const VARIANTS = [
  'hero', 'fullscreen', 'banner', 'card', 'split', 'center', 'fade', 'zoom', 'ken-burns',
  'parallax', 'coverflow', 'product', 'portfolio', 'testimonial', 'logos', 'vertical', 'thumbnail',
  'filmstrip', 'centered-cards', 'multi-card', 'editorial', 'polaroid', 'framed', 'minimal', 'dark',
  'gradient', 'glass', 'bordered', 'offer', 'story'
] as const;

function safeVariant(value: string): string {
  return VARIANTS.includes(value as any) ? value : 'hero';
}

function defaultStyle(variant: string): Record<string, any> {
  const common: Record<string, any> = {
    background: '#FFFFFF',
    backgroundType: 'color',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    gradientFrom: '#FFFFFF',
    gradientTo: '#F1F5F9',
    gradientDirection: '135deg',
    padding: 24,
    align: 'left',
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 400,
    radius: 0,
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: '#E2E8F0',
    borderStyle: 'solid',
    shadow: 'none',
    height: 420,
    mobileHeight: 300,
    gap: 16,
    imageRadius: 0,
    arrowSize: 42,
    dotSize: 8,
    thumbHeight: 64,
    contentMaxWidth: 1180
  };

  const variants: Record<string, Partial<Record<string, any>>> = {
    hero: { height: 460 }, fullscreen: { height: 680, mobileHeight: 560 }, banner: { height: 300, mobileHeight: 230 },
    card: { height: 520, mobileHeight: 500 }, split: { height: 500, mobileHeight: 620 }, center: { height: 420, contentMaxWidth: 980 },
    fade: { height: 500 }, zoom: { height: 460 }, 'ken-burns': { height: 520 }, parallax: { height: 500 },
    coverflow: { height: 460, gap: 18 }, product: { height: 440, mobileHeight: 560 }, portfolio: { height: 520 },
    testimonial: { height: 430, mobileHeight: 520 }, logos: { height: 260, mobileHeight: 220 }, vertical: { height: 620, mobileHeight: 520, contentMaxWidth: 760 },
    thumbnail: { height: 480, thumbHeight: 68 }, filmstrip: { height: 500, thumbHeight: 58 }, 'centered-cards': { height: 430, gap: 20 },
    'multi-card': { height: 380, gap: 18 }, editorial: { height: 520, mobileHeight: 640 }, polaroid: { height: 560, mobileHeight: 520 },
    framed: { height: 500 }, minimal: { height: 420 }, dark: { height: 470 }, gradient: { height: 470 }, glass: { height: 500, mobileHeight: 560 },
    bordered: { height: 430 }, offer: { height: 460, mobileHeight: 560 }, story: { height: 520, mobileHeight: 620 }
  };

  return { ...common, ...(variants[variant] || {}) };
}

function makeItem(index: number): SliderItem {
  const item = createSliderItem(index);
  if (index === 0) {
    item.eyebrow = 'FEATURED';
    item.title = 'Your slider headline';
    item.subtitle = 'Add a short supporting message for this slide.';
    item.description = '';
    item.buttonText = 'Learn More';
    item.showButton = true;
    item.buttonAction = {
      ...createSliderAction(),
      type: 'website',
      url: '#'
    };
  }
  return item;
}

export function createSliderBlock(id: string, variant = 'hero'): EditorBlock {
  const safe = safeVariant(String(variant));
  const items = [makeItem(0), makeItem(1), makeItem(2)];

  return {
    id,
    type: 'slider',
    content: {
      variant: safe,
      items,
      images: items.map(item => item.image),
      mediaIds: items.map(item => item.mediaId),
      maxSlides: 6,
      transition: safe === 'fade' ? 'fade' : safe === 'zoom' ? 'zoom' : 'slide',
      transitionSpeed: 600,
      interval: 3500,
      autoplay: true,
      pauseOnHover: true,
      pauseOnInteraction: true,
      loop: true,
      swipe: true,
      keyboard: true,
      lazyLoad: true,
      showArrows: true,
      showDots: true,
      showCounter: false,
      showProgress: false,
      showThumbnails: ['thumbnail', 'filmstrip'].includes(safe),
      slidesPerView: ['multi-card', 'centered-cards', 'coverflow'].includes(safe) ? 3 : 1,
      mobileSlidesPerView: 1,
      objectFit: safe === 'logos' ? 'contain' : 'cover',
      objectPosition: 'center',
      captionPosition: ['split', 'product', 'editorial'].includes(safe) ? 'side' : 'bottom',
      captionAlign: ['center', 'testimonial', 'story'].includes(safe) ? 'center' : 'left',
      arrowPosition: 'inside',
      arrowStyle: 'circle',
      dotStyle: 'circle',
      thumbnailPosition: 'bottom'
    },
    style: defaultStyle(safe)
  };
}
