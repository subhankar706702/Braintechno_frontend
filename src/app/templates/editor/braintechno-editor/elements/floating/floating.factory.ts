import { EditorBlock } from '../../models/editor-block.model';

export const FLOATING_SOCIAL_ICONS: Record<string, string> = {
  facebook: 'https://cdn.tools.unlayer.com/social/icons/circle/facebook.png',
  instagram: 'https://cdn.tools.unlayer.com/social/icons/circle/instagram.png',
  youtube: 'https://cdn.tools.unlayer.com/social/icons/circle/youtube.png',
  linkedin: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png',
  twitter: 'https://cdn.tools.unlayer.com/social/icons/circle/twitter.png'
};

const actionDefaults: Record<string, Record<string, any>> = {
  whatsapp: { type: 'whatsapp', label: 'WhatsApp', icon: 'chat', url: 'https://wa.me/', color: '#25D366' },
  call: { type: 'call', label: 'Call Now', icon: 'call', url: 'tel:', color: '#2563EB' },
  message: { type: 'message', label: 'Message', icon: 'message', url: '#contact', color: '#FF4D6D' },
  email: { type: 'email', label: 'Email', icon: 'mail', url: 'mailto:', color: '#7C3AED' },
  location: { type: 'location', label: 'Location', icon: 'location_on', url: 'https://maps.google.com/', color: '#EA4335' },
  coupon: { type: 'coupon', label: 'Get Coupon', icon: 'sell', url: '#coupon', color: '#F59E0B' },
  offer: { type: 'offer', label: 'Special Offer', icon: 'local_offer', url: '#offer', color: '#EF4444' },
  buy: { type: 'buy', label: 'Buy Now', icon: 'shopping_bag', url: '#buy', color: '#16A34A' },
  book: { type: 'book', label: 'Book Now', icon: 'calendar_month', url: '#booking', color: '#0EA5E9' },
  quote: { type: 'quote', label: 'Get Quote', icon: 'request_quote', url: '#quote', color: '#8B5CF6' },
  share: { type: 'share', label: 'Share', icon: 'share', url: '#share', color: '#334155' },
  download: { type: 'download', label: 'Download', icon: 'download', url: '#download', color: '#475569' },
  backtop: { type: 'backtop', label: 'Back to Top', icon: 'arrow_upward', url: '#top', color: '#0F172A' },
  custom: { type: 'custom', label: 'Custom Action', icon: 'open_in_new', url: '#', color: '#FF4D6D' },
  social: { type: 'social', label: 'Instagram', icon: '', image: FLOATING_SOCIAL_ICONS.instagram, socialPlatform: 'instagram', url: 'https://www.instagram.com/', color: '#E1306C' }
};

function action(type: string): Record<string, any> {
  return {
    ...(actionDefaults[type] || actionDefaults.custom),
    target: '_self',
    enabled: true,
    tooltip: true
  };
}

export function createFloatingBlock(_parent: any, base: EditorBlock, variant: string): EditorBlock {
  const presets: Record<string, Record<string, any>> = {
    single: {
      layout: 'single', openMode: 'always', mainIcon: 'chat', mainLabel: 'WhatsApp',
      actions: [action('whatsapp')]
    },
    vertical: {
      layout: 'vertical', openMode: 'always', mainIcon: 'more_vert', mainLabel: 'Actions',
      actions: [action('whatsapp'), action('call')]
    },
    horizontal: {
      layout: 'horizontal', openMode: 'always', mainIcon: 'more_horiz', mainLabel: 'Actions',
      actions: [action('whatsapp'), action('call'), action('coupon')]
    },
    expand: {
      layout: 'expand', openMode: 'click', openState: false, mainIcon: 'add', mainLabel: 'Open actions',
      actions: [action('whatsapp'), action('call'), action('coupon'), action('book')]
    },
    sales: {
      layout: 'expand', openMode: 'click', openState: false, mainIcon: 'shopping_cart', mainLabel: 'Shop',
      actions: [action('coupon'), action('offer'), action('buy'), action('quote')]
    },
    contact: {
      layout: 'expand', openMode: 'click', openState: false, mainIcon: 'support_agent', mainLabel: 'Contact',
      actions: [action('whatsapp'), action('call'), action('message'), action('email')]
    },
    business: {
      layout: 'expand', openMode: 'click', openState: false, mainIcon: 'storefront', mainLabel: 'Business',
      actions: [action('location'), action('book'), action('quote'), action('share')]
    },
    social: {
      layout: 'expand', openMode: 'click', openState: false, mainIcon: 'share', mainLabel: 'Social',
      actions: [
        { ...action('social'), socialPlatform: 'instagram', label: 'Instagram', image: FLOATING_SOCIAL_ICONS.instagram, url: 'https://www.instagram.com/' },
        { ...action('social'), socialPlatform: 'facebook', label: 'Facebook', image: FLOATING_SOCIAL_ICONS.facebook, url: 'https://www.facebook.com/' },
        { ...action('social'), socialPlatform: 'linkedin', label: 'LinkedIn', image: FLOATING_SOCIAL_ICONS.linkedin, url: 'https://www.linkedin.com/' }
      ]
    },
    utilities: {
      layout: 'expand', openMode: 'click', openState: false, mainIcon: 'apps', mainLabel: 'Tools',
      actions: [action('share'), action('download'), action('backtop')]
    }
  };

  const selected = presets[variant] || presets.expand;

  return {
    ...base,
    content: {
      ...base.content,
      variant,
      layout: selected.layout,
      openMode: selected.openMode,
      openState: selected.openState ?? false,
      mainIcon: selected.mainIcon,
      mainLabel: selected.mainLabel,
      mainImage: '',
      tooltip: true,
      showLabels: true,
      mobileOnly: false,
      desktopOnly: false,
      actions: selected.actions,
      items: selected.actions
    },
    style: {
      ...base.style,
      position: 'bottom-right',
      offsetX: 20,
      offsetY: 20,
      gap: 10,
      size: 50,
      actionSize: 44,
      mobileSize: 48,
      mobileGap: 8,
      radius: 999,
      background: '#FF4D6D',
      color: '#FFFFFF',
      shadow: '0 12px 28px rgba(15,23,42,.18)',
      animation: 'none',
      zIndex: 1200
    }
  };
}

export function getFloatingActionDefaults(type: string): Record<string, any> {
  return {
    ...(actionDefaults[type] || actionDefaults.custom),
    target: '_self',
    enabled: true,
    tooltip: true
  };
}
