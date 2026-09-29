import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MATERIAL_ICON_CATEGORIES, MATERIAL_ICON_LIST } from '../material-icon-list';
import { MediaPickerComponent } from '../../../shared/media-picker/media-picker.component';
import { MediaLibraryItem } from '../../../core/media-library.service';
import { ElementCatalogService } from '../../../core/element-catalog.service';

interface EditorBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
}

interface EditorDesign {
  schemaVersion: number;
  counters: Record<string, number>;
  body: {
    rows: EditorBlock[];
    values: Record<string, any>;
  };
}

interface ElementPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
  image?: string;
}

interface MediaItem {
  name: string;
  type: string;
  dataUrl: string;
}

@Component({
  selector: 'bt-braintechno-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MediaPickerComponent],
  templateUrl: './braintechno-editor.component.html',
  styleUrls: ['./braintechno-editor.component.scss']
})
export class BraintechnoEditorComponent implements OnChanges, OnDestroy {
  @Input() design: unknown;
  @Output() readonly ready = new EventEmitter<void>();
  @Output() readonly changed = new EventEmitter<void>();

  constructor(private readonly sanitizer: DomSanitizer) {}

  private readonly catalog = inject(ElementCatalogService);

  readonly materialIconCategories = MATERIAL_ICON_CATEGORIES;
  readonly materialIconList = MATERIAL_ICON_LIST;

