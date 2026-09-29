import { EditorBlock } from '../../models/editor-block.model';

/**
 * Keep the original 10 Heading preset keys for backward compatibility and
 * add 5 genuinely different layouts: numbered, icon, split, highlight, image.
 * The preset registry exposes exactly 15 selectable styles.
 */
const MAP: Record<string, Record<string, any>> = {
  hero: { fontSize: 52, fontWeight: 900, align: 'center', color: '#0F172A', padding: 30 },
  'section-title': { fontSize: 30, fontWeight: 800, align: 'left', color: '#0F172A', padding: 18 },
  center: { fontSize: 34, fontWeight: 800, align: 'center', color: '#0F172A', padding: 16 },
  accent: { fontSize: 34, fontWeight: 800, align: 'left', color: '#FF4D6D', padding: 16 },
  compact: { fontSize: 24, fontWeight: 700, align: 'left', color: '#0F172A', padding: 12 },
  display: { fontSize: 60, fontWeight: 900, align: 'center', color: '#0F172A', padding: 34 },
  eyebrow: { fontSize: 34, fontWeight: 850, align: 'left', color: '#0F172A', padding: 18 },
  underline: { fontSize: 34, fontWeight: 850, align: 'left', color: '#0F172A', padding: 18, headingDecoration: 'underline' },
  serif: { fontSize: 42, fontWeight: 700, align: 'left', color: '#111827', padding: 20, fontFamily: 'Georgia, serif' },
  gradient: { fontSize: 46, fontWeight: 900, align: 'center', color: '#7C3AED', padding: 24, textGradient: true },
  numbered: { fontSize: 30, fontWeight: 850, align: 'left', color: '#0F172A', padding: 18, showNumber: true },
  icon: { fontSize: 30, fontWeight: 800, align: 'left', color: '#0F172A', padding: 18, showIcon: true },
  split: { fontSize: 36, fontWeight: 900, align: 'left', color: '#0F172A', padding: 20, splitLayout: true },
  highlight: { fontSize: 36, fontWeight: 900, align: 'left', color: '#0F172A', padding: 20, highlightWord: true },
  image: { fontSize: 42, fontWeight: 900, align: 'left', color: '#FFFFFF', padding: 32, background: '#0F172A', backgroundType: 'image', backgroundImage: '', overlay: 'rgba(15,23,42,.58)' },

  // Legacy-only key. It is intentionally not exposed as a selectable preset.
  classic: { fontSize: 32, fontWeight: 700, align: 'left', color: '#0F172A', padding: 18 }
};

export function createHeadingBlock(_parent: any, base: EditorBlock, variant: string): EditorBlock {
  const key = MAP[variant] ? variant : 'section-title';
  const v = MAP[key];
  const centered = v.align === 'center';

  return {
    ...base,
    content: {
      variant: key,
      text: 'Your Heading',
      level: ['hero', 'display', 'image'].includes(key) ? 'h1' : ['compact', 'numbered', 'icon'].includes(key) ? 'h3' : 'h2',
      eyebrow: ['eyebrow', 'hero', 'image'].includes(key) ? 'INTRODUCING' : '',
      subtitle: ['hero', 'center', 'display', 'split'].includes(key) ? 'Add a supporting line here.' : '',
      description: key === 'split' ? 'Add supporting content on the right side.' : '',
      number: key === 'numbered' ? '01' : '',
      icon: key === 'icon' ? 'auto_awesome' : '',
      highlight: key === 'highlight' ? 'Heading' : '',
      linkLabel: key === 'split' ? 'Learn More' : '',
      linkUrl: '#'
    },
    style: {
      ...base.style,
      background: v.background || base.style['background'] || '#FFFFFF',
      backgroundType: v.backgroundType || 'color',
      backgroundImage: v.backgroundImage || '',
      overlay: v.overlay || 'transparent',
      fontSize: v.fontSize,
      fontWeight: v.fontWeight,
      align: v.align,
      color: v.color,
      padding: v.padding,
      fontFamily: v.fontFamily || base.style['fontFamily'],
      headingDecoration: v.headingDecoration || '',
      showNumber: !!v.showNumber,
      showIcon: !!v.showIcon,
      splitLayout: !!v.splitLayout,
      textGradient: !!v.textGradient,
      highlightWord: !!v.highlightWord,
      accent: '#FF4D6D',
      highlightColor: '#FFE8EE',
      subtitleColor: '#475569',
      descriptionColor: '#64748B',
      iconBackground: 'rgba(255,77,109,.10)',
      maxWidth: centered ? 860 : key === 'split' ? 1100 : 920,
      mobileFontSize: Math.max(22, Math.round(v.fontSize * 0.62)),
      tabletFontSize: Math.max(26, Math.round(v.fontSize * 0.78)),
      letterSpacing: key === 'display' ? -0.035 : -0.02,
      lineHeight: 1.12,
      radius: 0,
      marginTop: 0,
      marginBottom: 0
    }
  };
}
