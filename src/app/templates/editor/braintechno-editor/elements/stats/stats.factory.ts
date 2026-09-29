import { EditorBlock } from '../../models/editor-block.model';

/** Stats factory. Keeps the editor JSON stable while giving each preset a distinct default. */
export function createStatsBlock(_parent: any, base: EditorBlock, variant: string): EditorBlock {
  const countMap: Record<string, number> = {
    three: 3,
    minimal: 3,
    'side-side': 4,
    dropdown: 4,
    split: 4,
    featured: 4,
    'photo-bg': 4,
    four: 4,
    cards: 4,
    dark: 4,
    accent: 4,
    percent: 4,
    business: 4,
    icon: 4,
    progress: 4
  };

  const count = countMap[variant] || 4;
  const values = ['100+', '98%', '10+', '24/7', '500+', '4.9/5'];
  const labels = ['Projects', 'Satisfaction', 'Years', 'Support', 'Customers', 'Rating'];
  const icons = ['monitoring', 'groups', 'workspace_premium', 'support_agent', 'verified', 'star'];

  const items = Array.from({ length: count }, (_, i) => ({
    icon: icons[i % icons.length],
    value: values[i] || '100+',
    prefix: '',
    suffix: '',
    label: labels[i] || `Metric ${i + 1}`,
    text: 'Add a short explanation for this metric.',
    progress: [82, 96, 74, 100, 88, 94][i] || 75
  }));

  const dark = variant === 'dark';
  const photo = variant === 'photo-bg';
  const accent = variant === 'accent' || variant === 'percent' ? '#FF4D6D' : '#FF4D6D';

  return {
    ...base,
    content: {
      variant,
      title: variant === 'business' ? 'Business at a Glance' : 'Our Impact',
      subtitle: 'Numbers that show the value we create.',
      items,
      desktopLayout: variant === 'side-side' ? 'row' : 'grid',
      mobileLayout: variant === 'dropdown' ? 'dropdown' : 'stack',
      showTitle: true,
      showSubtitle: !['minimal', 'percent'].includes(variant),
      showDescription: variant === 'split' || variant === 'featured' || variant === 'business',
      showIcons: variant === 'icon' || variant === 'business',
      showProgress: variant === 'progress' || variant === 'percent',
      featuredIndex: 0
    },
    style: {
      ...base.style,
      background: dark ? '#0F172A' : '#FFFFFF',
      backgroundType: photo ? 'image' : 'color',
      backgroundImage: '',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: dark ? '#FFFFFF' : '#0F172A',
      accent,
      textColor: dark ? '#FFFFFF' : '#0F172A',
      mutedColor: dark ? 'rgba(255,255,255,.72)' : '#64748B',
      cardBg: dark ? 'rgba(255,255,255,.07)' : '#FFFFFF',
      cardBorder: dark ? 'rgba(255,255,255,.14)' : '#E2E8F0',
      columns: variant === 'three' || variant === 'minimal' ? 3 : 4,
      gap: variant === 'minimal' ? 26 : 14,
      radius: 0,
      marginTop: 0,
      marginBottom: 0,
      padding: variant === 'minimal' ? 18 : 24,
      overlay: photo ? 'rgba(15,23,42,.50)' : 'transparent',
      cardRadius: 0,
      iconRadius: variant === 'icon' ? 18 : 14,
      iconBg: '#FFF1F4',
      iconColor: '#FF4D6D',
      iconBox: variant === 'icon' ? 56 : 44,
      progressBg: dark ? 'rgba(255,255,255,.15)' : '#E9EEF3',
      progressColor: '#FF4D6D',
      numberColor: '#FF4D6D',
      badgeBg: dark ? 'rgba(255,255,255,.10)' : '#FFF1F4',
      badgeColor: dark ? '#FFFFFF' : '#FF4D6D'
    }
  };
}
