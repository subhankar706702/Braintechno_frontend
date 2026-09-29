import { EditorBlock } from '../../models/editor-block.model';

export function createNavbarMenuItem(index: number): Record<string, any> {
  return { label: `Menu ${index + 1}`, url: '#', icon: '', target: '_self', children: [], childrenJson: '' };
}

export function createNavbarBlock(base: EditorBlock, variant: string): EditorBlock {
  const items = [
    { label: 'Home', url: '#', icon: 'home', target: '_self', children: [] },
    { label: 'Services', url: '#services', icon: 'design_services', target: '_self', children: [] },
    { label: 'About', url: '#about', icon: 'info', target: '_self', children: [] },
    { label: 'Contact', url: '#contact', icon: 'contact_mail', target: '_self', children: [] }
  ];
  const dark = variant === 'dark';
  return {
    ...base,
    content: {
      variant,
      brand: 'BRAIN TECHNO',
      logo: '',
      logoMediaId: null,
      logoPosition: ['right-logo'].includes(variant) ? 'right' : variant === 'center-logo' ? 'center' : 'left',
      logoShape: variant === 'pill' ? 'circle' : 'rounded',
      logoRadius: variant === 'logo-only' ? 50 : variant === 'bordered' ? 10 : 20,
      logoSize: variant === 'compact' ? 32 : 42,
      showBrand: variant !== 'logo-only',
      links: 'Home, Services, About, Contact',
      menuItems: items,
      cta: variant === 'shop' ? 'Shop Now' : 'Get Started',
      ctaUrl: '#',
      showCta: ['logo-menu-button', 'shop', 'mobile-first'].includes(variant),
      showIcons: false,
      mobileMenu: true,
      mobileTrigger: variant === 'mobile-first' ? 'menu' : variant === 'shop' ? 'dots' : 'menu',
      mobileLabel: 'Menu',
      menuAlign: variant === 'center-logo' ? 'center' : variant === 'right-logo' ? 'left' : 'right',
      menuGap: variant === 'compact' ? 12 : 18
    },
    style: {
      ...base.style,
      background: dark ? '#0F172A' : variant === 'transparent' ? 'transparent' : '#FFFFFF',
      color: dark ? '#FFFFFF' : '#0F172A',
      padding: variant === 'stacked' ? 14 : variant === 'mobile-first' ? 14 : 18,
      radius: 0,
      borderWidth: variant === 'bordered' ? 1 : 0,
      borderColor: '#E2E8F0'
    }
  };
}
