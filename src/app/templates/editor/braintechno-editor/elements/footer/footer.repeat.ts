export interface FooterLinkItem {
  label: string;
  url: string;
  target?: '_self' | '_blank';
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterSocialItem {
  platform: string;
  name: string;
  label: string;
  url: string;
  icon: string;
  target?: '_self' | '_blank';
}

/**
 * Keep these platform images identical to the Social element.
 * Platform is the source of truth; icon is regenerated from this map.
 */
export const FOOTER_SOCIAL_PLATFORMS: Record<string, { name: string; icon: string; defaultUrl: string }> = {
  facebook: {
    name: 'Facebook',
    icon: 'https://cdn.simpleicons.org/facebook/1877F2',
    defaultUrl: 'https://www.facebook.com/'
  },
  instagram: {
    name: 'Instagram',
    icon: 'https://cdn.simpleicons.org/instagram/E4405F',
    defaultUrl: 'https://www.instagram.com/'
  },
  youtube: {
    name: 'YouTube',
    icon: 'https://cdn.simpleicons.org/youtube/FF0000',
    defaultUrl: 'https://www.youtube.com/'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png',
    defaultUrl: 'https://www.linkedin.com/'
  },
  telegram: {
    name: 'Telegram',
    icon: 'https://cdn.simpleicons.org/telegram/229ED9',
    defaultUrl: 'https://t.me/'
  },
  x: {
    name: 'X',
    icon: 'https://cdn.simpleicons.org/x/111111',
    defaultUrl: 'https://x.com/'
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: 'https://cdn.simpleicons.org/whatsapp/25D366',
    defaultUrl: 'https://wa.me/'
  },
  website: {
    name: 'Website',
    icon: 'public',
    defaultUrl: '#'
  },
  github: {
    name: 'GitHub',
    icon: 'https://cdn.simpleicons.org/github/181717',
    defaultUrl: 'https://github.com/'
  },
  tiktok: {
    name: 'TikTok',
    icon: 'https://cdn.simpleicons.org/tiktok/111111',
    defaultUrl: 'https://www.tiktok.com/'
  }
};

export function createFooterLinkGroup(index = 0): FooterLinkGroup {
  const titles = ['Company', 'Services', 'Resources', 'Support'];
  return {
    title: titles[index] || `Group ${index + 1}`,
    links: [
      { label: 'About Us', url: '#', target: '_self' },
      { label: 'Services', url: '#', target: '_self' },
      { label: 'Contact', url: '#', target: '_self' }
    ]
  };
}

export function createFooterSocial(index = 0): FooterSocialItem {
  const platforms = ['facebook', 'instagram', 'linkedin', 'youtube'];
  const platform = platforms[index] || 'website';
  const meta = FOOTER_SOCIAL_PLATFORMS[platform] || FOOTER_SOCIAL_PLATFORMS.website;
  return {
    platform,
    name: meta.name,
    label: meta.name,
    url: meta.defaultUrl,
    icon: meta.icon,
    target: '_blank'
  };
}

export function normalizeFooterSocial(item: any): FooterSocialItem {
  const platform = String(item?.platform || '').toLowerCase() || 'website';
  const meta = FOOTER_SOCIAL_PLATFORMS[platform] || FOOTER_SOCIAL_PLATFORMS.website;
  return {
    platform,
    name: String(item?.name || item?.label || meta.name),
    label: String(item?.label || item?.name || meta.name),
    url: String(item?.url || meta.defaultUrl),
    icon: meta.icon,
    target: item?.target === '_self' ? '_self' : '_blank'
  };
}

export function repeatFooterSocialItemTemplate(parent: any, index: number, key: string): Record<string, any> {
  return createFooterSocial(index);
}
