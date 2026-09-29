import { ElementPreset } from '../models/editor-block.model';
import { SECTION_PRESETS } from '../elements/section/section.presets';
import { BLOCK_PRESETS } from '../elements/block/block.presets';
import { HEADING_PRESETS } from '../elements/heading/heading.presets';
import { TEXT_PRESETS } from '../elements/text/text.presets';
import { LINK_PRESETS } from '../elements/link/link.presets';
import { IMAGE_PRESETS } from '../elements/image/image.presets';
import { VIDEO_PRESETS } from '../elements/video/video.presets';
import { SLIDER_PRESETS } from '../elements/slider/slider.presets';
import { GALLERY_PRESETS } from '../elements/gallery/gallery.presets';
import { BUTTON_PRESETS } from '../elements/button/button.presets';
import { ICON_PRESETS } from '../elements/icon/icon.presets';
import { SOCIAL_PRESETS } from '../elements/social/social.presets';
import { PRODUCT_PRESETS } from '../elements/product/product.presets';
import { OFFER_PRESETS } from '../elements/offer/offer.presets';
import { ECOMMERCE_PRESETS } from '../elements/ecommerce/ecommerce.presets';
import { TEMPLATE_PRESETS } from '../elements/template/template.presets';
import { HTML_PRESETS } from '../elements/html/html.presets';
import { FORM_PRESETS } from '../elements/form/form.presets';
import { CONTACT_PRESETS } from '../elements/contact/contact.presets';
import { WHATSAPP_PRESETS } from '../elements/whatsapp/whatsapp.presets';
import { MAP_PRESETS } from '../elements/map/map.presets';
import { SCANNER_PRESETS } from '../elements/scanner/scanner.presets';
import { TIMER_PRESETS } from '../elements/timer/timer.presets';
import { COUNTER_PRESETS } from '../elements/counter/counter.presets';
import { CHART_PRESETS } from '../elements/chart/chart.presets';
import { MEDIA_PRESETS } from '../elements/media/media.presets';
import { HERO_PRESETS } from '../elements/hero/hero.presets';
import { SERVICES_PRESETS } from '../elements/services/services.presets';
import { TESTIMONIAL_PRESETS } from '../elements/testimonial/testimonial.presets';
import { PRICING_PRESETS } from '../elements/pricing/pricing.presets';
import { FAQ_PRESETS } from '../elements/faq/faq.presets';
import { STATS_PRESETS } from '../elements/stats/stats.presets';
import { TABS_PRESETS } from '../elements/tabs/tabs.presets';
import { TIMELINE_PRESETS } from '../elements/timeline/timeline.presets';
import { TEAM_PRESETS } from '../elements/team/team.presets';
import { FOOTER_PRESETS } from '../elements/footer/footer.presets';
import { POPUP_PRESETS } from '../elements/popup/popup.presets';
import { FLOATING_PRESETS } from '../elements/floating/floating.presets';
import { DIVIDER_PRESETS } from '../elements/divider/divider.presets';
import { SPACER_PRESETS } from '../elements/spacer/spacer.presets';
import { NAVBAR_PRESETS } from '../elements/navbar/navbar.presets';

export const ELEMENT_PRESETS: Record<string, ElementPreset[]> = {
  section: SECTION_PRESETS,
  block: BLOCK_PRESETS,
  heading: HEADING_PRESETS,
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
  navbar: NAVBAR_PRESETS,
};
