import { EditorBlock } from '../../models/editor-block.model';

export function createTabsBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
  const dark = variant === 'dark';
  const vertical = variant === 'vertical-left' || variant === 'vertical-right';
  const image = variant === 'image' || variant === 'feature';
  return {
    ...base,
    content: {
      variant,
      title: 'Explore our features',
      subtitle: 'Present related information without taking visitors to a new page.',
      active: 0,
      showTitle: true,
      showSubtitle: true,
      showIcons: ['icon', 'icon-only', 'feature'].includes(variant),
      showImages: image,
      showBadges: ['feature', 'image', 'cards'].includes(variant),
      showButtons: ['feature', 'image'].includes(variant),
      desktopLayout: vertical ? variant : 'top',
      mobileLayout: variant === 'dropdown' ? 'accordion' : (variant === 'scrollable' ? 'scroll' : 'stack'),
      items: [
        { title: 'Overview', icon: 'dashboard', badge: '', text: 'Add overview content here.', image: '', buttonLabel: 'Learn More', buttonUrl: '#' },
        { title: 'Features', icon: 'auto_awesome', badge: '', text: 'Add feature details here.', image: '', buttonLabel: 'Explore Features', buttonUrl: '#' },
        { title: 'Details', icon: 'info', badge: '', text: 'Add detailed information here.', image: '', buttonLabel: 'View Details', buttonUrl: '#' }
      ]
    },
    style: {
      ...base.style,
      background: dark ? '#0F172A' : '#FFFFFF',
      color: dark ? '#FFFFFF' : '#0F172A',
      accent: '#FF4D6D',
      tabTextColor: dark ? '#CBD5E1' : '#475569',
      tabActiveText: dark ? '#FFFFFF' : '#0F172A',
      tabBg: dark ? '#162033' : '#F8FAFC',
      tabActiveBg: dark ? '#24324A' : '#FFF1F4',
      panelBg: dark ? '#111827' : '#FFFFFF',
      panelBorder: dark ? '#334155' : '#E2E8F0',
      gap: 12,
      tabGap: variant === 'segmented' ? 0 : 10,
      tabRadius: variant === 'pills' ? 999 : variant === 'segmented' ? 0 : 10,
      panelRadius: variant === 'cards' || variant === 'feature' ? 18 : 12,
      tabPaddingX: variant === 'compact' ? 10 : 14,
      tabPaddingY: variant === 'compact' ? 8 : 10,
      imageRadius: 14,
      borderWidth: variant === 'underline' ? 0 : 1,
      backgroundType: 'color',
      backgroundImage: '',
      overlay: 'transparent',
      radius: 0,
      marginTop: 0,
      marginBottom: 0
    }
  };
}
