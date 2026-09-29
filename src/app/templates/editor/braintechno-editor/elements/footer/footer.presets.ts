import { ElementPreset } from '../../models/editor-block.model';

export const FOOTER_PRESETS: ElementPreset[] = [
  { key: 'simple', label: 'Classic Footer', description: 'Brand, links, contact and social links.', preview: 'Classic' },
  { key: 'minimal', label: 'Minimal Footer', description: 'Compact centered footer with essential links.', preview: 'Minimal' },
  { key: 'centered', label: 'Centered Footer', description: 'Centered brand, navigation and social logos.', preview: 'Center' },
  { key: 'columns', label: '4 Column Footer', description: 'Traditional four-column business layout.', preview: '4 Col' },
  { key: 'mega', label: 'Mega Footer', description: 'Resource-heavy footer with multiple link groups.', preview: 'Mega' },
  { key: 'split', label: 'Split Footer', description: 'Brand area beside a structured links/contact panel.', preview: 'Split' },
  { key: 'dark-premium', label: 'Dark Premium', description: 'Premium dark treatment with layered panels.', preview: 'Premium' },
  { key: 'newsletter', label: 'Newsletter Footer', description: 'Newsletter card is the primary conversion area.', preview: 'Mail' },
  { key: 'cta', label: 'CTA Footer', description: 'Strong call-to-action bar above footer content.', preview: 'CTA' },
  { key: 'contact', label: 'Contact Focused', description: 'Phone, WhatsApp, email and map are prominent.', preview: 'Contact' },
  { key: 'business', label: 'Business Footer', description: 'Business hours, location and contact details.', preview: 'Business' },
  { key: 'accordion-mobile', label: 'Accordion Mobile', description: 'Desktop columns collapse into mobile accordions.', preview: 'Accordion' },
  { key: 'app-download', label: 'App Download', description: 'QR code and Android/iOS actions are featured.', preview: 'App' },
  { key: 'social-wall', label: 'Social Wall', description: 'Image-based social logo cards with strong emphasis.', preview: 'Social' },
  { key: 'large-brand', label: 'Large Brand', description: 'Oversized brand treatment for strong visual identity.', preview: 'Brand' },
  { key: 'floating-actions', label: 'Floating Actions', description: 'Footer with Call, WhatsApp, Message and Back to Top.', preview: 'Actions' }
];
