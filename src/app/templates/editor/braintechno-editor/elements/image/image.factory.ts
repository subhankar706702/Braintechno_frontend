import { EditorBlock } from '../../models/editor-block.model';

const styleByVariant: Record<string, Record<string, any>> = {
  banner: { imageWidth: 100, imageHeight: 42, objectFit: 'cover', radius: 0, shadow: 'none' },
  rounded: { imageWidth: 100, imageHeight: 56, objectFit: 'cover', radius: 20, shadow: 'none' },
  card: { imageWidth: 100, imageHeight: 56, objectFit: 'cover', radius: 16, background: '#F8FAFC', padding: 16, borderColor: '#E2E8F0', borderWidth: 1 },
  compact: { imageWidth: 62, imageHeight: 38, objectFit: 'cover', radius: 12, align: 'left' },
  shadow: { imageWidth: 100, imageHeight: 56, objectFit: 'cover', radius: 18, shadow: 'medium' },
  square: { imageWidth: 100, imageHeight: 100, objectFit: 'cover', radius: 16 },
  portrait: { imageWidth: 72, imageHeight: 100, objectFit: 'cover', radius: 18, align: 'center' },
  circle: { imageWidth: 42, imageHeight: 42, objectFit: 'cover', radius: 999, align: 'center' },
  bordered: { imageWidth: 100, imageHeight: 56, objectFit: 'cover', radius: 0, borderColor: '#CBD5E1', borderWidth: 2 },
  'full-bleed': { imageWidth: 100, imageHeight: 48, objectFit: 'cover', radius: 0, padding: 0 },
  polaroid: { imageWidth: 76, imageHeight: 76, objectFit: 'cover', radius: 0, background: '#FFFFFF', padding: 12, borderColor: '#E2E8F0', borderWidth: 1, shadow: 'soft' },
  frame: { imageWidth: 88, imageHeight: 62, objectFit: 'cover', radius: 2, borderColor: '#111827', borderWidth: 8, shadow: 'soft' },
  'overlay-caption': { imageWidth: 100, imageHeight: 58, objectFit: 'cover', radius: 18, shadow: 'medium' },
  'gradient-overlay': { imageWidth: 100, imageHeight: 58, objectFit: 'cover', radius: 18, shadow: 'medium' },
  editorial: { imageWidth: 52, imageHeight: 82, objectFit: 'cover', radius: 4, align: 'center' },
  split: { imageWidth: 52, imageHeight: 68, objectFit: 'cover', radius: 18, align: 'left', background: '#F8FAFC' },
  'before-after': { imageWidth: 48, imageHeight: 62, objectFit: 'cover', radius: 14, gap: 12 },
  'hover-zoom': { imageWidth: 100, imageHeight: 58, objectFit: 'cover', radius: 18, shadow: 'soft' },
  'tilt-card': { imageWidth: 82, imageHeight: 68, objectFit: 'cover', radius: 18, shadow: 'medium', background: '#FFFFFF', padding: 14 },
  cutout: { imageWidth: 76, imageHeight: 84, objectFit: 'cover', radius: 0, align: 'center', shadow: 'soft' },
  duotone: { imageWidth: 100, imageHeight: 60, objectFit: 'cover', radius: 18, shadow: 'soft', duoColor: '#FF4D6D' },
  monochrome: { imageWidth: 100, imageHeight: 60, objectFit: 'cover', radius: 12 },
  ring: { imageWidth: 42, imageHeight: 42, objectFit: 'cover', radius: 999, align: 'center', ringWidth: 6, ringColor: '#FF4D6D' },
  magazine: { imageWidth: 58, imageHeight: 78, objectFit: 'cover', radius: 0, align: 'center' }
};

export function createImageBlock(id: string, variant = 'banner'): EditorBlock {
  const safeVariant = styleByVariant[variant] ? variant : 'banner';
  return {
    id,
    type: 'image',
    content: {
      variant: safeVariant,
      url: '',
      mediaId: null,
      alt: 'Image',
      caption: '',
      linkUrl: '',
      linkTarget: '_self',
      lazy: true,
      afterUrl: '',
      afterMediaId: null,
      beforeLabel: 'Before',
      afterLabel: 'After'
    },
    style: {
      background: '#FFFFFF',
      backgroundType: 'color',
      backgroundImage: '',
      backgroundMediaId: null,
      padding: 24,
      marginTop: 0,
      marginBottom: 0,
      align: 'center',
      color: '#0F172A',
      fontSize: 14,
      fontWeight: 400,
      radius: 0,
      borderWidth: 0,
      borderColor: '#E2E8F0',
      borderStyle: 'solid',
      shadow: 'none',
      objectFit: 'cover',
      objectPosition: 'center',
      ...styleByVariant[safeVariant]
    }
  };
}
