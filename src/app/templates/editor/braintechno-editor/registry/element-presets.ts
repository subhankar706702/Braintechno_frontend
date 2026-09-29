import { ElementPreset } from '../models/editor-block.model';
import { SECTION_PRESETS } from './elements/section.presets';
import { BLOCK_PRESETS } from './elements/block.presets';
import { HEADING_PRESETS } from './elements/heading.presets';
import { TEXT_PRESETS } from './elements/text.presets';
import { LINK_PRESETS } from './elements/link.presets';
import { IMAGE_PRESETS } from './elements/image.presets';
import { VIDEO_PRESETS } from './elements/video.presets';
import { SLIDER_PRESETS } from './elements/slider.presets';
import { GALLERY_PRESETS } from './elements/gallery.presets';
import { BUTTON_PRESETS } from './elements/button.presets';
import { ICON_PRESETS } from './elements/icon.presets';
import { SOCIAL_PRESETS } from './elements/social.presets';
import { PRODUCT_PRESETS } from './elements/product.presets';
import { OFFER_PRESETS } from './elements/offer.presets';
import { ECOMMERCE_PRESETS } from './elements/ecommerce.presets';
import { TEMPLATE_PRESETS } from './elements/template.presets';
import { HTML_PRESETS } from './elements/html.presets';
import { FORM_PRESETS } from './elements/form.presets';
import { CONTACT_PRESETS } from './elements/contact.presets';
import { WHATSAPP_PRESETS } from './elements/whatsapp.presets';
import { MAP_PRESETS } from './elements/map.presets';
import { SCANNER_PRESETS } from './elements/scanner.presets';
import { TIMER_PRESETS } from './elements/timer.presets';
import { COUNTER_PRESETS } from './elements/counter.presets';
import { CHART_PRESETS } from './elements/chart.presets';
import { MEDIA_PRESETS } from './elements/media.presets';
import { HERO_PRESETS } from './elements/hero.presets';
import { SERVICES_PRESETS } from './elements/services.presets';
import { TESTIMONIAL_PRESETS } from './elements/testimonial.presets';
import { PRICING_PRESETS } from './elements/pricing.presets';
  import { FAQ_PRESETS } from './elements/faq.presets';
import { TABS_PRESETS } from './elements/tabs.presets';
import { TIMELINE_PRESETS } from './elements/timeline.presets';
import { TEAM_PRESETS } from './elements/team.presets';
import { FOOTER_PRESETS } from './elements/footer.presets';
import { POPUP_PRESETS } from './elements/popup.presets';
import { FLOATING_PRESETS } from './elements/floating.presets';
import { DIVIDER_PRESETS } from './elements/divider.presets';
import { SPACER_PRESETS } from './elements/spacer.presets';
import { NAVBAR_PRESETS } from './navbar-presets';
import { STATS_PRESETS } from '../elements/stats/stats.repeat';

export const ELEMENT_PRESETS: Record<string, ElementPreset[]> = {
  section: SECTION_PRESETS,
  block: BLOCK_PRESETS,
  heading: HEADING_PRESETS,
  navbar: NAVBAR_PRESETS,
  text: TEXT_PRESETS,
  link: LINK_PRESETS,
  image: IMAGE_PRESETS,
  video: VIDEO_PRESETS,
  slider: SLIDER_PRESETS,
  gallery: GALLERY_PRESETS,
  button: BUTTON_PRESETS,
  icon: ICON_PRESETS,
  social: SOCIAL_PRESETS,
  product: PRODUCT_PRESETS,
  offer: OFFER_PRESETS,
  ecommerce: ECOMMERCE_PRESETS,
  template: TEMPLATE_PRESETS,
  html: HTML_PRESETS,
  form: FORM_PRESETS,
  contact: CONTACT_PRESETS,
  whatsapp: WHATSAPP_PRESETS,
  map: MAP_PRESETS,
  scanner: SCANNER_PRESETS,
  timer: TIMER_PRESETS,
  counter: COUNTER_PRESETS,
  chart: CHART_PRESETS,
  media: MEDIA_PRESETS,
  hero: HERO_PRESETS,
  services: SERVICES_PRESETS,
  testimonial: TESTIMONIAL_PRESETS,
  pricing: PRICING_PRESETS,
  faq: FAQ_PRESETS,
  stats: STATS_PRESETS,
  tabs: TABS_PRESETS,
  timeline: TIMELINE_PRESETS,
  team: TEAM_PRESETS,
  footer: FOOTER_PRESETS,
  popup: POPUP_PRESETS,
  floating: FLOATING_PRESETS,
  divider: DIVIDER_PRESETS,
  spacer: SPACER_PRESETS,
};
