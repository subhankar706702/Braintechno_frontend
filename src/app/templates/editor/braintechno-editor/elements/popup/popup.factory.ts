import { EditorBlock } from '../../models/editor-block.model';
import { createDefaultPopupFields } from './popup.repeat';

const defaultImage = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80';

export function createPopupBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
  const kind = String(variant || 'offer');
  const isForm = ['contact', 'lead', 'coupon', 'booking'].includes(kind);
  const isImage = ['offer', 'image', 'event', 'welcome', 'exit-intent'].includes(kind);
  const isDark = ['announcement', 'video'].includes(kind);

  return {
    ...base,
    content: {
      ...(base.content || {}),
      variant: kind,
      enabled: true,
      trigger: kind === 'exit-intent' ? 'exit' : kind === 'welcome' ? 'load' : 'delay',
      delay: 1500,
      scrollPercent: 60,
      frequency: 'session',
      triggerLabel: kind === 'offer' ? 'View Offer' : 'Open Popup',
      title:
        kind === 'offer' ? 'Special Offer For You' :
        kind === 'newsletter' ? 'Stay in the Loop' :
        kind === 'contact' ? 'Let’s Talk' :
        kind === 'whatsapp' ? 'Chat With Us' :
        kind === 'lead' ? 'Get in Touch' :
        kind === 'coupon' ? 'Unlock Your Coupon' :
        kind === 'event' ? 'You’re Invited' :
        kind === 'announcement' ? 'Important Update' :
        kind === 'welcome' ? 'Welcome to Our Website' :
        kind === 'exit-intent' ? 'Before You Go…' :
        kind === 'image' ? 'Discover Something New' :
        kind === 'video' ? 'Watch Our Story' :
        kind === 'booking' ? 'Book an Appointment' :
        kind === 'qr' ? 'Scan to Continue' : 'Custom Popup',
      text:
        kind === 'offer' ? 'Save more with our latest limited-time promotion.' :
        kind === 'newsletter' ? 'Get useful updates, offers and new announcements.' :
        kind === 'contact' ? 'Send us your query and our team will get back to you.' :
        kind === 'whatsapp' ? 'Have a question? Start a WhatsApp chat with our team.' :
        kind === 'lead' ? 'Leave your details and we will contact you soon.' :
        kind === 'coupon' ? 'Complete the form to unlock your special coupon code.' :
        kind === 'event' ? 'Reserve your place and get the event details.' :
        kind === 'announcement' ? 'Here is an important message for our visitors.' :
        kind === 'welcome' ? 'Thanks for visiting. Explore our latest offers and services.' :
        kind === 'exit-intent' ? 'Take a quick look at this offer before you leave.' :
        kind === 'image' ? 'Use a visual-first popup for campaigns and promotions.' :
        kind === 'video' ? 'Show your story, product demo or campaign video.' :
        kind === 'booking' ? 'Choose your preferred date and send a booking enquiry.' :
        kind === 'qr' ? 'Scan the code with your phone camera.' : 'Add your popup message here.',
      image: isImage ? defaultImage : '',
      videoUrl: kind === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : '',
      ctaLabel:
        kind === 'newsletter' ? 'Subscribe' :
        kind === 'whatsapp' ? 'Open WhatsApp' :
        kind === 'booking' ? 'Request Booking' :
        kind === 'coupon' ? 'Unlock Coupon' : 'Learn More',
      ctaUrl: kind === 'whatsapp' ? 'https://wa.me/919999999999' : '#',
      secondaryLabel: kind === 'offer' ? 'Maybe Later' : '',
      secondaryUrl: '#',
      showImage: isImage,
      showVideo: kind === 'video',
      showForm: isForm,
      showSecondary: kind === 'offer',
      showClose: true,
      showOverlay: true,
      formHeading: kind === 'booking' ? 'Booking Details' : kind === 'coupon' ? 'Your Details' : 'Quick Enquiry',
      submitLabel: kind === 'booking' ? 'Send Booking Request' : kind === 'coupon' ? 'Get My Coupon' : 'Send Message',
      successMessage: kind === 'coupon' ? 'Your coupon is ready.' : 'Thanks! We received your request.',
      couponCode: kind === 'coupon' ? 'BRAIN10' : '',
      eventDate: kind === 'event' ? '12 October 2026' : '',
      eventTime: kind === 'event' ? '6:00 PM' : '',
      eventLocation: kind === 'event' ? 'Your Event Location' : '',
      qrImage: kind === 'qr' ? '' : '',
      qrText: kind === 'qr' ? 'Scan this code to continue' : '',
      fields: createDefaultPopupFields(),
      animation: 'scale',
      mobileFullScreen: false,
      position: 'center',
      width: 560,
      padding: 28,
      radius: 20,
      backdropOpacity: 0.62,
      autoCloseSeconds: 0,
      previewOpen: true,
      theme: isDark ? 'dark' : 'light'
    },
    style: {
      ...(base.style || {}),
      background: isDark ? '#0F172A' : '#FFFFFF',
      color: isDark ? '#FFFFFF' : '#0F172A',
      accent: '#FF4D6D',
      mutedColor: isDark ? '#CBD5E1' : '#64748B',
      buttonText: '#FFFFFF',
      overlay: 'rgba(15,23,42,.62)',
      borderColor: isDark ? '#334155' : '#E2E8F0',
      shadow: '0 26px 80px rgba(15,23,42,.28)',
      backgroundType: 'color',
      backgroundImage: '',
      radius: 0,
      marginTop: 0,
      marginBottom: 0
    }
  };
}
