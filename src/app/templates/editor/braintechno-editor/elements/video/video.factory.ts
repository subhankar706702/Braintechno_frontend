import { EditorBlock } from '../../models/editor-block.model';

const styleByVariant: Record<string, Record<string, any>> = {
  wide: { maxWidth: '100%', aspect: '21/9', radius: 12, shadow: 'none', background: '#0F172A' },
  rounded: { maxWidth: '100%', aspect: '16/9', radius: 20, shadow: 'none', background: '#0F172A' },
  card: { maxWidth: '100%', aspect: '16/9', radius: 18, shadow: 'soft', background: '#F8FAFC', padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  shadow: { maxWidth: '100%', aspect: '16/9', radius: 18, shadow: 'medium', background: '#0F172A' },
  'full-bleed': { maxWidth: '100%', aspect: '21/9', radius: 0, shadow: 'none', background: '#0F172A', padding: 0 },
  portrait: { maxWidth: '420px', aspect: '9/16', radius: 18, shadow: 'soft', background: '#0F172A', align: 'center' },
  square: { maxWidth: '520px', aspect: '1/1', radius: 18, shadow: 'soft', background: '#0F172A', align: 'center' },
  cinema: { maxWidth: '100%', aspect: '2.35/1', radius: 14, shadow: 'medium', background: '#000000' },
  dark: { maxWidth: '100%', aspect: '16/9', radius: 16, shadow: 'none', background: '#020617', color: '#FFFFFF', padding: 18 },
  minimal: { maxWidth: '100%', aspect: '16/9', radius: 8, shadow: 'none', background: '#FFFFFF', padding: 8 },
  bordered: { maxWidth: '100%', aspect: '16/9', radius: 12, shadow: 'none', background: '#FFFFFF', padding: 8, borderWidth: 2, borderColor: '#CBD5E1' },
  poster: { maxWidth: '100%', aspect: '16/9', radius: 16, shadow: 'medium', background: '#0F172A' },
  floating: { maxWidth: '720px', aspect: '16/9', radius: 22, shadow: 'strong', background: '#0F172A', align: 'center', padding: 14 },
  compact: { maxWidth: '720px', aspect: '16/9', radius: 14, shadow: 'soft', background: '#0F172A', align: 'center', padding: 10 },
  theater: { maxWidth: '1100px', aspect: '16/9', radius: 10, shadow: 'strong', background: '#020617', align: 'center', padding: 22 }
};

export function createVideoBlock(id: string, variant = 'wide'): EditorBlock {
  const safeVariant = styleByVariant[variant] ? variant : 'wide';
  return {
    id,
    type: 'video',
    content: {
      variant: safeVariant,
      provider: 'auto',
      url: '',
      title: 'Featured video',
      caption: '',
      poster: '',
      posterMediaId: null,
      controls: true,
      autoplay: false,
      muted: false,
      loop: false,
      playsinline: true,
      start: 0,
      end: 0,
      lazy: true
    },
    style: {
      background: '#0F172A',
      backgroundType: 'color',
      backgroundImage: '',
      backgroundMediaId: null,
      padding: 18,
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
      maxWidth: '100%',
      aspect: '16/9',
      objectFit: 'cover',
      ...styleByVariant[safeVariant]
    }
  };
}
