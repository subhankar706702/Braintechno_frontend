import { ElementPreset } from '../../models/editor-block.model';

export const FLOATING_PRESETS: ElementPreset[] = [
  { key: 'single', label: 'Single Action', description: 'One fixed primary action', preview: '1' },
  { key: 'vertical', label: 'Vertical Stack', description: 'Always-visible vertical actions', preview: '↕' },
  { key: 'horizontal', label: 'Horizontal Stack', description: 'Always-visible horizontal actions', preview: '↔' },
  { key: 'expand', label: 'Expand Menu', description: 'One launcher opens multiple actions', preview: '+' },
  { key: 'sales', label: 'Sales Hub', description: 'Coupon, offer, buy and quote actions', preview: 'Sale' },
  { key: 'contact', label: 'Contact Hub', description: 'WhatsApp, call, message and email', preview: 'Help' },
  { key: 'business', label: 'Business Hub', description: 'Location, booking, quote and share', preview: 'Biz' },
  { key: 'social', label: 'Social Hub', description: 'Social logos from the Social element source', preview: 'Social' },
  { key: 'utilities', label: 'Utilities', description: 'Share, download and back to top', preview: 'Tools' }
];

export const FLOATING_ACTION_TYPES = [
  { key: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
  { key: 'call', label: 'Call', icon: 'call' },
  { key: 'message', label: 'Message', icon: 'message' },
  { key: 'email', label: 'Email', icon: 'mail' },
  { key: 'location', label: 'Location', icon: 'location_on' },
  { key: 'coupon', label: 'Coupon', icon: 'sell' },
  { key: 'offer', label: 'Special Offer', icon: 'local_offer' },
  { key: 'buy', label: 'Buy Now', icon: 'shopping_bag' },
  { key: 'book', label: 'Book Now', icon: 'calendar_month' },
  { key: 'quote', label: 'Get Quote', icon: 'request_quote' },
  { key: 'share', label: 'Share', icon: 'share' },
  { key: 'download', label: 'Download', icon: 'download' },
  { key: 'backtop', label: 'Back to Top', icon: 'arrow_upward' },
  { key: 'social', label: 'Social Link', icon: 'share' },
  { key: 'custom', label: 'Custom URL', icon: 'open_in_new' }
];

export const FLOATING_SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter / X' }
];
