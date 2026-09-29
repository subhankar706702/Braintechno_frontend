import { ElementPreset } from '../../models/editor-block.model';

export const POPUP_PRESETS: ElementPreset[] = [
  { key: 'offer', label: 'Offer Popup', description: 'Discount, sale or special offer popup.', preview: 'SALE' },
  { key: 'newsletter', label: 'Newsletter Popup', description: 'Email subscription popup.', preview: 'MAIL' },
  { key: 'contact', label: 'Contact Popup', description: 'Quick contact and enquiry popup.', preview: 'CONTACT' },
  { key: 'whatsapp', label: 'WhatsApp Popup', description: 'Direct WhatsApp conversation popup.', preview: 'WA' },
  { key: 'lead', label: 'Lead Capture', description: 'Lead form with name, phone and optional message.', preview: 'LEAD' },
  { key: 'coupon', label: 'Coupon Unlock', description: 'Collect details and reveal a coupon code.', preview: 'COUPON' },
  { key: 'event', label: 'Event Popup', description: 'Event date, time, location and CTA.', preview: 'EVENT' },
  { key: 'announcement', label: 'Announcement', description: 'Important notice or business announcement.', preview: 'NOTICE' },
  { key: 'welcome', label: 'Welcome Popup', description: 'Welcome message for first-time visitors.', preview: 'WELCOME' },
  { key: 'exit-intent', label: 'Exit Intent', description: 'Retention popup for leaving visitors.', preview: 'WAIT' },
  { key: 'image', label: 'Image Banner', description: 'Large promotional image with CTA.', preview: 'IMAGE' },
  { key: 'video', label: 'Video Popup', description: 'Video-focused popup with CTA.', preview: 'VIDEO' },
  { key: 'booking', label: 'Booking Popup', description: 'Appointment or booking enquiry popup.', preview: 'BOOK' },
  { key: 'qr', label: 'QR Code Popup', description: 'QR code with supporting information.', preview: 'QR' },
  { key: 'custom', label: 'Custom Popup', description: 'Flexible popup for custom content.', preview: 'CUSTOM' }
];