  readonly elements = [
    { type: 'section', label: 'Section', icon: 'view_quilt' },
    { type: 'block', label: 'Block', icon: 'dashboard_customize' },
    { type: 'navbar', label: 'Navbar', icon: 'web_asset' },
    { type: 'hero', label: 'Hero', icon: 'view_day' },
    { type: 'services', label: 'Services', icon: 'grid_view' },
    { type: 'testimonial', label: 'Testimonial', icon: 'reviews' },
    { type: 'pricing', label: 'Pricing', icon: 'price_change' },
    { type: 'faq', label: 'FAQ', icon: 'quiz' },
    { type: 'stats', label: 'Stats', icon: 'monitoring' },
    { type: 'tabs', label: 'Tabs', icon: 'tab' },
    { type: 'timeline', label: 'Timeline', icon: 'timeline' },
    { type: 'team', label: 'Team', icon: 'groups' },
    { type: 'footer', label: 'Footer', icon: 'bottom_navigation' },
    { type: 'popup', label: 'Popup', icon: 'open_in_new' },
    { type: 'floating', label: 'Floating Action', icon: 'touch_app' },
    { type: 'heading', label: 'Heading', icon: 'title' },
    { type: 'text', label: 'Text', icon: 'notes' },
    { type: 'link', label: 'Link URL', icon: 'link' },
    { type: 'image', label: 'Image', icon: 'image' },
    { type: 'video', label: 'Video', icon: 'smart_display' },
    { type: 'slider', label: 'Image Slider', icon: 'view_carousel' },
    { type: 'gallery', label: 'Gallery', icon: 'photo_library' },
    { type: 'button', label: 'Button', icon: 'smart_button' },
    { type: 'icon', label: 'Icon', icon: 'interests' },
    { type: 'social', label: 'Social Links', icon: 'share' },
    { type: 'product', label: 'Product', icon: 'inventory_2' },
    { type: 'offer', label: 'Offer', icon: 'sell' },
    { type: 'ecommerce', label: 'E-commerce', icon: 'storefront' },
    { type: 'template', label: 'Templates', icon: 'dashboard' },
    { type: 'html', label: 'HTML', icon: 'code' },
    { type: 'form', label: 'Contact Form', icon: 'dynamic_form' },
    { type: 'contact', label: 'Contact', icon: 'contact_phone' },
    { type: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
    { type: 'map', label: 'Map', icon: 'map' },
    { type: 'scanner', label: 'Scanner', icon: 'qr_code_scanner' },
    { type: 'timer', label: 'Timer', icon: 'timer' },
    { type: 'counter', label: 'Counter', icon: '123' },
    { type: 'rating', label: 'Customer Rating', icon: 'star_rate' },
    { type: 'chart', label: 'Chart', icon: 'insert_chart' },
    { type: 'media', label: 'Your Media', icon: 'perm_media' },
    { type: 'divider', label: 'Divider', icon: 'horizontal_rule' },
    { type: 'spacer', label: 'Spacer', icon: 'height' }
  ];

  readonly presets: Record<string, ElementPreset[]> = {
    section: [
      { key: 'one', label: '1 Div', description: 'Single full-width section', preview: '1' },
      { key: 'two', label: '2 Div', description: 'Two equal columns', preview: '2' },
      { key: 'three', label: '3 Div', description: 'Three equal columns', preview: '3' },
      { key: 'four', label: '4 Div', description: 'Four equal columns', preview: '4' },
      { key: 'two-two', label: '2 + 2 Div', description: 'Two columns on two rows', preview: '2x2' },
      { key: 'three-three', label: '3 + 3 Div', description: 'Three columns on two rows', preview: '3x2' },
      { key: 'hero-split', label: 'Hero Split', description: 'Text and visual split section', preview: 'Hero' },
      { key: 'feature-grid', label: 'Feature Grid', description: 'Four compact feature cards', preview: 'Grid' },
      { key: 'content-aside', label: 'Content + Aside', description: 'Wide content with narrow aside', preview: '70/30' },
      { key: 'aside-content', label: 'Aside + Content', description: 'Narrow aside with wide content', preview: '30/70' }
    ],
    block: [
      { key: 'one', label: '1 Slot', description: 'Blank full-width drop zone', preview: '1' },
      { key: 'two', label: '2 Slots', description: 'Drop different elements side by side', preview: '2' },
      { key: 'three', label: '3 Slots', description: 'Three blank element zones', preview: '3' },
      { key: 'four', label: '4 Slots', description: 'Four equal blank zones', preview: '4' },
      { key: 'two-two', label: '2 + 2 Slots', description: 'Four zones in two rows', preview: '2x2' },
      { key: 'three-three', label: '3 + 3 Slots', description: 'Six zones in two rows', preview: '3x2' },
      { key: 'media-form', label: 'Media + Form', description: 'Two slots prepared for media and form', preview: 'M+F' },
      { key: 'text-media', label: 'Text + Media', description: 'Content and media split', preview: 'T+M' }
    ],
    heading: [
      { key: 'hero', label: 'Hero Heading', description: 'Large bold centered title', preview: 'H1' },
      { key: 'section-title', label: 'Section Title', description: 'Clean left aligned title', preview: 'H2' },
      { key: 'center', label: 'Centered', description: 'Balanced centered heading', preview: 'H2' },
      { key: 'accent', label: 'Accent', description: 'Brand color heading', preview: 'Pink' },
      { key: 'compact', label: 'Compact', description: 'Smaller compact heading', preview: 'H3' },
      { key: 'display', label: 'Display', description: 'Extra large display title', preview: 'XL' },
      { key: 'eyebrow', label: 'Eyebrow + Title', description: 'Small label above strong title', preview: 'Tag' },
      { key: 'underline', label: 'Underline', description: 'Heading with accent underline', preview: 'Line' },
      { key: 'serif', label: 'Editorial', description: 'Editorial style large title', preview: 'Edit' },
      { key: 'gradient', label: 'Gradient', description: 'Modern gradient title', preview: 'Grad' }
    ],
    text: [
      { key: 'paragraph', label: 'Paragraph', description: 'Standard body copy', preview: 'P' },
      { key: 'lead', label: 'Lead Text', description: 'Large introductory copy', preview: 'Lead' },
      { key: 'muted', label: 'Muted Text', description: 'Soft secondary copy', preview: 'Muted' },
      { key: 'quote', label: 'Quote', description: 'Highlighted quotation', preview: 'Quote' },
      { key: 'note', label: 'Note', description: 'Soft information note', preview: 'Note' },
      { key: 'center', label: 'Centered', description: 'Centered body text', preview: 'Center' },
      { key: 'callout', label: 'Callout', description: 'Strong bordered callout', preview: 'Call' },
      { key: 'success', label: 'Success Note', description: 'Positive status message', preview: 'OK' },
      { key: 'warning', label: 'Warning Note', description: 'Attention message', preview: '!' },
      { key: 'two-column', label: 'Two Column Copy', description: 'Magazine-like copy treatment', preview: '2 Col' }
    ],
    link: [
      { key: 'inline', label: 'Inline Link', description: 'Simple text link', preview: 'Link' },
      { key: 'arrow', label: 'Arrow Link', description: 'Link with forward arrow', preview: '→' },
      { key: 'underline', label: 'Underline', description: 'Classic underlined link', preview: 'Line' },
      { key: 'pill', label: 'Link Pill', description: 'Compact pill link', preview: 'Pill' },
      { key: 'card', label: 'Link Card', description: 'Title and URL card', preview: 'Card' },
      { key: 'download', label: 'Download Link', description: 'Download style action', preview: 'Down' },
      { key: 'external', label: 'External Link', description: 'External destination link', preview: 'Ext' },
      { key: 'email', label: 'Email Link', description: 'Email action link', preview: '@' }
    ],
    image: [
      { key: 'banner', label: 'Banner', description: 'Full width banner image', preview: 'Banner' },
      { key: 'rounded', label: 'Rounded', description: 'Rounded image block', preview: 'Round' },
      { key: 'card', label: 'Card Image', description: 'Image inside a card frame', preview: 'Card' },
      { key: 'compact', label: 'Compact', description: 'Compact centered image', preview: 'Small' },
      { key: 'shadow', label: 'Shadow', description: 'Raised visual style', preview: 'Lift' },
      { key: 'square', label: 'Square', description: 'Square media image', preview: '1:1' },
      { key: 'portrait', label: 'Portrait', description: 'Portrait ratio visual', preview: '3:4' },
      { key: 'circle', label: 'Circle', description: 'Circular profile style', preview: '○' },
      { key: 'bordered', label: 'Bordered', description: 'Crisp bordered image', preview: 'Box' },
      { key: 'full-bleed', label: 'Full Bleed', description: 'Edge-to-edge image', preview: 'Full' }
    ],
    video: [
      { key: 'youtube', label: 'YouTube', description: 'Responsive YouTube embed', preview: 'YT' },
      { key: 'wide', label: 'Wide Video', description: '16:9 wide player', preview: '16:9' },
      { key: 'rounded', label: 'Rounded Player', description: 'Rounded video frame', preview: 'Round' },
      { key: 'card', label: 'Video Card', description: 'Video inside bordered card', preview: 'Card' },
      { key: 'portrait', label: 'Portrait Reel', description: '9:16 short video layout', preview: '9:16' },
      { key: 'direct', label: 'Direct MP4', description: 'HTML5 video URL player', preview: 'MP4' },
      { key: 'autoplay', label: 'Autoplay Muted', description: 'Muted autoplay hero video', preview: 'Auto' },
      { key: 'minimal', label: 'Minimal', description: 'Simple clean player', preview: 'Min' }
    ],
    slider: [
      { key: 'hero', label: 'Hero Slider', description: 'Large promotional slider', preview: 'Hero' },
      { key: 'cards', label: 'Card Slider', description: 'Rounded card carousel', preview: 'Card' },
      { key: 'fade', label: 'Fade Slider', description: 'Soft fade transitions', preview: 'Fade' },
      { key: 'compact', label: 'Compact Slider', description: 'Short compact carousel', preview: 'Small' },
      { key: 'product', label: 'Product Slider', description: 'Product-focused image slider', preview: 'Shop' },
      { key: 'portfolio', label: 'Portfolio', description: 'Creative portfolio carousel', preview: 'Work' },
      { key: 'testimonial', label: 'Story Slider', description: 'Story/testimonial visual carousel', preview: 'Story' },
      { key: 'full', label: 'Full Width', description: 'Edge-to-edge image slider', preview: 'Full' }
    ],
    gallery: [
      { key: 'two', label: '2 Columns', description: 'Two image columns', preview: '2' },
      { key: 'three', label: '3 Columns', description: 'Three image columns', preview: '3' },
      { key: 'four', label: '4 Columns', description: 'Four image columns', preview: '4' },
      { key: 'spacious', label: 'Spacious', description: 'Large image gaps', preview: 'Gap' },
      { key: 'compact', label: 'Compact', description: 'Tight image gaps', preview: 'Tight' },
      { key: 'rounded', label: 'Rounded', description: 'Rounded gallery tiles', preview: 'Round' },
      { key: 'masonry', label: 'Masonry Look', description: 'Editorial gallery treatment', preview: 'Masonry' },
      { key: 'bordered', label: 'Bordered', description: 'Framed image collection', preview: 'Frame' },
      { key: 'showcase', label: 'Showcase', description: 'Large first visual feel', preview: 'Show' },
      { key: 'minimal', label: 'Minimal', description: 'Clean gallery without chrome', preview: 'Min' }
    ],
    button: [
      { key: 'primary', label: 'Primary', description: 'Solid brand CTA', preview: 'Primary' },
      { key: 'outline', label: 'Outline', description: 'Border-only button', preview: 'Outline' },
      { key: 'pill', label: 'Pill', description: 'Fully rounded CTA', preview: 'Pill' },
      { key: 'full', label: 'Full Width', description: 'Wide block button', preview: 'Full' },
      { key: 'soft', label: 'Soft', description: 'Light brand background', preview: 'Soft' },
      { key: 'dark', label: 'Dark', description: 'Dark premium CTA', preview: 'Dark' },
      { key: 'gradient', label: 'Gradient', description: 'Modern gradient action', preview: 'Grad' },
      { key: 'glass', label: 'Glass', description: 'Soft translucent button', preview: 'Glass' },
      { key: 'icon-left', label: 'Icon Left', description: 'CTA with leading icon feel', preview: 'Icon' },
      { key: 'danger', label: 'Alert CTA', description: 'Strong red attention button', preview: 'Alert' }
    ],
    icon: [
      { key: 'circle', label: 'Circle Icon', description: 'Icon inside circular badge', preview: '○' },
      { key: 'square', label: 'Square Icon', description: 'Icon inside rounded square', preview: '□' },
      { key: 'plain', label: 'Plain Icon', description: 'Standalone Material icon', preview: 'Icon' },
      { key: 'accent', label: 'Accent', description: 'Brand accent icon', preview: 'Pink' },
      { key: 'soft', label: 'Soft Badge', description: 'Soft background icon', preview: 'Soft' },
      { key: 'dark', label: 'Dark Badge', description: 'Dark premium badge', preview: 'Dark' },
      { key: 'large', label: 'Large Feature', description: 'Large feature icon', preview: 'XL' },
      { key: 'icon-label', label: 'Icon + Label', description: 'Icon paired with short label', preview: 'I+T' }
    ],
    social: [
      { key: 'logo-only', label: 'Logo Only', description: 'Social logo without text', preview: 'Logo' },
      { key: 'logo-name', label: 'Logo + Name', description: 'Logo with social name', preview: 'L+N' },
      { key: 'logo-round', label: 'Logo Round', description: 'Round social logo style', preview: '◯' },
      { key: 'logo-square', label: 'Logo Square', description: 'Square social logo style', preview: '□' },
      { key: 'logo-hover', label: 'Logo Hover', description: 'Logo with hover interaction', preview: 'Hover' },
      { key: 'logo-url-left', label: 'Left + URL', description: 'Logo, name and URL aligned left', preview: 'L+URL' },
      { key: 'logo-url-center', label: 'Center + URL', description: 'Logo, name and URL centered', preview: 'C+URL' },
      { key: 'logo-url-right', label: 'Right + URL', description: 'Logo, name and URL aligned right', preview: 'R+URL' },
      { key: 'logo-circle-name', label: 'Circle + Name', description: 'Circle logo with social name', preview: '◯+N' },
      { key: 'logo-square-name', label: 'Square + Name', description: 'Square logo with social name', preview: '□+N' },
      { key: 'logo-card', label: 'Logo Cards', description: 'Social links as cards', preview: 'Cards' },
      { key: 'logo-outline', label: 'Logo Outline', description: 'Outlined social links', preview: 'Outline' },
      { key: 'logo-soft', label: 'Logo Soft', description: 'Soft background social links', preview: 'Soft' },
      { key: 'logo-dark', label: 'Logo Dark', description: 'Dark premium social links', preview: 'Dark' },
      { key: 'logo-footer', label: 'Logo Footer', description: 'Compact footer social layout', preview: 'Footer' }
    ],
    product: [
      { key: 'classic', label: 'Classic Card', description: 'Image top with product details', preview: 'Classic' },
      { key: 'horizontal', label: 'Horizontal', description: 'Image left, details right', preview: 'Side' },
      { key: 'minimal', label: 'Minimal', description: 'Clean compact product block', preview: 'Min' },
      { key: 'sale', label: 'Sale Card', description: 'Offer badge and old price', preview: 'Sale' },
      { key: 'centered', label: 'Centered', description: 'Centered product showcase', preview: 'Center' },
      { key: 'dark', label: 'Dark Card', description: 'Dark premium product card', preview: 'Dark' },
      { key: 'catalog', label: 'Catalog Item', description: 'Compact catalogue listing', preview: 'List' },
      { key: 'featured', label: 'Featured Product', description: 'Large featured product visual', preview: 'Feature' },
      { key: 'luxury', label: 'Luxury', description: 'Elegant high-end card', preview: 'Luxury' },
      { key: 'quick-buy', label: 'Quick Buy', description: 'Compact quick purchase card', preview: 'Buy' }
    ],
    offer: [
      { key: 'soft', label: 'Soft Offer', description: 'Light promotional card', preview: '20%' },
      { key: 'coupon', label: 'Coupon', description: 'Coupon-inspired offer', preview: 'SAVE' },
      { key: 'sale', label: 'Sale', description: 'Bold sale campaign', preview: 'SALE' },
      { key: 'dark', label: 'Dark Offer', description: 'Dark premium promotion', preview: 'OFF' },
      { key: 'compact', label: 'Compact', description: 'Compact promotional block', preview: 'Deal' },
      { key: 'center', label: 'Centered', description: 'Centered offer message', preview: 'Offer' },
      { key: 'flash', label: 'Flash Deal', description: 'High urgency flash deal', preview: 'Flash' },
      { key: 'voucher', label: 'Voucher', description: 'Voucher-like visual style', preview: 'Code' },
      { key: 'bundle', label: 'Bundle Offer', description: 'Bundle promotion card', preview: 'Bundle' },
      { key: 'seasonal', label: 'Seasonal', description: 'Festive seasonal campaign', preview: 'Fest' }
    ],
    ecommerce: [
      { key: 'product-hero', label: 'Product Hero', description: 'Hero + CTA + product visual', preview: 'Hero' },
      { key: 'product-grid', label: 'Product Grid', description: 'Heading with product cards', preview: 'Grid' },
      { key: 'sale-store', label: 'Sale Store', description: 'Offer banner plus products', preview: 'Sale' },
      { key: 'single-product', label: 'Single Product', description: 'Focused product landing flow', preview: '1 Prod' },
      { key: 'catalog', label: 'Mini Catalog', description: 'Compact product catalogue', preview: 'Cat' },
      { key: 'fashion', label: 'Fashion Drop', description: 'Visual fashion store section', preview: 'Fashion' },
      { key: 'electronics', label: 'Electronics', description: 'Tech product section', preview: 'Tech' },
      { key: 'food', label: 'Food Menu', description: 'Food product/menu section', preview: 'Food' }
    ],
    template: [
      { key: 'business', label: 'Business Intro', description: 'Hero, services, CTA and contact', preview: 'Biz' },
      { key: 'tattoo', label: 'Tattoo Studio', description: 'Dark artist landing page with services', preview: 'Tattoo' },
      { key: 'agency', label: 'Creative Agency', description: 'Modern agency mini landing page', preview: 'Agency' },
      { key: 'restaurant', label: 'Restaurant', description: 'Food hero, menu and contact', preview: 'Food' },
      { key: 'clinic', label: 'Clinic', description: 'Professional services + appointment CTA', preview: 'Clinic' },
      { key: 'portfolio', label: 'Portfolio', description: 'Work showcase and contact CTA', preview: 'Work' },
      { key: 'event', label: 'Event', description: 'Event hero, timer and registration', preview: 'Event' },
      { key: 'course', label: 'Course', description: 'Course benefits and enrol CTA', preview: 'Learn' },
      { key: 'real-estate', label: 'Real Estate', description: 'Property visual and enquiry flow', preview: 'Home' },
      { key: 'local-service', label: 'Local Service', description: 'Service features, map and contact', preview: 'Local' },
      { key: 'salon', label: 'Salon & Beauty', description: 'Premium beauty services and booking CTA', preview: 'Beauty' },
      { key: 'gym', label: 'Gym & Fitness', description: 'Bold fitness hero, plans and enquiry', preview: 'Gym' },
      { key: 'saas', label: 'SaaS Product', description: 'Software feature landing page with CTA', preview: 'SaaS' },
      { key: 'travel', label: 'Travel & Tour', description: 'Destination highlights and booking flow', preview: 'Travel' },
      { key: 'wedding', label: 'Wedding Invite', description: 'Elegant event invitation and countdown', preview: 'Wedding' },
      { key: 'fashion', label: 'Fashion Store', description: 'Stylish collection showcase and products', preview: 'Fashion' }
    ],
    html: [
      { key: 'blank', label: 'Blank HTML', description: 'Start with a blank custom HTML block', preview: '<>' },
      { key: 'notice', label: 'Notice Box', description: 'Simple custom notice markup', preview: 'HTML' },
      { key: 'table', label: 'HTML Table', description: 'Editable table markup', preview: 'Table' },
      { key: 'badge', label: 'Badge Row', description: 'Custom badge markup', preview: 'Tags' },
      { key: 'embed', label: 'Embed Area', description: 'Paste supported embed markup', preview: 'Embed' },
      { key: 'custom-card', label: 'Custom Card', description: 'Custom HTML card starter', preview: 'Card' },
      { key: 'list', label: 'Custom List', description: 'HTML list starter', preview: 'List' },
      { key: 'code', label: 'Code Block', description: 'Preformatted code-style block', preview: 'Code' }
    ],
    form: [
      { key: 'card', label: 'Form Card', description: 'Standard enquiry form', preview: 'Form' },
      { key: 'minimal', label: 'Minimal', description: 'Clean minimal form', preview: 'Min' },
      { key: 'soft', label: 'Soft', description: 'Soft background form', preview: 'Soft' },
      { key: 'compact', label: 'Compact', description: 'Compact lead form', preview: 'Small' },
      { key: 'center', label: 'Centered', description: 'Centered form heading', preview: 'Center' },
      { key: 'dark', label: 'Dark', description: 'Dark premium form', preview: 'Dark' },
      { key: 'newsletter', label: 'Newsletter', description: 'Email subscription form', preview: 'Mail' },
      { key: 'appointment', label: 'Appointment', description: 'Appointment enquiry starter', preview: 'Date' },
      { key: 'quote', label: 'Get Quote', description: 'Service quote lead form', preview: 'Quote' },
      { key: 'callback', label: 'Callback', description: 'Phone-first callback form', preview: 'Call' }
    ],
    contact: [
      { key: 'card', label: 'Contact Card', description: 'Full contact information card', preview: 'Card' },
      { key: 'minimal', label: 'Minimal', description: 'Simple contact details', preview: 'Min' },
      { key: 'soft', label: 'Soft', description: 'Soft background contact card', preview: 'Soft' },
      { key: 'center', label: 'Centered', description: 'Centered contact details', preview: 'Center' },
      { key: 'border', label: 'Bordered', description: 'Bordered contact card', preview: 'Border' },
      { key: 'dark', label: 'Dark', description: 'Dark contact card', preview: 'Dark' },
      { key: 'split', label: 'Split Contact', description: 'Details with strong heading', preview: 'Split' },
      { key: 'office', label: 'Office Card', description: 'Office address-focused style', preview: 'Office' }
    ],
    whatsapp: [
      { key: 'pill', label: 'Pill', description: 'Rounded WhatsApp CTA', preview: 'Chat' },
      { key: 'full', label: 'Full Width', description: 'Full width WhatsApp CTA', preview: 'Full' },
      { key: 'outline', label: 'Outline', description: 'Outlined WhatsApp button', preview: 'Line' },
      { key: 'soft', label: 'Soft', description: 'Soft green CTA', preview: 'Soft' },
      { key: 'dark', label: 'Dark', description: 'Dark WhatsApp CTA', preview: 'Dark' },
      { key: 'compact', label: 'Compact', description: 'Small compact CTA', preview: 'Small' },
      { key: 'card', label: 'Chat Card', description: 'WhatsApp contact card', preview: 'Card' },
      { key: 'floating', label: 'Floating Look', description: 'Floating-button inspired style', preview: 'Float' }
    ],
    map: [
      { key: 'standard', label: 'Standard', description: 'Standard map block', preview: 'Map' },
      { key: 'wide', label: 'Wide', description: 'Large map area', preview: 'Wide' },
      { key: 'compact', label: 'Compact', description: 'Compact map area', preview: 'Small' },
      { key: 'rounded', label: 'Rounded', description: 'Rounded map block', preview: 'Round' },
      { key: 'card', label: 'Card', description: 'Map inside a card', preview: 'Card' },
      { key: 'flush', label: 'Flush', description: 'Edge-to-edge map', preview: 'Full' },
      { key: 'office', label: 'Office Location', description: 'Map with location title feel', preview: 'Office' },
      { key: 'dark', label: 'Dark Frame', description: 'Dark framed location section', preview: 'Dark' }
    ],
    scanner: [
      { key: 'qr', label: 'QR Scanner', description: 'Camera QR scanner button', preview: 'QR' },
      { key: 'barcode', label: 'Barcode Scanner', description: 'Barcode scan interaction', preview: 'Bar' },
      { key: 'card', label: 'Scanner Card', description: 'Scanner inside helpful card', preview: 'Card' },
      { key: 'compact', label: 'Compact Scanner', description: 'Compact scan CTA', preview: 'Small' },
      { key: 'dark', label: 'Dark Scanner', description: 'Dark scanner section', preview: 'Dark' },
      { key: 'retail', label: 'Retail Scan', description: 'Product lookup scanner style', preview: 'Shop' },
      { key: 'ticket', label: 'Ticket Scan', description: 'Event/ticket scanning style', preview: 'Ticket' },
      { key: 'verify', label: 'Verify Code', description: 'Verification scanner style', preview: 'Verify' }
    ],
    timer: [
      { key: 'classic', label: 'Classic Countdown', description: 'Days, hours, minutes, seconds', preview: 'D:H:M:S' },
      { key: 'cards', label: 'Timer Cards', description: 'Separate number cards', preview: 'Cards' },
      { key: 'minimal', label: 'Minimal Timer', description: 'Simple inline countdown', preview: 'Min' },
      { key: 'dark', label: 'Dark Timer', description: 'Dark campaign countdown', preview: 'Dark' },
      { key: 'sale', label: 'Sale Countdown', description: 'Urgent sale countdown', preview: 'Sale' },
      { key: 'event', label: 'Event Countdown', description: 'Event launch countdown', preview: 'Event' },
      { key: 'pill', label: 'Pill Timer', description: 'Rounded timer units', preview: 'Pill' },
      { key: 'compact', label: 'Compact', description: 'Space-saving countdown', preview: 'Small' }
    ],
    counter: [
      { key: 'number', label: 'Big Number', description: 'Large animated number', preview: '100+' },
      { key: 'card', label: 'Counter Card', description: 'Number inside a card', preview: 'Card' },
      { key: 'soft', label: 'Soft Counter', description: 'Soft background statistic', preview: 'Soft' },
      { key: 'dark', label: 'Dark Counter', description: 'Dark metric card', preview: 'Dark' },
      { key: 'compact', label: 'Compact Metric', description: 'Small inline metric', preview: 'Mini' },
      { key: 'accent', label: 'Accent Metric', description: 'Brand accent statistic', preview: 'Pink' },
      { key: 'percentage', label: 'Percentage', description: 'Percentage metric', preview: '98%' },
      { key: 'money', label: 'Currency Metric', description: 'Revenue/value counter', preview: '₹' }
    ],
    chart: [
      { key: 'bar', label: 'Bar Chart', description: 'Simple responsive bar chart', preview: 'Bar' },
      { key: 'line', label: 'Line Chart', description: 'Trend line style', preview: 'Line' },
      { key: 'donut', label: 'Donut Chart', description: 'Circular ratio visual', preview: 'Donut' },
      { key: 'progress', label: 'Progress Bars', description: 'Horizontal progress values', preview: 'Prog' },
      { key: 'cards', label: 'Metric Chart', description: 'Chart inside KPI card', preview: 'KPI' },
      { key: 'dark', label: 'Dark Chart', description: 'Dark analytics card', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Chart', description: 'Low-chrome chart style', preview: 'Min' },
      { key: 'accent', label: 'Accent Chart', description: 'Brand-accent chart', preview: 'Pink' }
    ],
    media: [
      { key: 'library', label: 'Media Library', description: 'Upload and display account media', preview: 'Media' },
      { key: 'images', label: 'Image Files', description: 'Image-focused media shelf', preview: 'Images' },
      { key: 'documents', label: 'Documents', description: 'Document download list', preview: 'Docs' },
      { key: 'cards', label: 'Media Cards', description: 'Visual media cards', preview: 'Cards' },
      { key: 'compact', label: 'Compact List', description: 'Compact file list', preview: 'List' },
      { key: 'grid', label: 'Media Grid', description: 'Thumbnail media grid', preview: 'Grid' },
      { key: 'downloads', label: 'Downloads', description: 'Download-focused files section', preview: 'Down' },
      { key: 'portfolio', label: 'Portfolio Media', description: 'Creative asset presentation', preview: 'Work' }
    ],

    navbar: [
      { key: 'simple', label: 'Simple Navbar', description: 'Logo, links and CTA', preview: 'Nav' },
      { key: 'centered', label: 'Centered Menu', description: 'Centered navigation links', preview: 'Center' },
      { key: 'minimal', label: 'Minimal', description: 'Clean logo and menu', preview: 'Min' },
      { key: 'dark', label: 'Dark Navbar', description: 'Dark navigation bar', preview: 'Dark' },
      { key: 'sticky', label: 'Sticky Navbar', description: 'Sticky page navigation', preview: 'Stick' },
      { key: 'cta', label: 'CTA Navbar', description: 'Strong action button', preview: 'CTA' },
      { key: 'shop', label: 'Shop Navbar', description: 'Store oriented menu', preview: 'Shop' },
      { key: 'compact', label: 'Compact Navbar', description: 'Space-saving header', preview: 'Small' },
      { key: 'mega', label: 'Mega Navbar', description: 'Large navigation with grouped content', preview: 'Mega' }
    ],
    hero: [
      { key: 'centered', label: 'Centered Hero', description: 'Centered title, text and CTA', preview: 'Hero' },
      { key: 'split', label: 'Split Hero', description: 'Text and visual side by side', preview: 'Split' },
      { key: 'image', label: 'Image Hero', description: 'Large gray image placeholder', preview: 'Image' },
      { key: 'gradient', label: 'Gradient Hero', description: 'Gradient marketing hero', preview: 'Grad' },
      { key: 'dark', label: 'Dark Hero', description: 'Dark high-contrast hero', preview: 'Dark' },
      { key: 'offer', label: 'Offer Hero', description: 'Promotion and CTA hero', preview: 'Sale' },
      { key: 'minimal', label: 'Minimal Hero', description: 'Simple clean hero', preview: 'Min' },
      { key: 'app', label: 'App Hero', description: 'Product/app launch hero', preview: 'App' },
      { key: 'saas', label: 'SaaS Split', description: 'Product copy with app visual and dual CTA', preview: 'SaaS' },
      { key: 'event', label: 'Event Hero', description: 'Event title, date and registration CTA', preview: 'Event' },
      { key: 'agency', label: 'Agency Hero', description: 'Editorial agency hero with proof points', preview: 'Agency' },
      { key: 'portfolio', label: 'Portfolio Hero', description: 'Creative profile and featured work layout', preview: 'Work' },
      { key: 'video', label: 'Video Hero', description: 'Hero with background/feature video', preview: 'Video' }
    ],
    services: [
      { key: 'three', label: '3 Services', description: 'Three equal service cards', preview: '3' },
      { key: 'four', label: '4 Services', description: 'Four compact services', preview: '4' },
      { key: 'icons', label: 'Icon Services', description: 'Icon-led service cards', preview: 'Icon' },
      { key: 'minimal', label: 'Minimal List', description: 'Clean service list', preview: 'List' },
      { key: 'dark', label: 'Dark Services', description: 'Dark service grid', preview: 'Dark' },
      { key: 'numbers', label: 'Numbered Services', description: 'Numbered process-like services', preview: '01' },
      { key: 'two', label: '2 Services', description: 'Two wider service cards', preview: '2' },
      { key: 'soft', label: 'Soft Cards', description: 'Soft background service cards', preview: 'Soft' },
      { key: 'carousel', label: 'Service Carousel', description: 'Horizontal cards with previous/next navigation', preview: 'Slide' },
      { key: 'media', label: 'Media Services', description: 'Image-led service cards with CTA', preview: 'Media' },
      { key: 'showcase', label: 'Service Showcase', description: 'Large featured service plus compact list', preview: 'Show' },
      { key: 'booking', label: 'Bookable Services', description: 'Service cards with booking actions', preview: 'Book' }
    ],
    testimonial: [
      { key: 'single', label: 'Single Review', description: 'Focused testimonial card', preview: '1' },
      { key: 'three', label: '3 Reviews', description: 'Three review cards', preview: '3' },
      { key: 'quote', label: 'Quote Review', description: 'Large quote layout', preview: 'Quote' },
      { key: 'rating', label: 'Rating Review', description: 'Stars and customer review', preview: '5★' },
      { key: 'dark', label: 'Dark Review', description: 'Dark testimonial section', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Review', description: 'Simple text review', preview: 'Min' },
      { key: 'profile', label: 'Profile Review', description: 'Avatar placeholder and review', preview: 'User' },
      { key: 'featured', label: 'Featured Review', description: 'Prominent highlighted quote', preview: 'Best' }
    ],
    pricing: [
      { key: 'three', label: '3 Plans', description: 'Three pricing cards', preview: '3' },
      { key: 'featured', label: 'Featured Plan', description: 'Highlight middle plan', preview: 'Best' },
      { key: 'single', label: 'Single Plan', description: 'One focused pricing card', preview: '1' },
      { key: 'two', label: '2 Plans', description: 'Two comparison plans', preview: '2' },
      { key: 'dark', label: 'Dark Pricing', description: 'Dark pricing cards', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Pricing', description: 'Low-chrome pricing layout', preview: 'Min' },
      { key: 'monthly', label: 'Monthly Plans', description: 'Monthly pricing labels', preview: '/mo' },
      { key: 'service', label: 'Service Pricing', description: 'Service/package pricing', preview: 'Svc' }
    ],
    faq: [
      { key: 'accordion', label: 'Accordion FAQ', description: 'Expandable FAQ list', preview: 'FAQ' },
      { key: 'cards', label: 'FAQ Cards', description: 'Questions in cards', preview: 'Cards' },
      { key: 'two-column', label: '2 Column FAQ', description: 'Two-column questions', preview: '2 Col' },
      { key: 'minimal', label: 'Minimal FAQ', description: 'Simple question list', preview: 'Min' },
      { key: 'dark', label: 'Dark FAQ', description: 'Dark FAQ section', preview: 'Dark' },
      { key: 'support', label: 'Support FAQ', description: 'Support-oriented questions', preview: 'Help' },
      { key: 'product', label: 'Product FAQ', description: 'Product-related questions', preview: 'Prod' },
      { key: 'service', label: 'Service FAQ', description: 'Service-related questions', preview: 'Svc' }
    ],
    stats: [
      { key: 'four', label: '4 Stats', description: 'Four business metrics', preview: '4' },
      { key: 'three', label: '3 Stats', description: 'Three large metrics', preview: '3' },
      { key: 'cards', label: 'Stat Cards', description: 'Metrics inside cards', preview: 'Card' },
      { key: 'dark', label: 'Dark Stats', description: 'Dark metric strip', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Stats', description: 'Simple numeric metrics', preview: 'Min' },
      { key: 'accent', label: 'Accent Stats', description: 'Brand-accent numbers', preview: 'Pink' },
      { key: 'percent', label: 'Percent Stats', description: 'Percentage metrics', preview: '%' },
      { key: 'business', label: 'Business Stats', description: 'Clients, projects and years', preview: 'Biz' }
    ],
    tabs: [
      { key: 'simple', label: 'Simple Tabs', description: 'Three simple tabs', preview: 'Tabs' },
      { key: 'pills', label: 'Pill Tabs', description: 'Rounded pill navigation', preview: 'Pill' },
      { key: 'underline', label: 'Underline Tabs', description: 'Underline active tab', preview: 'Line' },
      { key: 'cards', label: 'Card Tabs', description: 'Tabs in card container', preview: 'Card' },
      { key: 'dark', label: 'Dark Tabs', description: 'Dark tab section', preview: 'Dark' },
      { key: 'services', label: 'Service Tabs', description: 'Tabbed service content', preview: 'Svc' },
      { key: 'features', label: 'Feature Tabs', description: 'Tabbed product features', preview: 'Feat' },
      { key: 'compact', label: 'Compact Tabs', description: 'Small compact tabs', preview: 'Small' }
    ],
    timeline: [
      { key: 'steps', label: 'Steps', description: 'Numbered process steps', preview: '1-2-3' },
      { key: 'vertical', label: 'Vertical Timeline', description: 'Vertical milestone list', preview: 'Vert' },
      { key: 'horizontal', label: 'Horizontal Steps', description: 'Horizontal process', preview: 'Horiz' },
      { key: 'cards', label: 'Step Cards', description: 'Steps shown as cards', preview: 'Cards' },
      { key: 'dark', label: 'Dark Timeline', description: 'Dark process section', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Steps', description: 'Clean lightweight steps', preview: 'Min' },
      { key: 'process', label: 'Work Process', description: 'Business process layout', preview: 'Work' },
      { key: 'roadmap', label: 'Roadmap', description: 'Roadmap milestone layout', preview: 'Road' }
    ],
    team: [
      { key: 'three', label: '3 Members', description: 'Three team profile cards', preview: '3' },
      { key: 'four', label: '4 Members', description: 'Four compact profiles', preview: '4' },
      { key: 'minimal', label: 'Minimal Team', description: 'Simple names and roles', preview: 'Min' },
      { key: 'social', label: 'Team + Social', description: 'Profiles with social links', preview: 'Share' },
      { key: 'dark', label: 'Dark Team', description: 'Dark profile cards', preview: 'Dark' },
      { key: 'leadership', label: 'Leadership', description: 'Leadership profile layout', preview: 'Lead' },
      { key: 'two', label: '2 Members', description: 'Two wide profiles', preview: '2' },
      { key: 'grid', label: 'Team Grid', description: 'Compact people grid', preview: 'Grid' }
    ],
    footer: [
      { key: 'simple', label: 'Simple Footer', description: 'Brand and copyright', preview: 'Foot' },
      { key: 'columns', label: '4 Column Footer', description: 'Links and contact columns', preview: '4 Col' },
      { key: 'dark', label: 'Dark Footer', description: 'Dark site footer', preview: 'Dark' },
      { key: 'newsletter', label: 'Newsletter Footer', description: 'Email signup and links', preview: 'Mail' },
      { key: 'contact', label: 'Contact Footer', description: 'Contact details and links', preview: 'Contact' },
      { key: 'minimal', label: 'Minimal Footer', description: 'Compact minimal footer', preview: 'Min' },
      { key: 'social', label: 'Social Footer', description: 'Social links focused footer', preview: 'Share' },
      { key: 'business', label: 'Business Footer', description: 'Business info and navigation', preview: 'Biz' }
    ],
    popup: [
      { key: 'offer', label: 'Offer Popup', description: 'Promotion popup preview', preview: 'Sale' },
      { key: 'lead', label: 'Lead Popup', description: 'Lead capture popup', preview: 'Lead' },
      { key: 'newsletter', label: 'Newsletter Popup', description: 'Email signup popup', preview: 'Mail' },
      { key: 'notice', label: 'Notice Popup', description: 'Announcement popup', preview: 'Info' },
      { key: 'dark', label: 'Dark Popup', description: 'Dark modal design', preview: 'Dark' },
      { key: 'minimal', label: 'Minimal Popup', description: 'Simple modal card', preview: 'Min' }
    ],
    floating: [
      { key: 'whatsapp', label: 'WhatsApp', description: 'Floating WhatsApp action', preview: 'WA' },
      { key: 'call', label: 'Call', description: 'Floating call action', preview: 'Call' },
      { key: 'email', label: 'Email', description: 'Floating email action', preview: 'Mail' },
      { key: 'book', label: 'Book Now', description: 'Floating booking action', preview: 'Book' },
      { key: 'multi', label: 'Multi Action', description: 'Multiple floating contacts', preview: 'Multi' },
      { key: 'top', label: 'Back to Top', description: 'Floating back-to-top button', preview: 'Top' }
    ],
    divider: [
      { key: 'line', label: 'Line', description: 'Simple divider line', preview: 'Line' },
      { key: 'accent', label: 'Accent', description: 'Brand color divider', preview: 'Pink' },
      { key: 'thick', label: 'Thick', description: 'Thicker divider', preview: 'Thick' },
      { key: 'dashed', label: 'Dashed', description: 'Dashed divider line', preview: 'Dash' },
      { key: 'dotted', label: 'Dotted', description: 'Dotted divider line', preview: 'Dot' },
      { key: 'soft', label: 'Soft', description: 'Soft gray divider', preview: 'Soft' },
      { key: 'short', label: 'Short Accent', description: 'Short centered divider', preview: 'Short' },
      { key: 'double', label: 'Double Line', description: 'Double line divider', preview: 'Double' }
    ],
    spacer: [
      { key: 'xs', label: 'Extra Small', description: '16px spacing', preview: '16' },
      { key: 'sm', label: 'Small', description: '32px spacing', preview: '32' },
      { key: 'md', label: 'Medium', description: '48px spacing', preview: '48' },
      { key: 'lg', label: 'Large', description: '72px spacing', preview: '72' },
      { key: 'xl', label: 'Extra Large', description: '96px spacing', preview: '96' },
      { key: 'xxl', label: 'XX Large', description: '128px spacing', preview: '128' },
      { key: 'huge', label: 'Huge', description: '160px spacing', preview: '160' },
      { key: 'custom', label: 'Custom', description: 'Start at 64px and edit', preview: 'Custom' }
    ]
  };

  blocks: EditorBlock[] = [];
  selectedId = '';
  selectedNestedParentId = '';
  selectedNestedSlot = -1;
  selectedNestedId = '';
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  zoom = 100;
  dragIndex = -1;
  draggingType = '';
  activePresetType = '';
  presetExpanded = false;
  elementSearch = '';
  elementMenuType = '';
  mobilePanel: 'none' | 'elements' | 'properties' = 'none';
  readonly pinnedElementTypes = new Set<string>(this.readPinnedElements());
  initialized = false;

  mediaPickerOpen = false;
  mediaPickerMultiple = false;
  mediaPickerTitle = 'Choose image';
  mediaPickerSelectedIds: Array<string | number> = [];
  mediaPickerMaxSelection = 0;
  private mediaTarget?: {
    record: Record<string, any>;
    valueField: string;
    idField: string;
    multiple: boolean;
  };


  private designTimer?: ReturnType<typeof setTimeout>;
  private history: EditorBlock[][] = [];
  private future: EditorBlock[][] = [];

  get selected(): EditorBlock | undefined {
    if (this.selectedNestedId) {
      const parent = this.blocks.find(block => block.id === this.selectedNestedParentId);
      const slots = Array.isArray(parent?.content?.['slots']) ? parent?.content?.['slots'] : [];
      const slot = Array.isArray(slots[this.selectedNestedSlot]) ? slots[this.selectedNestedSlot] : [];
      return slot.find((item: EditorBlock) => item.id === this.selectedNestedId);
    }
    return this.blocks.find(block => block.id === this.selectedId);
  }

  get selectedIsNested(): boolean {
    return !!this.selectedNestedId;
  }

  get canUndo(): boolean {
    return this.history.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['design'] && changes['design'].currentValue) {
      this.loadDesign(changes['design'].currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.designTimer) clearTimeout(this.designTimer);
  }

  loadDesign(value: unknown): void {
    const design = this.normalizeDesign(value);
    const firstLoad = !this.initialized;
    this.blocks = design.body.rows.map(row => this.clone(row));
    this.selectedId = this.blocks[0]?.id || '';
    this.clearNestedSelection();
    this.history = [];
    this.future = [];
    this.initialized = true;
    if (firstLoad && typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      this.device = 'mobile';
    }
    if (firstLoad) setTimeout(() => this.ready.emit());
  }

  async saveDesign(): Promise<EditorDesign> {
    return this.buildDesign();
  }

  async exportHtml(): Promise<{ html: string; design: EditorDesign }> {
    const design = this.buildDesign();
    return { design, html: this.buildHtml(design) };
  }

  get filteredElements(): Array<{ type: string; label: string; icon: string }> {
    const query = this.elementSearch.trim().toLowerCase();
    return this.elements
      .filter(element => !query || element.label.toLowerCase().includes(query) || element.type.toLowerCase().includes(query))
      .slice()
      .sort((a, b) => {
        const aPinned = this.isElementPinned(a.type) ? 1 : 0;
        const bPinned = this.isElementPinned(b.type) ? 1 : 0;
        return bPinned - aPinned;
      });
  }

  isElementPinned(type: string): boolean {
    return this.pinnedElementTypes.has(type);
  }

  toggleElementPin(type: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.pinnedElementTypes.has(type)) this.pinnedElementTypes.delete(type);
    else this.pinnedElementTypes.add(type);
    this.savePinnedElements();
  }

  toggleElementMenu(type: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.elementMenuType = this.elementMenuType === type ? '' : type;
  }

  closeElementMenu(): void {
    this.elementMenuType = '';
  }

  openElementStylesFromMenu(type: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.elementMenuType = '';
    this.onElementClick(type);
  }

  addDefaultElementFromMenu(type: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.elementMenuType = '';
    const preset = this.defaultPreset(type);
    if (type === 'template') {
      this.insertTemplatePreset(preset);
      this.closePresetPicker();
      return;
    }
    if (type === 'ecommerce') {
      this.insertEcommercePreset(preset);
      this.closePresetPicker();
      return;
    }
    this.addElement(type, undefined, preset);
    this.closePresetPicker();
  }

  clearElementSearch(): void {
    this.elementSearch = '';
  }

  openMobileElements(): void {
    this.mobilePanel = 'elements';
  }

  openMobileProperties(): void {
    if (!this.selected) return;
    this.mobilePanel = 'properties';
  }

  closeMobilePanel(): void {
    this.mobilePanel = 'none';
  }

  onElementClick(type: string): void {
    this.elementMenuType = '';
    if (!this.hasPresets(type)) {
      this.addElement(type);
      return;
    }
    const same = this.activePresetType === type;
    this.activePresetType = same ? '' : type;
    this.presetExpanded = false;
    this.mobilePanel = 'elements';
  }

  hasPresets(type: string): boolean {
    return Array.isArray(this.presets[type]) && this.presets[type].length > 0;
  }

  presetOptions(type: string): ElementPreset[] {
    return (this.presets[type] || []).filter(preset => !this.catalog.isHiddenPreset(preset.key));
  }

  presetBadge(type: string, key: string): string {
    return this.catalog.label(type, key);
  }

  presetTier(type: string, key: string): string {
    return this.catalog.meta(type, key).tier;
  }

  canUsePreset(type: string, key: string): boolean {
    return this.catalog.canUse(type, key);
  }

  visiblePresetOptions(type: string): ElementPreset[] {
    const options = this.presetOptions(type);
    return this.presetExpanded ? options : options.slice(0, 8);
  }

  hasMorePresets(type: string): boolean {
    return this.presetOptions(type).length > 6;
  }

  toggleMorePresets(): void {
    this.presetExpanded = !this.presetExpanded;
  }

  closePresetPicker(): void {
    this.activePresetType = '';
    this.presetExpanded = false;
  }

  elementLabel(type: string): string {
    return this.elements.find(element => element.type === type)?.label || 'Element';
  }

  presetIcon(type: string): string {
    return this.elements.find(element => element.type === type)?.icon || 'widgets';
  }

  addPreset(type: string, preset: string): void {
    if (!this.canUsePreset(type, preset)) return;
    if (type === 'template') {
      this.insertTemplatePreset(preset);
      return;
    }
    if (type === 'ecommerce') {
      this.insertEcommercePreset(preset);
      return;
    }
    this.addElement(type, undefined, preset);
  }

  openMediaPicker(
    record: Record<string, any>,
    valueField: string,
    idField: string,
    title = 'Choose image'
  ): void {
    this.mediaTarget = { record, valueField, idField, multiple: false };
    const id = record[idField];
    this.mediaPickerSelectedIds = id !== undefined && id !== null && id !== '' ? [id] : [];
    this.mediaPickerMultiple = false;
    this.mediaPickerMaxSelection = 1;
    this.mediaPickerTitle = title;
    this.mediaPickerOpen = true;
  }

  openMultipleMediaPicker(
    record: Record<string, any>,
    valueField: string,
    idField: string,
    title = 'Choose images',
    maxSelection = 0
  ): void {
    this.mediaTarget = { record, valueField, idField, multiple: true };
    this.mediaPickerSelectedIds = Array.isArray(record[idField]) ? [...record[idField]] : [];
    this.mediaPickerMultiple = true;
    this.mediaPickerMaxSelection = maxSelection;
    this.mediaPickerTitle = title;
    this.mediaPickerOpen = true;
  }

  closeMediaPicker(): void {
    this.mediaPickerOpen = false;
    this.mediaTarget = undefined;
    this.mediaPickerSelectedIds = [];
    this.mediaPickerMaxSelection = 0;
  }

  onMediaPickerSelected(items: MediaLibraryItem[]): void {
    const target = this.mediaTarget;
    if (!target || !items.length) return;

    this.pushHistory();
    if (target.multiple) {
      target.record[target.valueField] = items.map(item => item.url);
      target.record[target.idField] = items.map(item => item.id);
      if ('imagesText' in target.record) {
        target.record['imagesText'] = items.map(item => item.url).join('\n');
      }
    } else {
      const item = items[0];
      target.record[target.valueField] = item.url;
      target.record[target.idField] = item.id;
    }
    this.commitChange();
    this.closeMediaPicker();
  }

  clearMedia(record: Record<string, any>, valueField: string, idField: string): void {
    this.pushHistory();
    record[valueField] = Array.isArray(record[valueField]) ? [] : '';
    record[idField] = Array.isArray(record[idField]) ? [] : null;
    if ('imagesText' in record && Array.isArray(record[valueField])) record['imagesText'] = '';
    this.commitChange();
  }

  addElement(type: string, index?: number, preset?: string): void {
    if (!this.isElementType(type) || type === 'template' || type === 'ecommerce') return;
    this.pushHistory();
    const block = this.createBlock(type, preset || this.defaultPreset(type));
    const insertAt = Number.isInteger(index)
      ? Math.max(0, Math.min(index as number, this.blocks.length))
      : this.insertIndexAfterSelection();
    this.blocks.splice(insertAt, 0, block);
    this.selectedId = block.id;
    this.clearNestedSelection();
    this.closePresetPicker();
    this.mobilePanel = 'properties';
    this.commitChange();
  }

  insertTemplatePreset(preset: string): void {
    this.pushHistory();
    const bundle = this.templateBundle(preset);
    const insertAt = this.insertIndexAfterSelection();
    this.blocks.splice(insertAt, 0, ...bundle);
    this.selectedId = bundle[0]?.id || this.selectedId;
    this.clearNestedSelection();
    this.closePresetPicker();
    this.mobilePanel = 'properties';
    this.commitChange();
  }

  insertEcommercePreset(preset: string): void {
    this.pushHistory();
    const bundle = this.ecommerceBundle(preset);
    const insertAt = this.insertIndexAfterSelection();
    this.blocks.splice(insertAt, 0, ...bundle);
    this.selectedId = bundle[0]?.id || this.selectedId;
    this.clearNestedSelection();
    this.closePresetPicker();
    this.mobilePanel = 'properties';
    this.commitChange();
  }

  private insertIndexAfterSelection(): number {
    if (!this.selectedId) return this.blocks.length;
    const selectedIndex = this.blocks.findIndex(block => block.id === this.selectedId);
    return selectedIndex >= 0 ? selectedIndex + 1 : this.blocks.length;
  }

  select(block: EditorBlock): void {
    this.selectedId = block.id;
    this.clearNestedSelection();
    this.mobilePanel = 'properties';
  }

  selectNested(parent: EditorBlock, slotIndex: number, child: EditorBlock, event?: Event): void {
    event?.stopPropagation();
    this.selectedId = parent.id;
    this.selectedNestedParentId = parent.id;
    this.selectedNestedSlot = slotIndex;
    this.selectedNestedId = child.id;
    this.mobilePanel = 'properties';
  }

  clearSelection(event?: Event): void {
    event?.stopPropagation();
    this.elementMenuType = '';
    this.selectedId = '';
    this.clearNestedSelection();
    this.mobilePanel = 'none';
  }

  private clearNestedSelection(): void {
    this.selectedNestedParentId = '';
    this.selectedNestedSlot = -1;
    this.selectedNestedId = '';
  }

  duplicate(block: EditorBlock): void {
    if (this.selectedIsNested) {
      const context = this.nestedContext();
      if (!context) return;
      this.pushHistory();
      const copy = this.clone(block);
      copy.id = this.uid(block.type);
      context.slot.splice(context.index + 1, 0, copy);
      this.selectedNestedId = copy.id;
      this.commitChange();
      return;
    }
    const index = this.blocks.findIndex(item => item.id === block.id);
    if (index < 0) return;
    this.pushHistory();
    const copy = this.clone(block);
    copy.id = this.uid(block.type);
    this.blocks.splice(index + 1, 0, copy);
    this.selectedId = copy.id;
    this.commitChange();
  }

  remove(block: EditorBlock): void {
    if (this.selectedIsNested) {
      const context = this.nestedContext();
      if (!context) return;
      this.pushHistory();
      context.slot.splice(context.index, 1);
      this.clearNestedSelection();
      this.selectedId = context.parent.id;
      this.commitChange();
      return;
    }
    const index = this.blocks.findIndex(item => item.id === block.id);
    if (index < 0) return;
    this.pushHistory();
    this.blocks.splice(index, 1);
    this.selectedId = this.blocks[index]?.id || this.blocks[index - 1]?.id || '';
    this.clearNestedSelection();
    this.commitChange();
  }

  move(block: EditorBlock, delta: number): void {
    if (this.selectedIsNested) return;
    const index = this.blocks.findIndex(item => item.id === block.id);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= this.blocks.length) return;
    this.pushHistory();
    [this.blocks[index], this.blocks[next]] = [this.blocks[next], this.blocks[index]];
    this.selectedId = block.id;
    this.commitChange();
  }

  updateSelected(): void {
    this.commitChange();
  }

  changeSocialPlatform(block: EditorBlock, item: Record<string, any>, platform: string): void {
    const key = String(platform || '').toLowerCase();
    const iconMap: Record<string, string> = {
      facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
      instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
      youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
      linkedin: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png',
      telegram: 'https://cdn.simpleicons.org/telegram/229ED9',
      x: 'https://cdn.simpleicons.org/x/111111',
      whatsapp: 'https://cdn.simpleicons.org/whatsapp/25D366',
      website: 'https://cdn.simpleicons.org/internetarchive/000000',
      github: 'https://cdn.simpleicons.org/github/181717',
      tiktok: 'https://cdn.simpleicons.org/tiktok/111111'
    };
    const nameMap: Record<string, string> = {
      facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube',
      linkedin: 'LinkedIn', telegram: 'Telegram', x: 'X', whatsapp: 'WhatsApp',
      website: 'Website', github: 'GitHub', tiktok: 'TikTok'
    };
    const urlMap: Record<string, string> = {
      facebook: 'https://www.facebook.com/',
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      telegram: 'https://t.me/',
      x: 'https://x.com/',
      whatsapp: 'https://wa.me/',
      website: 'https://example.com/',
      github: 'https://github.com/',
      tiktok: 'https://www.tiktok.com/'
    };

    this.pushHistory();
    item['platform'] = key;
    item['name'] = nameMap[key] || item['name'] || item['label'] || 'Link';
    item['label'] = item['name'];
    if (iconMap[key]) item['icon'] = iconMap[key];
    if (!String(item['url'] || '').trim() || String(item['url']).trim() === '#') {
      item['url'] = urlMap[key] || '#';
    }

    const items = Array.isArray(block.content['items']) ? block.content['items'] : [];
    block.content['items'] = items;
    this.commitChange();
  }

  addRepeatItem(block: EditorBlock, key: string): void {
    const list = Array.isArray(block.content[key]) ? block.content[key] : [];
    this.pushHistory();
    list.push(this.repeatItemTemplate(block.type, key, list.length));
    block.content[key] = list;
    this.commitChange();
  }

  removeRepeatItem(block: EditorBlock, key: string, index: number, minimum = 1): void {
    const list = Array.isArray(block.content[key]) ? block.content[key] : [];
    if (list.length <= minimum || index < 0 || index >= list.length) return;
    this.pushHistory();
    list.splice(index, 1);
    block.content[key] = list;
    this.commitChange();
  }

  moveRepeatItem(block: EditorBlock, key: string, index: number, delta: number): void {
    const list = Array.isArray(block.content[key]) ? block.content[key] : [];
    const next = index + delta;
    if (index < 0 || next < 0 || next >= list.length) return;
    this.pushHistory();
    [list[index], list[next]] = [list[next], list[index]];
    block.content[key] = list;
    this.commitChange();
  }

  addFormField(block: EditorBlock, type = 'text'): void {
    const fields = Array.isArray(block.content['fields']) ? block.content['fields'] : [];
    this.pushHistory();
    fields.push(this.formFieldTemplate(type, fields.length));
    block.content['fields'] = fields;
    this.commitChange();
  }

  changeFormFieldType(block: EditorBlock, field: Record<string, any>, type: string): void {
    const next = this.formFieldTemplate(type, 0);
    field['type'] = type;
    field['options'] = next.options || field['options'] || '';
    this.commitChange();
  }

  private formFieldTemplate(type: string, index: number): Record<string, any> {
    const labelMap: Record<string, string> = { text: 'Name', email: 'Email', phone: 'Phone', number: 'Number', textarea: 'Message', select: 'Select option', radio: 'Choose one', checkbox: 'I agree', date: 'Date', time: 'Time', datetime: 'Date & time' };
    return {
      id: this.uid('field'),
      type,
      name: `${type}_${index + 1}`,
      label: labelMap[type] || 'Field',
      placeholder: type === 'textarea' ? 'Write your message' : '',
      required: ['email', 'phone'].includes(type),
      options: ['select', 'radio'].includes(type) ? 'Option 1\nOption 2\nOption 3' : '',
      width: 'full'
    };
  }

  private repeatItemTemplate(type: string, key: string, index: number): Record<string, any> {
    switch (type) {
      case 'services': return { icon: 'design_services', title: `Service ${index + 1}`, text: 'Add a short description of this service.', image: '', mediaId: null, badge: '', cta: 'Learn more', url: '#' };
      case 'testimonial': return { name: `Customer ${index + 1}`, role: 'Verified customer', rating: 5, quote: 'Add your customer review here.', image: '', mediaId: null };
      case 'pricing': return { name: `Plan ${index + 1}`, price: '₹999', oldPrice: '', period: '/month', features: 'Feature one\nFeature two\nFeature three', badge: '', cta: 'Choose Plan', url: '#' };
      case 'faq': return { q: `Question ${index + 1}`, a: 'Add your answer here.' };
      case 'stats': return { icon: 'monitoring', value: '100+', prefix: '', suffix: '', label: `Metric ${index + 1}`, text: '' };
      case 'tabs': return { title: `Tab ${index + 1}`, text: 'Add tab content here.', image: '', mediaId: null };
      case 'timeline': return { title: `Step ${index + 1}`, text: 'Describe this step.', icon: 'radio_button_checked' };
      case 'team': return { name: `Team Member ${index + 1}`, role: 'Team', bio: '', image: '', mediaId: null, facebook: '', instagram: '', linkedin: '', x: '' };
      case 'button': return { label: `Button ${index + 1}`, url: '#', target: '_self', icon: '' };
      case 'icon': return { materialIcon: 'star', label: `Icon ${index + 1}`, url: '#' };
      case 'social': return { name: 'Facebook', url: '#', icon: 'https://cdn.simpleicons.org/facebook/1877F2', platform: 'facebook', label: 'Facebook' };
      case 'navbar': return { label: `Menu ${index + 1}`, url: '#', icon: '', target: '_self' };
      case 'product': return { name: `Product ${index + 1}`, price: '₹499', oldPrice: '', badge: '', description: 'Short product description.', image: '', mediaId: null, cta: 'Buy Now', url: '#', rating: 5 };
      case 'offer': return { badge: 'LIMITED OFFER', title: `Offer ${index + 1}`, discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#', image: '', mediaId: null };
      case 'contact': return { platform: 'whatsapp', label: 'WhatsApp', url: '#' };
      case 'floating': return { icon: 'chat', label: `Action ${index + 1}`, url: '#' };
      case 'counter': return { start: 0, end: 100, prefix: '', suffix: '+', label: `Counter ${index + 1}`, duration: 1600 };
      case 'chart': return { label: `Item ${index + 1}`, value: 50 };
      case 'rating': return { label: 'Your rating', max: 5 };
      default: return { label: `Item ${index + 1}` };
    }
  }

  applyPresetToBlock(block: EditorBlock, variant: string): void {
    const fresh = this.createBlock(block.type, variant);
    block.content = { ...block.content, variant };
    block.style = { ...block.style, ...fresh.style };
    if (block.type === 'section') {
      this.changeSectionVariant(block, variant);
      return;
    }
    if (block.type === 'block') {
      this.changeBlockVariant(block, variant);
      return;
    }
    if (block.type === 'gallery') block.style['columns'] = fresh.style['columns'];
    if (block.type === 'spacer') block.style['height'] = fresh.style['height'];
    if (block.type === 'map') block.content['height'] = fresh.content['height'];
    if (block.type === 'timer') block.content['variant'] = variant;
    if (block.type === 'chart') block.content['variant'] = variant;
    this.commitChange();
  }

  applyButtonVariant(block: EditorBlock, variant: string): void {
    const fresh = this.createBlock('button', variant);
    block.content['variant'] = variant;
    block.style = { ...block.style, ...fresh.style };
    this.commitChange();
  }

  applyProductVariant(block: EditorBlock, variant: string): void {
    const fresh = this.createBlock('product', variant);
    block.content['variant'] = variant;
    if (variant === 'sale') {
      block.content['oldPrice'] ||= fresh.content['oldPrice'];
      block.content['badge'] ||= fresh.content['badge'];
    }
    block.style = { ...block.style, ...fresh.style };
    this.commitChange();
  }

  changeSectionVariant(block: EditorBlock, variant: string): void {
    const count = this.sectionCellCount(variant);
    const current = Array.isArray(block.content['cells']) ? block.content['cells'] : [];
    block.content['variant'] = variant;
    block.content['cells'] = Array.from({ length: count }, (_, index) => ({
      title: current[index]?.title || `Column ${index + 1}`,
      text: current[index]?.text || 'Add your content here.'
    }));
    block.style['columns'] = this.sectionColumns(variant);
    this.commitChange();
  }

  changeBlockVariant(block: EditorBlock, variant: string): void {
    const count = this.sectionCellCount(variant);
    const current = Array.isArray(block.content['slots']) ? block.content['slots'] : [];
    const slots = Array.from({ length: count }, (_, index) => Array.isArray(current[index]) ? current[index] : []);
    block.content['variant'] = variant;
    block.content['slots'] = slots;
    block.style['columns'] = this.sectionColumns(variant);
    if (variant === 'media-form' && slots.every((slot: EditorBlock[]) => !slot.length)) {
      slots[0] = [this.createBlock('image', 'rounded')];
      slots[1] = [this.createBlock('form', 'compact')];
    }
    if (variant === 'text-media' && slots.every((slot: EditorBlock[]) => !slot.length)) {
      slots[0] = [this.createBlock('text', 'lead')];
      slots[1] = [this.createBlock('image', 'rounded')];
    }
    this.commitChange();
  }

  onContainerSlotDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onContainerSlotDrop(event: DragEvent, parent: EditorBlock, slotIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    const type = event.dataTransfer?.getData('application/x-brain-techno-element')
      || event.dataTransfer?.getData('text/plain')
      || this.draggingType;
    if (!type || !this.isElementType(type) || ['template', 'ecommerce', 'block'].includes(type)) return;
    const slots = Array.isArray(parent.content['slots']) ? parent.content['slots'] : [];
    if (!Array.isArray(slots[slotIndex])) slots[slotIndex] = [];
    this.pushHistory();
    const child = this.createBlock(type, this.defaultPreset(type));
    slots[slotIndex].push(child);
    parent.content['slots'] = slots;
    this.selectNested(parent, slotIndex, child);
    this.draggingType = '';
    this.commitChange();
  }

  addToSlot(parent: EditorBlock, slotIndex: number, type: string): void {
    const slots = Array.isArray(parent.content['slots']) ? parent.content['slots'] : [];
    if (!Array.isArray(slots[slotIndex])) slots[slotIndex] = [];
    this.pushHistory();
    const child = this.createBlock(type, this.defaultPreset(type));
    slots[slotIndex].push(child);
    parent.content['slots'] = slots;
    this.selectNested(parent, slotIndex, child);
    this.commitChange();
  }

  updateGalleryImages(block: EditorBlock): void {
    const text = String(block.content['imagesText'] || '');
    block.content['images'] = text.split('\n').map(value => value.trim()).filter(Boolean);
    this.commitChange();
  }

  async onImageFile(event: Event, block: EditorBlock): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      input.value = '';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Please choose an image smaller than 4 MB.');
      input.value = '';
      return;
    }
    const dataUrl = await this.readFileAsDataUrl(file);
    this.pushHistory();
    if (block.type === 'product') block.content['image'] = dataUrl;
    else block.content['url'] = dataUrl;
    block.content['alt'] = block.content['alt'] || file.name.replace(/\.[^.]+$/, '');
    this.commitChange();
    input.value = '';
  }

  async onBackgroundImageFile(event: Event, block: EditorBlock): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      input.value = '';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Please choose an image smaller than 4 MB.');
      input.value = '';
      return;
    }
    const dataUrl = await this.readFileAsDataUrl(file);
    this.pushHistory();
    block.style['backgroundImage'] = dataUrl;
    if (block.style['backgroundType'] === 'color') block.style['backgroundType'] = 'image';
    this.commitChange();
    input.value = '';
  }

  clearBackgroundImage(block: EditorBlock): void {
    this.pushHistory();
    block.style['backgroundImage'] = '';
    if (block.style['backgroundType'] === 'image') block.style['backgroundType'] = 'color';
    if (block.style['backgroundType'] === 'gradient-image') block.style['backgroundType'] = 'gradient';
    this.commitChange();
  }

  async onGalleryFiles(event: Event, block: EditorBlock): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []).filter(file => file.type.startsWith('image/'));
    if (!files.length) return;
    if (files.some(file => file.size > 4 * 1024 * 1024)) {
      alert('Each image must be smaller than 4 MB.');
      input.value = '';
      return;
    }
    const current = Array.isArray(block.content['images']) ? [...block.content['images']] : [];
    const urls = await Promise.all(files.slice(0, 10).map(file => this.readFileAsDataUrl(file)));
    this.pushHistory();
    block.content['images'] = [...current, ...urls].slice(0, 16);
    block.content['imagesText'] = block.content['images'].join('\n');
    this.commitChange();
    input.value = '';
  }

  removeGalleryImage(block: EditorBlock, index: number): void {
    const images = Array.isArray(block.content['images']) ? [...block.content['images']] : [];
    if (index < 0 || index >= images.length) return;
    this.pushHistory();
    images.splice(index, 1);
    block.content['images'] = images;
    block.content['imagesText'] = images.join('\n');
    this.commitChange();
  }

  async onMediaFiles(event: Event, block: EditorBlock): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) return;
    if (files.some(file => file.size > 4 * 1024 * 1024)) {
      alert('Each media file must be smaller than 4 MB in this editor.');
      input.value = '';
      return;
    }
    const current: MediaItem[] = Array.isArray(block.content['files']) ? [...block.content['files']] : [];
    const items: MediaItem[] = [];
    for (const file of files.slice(0, 8)) {
      items.push({ name: file.name, type: file.type || 'application/octet-stream', dataUrl: await this.readFileAsDataUrl(file) });
    }
    this.pushHistory();
    block.content['files'] = [...current, ...items].slice(0, 12);
    this.commitChange();
    input.value = '';
  }

  removeMediaFile(block: EditorBlock, index: number): void {
    const files: MediaItem[] = Array.isArray(block.content['files']) ? [...block.content['files']] : [];
    if (index < 0 || index >= files.length) return;
    this.pushHistory();
    files.splice(index, 1);
    block.content['files'] = files;
    this.commitChange();
  }

  chartData(block: EditorBlock): Array<{ label: string; value: number }> {
    return String(block.content['data'] || '')
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const [label, value] = part.split(':');
        return { label: (label || '').trim(), value: Number(value) || 0 };
      })
      .slice(0, 10);
  }

  chartMax(block: EditorBlock): number {
    return Math.max(1, ...this.chartData(block).map(item => item.value));
  }

  chartPoints(block: EditorBlock): string {
    const data = this.chartData(block);
    const max = this.chartMax(block);
    if (!data.length) return '';
    const step = data.length === 1 ? 100 : 100 / (data.length - 1);
    return data.map((item, index) => `${index * step},${100 - (item.value / max) * 90}`).join(' ');
  }

  videoPreviewUrl(block: EditorBlock): string {
    return this.youtubeEmbedUrl(String(block.content['url'] || ''));
  }

  sectionColumns(variant: string): number {
    if (variant === 'three' || variant === 'three-three') return 3;
    if (variant === 'four' || variant === 'feature-grid') return 4;
    return variant === 'one' ? 1 : 2;
  }

  sectionCellCount(variant: string): number {
    if (variant === 'three-three') return 6;
    if (variant === 'two-two' || variant === 'feature-grid') return 4;
    if (variant === 'three') return 3;
    if (variant === 'four') return 4;
    return variant === 'one' ? 1 : 2;
  }

  presetCells(variant: string): number[] {
    return Array.from({ length: this.sectionCellCount(variant) });
  }

  setDevice(device: 'desktop' | 'tablet' | 'mobile'): void {
    this.device = device;
  }

  zoomOut(): void {
    this.zoom = Math.max(60, this.zoom - 10);
  }

  zoomIn(): void {
    this.zoom = Math.min(120, this.zoom + 10);
  }

  resetZoom(): void {
    this.zoom = 100;
  }

  undo(): void {
    const previous = this.history.pop();
    if (!previous) return;
    this.future.push(this.clone(this.blocks));
    this.blocks = this.clone(previous);
    this.selectedId = this.blocks[0]?.id || '';
    this.clearNestedSelection();
    this.commitChange();
  }

  redo(): void {
    const next = this.future.pop();
    if (!next) return;
    this.history.push(this.clone(this.blocks));
    this.blocks = this.clone(next);
    this.selectedId = this.blocks[0]?.id || '';
    this.clearNestedSelection();
    this.commitChange();
  }

  onToolDragStart(event: DragEvent, type: string): void {
    this.draggingType = type;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('application/x-brain-techno-element', type);
      event.dataTransfer.setData('text/plain', type);
    }
  }

  onToolDragEnd(): void {
    this.draggingType = '';
  }

  onCanvasDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const type = event.dataTransfer?.getData('application/x-brain-techno-element')
      || event.dataTransfer?.getData('text/plain')
      || this.draggingType;
    if (type === 'template' || type === 'ecommerce') {
      this.onElementClick(type);
    } else if (type && this.isElementType(type)) {
      this.addElement(type);
    }
    this.draggingType = '';
  }

  onBlockDragStart(event: DragEvent, index: number): void {
    this.dragIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/x-brain-techno-block', String(index));
      event.dataTransfer.setData('text/plain', `block:${index}`);
    }
  }

  onBlockDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onBlockDragEnd(): void {
    this.dragIndex = -1;
  }

  onBlockDrop(event: DragEvent, targetIndex: number): void {
    const raw = event.dataTransfer?.getData('application/x-brain-techno-block');
    if (!raw && this.dragIndex < 0) return;
    event.preventDefault();
    event.stopPropagation();
    const source = Number(raw || this.dragIndex);
    if (!Number.isInteger(source) || source < 0 || source >= this.blocks.length || source === targetIndex) {
      this.dragIndex = -1;
      return;
    }
    this.pushHistory();
    const [item] = this.blocks.splice(source, 1);
    const destination = source < targetIndex ? targetIndex - 1 : targetIndex;
    this.blocks.splice(Math.max(0, Math.min(destination, this.blocks.length)), 0, item);
    this.selectedId = item.id;
    this.dragIndex = -1;
    this.clearNestedSelection();
    this.commitChange();
  }

  trackById(_: number, item: EditorBlock): string {
    return item.id;
  }

  defaultPreset(type: string): string {
    const first = this.presets[type]?.[0]?.key;
    return first || '';
  }

  private createBlock(type: string, preset = ''): EditorBlock {
    const variant = preset || this.defaultPreset(type);
    const base: EditorBlock = {
      id: this.uid(type),
      type,
      content: { variant },
      style: this.defaultStyle()
    };

    switch (type) {
      case 'section': {
        const count = this.sectionCellCount(variant || 'one');
        const columns = this.sectionColumns(variant || 'one');
        return {
          ...base,
          content: {
            variant: variant || 'one',
            cells: Array.from({ length: count }, (_, index) => ({ title: `Column ${index + 1}`, text: 'Add your content here.' }))
          },
          style: { ...base.style, background: '#FFFFFF', padding: 28, radius: 16, gap: 14, columns }
        };
      }
      case 'block': {
        const count = this.sectionCellCount(variant || 'two');
        const slots = Array.from({ length: count }, () => [] as EditorBlock[]);
        const block: EditorBlock = {
          ...base,
          content: { variant: variant || 'two', slots },
          style: { ...base.style, background: '#FFFFFF', padding: 18, radius: 16, gap: 14, columns: this.sectionColumns(variant || 'two') }
        };
        if (variant === 'media-form') {
          block.content['slots'][0] = [this.createBlock('image', 'rounded')];
          block.content['slots'][1] = [this.createBlock('form', 'compact')];
        }
        if (variant === 'text-media') {
          block.content['slots'][0] = [this.createBlock('text', 'lead')];
          block.content['slots'][1] = [this.createBlock('image', 'rounded')];
        }
        return block;
      }
      case 'heading': {
        const styleMap: Record<string, any> = {
          hero: { fontSize: 46, fontWeight: 800, align: 'center', padding: 30 },
          'section-title': { fontSize: 30, fontWeight: 700, align: 'left', padding: 22 },
          center: { fontSize: 34, fontWeight: 700, align: 'center' },
          accent: { fontSize: 34, fontWeight: 800, color: '#FF4D6D', align: 'left' },
          compact: { fontSize: 24, fontWeight: 700, align: 'left', padding: 16 },
          display: { fontSize: 58, fontWeight: 900, align: 'center', padding: 36 },
          eyebrow: { fontSize: 32, fontWeight: 800, align: 'left', padding: 24 },
          underline: { fontSize: 34, fontWeight: 800, align: 'left', accentLine: true },
          serif: { fontSize: 42, fontWeight: 700, align: 'left' },
          gradient: { fontSize: 44, fontWeight: 900, align: 'center', color: '#7C3AED' }
        };
        return { ...base, content: { variant, text: 'Your Heading', level: variant === 'compact' ? 'h3' : 'h2', eyebrow: 'INTRODUCING' }, style: { ...base.style, ...styleMap[variant] } };
      }
      case 'text': {
        const styleMap: Record<string, any> = {
          paragraph: { fontSize: 16, color: '#475569', align: 'left' },
          lead: { fontSize: 20, color: '#334155', align: 'left' },
          muted: { fontSize: 15, color: '#64748B', align: 'left' },
          quote: { fontSize: 20, color: '#0F172A', background: '#F8FAFC', borderLeft: '#FF4D6D', padding: 24 },
          note: { fontSize: 15, color: '#334155', background: '#F1F5F9', radius: 12 },
          center: { fontSize: 16, color: '#475569', align: 'center' },
          callout: { fontSize: 17, color: '#0F172A', background: '#FFFFFF', radius: 12, borderColor: '#CBD5E1' },
          success: { fontSize: 15, color: '#166534', background: '#F0FDF4', radius: 12 },
          warning: { fontSize: 15, color: '#92400E', background: '#FFFBEB', radius: 12 },
          'two-column': { fontSize: 16, color: '#475569', columns: 2 }
        };
        return { ...base, content: { variant, text: 'Write your business message here.' }, style: { ...base.style, ...styleMap[variant] } };
      }
      case 'link': {
        return {
          ...base,
          content: { variant, label: variant === 'download' ? 'Download brochure' : 'Learn more', url: '#', target: '_self' },
          style: { ...base.style, padding: 18, color: '#2563EB', align: 'left', radius: variant === 'pill' ? 999 : 8 }
        };
      }
      case 'image': {
        const map: Record<string, any> = {
          banner: { radius: 12, maxWidth: '100%', aspect: '16/7' },
          rounded: { radius: 20, maxWidth: '100%', aspect: '16/9' },
          card: { radius: 16, padding: 16, background: '#F8FAFC', borderColor: '#E2E8F0', aspect: '16/9' },
          compact: { radius: 14, maxWidth: '70%', align: 'center', aspect: '16/9' },
          shadow: { radius: 18, shadow: true, aspect: '16/9' },
          square: { radius: 16, maxWidth: '520px', align: 'center', aspect: '1/1' },
          portrait: { radius: 18, maxWidth: '420px', align: 'center', aspect: '3/4' },
          circle: { radius: 999, maxWidth: '280px', align: 'center', aspect: '1/1' },
          bordered: { radius: 12, borderColor: '#CBD5E1', borderWidth: 1, aspect: '16/9' },
          'full-bleed': { radius: 0, padding: 0, aspect: '16/8' }
        };
        return { ...base, content: { variant, url: '', alt: 'Image placeholder' }, style: { ...base.style, align: 'center', imageWidth: 100, imageHeight: 56, ...map[variant] } };
      }
      case 'video': {
        return {
          ...base,
          content: {
            variant,
            url: variant === 'direct' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Featured video',
            controls: true,
            autoplay: variant === 'autoplay',
            muted: variant === 'autoplay'
          },
          style: { ...base.style, padding: variant === 'full' ? 0 : 18, radius: variant === 'rounded' || variant === 'card' ? 18 : 10, aspect: variant === 'portrait' ? '9/16' : '16/9', background: variant === 'card' ? '#F8FAFC' : '#FFFFFF' }
        };
      }
      case 'slider': {
        const images = ['', '', ''];
        return {
          ...base,
          content: { variant, images, imagesText: images.join('\n'), interval: 3500, autoplay: true },
          style: { ...base.style, padding: variant === 'full' ? 0 : 18, radius: variant === 'cards' ? 20 : 14, height: variant === 'compact' ? 260 : 420 }
        };
      }
      case 'gallery': {
        const images = [
          '',
          '',
          ''
        ];
        const columns = variant === 'two' ? 2 : variant === 'four' ? 4 : 3;
        const gap = variant === 'spacious' ? 22 : variant === 'compact' ? 5 : 10;
        return { ...base, content: { variant, images, imagesText: images.join('\n') }, style: { ...base.style, columns, gap, radius: variant === 'rounded' ? 18 : 10 } };
      }
      case 'button': {
        const styleMap: Record<string, any> = {
          primary: { buttonBg: '#FF4D6D', buttonText: '#FFFFFF', borderColor: '#FF4D6D', borderWidth: 0, radius: 10 },
          outline: { buttonBg: '#FFFFFF', buttonText: '#FF4D6D', borderColor: '#FF4D6D', borderWidth: 1, radius: 10 },
          pill: { buttonBg: '#FF4D6D', buttonText: '#FFFFFF', borderColor: '#FF4D6D', radius: 999 },
          full: { buttonBg: '#FF4D6D', buttonText: '#FFFFFF', fullWidth: true, radius: 10 },
          soft: { buttonBg: '#FFF1F4', buttonText: '#E11D48', borderColor: '#FFD1D9', borderWidth: 1, radius: 10 },
          dark: { buttonBg: '#0F172A', buttonText: '#FFFFFF', radius: 10 },
          gradient: { buttonBg: 'linear-gradient(135deg,#FF4D6D,#7C3AED)', buttonText: '#FFFFFF', radius: 12, shadow: true },
          glass: { buttonBg: '#F8FAFC', buttonText: '#0F172A', borderColor: '#E2E8F0', borderWidth: 1, radius: 14 },
          'icon-left': { buttonBg: '#111827', buttonText: '#FFFFFF', radius: 12, icon: 'arrow_forward' },
          danger: { buttonBg: '#DC2626', buttonText: '#FFFFFF', radius: 10 }
        };
        return { ...base, content: { variant, label: 'Contact Us', url: '#', target: '_self', items: [{ label: 'Contact Us', url: '#', target: '_self', icon: '' }] }, style: { ...base.style, align: 'center', fontSize: 15, ...styleMap[variant] } };
      }
      case 'icon': {
        return {
          ...base,
          content: { variant, materialIcon: 'star', label: variant === 'icon-label' ? 'Popular service' : '', url: '#', items: [{ materialIcon: 'star', label: variant === 'icon-label' ? 'Popular service' : '', url: '#' }] },
          style: { ...base.style, align: 'center', iconSize: variant === 'large' ? 64 : 36, iconColor: '#FF4D6D', iconBg: variant === 'plain' ? 'transparent' : '#FFF1F4', radius: variant === 'square' ? 14 : 999 }
        };
      }
      case 'social': {
        const socialItems = [
          { name: 'Facebook', url: '#', icon: 'https://cdn.simpleicons.org/facebook/1877F2', platform: 'facebook', label: 'Facebook' },
          { name: 'Instagram', url: '#', icon: 'https://cdn.simpleicons.org/instagram/E4405F', platform: 'instagram', label: 'Instagram' },
          { name: 'YouTube', url: '#', icon: 'https://cdn.simpleicons.org/youtube/FF0000', platform: 'youtube', label: 'YouTube' },
          { name: 'LinkedIn', url: '#', icon: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png', platform: 'linkedin', label: 'LinkedIn' },
          { name: 'X', url: '#', icon: 'https://cdn.simpleicons.org/x/111111', platform: 'x', label: 'X' },
          { name: 'WhatsApp', url: '#', icon: 'https://cdn.simpleicons.org/whatsapp/25D366', platform: 'whatsapp', label: 'WhatsApp' }
        ];

        const align = ['logo-url-center', 'logo-circle-name', 'logo-square-name'].includes(variant)
          ? 'center'
          : variant === 'logo-url-right'
            ? 'right'
            : 'left';

        return {
          ...base,
          content: {
            variant,
            items: socialItems,
            // Legacy keys are kept so older editor data remains readable.
            facebook: '#',
            instagram: '#',
            youtube: '#',
            linkedin: '#',
            x: '',
            whatsapp: ''
          },
          style: {
            ...base.style,
            align,
            background: variant === 'logo-dark' ? '#0F172A' : variant === 'logo-soft' ? '#F8FAFC' : '#FFFFFF',
            color: variant === 'logo-dark' ? '#FFFFFF' : '#0F172A',
            gap: 12,
            iconSize: 36,
            socialIconShape: variant === 'logo-round' || variant === 'logo-circle-name' ? 'round' : variant === 'logo-square' || variant === 'logo-square-name' ? 'square' : 'none',
            showName: !['logo-only', 'logo-round', 'logo-square', 'logo-hover'].includes(variant),
            showUrl: ['logo-url-left', 'logo-url-center', 'logo-url-right'].includes(variant),
            hover: variant === 'logo-hover',
            borderWidth: ['logo-outline', 'logo-card'].includes(variant) ? 1 : 0,
            borderColor: '#E2E8F0',
            radius: 0
          }
        };
      }
      case 'product': {
        return {
          ...base,
          content: {
            variant,
            name: 'Product Name',
            price: '₹499',
            oldPrice: variant === 'sale' ? '₹699' : '',
            badge: variant === 'sale' ? 'SAVE 29%' : '',
            description: 'Short product description that explains the main benefit.',
            image: '',
            cta: 'Buy Now',
            url: '#',
            layout: variant === 'horizontal' ? 'list' : 'grid',
            slider: false,
            items: [{ name: 'Product Name', price: '₹499', oldPrice: variant === 'sale' ? '₹699' : '', badge: variant === 'sale' ? 'SAVE 29%' : '', description: 'Short product description that explains the main benefit.', image: '', cta: 'Buy Now', url: '#', rating: 5 }]
          },
          style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: variant === 'luxury' ? 4 : 16, padding: 18 }
        };
      }
      case 'offer': {
        const dark = variant === 'dark';
        return {
          ...base,
          content: { variant, badge: variant === 'flash' ? 'FLASH DEAL' : 'LIMITED OFFER', title: 'Special Offer', discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#', items: [{ badge: variant === 'flash' ? 'FLASH DEAL' : 'LIMITED OFFER', title: 'Special Offer', discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#', image: '' }] },
          style: { ...base.style, background: dark ? '#0F172A' : '#FFF7F8', color: dark ? '#FFFFFF' : '#0F172A', accent: '#FF4D6D', align: variant === 'center' ? 'center' : 'left', radius: 18 }
        };
      }
      case 'html': {
        const starters: Record<string, string> = {
          blank: '<div>Custom HTML</div>',
          notice: '<div style="padding:16px;border:1px solid #dbeafe;background:#eff6ff;border-radius:12px"><strong>Notice</strong><p style="margin:6px 0 0">Write your custom message here.</p></div>',
          table: '<table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Item</th><th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Value</th></tr><tr><td style="padding:8px">Example</td><td style="padding:8px">100</td></tr></table>',
          badge: '<div style="display:flex;gap:8px;flex-wrap:wrap"><span>Fast</span><span>Secure</span><span>Reliable</span></div>',
          embed: '<div style="padding:24px;text-align:center;background:#f8fafc">Paste your supported embed HTML here</div>',
          'custom-card': '<article style="padding:24px;border:1px solid #e2e8f0;border-radius:16px"><h3>Custom Card</h3><p>Edit this HTML.</p></article>',
          list: '<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>',
          code: '<pre style="padding:16px;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:auto">console.log(\'BRAIN TECHNO\');</pre>'
        };
        return { ...base, content: { variant, html: starters[variant] || starters['blank'] }, style: { ...base.style, padding: 18 } };
      }
      case 'form': {
        return {
          ...base,
          content: {
            variant,
            title: variant === 'newsletter' ? 'Join our newsletter' : variant === 'appointment' ? 'Book an appointment' : variant === 'quote' ? 'Get a free quote' : 'Get in touch',
            subtitle: 'Send your details and we will contact you.',
            fields: [this.formFieldTemplate('text', 0), this.formFieldTemplate('email', 1), this.formFieldTemplate('phone', 2), this.formFieldTemplate('textarea', 3)],
            submitLabel: variant === 'newsletter' ? 'Subscribe' : variant === 'appointment' ? 'Request Appointment' : 'Send Enquiry',
            submitUrl: '/campaignForm/accountId',
            successMessage: 'Thank You For your Response',
            errorMessage: 'Something went wrong. Please try again.'
          },
          style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'soft' ? '#F8FAFC' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: variant === 'center' ? 'center' : 'left', radius: 16 }
        };
      }
      case 'contact': {
        return { ...base, content: { variant, phone: '+91 99999 99999', email: 'hello@example.com', address: 'Your business address', hours: 'Mon - Sat: 10 AM - 8 PM', actions: [{ platform: 'whatsapp', label: 'WhatsApp', url: '#' }, { platform: 'instagram', label: 'Instagram', url: '#' }, { platform: 'facebook', label: 'Facebook', url: '#' }] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'soft' ? '#F8FAFC' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: variant === 'center' ? 'center' : 'left', radius: 16 } };
      }
      case 'whatsapp': {
        return { ...base, content: { variant, phone: '919999999999', message: 'Hello, I want to know more.', label: 'Chat on WhatsApp' }, style: { ...base.style, align: 'center', buttonBg: variant === 'dark' ? '#0F172A' : '#22C55E', buttonText: '#FFFFFF', radius: variant === 'pill' || variant === 'floating' ? 999 : 12, fullWidth: variant === 'full' } };
      }
      case 'map': {
        const height = variant === 'wide' ? 420 : variant === 'compact' ? 220 : 300;
        return { ...base, content: { variant, url: 'https://www.google.com/maps?q=Kolkata&output=embed', height, title: 'Our location' }, style: { ...base.style, padding: variant === 'flush' ? 0 : 16, radius: variant === 'rounded' || variant === 'card' ? 18 : 10, background: variant === 'dark' ? '#0F172A' : '#FFFFFF' } };
      }
      case 'scanner': {
        return { ...base, content: { variant, title: variant === 'barcode' ? 'Scan barcode' : 'Scan QR code', successLabel: 'Scanned value', formats: variant === 'barcode' ? 'code_128,ean_13,ean_8,upc_a,upc_e' : 'qr_code' }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: 'center', radius: 16 } };
      }
      case 'timer': {
        const tomorrow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
        return { ...base, content: { variant, title: 'Offer ends in', target: tomorrow, expiredText: 'Offer ended' }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'sale' ? '#FFF1F2' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: 'center', radius: 16, accent: '#FF4D6D' } };
      }
      case 'counter': {
        const percentage = variant === 'percentage';
        return { ...base, content: { variant, start: 0, end: percentage ? 98 : 100, prefix: variant === 'money' ? '₹' : '', suffix: percentage ? '%' : '+', label: percentage ? 'Customer satisfaction' : 'Completed projects', duration: 1600, items: [{ start: 0, end: percentage ? 98 : 100, prefix: variant === 'money' ? '₹' : '', suffix: percentage ? '%' : '+', label: percentage ? 'Customer satisfaction' : 'Completed projects', duration: 1600 }] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'soft' ? '#F8FAFC' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', accent: '#FF4D6D', align: 'center', radius: 16 } };
      }
      case 'rating': {
        return { ...base, content: { variant, title: 'Rate your experience', text: 'Your feedback helps us improve.', max: 5, submitUrl: '/rating/accountId', submitLabel: 'Submit Rating', successMessage: 'Thank You For your Rating', allowComment: true, commentPlaceholder: 'Write a comment (optional)' }, style: { ...base.style, background: '#FFFFFF', color: '#0F172A', accent: '#F59E0B', align: 'center', radius: 16, padding: 24 } };
      }
      case 'chart': {
        return { ...base, content: { variant, title: 'Performance', chartType: variant === 'pie' ? 'pie' : variant === 'line' ? 'line' : 'bar', data: 'Jan:35, Feb:52, Mar:48, Apr:76, May:68', items: [{ label: 'Jan', value: 35 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 48 }, { label: 'Apr', value: 76 }, { label: 'May', value: 68 }], showLegend: true, showValues: true }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', accent: '#FF4D6D', radius: 16, padding: 22 } };
      }
      case 'media': {
        return { ...base, content: { variant, title: 'Your Media', files: [] as MediaItem[] }, style: { ...base.style, background: '#FFFFFF', radius: 16, padding: 18 } };
      }

      case 'navbar': {
        return { ...base, content: { variant, brand: 'BRAIN TECHNO', logo: '', logoMediaId: null, links: 'Home, Services, About, Contact', menuItems: [{ label: 'Home', url: '#', icon: 'home', target: '_self' }, { label: 'Services', url: '#services', icon: 'design_services', target: '_self' }, { label: 'About', url: '#about', icon: 'info', target: '_self' }, { label: 'Contact', url: '#contact', icon: 'contact_mail', target: '_self' }], cta: 'Get Started', ctaUrl: '#', showIcons: false, mobileMenu: true }, style: { ...base.style, background: '#FFFFFF', color: '#0F172A', padding: variant === 'compact' ? 12 : 18, radius: 0 } };
      }
      case 'hero': {
        const heroCopy: Record<string, any> = {
          saas: { eyebrow: 'PRODUCT', title: 'Launch your product with clarity', text: 'Explain the problem, show the product value and guide visitors to one focused action.', primary: 'Start Free', secondary: 'Watch Demo' },
          event: { eyebrow: 'SAVE THE DATE', title: 'A memorable event starts here', text: 'Share the date, venue, highlights and a clear registration action.', primary: 'Register Now', secondary: 'View Schedule' },
          agency: { eyebrow: 'CREATIVE PARTNER', title: 'Strategy, design and growth in one team', text: 'Present your strongest proposition with proof, services and a confident next step.', primary: 'Start a Project', secondary: 'See Work' },
          portfolio: { eyebrow: 'SELECTED WORK', title: 'Designing useful, memorable experiences', text: 'Introduce your work with a strong personal statement and a featured visual.', primary: 'View Projects', secondary: 'About Me' },
          video: { eyebrow: 'FEATURED', title: 'Tell your story with motion', text: 'Pair a concise message with a video-led visual experience.', primary: 'Explore', secondary: 'Contact' }
        };
        const copy = heroCopy[variant] || { eyebrow: 'WELCOME', title: 'Build a stronger online presence', text: 'Use this section to explain your value clearly and guide visitors to the next action.', primary: 'Get Started', secondary: 'Learn More' };
        return { ...base, content: { variant, ...copy, primaryUrl: '#', secondaryUrl: '#', image: '', mediaId: null, videoUrl: '' }, style: { ...base.style, background: '#FFFFFF', color: '#0F172A', padding: 48, radius: 18, align: variant === 'centered' ? 'center' : 'left', gradientFrom: '#FFF1F4', gradientTo: '#EEF2FF', backgroundType: variant === 'gradient' ? 'gradient' : 'color' } };
      }
      case 'services': {
        const count = variant === 'four' ? 4 : variant === 'two' ? 2 : 3;
        const items = Array.from({ length: count }, (_, i) => ({ icon: ['design_services','campaign','support_agent','bolt'][i % 4], title: `Service ${i+1}`, text: 'Add a short description of this service.', image: '', mediaId: null, badge: '', cta: 'Learn more', url: '#' }));
        return { ...base, content: { variant, title: 'Our Services', subtitle: 'Choose the service that fits your needs.', items, carousel: variant === 'carousel', showArrows: variant === 'carousel' }, style: { ...base.style, background: '#FFFFFF', color: '#0F172A', columns: count, gap: 12, radius: 16 } };
      }
      case 'testimonial': {
        const count = variant === 'three' ? 3 : 1;
        return { ...base, content: { variant, title: 'What customers say', items: Array.from({ length: count }, (_, i) => ({ name: `Customer ${i+1}`, role: 'Verified customer', rating: 5, quote: 'A great experience from start to finish. Add your customer review here.', image: '' })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16 } };
      }
      case 'pricing': {
        const count = variant === 'single' ? 1 : variant === 'two' ? 2 : 3;
        return { ...base, content: { variant, title: 'Simple pricing', plans: Array.from({ length: count }, (_, i) => ({ name: ['Starter','Business','Premium'][i] || `Plan ${i+1}`, price: ['₹999','₹1,999','₹3,999'][i] || '₹999', period: '/month', features: 'Feature one\nFeature two\nFeature three', cta: 'Choose Plan' })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16 } };
      }
      case 'faq': {
        return { ...base, content: { variant, title: 'Frequently asked questions', items: [ { q: 'What do you offer?', a: 'Add your answer here.' } ] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 16 } };
      }
      case 'stats': {
        const count = variant === 'three' ? 3 : 4;
        return { ...base, content: { variant, title: 'Our impact', items: Array.from({ length: count }, (_, i) => ({ value: ['100+','98%','10+','24/7'][i] || '100+', label: ['Projects','Satisfaction','Years','Support'][i] || `Metric ${i+1}` })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16, accent: '#FF4D6D' } };
      }
      case 'tabs': {
        return { ...base, content: { variant, active: 0, items: [ { title: 'Overview', text: 'Add overview content here.', image: '' }, { title: 'Features', text: 'Add feature details here.', image: '' }, { title: 'Details', text: 'Add detailed content here.', image: '' } ] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 16, accent: '#FF4D6D' } };
      }
      case 'timeline': {
        return { ...base, content: { variant, title: 'How it works', items: [ { title: 'Discover', text: 'Tell us what you need.' }, { title: 'Plan', text: 'We prepare the right approach.' }, { title: 'Deliver', text: 'Launch and improve.' } ] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 16, accent: '#FF4D6D' } };
      }
      case 'team': {
        const count = variant === 'four' ? 4 : variant === 'two' ? 2 : 3;
        return { ...base, content: { variant, title: 'Meet the team', items: Array.from({ length: count }, (_, i) => ({ name: `Team Member ${i+1}`, role: ['Founder','Designer','Specialist','Support'][i] || 'Team', bio: '', image: '', facebook: '', instagram: '', linkedin: '', x: '' })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16 } };
      }
      case 'footer': {
        return { ...base, content: { variant, brand: 'BRAIN TECHNO', text: 'Technology made simple.', links: 'About, Services, Contact, Privacy', phone: '+91 99999 99999', email: 'hello@example.com', copyright: '© 2026 BRAIN TECHNO. All rights reserved.' }, style: { ...base.style, background: variant === 'dark' || variant === 'business' ? '#0F172A' : '#F8FAFC', color: variant === 'dark' || variant === 'business' ? '#FFFFFF' : '#0F172A', padding: 32, radius: 0 } };
      }
      case 'popup': {
        return { ...base, content: { variant, title: variant === 'offer' ? 'Special offer' : 'Stay in the loop', text: 'Add your popup message here.', cta: variant === 'newsletter' ? 'Subscribe' : 'Continue', url: '#' }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 18, padding: 24 } };
      }
      case 'floating': {
        const icon = variant === 'call' ? 'call' : variant === 'email' ? 'mail' : variant === 'top' ? 'arrow_upward' : variant === 'book' ? 'calendar_month' : 'chat';
        return { ...base, content: { variant, label: variant === 'top' ? 'Back to top' : variant === 'call' ? 'Call now' : variant === 'email' ? 'Email us' : variant === 'book' ? 'Book now' : 'WhatsApp', url: variant === 'call' ? 'tel:+919999999999' : variant === 'email' ? 'mailto:hello@example.com' : '#', icon, items: [{ icon, label: variant === 'top' ? 'Back to top' : variant === 'call' ? 'Call now' : variant === 'email' ? 'Email us' : variant === 'book' ? 'Book now' : 'WhatsApp', url: variant === 'call' ? 'tel:+919999999999' : variant === 'email' ? 'mailto:hello@example.com' : '#' }] }, style: { ...base.style, background: '#FF4D6D', color: '#FFFFFF', radius: 999, padding: 12, align: 'right' } };
      }
      case 'divider': {
        const map: Record<string, any> = {
          line: { borderColor: '#E2E8F0', borderWidth: 1, borderStyle: 'solid' },
          accent: { borderColor: '#FF4D6D', borderWidth: 2, borderStyle: 'solid' },
          thick: { borderColor: '#0F172A', borderWidth: 4, borderStyle: 'solid' },
          dashed: { borderColor: '#94A3B8', borderWidth: 1, borderStyle: 'dashed' },
          dotted: { borderColor: '#94A3B8', borderWidth: 2, borderStyle: 'dotted' },
          soft: { borderColor: '#F1F5F9', borderWidth: 1, borderStyle: 'solid' },
          short: { borderColor: '#FF4D6D', borderWidth: 3, borderStyle: 'solid', short: true },
          double: { borderColor: '#CBD5E1', borderWidth: 3, borderStyle: 'double' }
        };
        return { ...base, content: { variant }, style: { ...base.style, padding: 12, ...map[variant] } };
      }
      case 'spacer': {
        const heights: Record<string, number> = { xs: 16, sm: 32, md: 48, lg: 72, xl: 96, xxl: 128, huge: 160, custom: 64 };
        return { ...base, content: { variant }, style: { ...base.style, height: heights[variant] || 48, padding: 0 } };
      }
      default:
        return { ...base, type: 'text', content: { variant: 'paragraph', text: 'New content' }, style: { ...base.style, color: '#475569' } };
    }
  }

  private defaultStyle(): Record<string, any> {
    return {
      background: '#FFFFFF',
      backgroundType: 'color',
      backgroundImage: '',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      gradientFrom: '#FFFFFF',
      gradientTo: '#F1F5F9',
      gradientDirection: '135deg',
      padding: 24,
      align: 'left',
      color: '#0F172A',
      fontSize: 16,
      fontWeight: 400,
      radius: 0,
      marginTop: 0,
      marginBottom: 0,
      borderWidth: 0,
      borderColor: '#E2E8F0',
      borderStyle: 'solid',
      shadow: 'none'
    };
  }

  private templateBundle(preset: string): EditorBlock[] {
    switch (preset) {
      case 'tattoo': {
        const title = this.createBlock('heading', 'section-title');
        title.content['text'] = 'We are professional tattoo artists';
        const intro = this.createBlock('text', 'paragraph');
        intro.content['text'] = 'Use this paragraph to describe why you do what you do. Add useful information your visitors may find interesting.';
        const features = this.createBlock('section', 'two-two');
        features.content['cells'] = [
          { title: 'Tattoos', text: 'Get a consultation from our design experts.' },
          { title: 'Piercing', text: 'Get body piercing services from professionals.' },
          { title: 'Cover Up', text: 'Refresh or cover an old tattoo.' },
          { title: 'Popular designs', text: 'View popular designs customers love.' }
        ];
        const serviceHeading = this.createBlock('heading', 'section-title');
        serviceHeading.content['text'] = 'High Quality Body Art';
        const gallery = this.createBlock('gallery', 'three');
        return [title, intro, features, serviceHeading, gallery];
      }
      case 'restaurant': {
        const hero = this.createBlock('heading', 'display'); hero.content['text'] = 'Fresh food, made with care';
        const lead = this.createBlock('text', 'lead'); lead.content['text'] = 'Discover today\'s favourites, seasonal dishes and signature specials.';
        const gallery = this.createBlock('gallery', 'three');
        const offer = this.createBlock('offer', 'seasonal');
        const contact = this.createBlock('contact', 'card');
        return [hero, lead, gallery, offer, contact];
      }
      case 'event': {
        const hero = this.createBlock('heading', 'display'); hero.content['text'] = 'Your Event Starts Here';
        const timer = this.createBlock('timer', 'event');
        const section = this.createBlock('section', 'three');
        const form = this.createBlock('form', 'appointment'); form.content['title'] = 'Register now';
        return [hero, timer, section, form];
      }
      case 'portfolio': {
        const hero = this.createBlock('heading', 'hero'); hero.content['text'] = 'Selected Work';
        const text = this.createBlock('text', 'lead');
        const gallery = this.createBlock('gallery', 'showcase');
        const social = this.createBlock('social', 'center');
        const contact = this.createBlock('contact', 'minimal');
        return [hero, text, gallery, social, contact];
      }
      case 'clinic': {
        const hero = this.createBlock('heading', 'hero'); hero.content['text'] = 'Professional care, close to home';
        const features = this.createBlock('section', 'three');
        const form = this.createBlock('form', 'appointment');
        const map = this.createBlock('map', 'card');
        return [hero, features, form, map];
      }
      case 'agency': {
        const hero = this.createBlock('heading', 'gradient'); hero.content['text'] = 'We build brands people remember';
        const text = this.createBlock('text', 'lead');
        const services = this.createBlock('section', 'three');
        const gallery = this.createBlock('gallery', 'showcase');
        const form = this.createBlock('form', 'quote');
        return [hero, text, services, gallery, form];
      }
      case 'course': {
        const hero = this.createBlock('heading', 'hero'); hero.content['text'] = 'Learn a practical skill';
        const lead = this.createBlock('text', 'lead');
        const features = this.createBlock('section', 'three');
        const counter = this.createBlock('counter', 'number'); counter.content['label'] = 'Students enrolled'; counter.content['end'] = 1200;
        const button = this.createBlock('button', 'primary'); button.content['label'] = 'Enroll Now';
        return [hero, lead, features, counter, button];
      }
      case 'real-estate': {
        const hero = this.createBlock('image', 'banner');
        const heading = this.createBlock('heading', 'section-title'); heading.content['text'] = 'Premium Property';
        const features = this.createBlock('section', 'three');
        const form = this.createBlock('form', 'callback');
        const map = this.createBlock('map', 'wide');
        return [hero, heading, features, form, map];
      }
      case 'local-service': {
        const hero = this.createBlock('heading', 'hero'); hero.content['text'] = 'Trusted service in your area';
        const section = this.createBlock('section', 'three');
        const whatsapp = this.createBlock('whatsapp', 'card');
        const map = this.createBlock('map', 'office');
        return [hero, section, whatsapp, map];
      }
      case 'salon': {
        const hero = this.createBlock('heading', 'display'); hero.content['text'] = 'Beauty that feels like you';
        const lead = this.createBlock('text', 'lead'); lead.content['text'] = 'Hair, skin and beauty services designed around your style.';
        const services = this.createBlock('section', 'three');
        services.content['cells'] = [
          { title: 'Hair Studio', text: 'Cuts, colour and styling.' },
          { title: 'Skin Care', text: 'Glow-focused facial services.' },
          { title: 'Bridal', text: 'Complete bridal beauty packages.' }
        ];
        const gallery = this.createBlock('gallery', 'showcase');
        const form = this.createBlock('form', 'appointment'); form.content['title'] = 'Book your appointment';
        return [hero, lead, services, gallery, form];
      }
      case 'gym': {
        const hero = this.createBlock('heading', 'display'); hero.content['text'] = 'Stronger every day';
        const lead = this.createBlock('text', 'lead'); lead.content['text'] = 'Training plans, expert coaching and a community that keeps you moving.';
        const stats = this.createBlock('section', 'three');
        stats.content['cells'] = [
          { title: 'Expert Coaches', text: 'Personal guidance for every goal.' },
          { title: 'Modern Equipment', text: 'Train with professional equipment.' },
          { title: 'Flexible Plans', text: 'Memberships that fit your routine.' }
        ];
        const counter = this.createBlock('counter', 'number'); counter.content['end'] = 500; counter.content['label'] = 'Active members';
        const button = this.createBlock('button', 'primary'); button.content['label'] = 'Start Training';
        return [hero, lead, stats, counter, button];
      }
      case 'saas': {
        const hero = this.createBlock('heading', 'gradient'); hero.content['text'] = 'One workspace. Less busywork.';
        const lead = this.createBlock('text', 'lead'); lead.content['text'] = 'Show your product value, features and conversion CTA in one clean landing page.';
        const features = this.createBlock('section', 'three');
        features.content['cells'] = [
          { title: 'Automate', text: 'Reduce repetitive work.' },
          { title: 'Collaborate', text: 'Keep teams in sync.' },
          { title: 'Measure', text: 'Track the metrics that matter.' }
        ];
        const chart = this.createBlock('chart', 'bars');
        const button = this.createBlock('button', 'pill'); button.content['label'] = 'Start Free';
        return [hero, lead, features, chart, button];
      }
      case 'travel': {
        const hero = this.createBlock('image', 'banner');
        const heading = this.createBlock('heading', 'section-title'); heading.content['text'] = 'Find your next escape';
        const gallery = this.createBlock('gallery', 'three');
        const offer = this.createBlock('offer', 'seasonal');
        const form = this.createBlock('form', 'callback'); form.content['title'] = 'Plan my trip';
        return [hero, heading, gallery, offer, form];
      }
      case 'wedding': {
        const heading = this.createBlock('heading', 'serif'); heading.content['text'] = 'Together, forever starts here';
        const text = this.createBlock('text', 'center'); text.content['text'] = 'Join us as we celebrate our special day with family and friends.';
        const timer = this.createBlock('timer', 'event');
        const gallery = this.createBlock('gallery', 'showcase');
        const map = this.createBlock('map', 'card');
        return [heading, text, timer, gallery, map];
      }
      case 'fashion': {
        const heading = this.createBlock('heading', 'display'); heading.content['text'] = 'New season. New mood.';
        const lead = this.createBlock('text', 'center'); lead.content['text'] = 'Curated essentials and statement pieces for your next look.';
        const products = this.ecommerceBundle('fashion');
        return [heading, lead, ...products];
      }
      case 'business':
      default: {
        const hero = this.createBlock('heading', 'hero'); hero.content['text'] = 'Grow your business with BRAIN TECHNO';
        const lead = this.createBlock('text', 'lead');
        const services = this.createBlock('section', 'three');
        const button = this.createBlock('button', 'primary');
        const contact = this.createBlock('contact', 'card');
        return [hero, lead, services, button, contact];
      }
    }
  }

  private ecommerceBundle(preset: string): EditorBlock[] {
    const heading = this.createBlock('heading', 'section-title');
    const offer = this.createBlock('offer', 'sale');
    const productA = this.createBlock('product', preset === 'single-product' ? 'featured' : 'classic');
    const productB = this.createBlock('product', 'sale');
    const productC = this.createBlock('product', 'quick-buy');
    const block = this.createBlock('block', 'three');
    block.content['slots'] = [[productA], [productB], [productC]];

    if (preset === 'product-hero') {
      heading.content['text'] = 'Featured Product';
      return [heading, this.createBlock('product', 'featured'), this.createBlock('offer', 'soft')];
    }
    if (preset === 'single-product') {
      heading.content['text'] = 'Discover Our Best Seller';
      return [heading, productA, this.createBlock('text', 'lead'), this.createBlock('button', 'primary')];
    }
    if (preset === 'sale-store') {
      heading.content['text'] = 'Sale Collection';
      return [offer, heading, block];
    }
    if (preset === 'fashion') heading.content['text'] = 'New Season Drop';
    else if (preset === 'electronics') heading.content['text'] = 'Smart Tech Picks';
    else if (preset === 'food') heading.content['text'] = 'Today\'s Menu';
    else heading.content['text'] = preset === 'catalog' ? 'Mini Catalog' : 'Shop Products';
    return [heading, block];
  }

  private normalizeDesign(value: unknown): EditorDesign {
    if (this.isCustomDesign(value)) {
      const raw = value as any;
      return {
        schemaVersion: 100,
        counters: raw.counters || {},
        body: {
          values: raw.body.values || { backgroundColor: '#F5F7FA', contentWidth: '760px' },
          rows: Array.isArray(raw.body.rows) ? raw.body.rows.map((row: any) => this.normalizeBlock(row)) : []
        }
      };
    }

    const old = value as any;
    const oldRows = Array.isArray(old?.body?.rows) ? old.body.rows : [];
    const rows: EditorBlock[] = [];
    for (const row of oldRows) {
      const columns = Array.isArray(row?.columns) ? row.columns : [];
      const contents = columns.flatMap((column: any) => Array.isArray(column?.contents) ? column.contents : []);
      for (const content of contents) {
        const type = String(content?.type || 'text').toLowerCase();
        const values = content?.values || {};
        if (type === 'text') rows.push(this.createImported('text', { text: this.stripHtml(String(values.text || 'Text')) }));
        else if (type === 'image') rows.push(this.createImported('image', { url: values.src || values.url || '', alt: values.altText || '' }));
        else if (type === 'button') rows.push(this.createImported('button', { label: this.stripHtml(String(values.text || 'Button')), url: values.href || '#' }));
        else if (type === 'divider') rows.push(this.createImported('divider', {}));
      }
    }
    if (!rows.length) rows.push(this.createBlock('heading', 'section-title'), this.createBlock('text', 'paragraph'));
    return { schemaVersion: 100, counters: {}, body: { values: { backgroundColor: '#F5F7FA', contentWidth: '760px' }, rows } };
  }

  private isCustomDesign(value: any): value is EditorDesign {
    return !!value?.body && Array.isArray(value.body.rows) && (value.schemaVersion === 100 || value.body.rows.some((row: any) => !!row?.type));
  }

  private normalizeBlock(row: any): EditorBlock {
    const type = String(row?.type || 'text');
    const incomingContent = row?.content || {};
    const preset = String(incomingContent?.variant || this.defaultPreset(type));
    const created = this.createBlock(type, preset);
    const normalized: EditorBlock = {
      id: String(row?.id || this.uid(type)),
      type,
      content: { ...created.content, ...incomingContent },
      style: { ...created.style, ...(row?.style || {}) }
    };
    if (type === 'block' && Array.isArray(incomingContent?.slots)) {
      normalized.content['slots'] = incomingContent.slots.map((slot: any[]) => Array.isArray(slot) ? slot.map(child => this.normalizeBlock(child)) : []);
    }
    return normalized;
  }

  private createImported(type: string, content: Record<string, any>): EditorBlock {
    const block = this.createBlock(type, this.defaultPreset(type));
    return { ...block, content: { ...block.content, ...content } };
  }

  previewBlockHtml(block: EditorBlock): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.renderBlock(block));
  }

  private buildDesign(): EditorDesign {
    return {
      schemaVersion: 100,
      counters: {},
      body: {
        rows: this.blocks.map(block => this.clone(block)),
        values: { backgroundColor: '#F5F7FA', contentWidth: '760px' }
      }
    };
  }

  private renderFormField(field: Record<string, any>): string {
    const type = String(field['type'] || 'text');
    const name = this.attr(field['name'] || field['id'] || 'field');
    const label = this.escape(field['label'] || 'Field');
    const placeholder = this.attr(field['placeholder'] || '');
    const required = field['required'] ? ' required' : '';
    const width = field['width'] === 'half' ? 'half' : field['width'] === 'third' ? 'third' : 'full';
    const options = String(field['options'] || '').split('\n').map((x:string)=>x.trim()).filter(Boolean);
    let control = '';
    if (type === 'textarea') control = `<textarea name="${name}" rows="4" placeholder="${placeholder}"${required}></textarea>`;
    else if (type === 'select') control = `<select name="${name}"${required}><option value="">Select...</option>${options.map((x:string)=>`<option value="${this.attr(x)}">${this.escape(x)}</option>`).join('')}</select>`;
    else if (type === 'radio') control = `<div class="bt-choice-list">${options.map((x:string,i:number)=>`<label><input type="radio" name="${name}" value="${this.attr(x)}"${required && i===0 ? ' required' : ''}> <span>${this.escape(x)}</span></label>`).join('')}</div>`;
    else if (type === 'checkbox') control = `<label class="bt-choice"><input type="checkbox" name="${name}" value="yes"${required}> <span>${label}</span></label>`;
    else { const htmlType = type === 'phone' ? 'tel' : type === 'datetime' ? 'datetime-local' : ['email','number','date','time'].includes(type) ? type : 'text'; control = `<input type="${htmlType}" name="${name}" placeholder="${placeholder}"${required}>`; }
    return `<div class="bt-form-field bt-form-field--${width}">${type === 'checkbox' ? '' : `<label>${label}${required ? ' *' : ''}</label>`}${control}</div>`;
  }

  private buildHtml(design: EditorDesign): string {
    const pageBg = design.body.values.backgroundColor || '#F5F7FA';
    const width = design.body.values.contentWidth || '760px';
    const sections = design.body.rows.map(block => this.renderBlock(block)).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BRAIN TECHNO</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0" rel="stylesheet"><style>html,body{margin:0;padding:0;background:${this.attr(pageBg)};font-family:Inter,'Noto Sans Bengali',Arial,sans-serif;color:#0F172A}*{box-sizing:border-box}.bt-page{width:100%;padding:24px 12px}.bt-container{max-width:${this.attr(width)};margin:0 auto}.bt-img{max-width:100%;display:block}.bt-btn{display:inline-block;text-decoration:none}.bt-grid{display:grid}.bt-card{border:1px solid #E2E8F0;overflow:hidden}.bt-muted{color:#64748B}.bt-form input,.bt-form textarea,.bt-form select{width:100%;padding:12px;border:1px solid #E2E8F0;border-radius:10px;margin:5px 0 10px;font:inherit}.bt-form-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0 12px}.bt-form-field--full{grid-column:span 6}.bt-form-field--half{grid-column:span 3}.bt-form-field--third{grid-column:span 2}.bt-choice-list{display:grid;gap:8px;margin:7px 0 12px}.bt-choice-list label,.bt-choice{display:flex;gap:8px;align-items:center}.bt-choice-list input,.bt-choice input{width:auto;margin:0}.bt-rating-stars{display:flex;justify-content:center;gap:4px;margin:8px 0 16px;flex-direction:row-reverse}.bt-rating-stars input{position:absolute;opacity:0;pointer-events:none}.bt-rating-stars span{font-size:38px;color:#CBD5E1;cursor:pointer}.bt-rating-stars label:hover span,.bt-rating-stars label:hover~label span,.bt-rating-stars input:checked~span,.bt-rating-stars label:has(input:checked)~label span{color:#F59E0B}.bt-powered{max-width:760px;margin:0 auto;padding:18px 12px 28px;text-align:center;font-size:12px;font-weight:700;letter-spacing:.04em;color:#64748B}.bt-form button{border:0;cursor:pointer}.material-symbols-rounded{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}.bt-social{display:flex;gap:10px;flex-wrap:wrap}.bt-social a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.bt-slider{position:relative;overflow:hidden}.bt-slider img{width:100%;height:100%;object-fit:cover;display:none}.bt-slider img.is-active{display:block}.bt-timer-units{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.bt-timer-unit{min-width:72px;padding:12px;border:1px solid #E2E8F0;border-radius:12px}.bt-chart-bars{display:flex;align-items:flex-end;gap:10px;height:180px}.bt-chart-bar{flex:1;min-width:0;text-align:center}.bt-chart-bar i{display:block;width:100%;background:#FF4D6D;border-radius:8px 8px 3px 3px}.bt-media-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}.bt-tabs>button{border:0;background:transparent;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer;border-bottom:2px solid transparent}.bt-tabs>button.is-active{color:#FF4D6D;border-bottom-color:#FF4D6D}@media(max-width:600px){.bt-page{padding:12px 8px}.bt-responsive-grid{grid-template-columns:1fr!important}.bt-form-field--half,.bt-form-field--third{grid-column:span 6}}</style></head><body><main class="bt-page"><div class="bt-container">${sections}</div></main><footer class="bt-powered">Proudly Powered by BRAIN TECHNO</footer>${this.exportRuntimeScript()}</body></html>`;
  }

  private renderBlock(block: EditorBlock): string {
    const c = block.content || {};
    const s = block.style || {};
    const common = `${this.exportBackgroundStyle(s)}padding:${this.cssPx(s.padding, 24)};margin-top:${this.cssPx(s.marginTop, 0)};margin-bottom:${this.cssPx(s.marginBottom, 0)};text-align:${this.css(s.align, 'left')};border-radius:${this.cssPx(s.radius, 0)};color:${this.css(s.color, '#0F172A')};border:${Number(s.borderWidth)||0}px ${this.css(s.borderStyle,'solid')} ${this.css(s.borderColor,'#E2E8F0')};box-shadow:${this.shadowCss(s.shadow)};font-family:${this.css(s.fontFamily, 'Inter,Arial,sans-serif')};font-style:${this.css(s.fontStyle,'normal')};letter-spacing:${Number(s.letterSpacing)||0}px;text-decoration:${s.underline?'underline ':''}${s.strike?'line-through':''};`;

    switch (block.type) {
      case 'section': {
        const columns = this.sectionColumns(String(c.variant || 'one'));
        const cells = Array.isArray(c.cells) ? c.cells : [];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${this.cssPx(s.gap, 14)}">${cells.map((cell: any) => `<div style="min-width:0;padding:18px;border:1px solid #E2E8F0;border-radius:12px;background:#FFFFFF"><h3 style="margin:0 0 8px;font-size:20px">${this.escape(cell?.title || '')}</h3><p style="margin:0;line-height:1.65;color:#475569">${this.nl2br(this.escape(cell?.text || ''))}</p></div>`).join('')}</div></section>`;
      }
      case 'block': {
        const columns = this.sectionColumns(String(c.variant || 'two'));
        const slots = Array.isArray(c.slots) ? c.slots : [];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${this.cssPx(s.gap, 14)}">${slots.map((slot: EditorBlock[]) => `<div style="min-width:0">${(Array.isArray(slot) ? slot : []).map(child => this.renderBlock(child)).join('')}</div>`).join('')}</div></section>`;
      }
      case 'heading': {
        const eyebrow = c.variant === 'eyebrow' ? `<small style="display:block;margin-bottom:8px;color:#FF4D6D;font-weight:800;letter-spacing:.12em">${this.escape(c.eyebrow || 'INTRODUCING')}</small>` : '';
        const line = s.accentLine ? '<span style="display:block;width:54px;height:4px;background:#FF4D6D;border-radius:99px;margin-top:10px"></span>' : '';
        return `<section style="${common}">${eyebrow}<${c.level || 'h2'} style="margin:0;font-size:${this.cssPx(s.fontSize, 30)};font-weight:${s.fontWeight || 700};color:${this.css(s.color, '#0F172A')}">${this.escape(c.text)}</${c.level || 'h2'}>${line}</section>`;
      }
      case 'text': {
        const extra = s.borderLeft ? `border-left:4px solid ${this.css(s.borderLeft, '#FF4D6D')};` : s.borderColor ? `border:1px solid ${this.css(s.borderColor, '#CBD5E1')};` : '';
        const columns = Number(s.columns) > 1 ? `column-count:${Number(s.columns)};column-gap:28px;` : '';
        return `<section style="${common}${extra}"><p style="margin:0;font-size:${this.cssPx(s.fontSize, 16)};font-weight:${s.fontWeight || 400};line-height:1.75;color:${this.css(s.color, '#475569')};${columns}">${this.nl2br(this.escape(c.text))}</p></section>`;
      }
      case 'link': {
        const arrow = c.variant === 'arrow' || c.variant === 'external' ? ' →' : '';
        const pill = c.variant === 'pill' ? 'padding:9px 14px;border-radius:999px;background:#EFF6FF;' : '';
        const card = c.variant === 'card' ? 'display:block;padding:16px;border:1px solid #E2E8F0;border-radius:12px;background:#FFFFFF;' : '';
        return `<section style="${common}"><a href="${this.attr(c.url || '#')}" target="${this.attr(c.target || '_self')}" style="color:${this.css(s.color, '#2563EB')};font-weight:700;text-decoration:${c.variant === 'underline' ? 'underline' : 'none'};${pill}${card}">${this.escape(c.label || 'Learn more')}${arrow}</a></section>`;
      }
      case 'image': {
        const shadow = s.shadow ? 'box-shadow:0 18px 45px rgba(15,23,42,.18);' : '';
        const border = Number(s.borderWidth) ? `border:${Number(s.borderWidth)}px solid ${this.css(s.borderColor, '#CBD5E1')};` : '';
        const width = Math.max(1, Math.min(100, Number(s.imageWidth) || 100));
        const height = Math.max(1, Math.min(200, Number(s.imageHeight) || 56));
        const media = c.url
          ? `<img class="bt-img" src="${this.attr(c.url)}" alt="${this.attr(c.alt || '')}" style="width:${width}%;aspect-ratio:${width}/${height};object-fit:cover;margin:${s.align === 'center' ? '0 auto' : s.align === 'right' ? '0 0 0 auto' : '0'};border-radius:${this.cssPx(s.radius, 10)};${shadow}${border}">`
          : `<div style="width:${width}%;aspect-ratio:${width}/${height};margin:${s.align === 'center' ? '0 auto' : s.align === 'right' ? '0 0 0 auto' : '0'};display:grid;place-items:center;background:#D1D5DB;color:#6B7280;border-radius:${this.cssPx(s.radius, 10)};${border}"><span style="font-size:14px;font-weight:700">Image</span></div>`;
        return `<section style="${common}">${media}</section>`;
      }
      case 'video': {
        const direct = c.variant === 'direct' || /\.mp4($|\?)/i.test(String(c.url || ''));
        const player = direct
          ? `<video src="${this.attr(c.url)}" ${c.controls !== false ? 'controls' : ''} ${c.autoplay ? 'autoplay' : ''} ${c.muted ? 'muted' : ''} playsinline style="width:100%;height:100%;object-fit:cover"></video>`
          : `<iframe src="${this.attr(this.youtubeEmbedUrl(String(c.url || '')))}" title="${this.attr(c.title || 'Video')}" style="width:100%;height:100%;border:0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
        return `<section style="${common}"><div style="width:100%;aspect-ratio:${this.attr(s.aspect || '16/9')};overflow:hidden;border-radius:${this.cssPx(s.radius, 10)}">${player}</div></section>`;
      }
      case 'slider': {
        const images = Array.isArray(c.images) ? c.images : [];
        const id = `slider-${this.safeDomId(block.id)}`;
        return `<section style="${common}"><div id="${id}" class="bt-slider" data-bt-slider data-interval="${Number(c.interval) || 3500}" data-autoplay="${c.autoplay !== false}" style="height:${this.cssPx(s.height, 420)};border-radius:${this.cssPx(s.radius, 14)}">${images.map((url: string, index: number) => url ? `<img class="${index === 0 ? 'is-active' : ''}" src="${this.attr(url)}" alt="Slide ${index + 1}">` : `<div class="${index === 0 ? 'is-active' : ''}" style="display:${index === 0 ? 'grid' : 'none'};width:100%;height:100%;place-items:center;background:#D1D5DB;color:#6B7280;font-weight:700">Image</div>`).join('')}</div></section>`;
      }
      case 'gallery': {
        const images = Array.isArray(c.images) ? c.images : [];
        return `<section style="${common}"><div class="bt-grid" style="grid-template-columns:repeat(${Math.max(1, Math.min(4, Number(s.columns) || 3))},1fr);gap:${this.cssPx(s.gap, 10)}">${images.map((url: string) => url ? `<img src="${this.attr(url)}" alt="Gallery image" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:${this.cssPx(s.radius, 10)}">` : `<div style="width:100%;aspect-ratio:1/1;display:grid;place-items:center;background:#D1D5DB;color:#6B7280;border-radius:${this.cssPx(s.radius, 10)};font-weight:700">Image</div>`).join('')}</div></section>`;
      }
      case 'button': {
        const fullWidth = !!s.fullWidth;
        const shadow = s.shadow ? 'box-shadow:0 8px 18px rgba(15,23,42,.14);' : '';
        const items = Array.isArray(c.items) && c.items.length ? c.items : [{ label: c.label, url: c.url, target: c.target, icon: s.icon || '' }];
        return `<section style="${common}"><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:${s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start'}">${items.map((item:any)=>`<a class="bt-btn" href="${this.attr(item.url || '#')}" target="${this.attr(item.target || '_self')}" style="display:${fullWidth ? 'flex' : 'inline-flex'};align-items:center;justify-content:center;gap:8px;${fullWidth ? 'flex:1 1 100%;' : ''}text-align:center;background:${this.css(s.buttonBg, '#FF4D6D')};color:${this.css(s.buttonText, '#FFFFFF')};border:${Number(s.borderWidth) || 0}px solid ${this.css(s.borderColor, '#FF4D6D')};padding:13px 22px;border-radius:${this.cssPx(s.radius, 10)};font-weight:700;font-size:${this.cssPx(s.fontSize, 15)};${shadow}">${item.icon ? `<span class="material-symbols-rounded">${this.escape(item.icon)}</span>` : ''}${this.escape(item.label || 'Button')}</a>`).join('')}</div></section>`;
      }
      case 'icon': {
        const items = Array.isArray(c.items) && c.items.length ? c.items : [{ materialIcon: c.materialIcon, label: c.label, url: c.url || '#' }];
        return `<section style="${common}"><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:${s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start'}">${items.map((item:any)=>`<a href="${this.attr(item.url || '#')}" style="display:inline-flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:inherit"><span class="material-symbols-rounded" style="display:inline-flex;align-items:center;justify-content:center;width:${this.cssPx(Number(s.iconSize) + 24, 60)};height:${this.cssPx(Number(s.iconSize) + 24, 60)};font-size:${this.cssPx(s.iconSize, 36)};color:${this.css(s.iconColor, '#FF4D6D')};background:${this.css(s.iconBg, 'transparent')};border-radius:${this.cssPx(s.radius, 999)}">${this.escape(item.materialIcon || 'star')}</span>${item.label ? `<strong>${this.escape(item.label)}</strong>` : ''}</a>`).join('')}</div></section>`;
      }
      case 'social': {
        const items = this.socialItems(c);
        const variant = String(c.variant || 'logo-only');
        const justify = s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start';
        const showName = typeof s.showName === 'boolean' ? s.showName : !['logo-only', 'logo-round', 'logo-square', 'logo-hover'].includes(variant);
        const showUrl = typeof s.showUrl === 'boolean' ? s.showUrl : ['logo-url-left', 'logo-url-center', 'logo-url-right'].includes(variant);
        const hover = Boolean(s.hover || variant === 'logo-hover');
        const dark = variant === 'logo-dark';
        const card = ['logo-card', 'logo-outline', 'logo-soft', 'logo-dark', 'logo-footer'].includes(variant);
        const shape = String(s.socialIconShape || (variant === 'logo-round' || variant === 'logo-circle-name' ? 'round' : variant === 'logo-square' || variant === 'logo-square-name' ? 'square' : 'none'));
        const logoSize = Math.max(20, Math.min(96, Number(s.iconSize) || 36));
        const gap = Math.max(4, Math.min(48, Number(s.gap) || 12));
        const href = (url: string) => /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url) || /^\//.test(url) || url === '#' ? url : `https://${url}`;
        const socialClass = `bt-social bt-social--${this.safeDomId(variant)}${hover ? ' bt-social--hover' : ''}`;
        const logoStyle = `width:${logoSize}px;height:${logoSize}px;object-fit:contain;flex:0 0 ${logoSize}px;border-radius:${shape === 'round' ? '999px' : shape === 'square' ? '10px' : '0'};`;
        const shellBg = dark ? '#172033' : variant === 'logo-soft' ? '#F8FAFC' : '#FFFFFF';
        const shellBorder = Number(s.borderWidth) > 0 ? `border:${Number(s.borderWidth)}px solid ${this.css(s.borderColor, '#E2E8F0')};` : (card ? 'border:1px solid #E2E8F0;' : 'border:0;');
        const nameColor = dark ? '#FFFFFF' : this.css(s.color, '#0F172A');
        const urlColor = dark ? '#CBD5E1' : '#64748B';
        const layoutDirection = ['logo-url-center', 'logo-url-right'].includes(variant) ? 'column' : 'row';
        const itemAlign = variant === 'logo-url-center' ? 'center' : 'flex-start';
        const list = items.map(item => {
          const safeUrl = href(item.url);
          const isImage = /^https?:\/\//i.test(item.icon || '') || /^data:image\//i.test(item.icon || '') || /\.(svg|png|jpe?g|webp)(\?|$)/i.test(item.icon || '');
          const iconHtml = isImage
            ? `<img src="${this.attr(item.icon)}" alt="${this.attr(item.name)} logo" style="${logoStyle}" loading="lazy">`
            : `<span class="material-symbols-rounded" style="font-size:${logoSize}px;line-height:1">${this.escape(item.icon || 'link')}</span>`;
          const nameHtml = showName ? `<strong style="font-size:14px;font-weight:800;color:${nameColor};line-height:1.2">${this.escape(item.name)}</strong>` : '';
          const urlHtml = showUrl ? `<span style="font-size:12px;color:${urlColor};line-height:1.35;word-break:break-all">${this.escape(item.url)}</span>` : '';
          const textHtml = (showName || showUrl) ? `<span style="display:flex;flex-direction:column;gap:3px;min-width:0;align-items:${itemAlign}">${nameHtml}${urlHtml}</span>` : '';
          const content = layoutDirection === 'column'
            ? `${iconHtml}${textHtml}`
            : `${iconHtml}${textHtml}`;
          return `<a class="bt-social__item" href="${this.attr(safeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${this.attr(item.name)}" style="display:inline-flex;align-items:center;justify-content:${variant === 'logo-url-center' ? 'center' : 'flex-start'};flex-direction:${layoutDirection};gap:${layoutDirection === 'column' ? '8px' : '10px'};min-width:${layoutDirection === 'column' ? Math.max(logoSize, 56) : showUrl ? '220px' : Math.max(logoSize, 56)};padding:${card ? '12px 14px' : '4px'};text-decoration:none;background:${shellBg};${shellBorder}border-radius:${variant === 'logo-card' ? '14px' : variant === 'logo-outline' ? '10px' : shape === 'round' ? '999px' : '8px'};transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease;">${content}</a>`;
        }).join('');
        const hoverCss = hover
          ? `<style>.${socialClass.replace(/ /g, '.')} .bt-social__item:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(15,23,42,.12);border-color:#CBD5E1;}</style>`
          : '';
        return `<section style="${common}">${hoverCss}<div class="${socialClass}" style="display:flex;gap:${gap}px;flex-wrap:wrap;align-items:center;justify-content:${justify};width:100%;">${list}</div></section>`;
      }
      case 'product': {
        const items = Array.isArray(c.items) && c.items.length ? c.items : [c];
        const wrap = c.slider ? 'display:flex;overflow-x:auto;scroll-snap-type:x mandatory;' : `display:grid;grid-template-columns:repeat(${Math.min(items.length,3)},minmax(0,1fr));`;
        return `<section style="${common}"><div style="${wrap}gap:14px">${items.map((x:any)=>`<article style="${c.slider?'min-width:min(320px,82vw);scroll-snap-align:start;':''}padding:18px;border:1px solid #E2E8F0;border-radius:16px">${x.image?`<img src="${this.attr(x.image)}" alt="" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px">`:`<div style="aspect-ratio:1/1;background:#E5E7EB;border-radius:12px;display:grid;place-items:center;color:#64748B">Product image</div>`}<h3>${this.escape(x.name)}</h3><strong style="font-size:22px">${this.escape(x.price)}</strong>${x.oldPrice?` <del style="opacity:.55">${this.escape(x.oldPrice)}</del>`:''}<p style="opacity:.72">${this.escape(x.description||'')}</p><a class="bt-btn" href="${this.attr(x.url||'#')}" style="background:#FF4D6D;color:#fff;padding:10px 14px;border-radius:10px;font-weight:800">${this.escape(x.cta||'Buy Now')}</a></article>`).join('')}</div></section>`;
      }
      case 'offer': {
        const items = Array.isArray(c.items) && c.items.length ? c.items : [c];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${Math.min(items.length,3)},minmax(0,1fr));gap:14px">${items.map((x:any)=>`<article style="padding:22px;border:1px solid #FFD1D9;border-radius:18px"><small style="font-weight:900;color:#FF4D6D">${this.escape(x.badge||'')}</small><h3>${this.escape(x.title)}</h3><strong style="display:block;font-size:32px;color:#FF4D6D">${this.escape(x.discount)}</strong><p>${this.escape(x.description)}</p><a class="bt-btn" href="${this.attr(x.url||'#')}" style="background:#FF4D6D;color:#fff;padding:10px 14px;border-radius:10px;font-weight:800">${this.escape(x.cta||'View offer')}</a></article>`).join('')}</div></section>`;
      }
      case 'html':
        return `<section style="${common}">${String(c.html || '')}</section>`;
      case 'form': {
        const fields = Array.isArray(c.fields) ? c.fields : [];
        const fieldHtml = fields.map((field:any) => this.renderFormField(field)).join('');
        return `<section style="${common}"><form class="bt-form bt-campaign-form" data-bt-campaign-form action="${this.attr(c.submitUrl || '/campaignForm/accountId')}" method="post" data-success="${this.attr(c.successMessage || 'Thank You For your Response')}" data-error="${this.attr(c.errorMessage || 'Something went wrong. Please try again.')}"><h3 style="margin:0 0 6px">${this.escape(c.title || 'Get in touch')}</h3><p class="bt-muted" style="margin-top:0">${this.escape(c.subtitle || '')}</p><div class="bt-form-grid">${fieldHtml}</div><button type="submit" style="background:#FF4D6D;color:#FFFFFF;padding:12px 20px;border-radius:10px;font-weight:800">${this.escape(c.submitLabel || 'Send Enquiry')}</button><p data-form-message style="display:none;margin:12px 0 0;font-weight:700"></p></form></section>`;
      }
      case 'contact':
        return `<section style="${common}"><div><h3 style="margin:0 0 12px">Contact</h3><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">call</span> <a href="tel:${this.attr(String(c.phone || '').replace(/\s+/g, ''))}" style="color:inherit;text-decoration:none">${this.escape(c.phone)}</a></p><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">mail</span> <a href="mailto:${this.attr(c.email)}" style="color:inherit;text-decoration:none">${this.escape(c.email)}</a></p><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">location_on</span> ${this.escape(c.address)}</p><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">schedule</span> ${this.escape(c.hours)}</p></div></section>`;
      case 'whatsapp': {
        const phone = String(c.phone || '').replace(/\D/g, '');
        const href = `https://wa.me/${phone}?text=${encodeURIComponent(c.message || '')}`;
        return `<section style="${common}"><a class="bt-btn" href="${this.attr(href)}" target="_blank" rel="noopener" style="display:${s.fullWidth ? 'flex' : 'inline-flex'};width:${s.fullWidth ? '100%' : 'auto'};justify-content:center;gap:8px;align-items:center;background:${this.css(s.buttonBg, '#22C55E')};color:${this.css(s.buttonText, '#FFFFFF')};padding:13px 22px;border-radius:${this.cssPx(s.radius, 999)};font-weight:800"><span class="material-symbols-rounded">chat</span>${this.escape(c.label || 'Chat on WhatsApp')}</a></section>`;
      }
      case 'map':
        return `<section style="${common}">${c.title && c.variant === 'office' ? `<h3 style="margin:0 0 12px">${this.escape(c.title)}</h3>` : ''}<iframe title="Business location" src="${this.attr(c.url)}" style="width:100%;height:${this.cssPx(c.height, 300)};border:0;border-radius:${this.cssPx(s.radius, 10)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></section>`;
      case 'scanner': {
        const id = `scan-${this.safeDomId(block.id)}`;
        return `<section style="${common}" id="${id}" data-bt-scanner data-formats="${this.attr(c.formats || 'qr_code')}"><span class="material-symbols-rounded" style="font-size:52px;color:#FF4D6D">qr_code_scanner</span><h3>${this.escape(c.title || 'Scan code')}</h3><video data-scan-video playsinline muted style="width:100%;max-width:420px;margin:14px auto;border-radius:12px;background:#0F172A"></video><p data-scan-result style="margin:12px 0 0">Point the camera at a QR or barcode.</p></section>`;
      }
      case 'timer': {
        const id = `timer-${this.safeDomId(block.id)}`;
        return `<section id="${id}" data-bt-timer data-target="${this.attr(c.target)}" data-expired="${this.attr(c.expiredText || 'Ended')}" style="${common}"><h3 style="margin:0 0 14px">${this.escape(c.title || 'Countdown')}</h3><div class="bt-timer-units"><div class="bt-timer-unit"><strong data-days>00</strong><small style="display:block">Days</small></div><div class="bt-timer-unit"><strong data-hours>00</strong><small style="display:block">Hours</small></div><div class="bt-timer-unit"><strong data-minutes>00</strong><small style="display:block">Minutes</small></div><div class="bt-timer-unit"><strong data-seconds>00</strong><small style="display:block">Seconds</small></div></div><p data-expired-label style="display:none;margin:12px 0 0"></p></section>`;
      }
      case 'counter': {
        const items = Array.isArray(c.items) && c.items.length ? c.items : [{ start:c.start,end:c.end,prefix:c.prefix,suffix:c.suffix,label:c.label,duration:c.duration }];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${Math.min(4, Math.max(1, items.length))},1fr);gap:12px">${items.map((item:any,index:number)=>`<div id="counter-${this.safeDomId(block.id)}-${index}" data-bt-counter data-start="${Number(item.start) || 0}" data-end="${Number(item.end) || 0}" data-duration="${Number(item.duration) || 1600}" data-prefix="${this.attr(item.prefix || '')}" data-suffix="${this.attr(item.suffix || '')}" style="padding:14px;text-align:center"><div data-counter-value style="font-size:44px;font-weight:900;color:${this.css(s.accent, '#FF4D6D')}">${this.escape(item.prefix || '')}${this.escape(item.end)}${this.escape(item.suffix || '')}</div><p style="margin:6px 0 0">${this.escape(item.label || '')}</p></div>`).join('')}</div></section>`;
      }
      case 'rating': {
        const max = Math.max(1, Math.min(10, Number(c.max) || 5));
        return `<section style="${common}"><form class="bt-rating" data-bt-rating action="${this.attr(c.submitUrl || '/rating/accountId')}" method="post" data-success="${this.attr(c.successMessage || 'Thank You For your Rating')}"><h3 style="margin:0 0 6px">${this.escape(c.title || 'Rate your experience')}</h3><p style="margin:0 0 16px;opacity:.72">${this.escape(c.text || '')}</p><div class="bt-rating-stars">${Array.from({length:max},(_,i)=>`<label><input type="radio" name="rating" value="${i+1}" ${i===max-1?'required':''}><span>★</span></label>`).join('')}</div>${c.allowComment !== false ? `<textarea name="comment" rows="3" placeholder="${this.attr(c.commentPlaceholder || 'Write a comment (optional)')}"></textarea>` : ''}<button type="submit" style="border:0;background:#0F172A;color:#fff;padding:11px 18px;border-radius:10px;font-weight:800">${this.escape(c.submitLabel || 'Submit Rating')}</button><p data-rating-message style="display:none;margin:12px 0 0;font-weight:700"></p></form></section>`;
      }
      case 'chart': {
        const data = this.chartData(block);
        const max = Math.max(1, ...data.map(item => item.value));
        if (c.variant === 'progress') {
          return `<section style="${common}"><h3 style="margin-top:0">${this.escape(c.title || 'Performance')}</h3>${data.map(item => `<div style="margin:12px 0"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${this.escape(item.label)}</span><strong>${item.value}</strong></div><div style="height:8px;background:#E2E8F0;border-radius:999px;overflow:hidden"><i style="display:block;height:100%;width:${Math.min(100, (item.value / max) * 100)}%;background:${this.css(s.accent, '#FF4D6D')}"></i></div></div>`).join('')}</section>`;
        }
        if (c.variant === 'donut') {
          const first = data[0]?.value || 65;
          const pct = Math.max(0, Math.min(100, Math.round((first / max) * 100)));
          return `<section style="${common}"><h3 style="margin-top:0">${this.escape(c.title || 'Performance')}</h3><div style="width:180px;height:180px;margin:auto;border-radius:50%;background:conic-gradient(${this.css(s.accent, '#FF4D6D')} ${pct}%,#E2E8F0 0);display:grid;place-items:center"><div style="width:120px;height:120px;background:${this.css(s.background, '#FFFFFF')};border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:900">${pct}%</div></div></section>`;
        }
        return `<section style="${common}"><h3 style="margin-top:0">${this.escape(c.title || 'Performance')}</h3><div class="bt-chart-bars">${data.map(item => `<div class="bt-chart-bar"><i style="height:${Math.max(8, (item.value / max) * 150)}px;background:${this.css(s.accent, '#FF4D6D')}"></i><small>${this.escape(item.label)}</small></div>`).join('')}</div></section>`;
      }
      case 'media': {
        const files: MediaItem[] = Array.isArray(c.files) ? c.files : [];
        return `<section style="${common}"><h3 style="margin-top:0">${this.escape(c.title || 'Your Media')}</h3><div class="bt-media-grid">${files.map(file => file.type.startsWith('image/') ? `<a href="${this.attr(file.dataUrl)}" download="${this.attr(file.name)}"><img src="${this.attr(file.dataUrl)}" alt="${this.attr(file.name)}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px"></a>` : `<a href="${this.attr(file.dataUrl)}" download="${this.attr(file.name)}" style="padding:14px;border:1px solid #E2E8F0;border-radius:10px;text-decoration:none;color:inherit"><span class="material-symbols-rounded">description</span><div style="margin-top:6px;word-break:break-word">${this.escape(file.name)}</div></a>`).join('')}</div></section>`;
      }

      case 'navbar': {
        const menuItems = Array.isArray(c.menuItems) && c.menuItems.length ? c.menuItems : String(c.links || '').split(',').map((x:string)=>({label:x.trim(),url:'#',icon:'',target:'_self'})).filter((x:any)=>x.label);
        const brand = c.logo ? `<span style="display:flex;align-items:center;gap:10px"><img src="${this.attr(c.logo)}" alt="" style="width:38px;height:38px;object-fit:contain;border-radius:9px"><strong style="font-size:20px">${this.escape(c.brand)}</strong></span>` : `<strong style="font-size:20px">${this.escape(c.brand)}</strong>`;
        return `<nav style="${common}display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap">${brand}<div style="display:flex;gap:16px;flex-wrap:wrap">${menuItems.map((x:any)=>`<a href="${this.attr(x.url||'#')}" target="${this.attr(x.target||'_self')}" style="color:inherit;text-decoration:none;display:inline-flex;gap:6px;align-items:center">${c.showIcons&&x.icon?`<span class="material-symbols-rounded" style="font-size:18px">${this.escape(x.icon)}</span>`:''}${this.escape(x.label)}</a>`).join('')}</div><a class="bt-btn" href="${this.attr(c.ctaUrl||'#')}" style="background:#FF4D6D;color:#fff;padding:10px 16px;border-radius:10px;font-weight:700">${this.escape(c.cta||'Get Started')}</a></nav>`;
      }
      case 'hero': {
        const img = String(c.image||'').trim();
        const visual = img ? `<img src="${this.attr(img)}" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:16px">` : `<div style="width:100%;aspect-ratio:4/3;background:#D1D5DB;border-radius:16px;display:grid;place-items:center;color:#6B7280">Image</div>`;
        const copy = `<div><small style="font-weight:800;letter-spacing:.12em;color:#FF4D6D">${this.escape(c.eyebrow||'')}</small><h1 style="font-size:48px;line-height:1.05;margin:10px 0 14px">${this.escape(c.title)}</h1><p style="font-size:18px;line-height:1.7;color:inherit;opacity:.78">${this.escape(c.text)}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><a class="bt-btn" href="${this.attr(c.primaryUrl||'#')}" style="background:#FF4D6D;color:#fff;padding:12px 20px;border-radius:10px;font-weight:800">${this.escape(c.primary)}</a><a class="bt-btn" href="${this.attr(c.secondaryUrl||'#')}" style="border:1px solid #CBD5E1;color:inherit;padding:12px 20px;border-radius:10px;font-weight:700">${this.escape(c.secondary)}</a></div></div>`;
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:${c.variant==='split'||c.variant==='image'?'1fr 1fr':'1fr'};gap:28px;align-items:center">${copy}${c.variant==='split'||c.variant==='image'?visual:''}</div></section>`;
      }
      case 'services': {
        const items = Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||3);
        return `<section style="${common}"><h2 style="margin-top:0">${this.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${this.cssPx(s.gap,12)}">${items.map((x:any,i:number)=>`<article style="padding:18px;border:1px solid #E2E8F0;border-radius:14px"><span class="material-symbols-rounded" style="font-size:28px;color:#FF4D6D">${this.escape(x.icon||'star')}</span><h3>${this.escape(x.title)}</h3><p style="opacity:.75">${this.escape(x.text)}</p></article>`).join('')}</div></section>`;
      }
      case 'testimonial': {
        const items=Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||1);
        return `<section style="${common}"><h2 style="margin-top:0">${this.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${this.cssPx(s.gap,12)}">${items.map((x:any)=>`<blockquote style="margin:0;padding:20px;border:1px solid #E2E8F0;border-radius:14px"><div style="color:#F59E0B">★★★★★</div><p style="font-size:18px;line-height:1.6">“${this.escape(x.quote)}”</p><strong>${this.escape(x.name)}</strong><small style="display:block;opacity:.7">${this.escape(x.role)}</small></blockquote>`).join('')}</div></section>`;
      }
      case 'pricing': {
        const plans=Array.isArray(c.plans)?c.plans:[]; const cols=Math.max(1,Number(s.columns)||3);
        return `<section style="${common}"><h2 style="margin-top:0">${this.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${this.cssPx(s.gap,12)}">${plans.map((x:any,i:number)=>`<article style="padding:22px;border:${c.variant==='featured'&&i===1?'2px solid #FF4D6D':'1px solid #E2E8F0'};border-radius:16px"><h3>${this.escape(x.name)}</h3><div style="font-size:34px;font-weight:900">${this.escape(x.price)}<small style="font-size:14px;font-weight:500">${this.escape(x.period)}</small></div><div style="white-space:pre-line;line-height:1.8;margin:16px 0">${this.escape(x.features)}</div><a class="bt-btn" href="#" style="background:#FF4D6D;color:#fff;padding:11px 16px;border-radius:10px;font-weight:700">${this.escape(x.cta)}</a></article>`).join('')}</div></section>`;
      }
      case 'faq': {
        const items=Array.isArray(c.items)?c.items:[];
        return `<section style="${common}"><h2>${this.escape(c.title)}</h2><div>${items.map((x:any)=>`<details style="border-bottom:1px solid #E2E8F0;padding:14px 0"><summary style="font-weight:800;cursor:pointer">${this.escape(x.q)}</summary><p style="line-height:1.7;opacity:.78">${this.escape(x.a)}</p></details>`).join('')}</div></section>`;
      }
      case 'stats': {
        const items=Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||4);
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${this.cssPx(s.gap,12)}">${items.map((x:any)=>`<div style="padding:18px;text-align:center"><strong style="display:block;font-size:38px;color:${this.css(s.accent,'#FF4D6D')}">${this.escape(x.value)}</strong><span>${this.escape(x.label)}</span></div>`).join('')}</div></section>`;
      }
      case 'tabs': {
        const items=Array.isArray(c.items)?c.items:[];
        return `<section style="${common}"><div class="bt-tabs" data-bt-tabs>${items.map((x:any,i:number)=>`<button type="button" data-tab-btn="${i}" class="${i===0?'is-active':''}">${this.escape(x.title)}</button>`).join('')}<div class="bt-tab-panels">${items.map((x:any,i:number)=>`<div data-tab-panel="${i}" style="display:${i===0?'block':'none'};padding:18px 0;line-height:1.7">${this.escape(x.text)}</div>`).join('')}</div></div></section>`;
      }
      case 'timeline': {
        const items=Array.isArray(c.items)?c.items:[];
        return `<section style="${common}"><h2>${this.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${items.length||1},1fr);gap:14px">${items.map((x:any,i:number)=>`<div style="padding:18px;border-top:3px solid ${this.css(s.accent,'#FF4D6D')}"><strong style="display:block;color:${this.css(s.accent,'#FF4D6D')}">0${i+1}</strong><h3>${this.escape(x.title)}</h3><p style="opacity:.75">${this.escape(x.text)}</p></div>`).join('')}</div></section>`;
      }
      case 'team': {
        const items=Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||3);
        return `<section style="${common}"><h2>${this.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${this.cssPx(s.gap,12)}">${items.map((x:any)=>`<article style="text-align:center;padding:16px"><div style="aspect-ratio:1/1;background:#D1D5DB;border-radius:16px;margin-bottom:12px;display:grid;place-items:center;color:#6B7280">Image</div><strong>${this.escape(x.name)}</strong><small style="display:block;opacity:.7">${this.escape(x.role)}</small></article>`).join('')}</div></section>`;
      }
      case 'footer': {
        const links=String(c.links||'').split(',').map((x:string)=>x.trim()).filter(Boolean);
        return `<footer style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:2fr 1fr 1fr;gap:24px"><div><strong style="font-size:22px">${this.escape(c.brand)}</strong><p style="opacity:.75">${this.escape(c.text)}</p></div><div>${links.map((x:string)=>`<a href="#" style="display:block;color:inherit;text-decoration:none;margin:7px 0">${this.escape(x)}</a>`).join('')}</div><div><div>${this.escape(c.phone)}</div><div>${this.escape(c.email)}</div></div></div><div style="margin-top:22px;padding-top:14px;border-top:1px solid rgba(148,163,184,.35);font-size:13px;opacity:.75">${this.escape(c.copyright)}</div></footer>`;
      }
      case 'popup': {
        return `<section style="${common}"><div style="max-width:520px;margin:auto;border:1px solid #E2E8F0;border-radius:18px;padding:26px;background:inherit"><small style="font-weight:800;color:#FF4D6D">POPUP PREVIEW</small><h2>${this.escape(c.title)}</h2><p style="line-height:1.7;opacity:.78">${this.escape(c.text)}</p><a class="bt-btn" href="${this.attr(c.url||'#')}" style="background:#FF4D6D;color:#fff;padding:11px 18px;border-radius:10px;font-weight:700">${this.escape(c.cta)}</a></div></section>`;
      }
      case 'floating': {
        const items = Array.isArray(c.items) && c.items.length ? c.items : [c];
        return `<section style="${common}"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">${items.map((x:any)=>`<a class="bt-btn" href="${this.attr(x.url||'#')}" style="display:inline-flex;align-items:center;gap:7px;background:#FF4D6D;color:#fff;padding:9px 13px;border-radius:999px;font-weight:800;font-size:13px"><span class="material-symbols-rounded" style="font-size:19px">${this.escape(x.icon||'chat')}</span>${this.escape(x.label||'Action')}</a>`).join('')}</div></section>`;
      }
      case 'divider': {
        const width = s.short ? '72px' : '100%';
        return `<section style="${common}"><hr style="width:${width};border:0;border-top:${Number(s.borderWidth) || 1}px ${this.css(s.borderStyle, 'solid')} ${this.css(s.borderColor, '#E2E8F0')};margin:${s.short ? '0 auto' : '0'}"></section>`;
      }
      case 'spacer':
        return `<div style="${this.exportBackgroundStyle(s)}height:${this.cssPx(s.height, 48)}"></div>`;
      default:
        return '';
    }
  }

  private exportRuntimeScript(): string {
    return `<script>(function(){
      document.querySelectorAll('[data-bt-slider]').forEach(function(root){var imgs=[].slice.call(root.querySelectorAll('img'));if(imgs.length<2)return;var i=0;var autoplay=root.getAttribute('data-autoplay')!=='false';var interval=Number(root.getAttribute('data-interval'))||3500;if(!autoplay)return;setInterval(function(){imgs[i].classList.remove('is-active');i=(i+1)%imgs.length;imgs[i].classList.add('is-active');},interval);});
      document.querySelectorAll('[data-bt-timer]').forEach(function(root){var target=new Date(root.getAttribute('data-target')||'').getTime();function tick(){var diff=target-Date.now();if(!isFinite(target)||diff<=0){['days','hours','minutes','seconds'].forEach(function(k){var n=root.querySelector('[data-'+k+']');if(n)n.textContent='00';});var e=root.querySelector('[data-expired-label]');if(e){e.style.display='block';e.textContent=root.getAttribute('data-expired')||'Ended';}return;}var d=Math.floor(diff/86400000),h=Math.floor(diff/3600000)%24,m=Math.floor(diff/60000)%60,s=Math.floor(diff/1000)%60;[['days',d],['hours',h],['minutes',m],['seconds',s]].forEach(function(p){var n=root.querySelector('[data-'+p[0]+']');if(n)n.textContent=String(p[1]).padStart(2,'0');});}tick();setInterval(tick,1000);});
      document.querySelectorAll('[data-bt-counter]').forEach(function(root){var el=root.querySelector('[data-counter-value]');if(!el)return;var start=Number(root.getAttribute('data-start'))||0,end=Number(root.getAttribute('data-end'))||0,dur=Number(root.getAttribute('data-duration'))||1600,prefix=root.getAttribute('data-prefix')||'',suffix=root.getAttribute('data-suffix')||'';var begun=false;function run(){if(begun)return;begun=true;var t0=performance.now();function step(t){var p=Math.min(1,(t-t0)/dur);var v=Math.round(start+(end-start)*(1-Math.pow(1-p,3)));el.textContent=prefix+v+suffix;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}if('IntersectionObserver'in window){new IntersectionObserver(function(entries,obs){if(entries.some(function(e){return e.isIntersecting;})){run();obs.disconnect();}}).observe(root);}else run();});
      document.querySelectorAll('[data-bt-tabs]').forEach(function(root){var buttons=[].slice.call(root.querySelectorAll('[data-tab-btn]'));var panels=[].slice.call(root.querySelectorAll('[data-tab-panel]'));buttons.forEach(function(btn){btn.addEventListener('click',function(){var i=btn.getAttribute('data-tab-btn');buttons.forEach(function(b){b.classList.toggle('is-active',b===btn);});panels.forEach(function(p){p.style.display=p.getAttribute('data-tab-panel')===i?'block':'none';});});});});
      document.querySelectorAll('[data-bt-scanner]').forEach(function(root){var video=root.querySelector('[data-scan-video]'),result=root.querySelector('[data-scan-result]');if(!video||!result)return;var started=false;async function start(){if(started)return;started=true;if(!('BarcodeDetector'in window)||!navigator.mediaDevices){result.textContent='Scanner is not supported in this browser.';return;}try{var formats=(root.getAttribute('data-formats')||'qr_code').split(',');var detector=new BarcodeDetector({formats:formats});var stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});video.srcObject=stream;await video.play();var stopped=false;async function scan(){if(stopped)return;try{var codes=await detector.detect(video);if(codes&&codes[0]){result.textContent=codes[0].rawValue||'';stopped=true;stream.getTracks().forEach(function(t){t.stop();});return;}}catch(e){}requestAnimationFrame(scan);}scan();}catch(e){started=false;result.textContent='Camera permission or scanner unavailable. Tap this scanner area to retry.';}}root.addEventListener('click',start);if('IntersectionObserver'in window){new IntersectionObserver(function(entries,obs){if(entries.some(function(e){return e.isIntersecting;})){start();obs.disconnect();}}).observe(root);}});
    })();</script>`;
  }

  private socialItems(content: Record<string, any>): Array<{ name: string; url: string; icon: string }> {
    const iconMap: Record<string, string> = {
      facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
      instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
      youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
      linkedin: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png',
      telegram: 'https://cdn.simpleicons.org/telegram/229ED9',
      x: 'https://cdn.simpleicons.org/x/111111',
      whatsapp: 'https://cdn.simpleicons.org/whatsapp/25D366',
      website: 'public',
      github: 'https://cdn.simpleicons.org/github/181717',
      tiktok: 'https://cdn.simpleicons.org/tiktok/111111'
    };

    const dynamic = Array.isArray(content['items']) ? content['items'] : [];
    if (dynamic.length) {
      return dynamic
        .filter((item: any) => String(item?.url || '').trim())
        .map((item: any) => {
          const platform = String(item?.platform || '').toLowerCase();
          return {
            name: String(item?.name || item?.label || item?.platform || 'Link'),
            url: String(item.url),
            // The selected platform is the source of truth for the default logo.
            // This fixes stale icons when an existing item is switched from one platform to another.
            icon: String(iconMap[platform] || item?.icon || 'link')
          };
        });
    }

    const all = [
      { key: 'facebook', name: 'Facebook' },
      { key: 'instagram', name: 'Instagram' },
      { key: 'youtube', name: 'YouTube' },
      { key: 'linkedin', name: 'LinkedIn' },
      { key: 'x', name: 'X' },
      { key: 'whatsapp', name: 'WhatsApp' }
    ];

    return all
      .filter(item => String(content[item.key] || '').trim())
      .map(item => ({ name: item.name, url: String(content[item.key]), icon: iconMap[item.key] || 'link' }));
  }

  private nestedContext(): { parent: EditorBlock; slot: EditorBlock[]; index: number } | null {
    if (!this.selectedNestedId) return null;
    const parent = this.blocks.find(block => block.id === this.selectedNestedParentId);
    if (!parent) return null;
    const slots = Array.isArray(parent.content['slots']) ? parent.content['slots'] : [];
    const slot = Array.isArray(slots[this.selectedNestedSlot]) ? slots[this.selectedNestedSlot] : [];
    const index = slot.findIndex((item: EditorBlock) => item.id === this.selectedNestedId);
    if (index < 0) return null;
    return { parent, slot, index };
  }

  private commitChange(): void {
    if (this.designTimer) clearTimeout(this.designTimer);
    this.designTimer = setTimeout(() => this.changed.emit(), 0);
  }

  private pushHistory(): void {
    this.history.push(this.clone(this.blocks));
    if (this.history.length > 50) this.history.shift();
    this.future = [];
  }

  private uid(type: string): string {
    return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  private isElementType(type: string): boolean {
    return this.elements.some(element => element.type === type);
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Could not read file.'));
      reader.readAsDataURL(file);
    });
  }

  private youtubeEmbedUrl(url: string): string {
    const value = String(url || '').trim();
    const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
    return value;
  }

  private stripHtml(value: string): string {
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent || div.innerText || '';
  }

  private safeDomId(value: string): string {
    return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  backgroundCss(style: Record<string, any>): string {
    const type = String(style?.['backgroundType'] || 'color');
    const color = String(style?.['background'] || '#FFFFFF');
    const gradient = `linear-gradient(${String(style?.['gradientDirection'] || '135deg')}, ${String(style?.['gradientFrom'] || '#FFFFFF')}, ${String(style?.['gradientTo'] || '#F1F5F9')})`;
    const image = String(style?.['backgroundImage'] || '').trim();
    const imageLayer = image ? `url("${image.replace(/"/g, '%22')}")` : '';
    if (type === 'gradient-image' && imageLayer) return `${gradient}, ${imageLayer}`;
    if (type === 'gradient') return gradient;
    if (type === 'image' && imageLayer) return `${imageLayer}, ${color}`;
    return color;
  }

  backgroundSize(style: Record<string, any>): string {
    return String(style?.['backgroundSize'] || 'cover');
  }

  backgroundPosition(style: Record<string, any>): string {
    return String(style?.['backgroundPosition'] || 'center');
  }

  backgroundRepeat(style: Record<string, any>): string {
    return String(style?.['backgroundRepeat'] || 'no-repeat');
  }

  imageHeightAspect(style: Record<string, any>): string {
    const width = Math.max(1, Math.min(100, Number(style?.['imageWidth']) || 100));
    const height = Math.max(1, Math.min(200, Number(style?.['imageHeight']) || 56));
    return `${width} / ${height}`;
  }

  private shadowCss(value: any): string {
    const key = String(value || 'none');
    const map: Record<string, string> = { none: 'none', soft: '0 8px 24px rgba(15,23,42,.08)', medium: '0 14px 36px rgba(15,23,42,.14)', strong: '0 20px 50px rgba(15,23,42,.22)' };
    return map[key] || key;
  }

  private exportBackgroundStyle(style: Record<string, any>): string {
    const type = String(style?.['backgroundType'] || 'color');
    const color = this.css(style?.['background'], '#FFFFFF');
    const direction = String(style?.['gradientDirection'] || '135deg');
    const from = this.css(style?.['gradientFrom'], '#FFFFFF');
    const to = this.css(style?.['gradientTo'], '#F1F5F9');
    const gradient = `linear-gradient(${direction},${from},${to})`;
    const image = String(style?.['backgroundImage'] || '').trim();
    const safeImage = image ? `url(&quot;${this.attr(image)}&quot;)` : '';
    let backgroundImage = 'none';
    if (type === 'gradient-image' && safeImage) backgroundImage = `${gradient},${safeImage}`;
    else if (type === 'gradient') backgroundImage = gradient;
    else if (type === 'image' && safeImage) backgroundImage = safeImage;
    return `background-color:${color};background-image:${backgroundImage};background-size:${this.attr(style?.['backgroundSize'] || 'cover')};background-position:${this.attr(style?.['backgroundPosition'] || 'center')};background-repeat:${this.attr(style?.['backgroundRepeat'] || 'no-repeat')};`;
  }

  private readPinnedElements(): string[] {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('brain-techno-editor-pinned-elements') : null;
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(value => typeof value === 'string') : [];
    } catch {
      return [];
    }
  }

  private savePinnedElements(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('brain-techno-editor-pinned-elements', JSON.stringify(Array.from(this.pinnedElementTypes)));
      }
    } catch {
      // Local storage may be unavailable in privacy-restricted browsers.
    }
  }

  private css(value: any, fallback: string): string {
    return String(value ?? fallback);
  }

  private cssPx(value: any, fallback: number): string {
    const n = Number(value);
    return Number.isFinite(n) ? `${n}px` : `${fallback}px`;
  }

  private escape(value: any): string {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  private attr(value: any): string {
    return this.escape(value);
  }

  private nl2br(value: string): string {
    return value.replace(/\r?\n/g, '<br>');
  }
}
