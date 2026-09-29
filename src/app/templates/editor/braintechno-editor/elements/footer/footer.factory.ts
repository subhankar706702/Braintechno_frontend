import { EditorBlock } from '../../models/editor-block.model';
import { createFooterLinkGroup, createFooterSocial } from './footer.repeat';

export function createFooterBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
  const dark = ['dark-premium', 'contact', 'business', 'large-brand', 'floating-actions'].includes(variant);
  const groupCount = variant === 'mega' ? 4 : variant === 'columns' || variant === 'accordion-mobile' ? 4 : 3;

  return {
    ...base,
    content: {
      ...base.content,
      variant,
      brand: 'BRAIN TECHNO',
      logo: '',
      tagline: 'Technology made simple.',
      text: 'Build a strong digital presence with modern tools and simple solutions.',
      logoWidth: 150,
      showBrand: true,
      columns: Array.from({ length: groupCount }, (_, i) => createFooterLinkGroup(i)),
      showPhone: true,
      showWhatsapp: true,
      showEmail: true,
      showAddress: ['contact', 'business'].includes(variant),
      showHours: variant === 'business',
      phone: '+91 99999 99999',
      whatsapp: '+91 99999 99999',
      email: 'hello@example.com',
      address: 'Your business address',
      hours: 'Mon - Sat · 10:00 AM - 7:00 PM',
      mapUrl: '#',

      showSocials: !['minimal'].includes(variant),
      socialTitle: 'Follow us',
      socials: [0, 1, 2, 3].map(createFooterSocial),
      socialStyle: ['logo', 'logo', 'pill', 'logo', 'cards'][0],
      socialShape: 'round',
      socialSize: 34,
      socialGap: 9,
      socialShowName: false,
      socialOpenNewTab: true,

      showNewsletter: variant === 'newsletter',
      newsletterTitle: 'Stay updated',
      newsletterText: 'Get useful updates, offers and business tips in your inbox.',
      newsletterPlaceholder: 'Your email address',
      newsletterButton: 'Subscribe',

      showCta: variant === 'cta',
      ctaTitle: 'Ready to grow your business?',
      ctaText: 'Let’s create something useful for your customers.',
      ctaLabel: 'Get Started',
      ctaUrl: '#',

      showAppButtons: variant === 'app-download',
      appTitle: 'Get the app',
      androidUrl: '#',
      iosUrl: '#',
      showQr: variant === 'app-download',
      qrImage: '',

      showFloatingActions: variant === 'floating-actions',
      actionCall: true,
      actionWhatsapp: true,
      actionMessage: true,

      copyright: '© 2026 BRAIN TECHNO. All rights reserved.',
      privacyUrl: '#',
      termsUrl: '#',
      showLegal: true,
      showBackToTop: true
    },
    style: {
      ...base.style,
      background: dark ? '#0B1220' : '#F8FAFC',
      color: dark ? '#FFFFFF' : '#0F172A',
      mutedColor: dark ? '#CBD5E1' : '#64748B',
      accent: '#FF4D6D',
      linkColor: dark ? '#E2E8F0' : '#334155',
      borderColor: dark ? '#334155' : '#E2E8F0',
      cardBackground: dark ? '#111827' : '#FFFFFF',
      buttonBackground: '#FF4D6D',
      buttonColor: '#FFFFFF',
      paddingTop: variant === 'large-brand' ? 48 : 34,
      paddingBottom: variant === 'large-brand' ? 38 : 26,
      columnGap: variant === 'mega' ? 28 : 22,
      contentMaxWidth: 1180,
      radius: variant === 'dark-premium' ? 22 : 0,
      sectionBorder: 'transparent',
      backgroundType: 'color',
      backgroundImage: '',
      overlay: 'rgba(0,0,0,.28)'
    }
  };
}
