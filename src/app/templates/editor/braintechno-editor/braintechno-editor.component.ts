import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
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
import { EditorBlock, ElementPreset, MediaItem } from './models/editor-block.model';
import { createNavbarBlock, createNavbarMenuItem } from './elements/navbar/navbar-factory';
import { NavbarEditorComponent } from './elements/navbar/navbar-editor.component';
import { renderNavbarBlock } from './elements/navbar/navbar.renderer';
import { ELEMENT_PRESETS } from './registry/element-presets';
import { ElementEditorContext } from './models/element-editor-context.model';
import { createSectionBlock } from './elements/section/section.factory';
import { renderSectionBlock } from './elements/section/section.renderer';
import { SectionEditorComponent } from './elements/section/section-editor.component';
import { createBlockBlock } from './elements/block/block.factory';
import { renderBlockBlock } from './elements/block/block.renderer';
import { BlockEditorComponent } from './elements/block/block-editor.component';
import { createHeadingBlock } from './elements/heading/heading.factory';
import { renderHeadingBlock } from './elements/heading/heading.renderer';
import { HeadingEditorComponent } from './elements/heading/heading-editor.component';
import { createTextBlock } from './elements/text/text.factory';
import { renderTextBlock } from './elements/text/text.renderer';
import { TextEditorComponent } from './elements/text/text-editor.component';
import { createLinkBlock } from './elements/link/link.factory';
import { renderLinkBlock } from './elements/link/link.renderer';
import { LinkEditorComponent } from './elements/link/link-editor.component';
import { createImageBlock } from './elements/image/image.factory';
import { renderImageBlock } from './elements/image/image.renderer';
import { ImageEditorComponent } from './elements/image/image-editor.component';
import { createVideoBlock } from './elements/video/video.factory';
import { renderVideoBlock } from './elements/video/video.renderer';
import { VideoEditorComponent } from './elements/video/video-editor.component';
import { createSliderBlock } from './elements/slider/slider.factory';
import { renderSliderBlock } from './elements/slider/slider.renderer';
import { SliderEditorComponent } from './elements/slider/slider-editor.component';
import { createGalleryBlock } from './elements/gallery/gallery.factory';
import { renderGalleryBlock } from './elements/gallery/gallery.renderer';
import { GalleryEditorComponent } from './elements/gallery/gallery-editor.component';
import { createButtonBlock } from './elements/button/button.factory';
import { renderButtonBlock } from './elements/button/button.renderer';
import { ButtonEditorComponent } from './elements/button/button-editor.component';
import { createIconBlock } from './elements/icon/icon.factory';
import { renderIconBlock } from './elements/icon/icon.renderer';
import { IconEditorComponent } from './elements/icon/icon-editor.component';
import { createSocialBlock } from './elements/social/social.factory';
import { renderSocialBlock } from './elements/social/social.renderer';
import { SocialEditorComponent } from './elements/social/social-editor.component';
import { createProductBlock } from './elements/product/product.factory';
import { renderProductBlock } from './elements/product/product.renderer';
import { ProductEditorComponent } from './elements/product/product-editor.component';
import { createOfferBlock } from './elements/offer/offer.factory';
import { renderOfferBlock } from './elements/offer/offer.renderer';
import { OfferEditorComponent } from './elements/offer/offer-editor.component';
import { createHtmlBlock } from './elements/html/html.factory';
import { renderHtmlBlock } from './elements/html/html.renderer';
import { HtmlEditorComponent } from './elements/html/html-editor.component';
import { createFormBlock } from './elements/form/form.factory';
import { renderFormBlock } from './elements/form/form.renderer';
import { FormEditorComponent } from './elements/form/form-editor.component';
import { createContactBlock } from './elements/contact/contact.factory';
import { renderContactBlock } from './elements/contact/contact.renderer';
import { ContactEditorComponent } from './elements/contact/contact-editor.component';
import { createWhatsappBlock } from './elements/whatsapp/whatsapp.factory';
import { renderWhatsappBlock } from './elements/whatsapp/whatsapp.renderer';
import { WhatsappEditorComponent } from './elements/whatsapp/whatsapp-editor.component';
import { createMapBlock } from './elements/map/map.factory';
import { renderMapBlock } from './elements/map/map.renderer';
import { MapEditorComponent } from './elements/map/map-editor.component';
import { createScannerBlock } from './elements/scanner/scanner.factory';
import { renderScannerBlock } from './elements/scanner/scanner.renderer';
import { ScannerEditorComponent } from './elements/scanner/scanner-editor.component';
import { createTimerBlock } from './elements/timer/timer.factory';
import { renderTimerBlock } from './elements/timer/timer.renderer';
import { TimerEditorComponent } from './elements/timer/timer-editor.component';
import { createCounterBlock } from './elements/counter/counter.factory';
import { renderCounterBlock } from './elements/counter/counter.renderer';
import { CounterEditorComponent } from './elements/counter/counter-editor.component';
import { createRatingBlock } from './elements/rating/rating.factory';
import { renderRatingBlock } from './elements/rating/rating.renderer';
import { RatingEditorComponent } from './elements/rating/rating-editor.component';
import { createChartBlock } from './elements/chart/chart.factory';
import { renderChartBlock } from './elements/chart/chart.renderer';
import { ChartEditorComponent } from './elements/chart/chart-editor.component';
import { createMediaBlock } from './elements/media/media.factory';
import { renderMediaBlock } from './elements/media/media.renderer';
import { MediaEditorComponent } from './elements/media/media-editor.component';
import { createHeroBlock } from './elements/hero/hero.factory';
import { renderHeroBlock } from './elements/hero/hero.renderer';
import { HeroEditorComponent } from './elements/hero/hero-editor.component';
import { createServicesBlock } from './elements/services/services.factory';
import { renderServicesBlock } from './elements/services/services.renderer';
import { ServicesEditorComponent } from './elements/services/services-editor.component';
import { createTestimonialBlock } from './elements/testimonial/testimonial.factory';
import { renderTestimonialBlock } from './elements/testimonial/testimonial.renderer';
import { TestimonialEditorComponent } from './elements/testimonial/testimonial-editor.component';
import { createPricingBlock } from './elements/pricing/pricing.factory';
import { renderPricingBlock } from './elements/pricing/pricing.renderer';
import { PricingEditorComponent } from './elements/pricing/pricing-editor.component';
import { createFaqBlock } from './elements/faq/faq.factory';
import { renderFaqBlock } from './elements/faq/faq.renderer';
import { FaqEditorComponent } from './elements/faq/faq-editor.component';
import { createStatsBlock } from './elements/stats/stats.factory';
import { renderStatsBlock } from './elements/stats/stats.renderer';
import { StatsEditorComponent } from './elements/stats/stats-editor.component';
import { createTabsBlock } from './elements/tabs/tabs.factory';
import { renderTabsBlock } from './elements/tabs/tabs.renderer';
import { TabsEditorComponent } from './elements/tabs/tabs-editor.component';
import { repeatTabsItemTemplate } from './elements/tabs/tabs.repeat';
import { createTimelineBlock } from './elements/timeline/timeline.factory';
import { renderTimelineBlock } from './elements/timeline/timeline.renderer';
import { TimelineEditorComponent } from './elements/timeline/timeline-editor.component';
import { createTeamBlock } from './elements/team/team.factory';
import { renderTeamBlock } from './elements/team/team.renderer';
import { TeamEditorComponent } from './elements/team/team-editor.component';
import { createFooterBlock } from './elements/footer/footer.factory';
import { renderFooterBlock } from './elements/footer/footer.renderer';
import { FooterEditorComponent } from './elements/footer/footer-editor.component';
import { createPopupBlock } from './elements/popup/popup.factory';
import { renderPopupBlock } from './elements/popup/popup.renderer';
import { PopupEditorComponent } from './elements/popup/popup-editor.component';
import { createFloatingBlock } from './elements/floating/floating.factory';
import { renderFloatingBlock } from './elements/floating/floating.renderer';
import { FloatingEditorComponent } from './elements/floating/floating-editor.component';
import { createDividerBlock } from './elements/divider/divider.factory';
import { renderDividerBlock } from './elements/divider/divider.renderer';
import { DividerEditorComponent } from './elements/divider/divider-editor.component';
import { createSpacerBlock } from './elements/spacer/spacer.factory';
import { renderSpacerBlock } from './elements/spacer/spacer.renderer';
import { SpacerEditorComponent } from './elements/spacer/spacer-editor.component';
import { repeatButtonItemTemplate } from './elements/button/button.repeat';
import { repeatChartItemTemplate } from './elements/chart/chart.repeat';
import { repeatContactItemTemplate } from './elements/contact/contact.repeat';
import { repeatCounterItemTemplate } from './elements/counter/counter.repeat';
import { repeatFaqItemTemplate } from './elements/faq/faq.repeat';
import { repeatFloatingItemTemplate } from './elements/floating/floating.repeat';
import { repeatIconItemTemplate } from './elements/icon/icon.repeat';
import { repeatOfferItemTemplate } from './elements/offer/offer.repeat';
import { repeatPricingItemTemplate } from './elements/pricing/pricing.repeat';
import { repeatProductItemTemplate } from './elements/product/product.repeat';
import { repeatRatingItemTemplate } from './elements/rating/rating.repeat';
import { repeatServicesItemTemplate } from './elements/services/services.repeat';
import { repeatSocialItemTemplate } from './elements/social/social.repeat';
import { repeatStatsItemTemplate } from './elements/stats/stats.repeat';
import { repeatTeamItemTemplate } from './elements/team/team.repeat';
import { repeatTestimonialItemTemplate } from './elements/testimonial/testimonial.repeat';
import { repeatTimelineItemTemplate } from './elements/timeline/timeline.repeat';


interface EditorDesign {
  schemaVersion: number;
  counters: Record<string, number>;
  body: {
    rows: EditorBlock[];
    values: Record<string, any>;
  };
}


@Component({
  selector: 'bt-braintechno-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MediaPickerComponent, NavbarEditorComponent, SectionEditorComponent, BlockEditorComponent, HeadingEditorComponent, TextEditorComponent, LinkEditorComponent, ImageEditorComponent, VideoEditorComponent, SliderEditorComponent, GalleryEditorComponent, ButtonEditorComponent, IconEditorComponent, SocialEditorComponent, ProductEditorComponent, OfferEditorComponent, HtmlEditorComponent, FormEditorComponent, ContactEditorComponent, WhatsappEditorComponent, MapEditorComponent, ScannerEditorComponent, TimerEditorComponent, CounterEditorComponent, RatingEditorComponent, ChartEditorComponent, MediaEditorComponent, HeroEditorComponent, ServicesEditorComponent, TestimonialEditorComponent, PricingEditorComponent, FaqEditorComponent, StatsEditorComponent, TabsEditorComponent, TimelineEditorComponent, TeamEditorComponent, FooterEditorComponent, PopupEditorComponent, FloatingEditorComponent, DividerEditorComponent, SpacerEditorComponent],
  templateUrl: './braintechno-editor.component.html',
  styleUrls: ['./braintechno-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BraintechnoEditorComponent implements OnChanges, OnDestroy {
  @Input() design: unknown;
  @Output() readonly ready = new EventEmitter<void>();
  @Output() readonly changed = new EventEmitter<void>();

  constructor(private readonly sanitizer: DomSanitizer) { }

  private readonly catalog = inject(ElementCatalogService);

  readonly materialIconCategories = MATERIAL_ICON_CATEGORIES;
  readonly materialIconList = MATERIAL_ICON_LIST;
  readonly elementContext: ElementEditorContext = this as any;

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

  readonly presets = ELEMENT_PRESETS;

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
    const options = this.presets[type] || [];

    // Tabs has its own complete 15-style catalog.
    // Do not let global preset visibility rules hide styles with shared keys.
    if (type === 'tabs' || type === 'navbar') {
      return options;
    }

    return options.filter(preset => !this.catalog.isHiddenPreset(preset.key));
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

  onPreviewClick(event: MouseEvent, block: EditorBlock): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (block.type === 'tabs') {
      const tab = target.closest<HTMLElement>('[data-tab-btn]');
      if (tab) {
        event.preventDefault();
        event.stopPropagation();
        const root = tab.closest<HTMLElement>('[data-bt-tabs], .bt-tabs');
        if (!root) return;
        const index = Number(tab.getAttribute('data-tab-btn'));
        if (!Number.isInteger(index)) return;
        this.pushHistory();
        block.content['active'] = index;
        this.commitChange();
        return;
      }
    }

    if (block.type === 'floating') {
      const toggle = target.closest<HTMLElement>('[data-floating-toggle]');
      if (toggle) {
        event.preventDefault();
        event.stopPropagation();
        const current = block.content['openState'] === true;
        this.pushHistory();
        block.content['openState'] = !current;
        this.commitChange();
        return;
      }

      const action = target.closest<HTMLElement>('[data-floating-action]');
      if (action) {
        // Floating actions must not navigate or execute customer actions while editing.
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
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
      case 'services': return repeatServicesItemTemplate(this, index, key);
      case 'testimonial': return repeatTestimonialItemTemplate(this, index, key);
      case 'pricing': return repeatPricingItemTemplate(this, index, key);
      case 'faq': return repeatFaqItemTemplate(this, index, key);
      case 'stats': return repeatStatsItemTemplate(this, index, key);
      case 'tabs': return repeatTabsItemTemplate(this, index, key);
      case 'timeline': return repeatTimelineItemTemplate(this, index, key);
      case 'team': return repeatTeamItemTemplate(this, index, key);
      case 'button': return repeatButtonItemTemplate(this, index, key);
      case 'icon': return repeatIconItemTemplate(this, index, key);
      case 'social': return repeatSocialItemTemplate(this, index, key);
      case 'navbar': return createNavbarMenuItem(index);
      case 'product': return repeatProductItemTemplate(this, index, key);
      case 'offer': return repeatOfferItemTemplate(this, index, key);
      case 'contact': return repeatContactItemTemplate(this, index, key);
      case 'floating': return repeatFloatingItemTemplate(this, index, key);
      case 'counter': return repeatCounterItemTemplate(this, index, key);
      case 'chart': return repeatChartItemTemplate(this, index, key);
      case 'rating': return repeatRatingItemTemplate(this, index, key);
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
    if (block.type === 'timeline') {
      block.content['variant'] = variant;
      const timelineKeys = [
        'showTitle', 'showSubtitle', 'showDates', 'showIcons',
        'showImages', 'showBadges', 'showButtons', 'showStatus'
      ];
      for (const key of timelineKeys) {
        if (key in fresh.content) block.content[key] = this.clone(fresh.content[key]);
      }
    }
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
      case 'section': return createSectionBlock(this, base, variant);
      case 'block': return createBlockBlock(this, base, variant);
      case 'heading': return createHeadingBlock(this, base, variant);
      case 'text': return createTextBlock(this, base, variant);
      case 'link': return createLinkBlock(this.uid('link'), variant);
      case 'image': return createImageBlock(this.uid('image'), variant);
      case 'video': return createVideoBlock(this.uid('video'), variant);
      case 'slider': return createSliderBlock(this.uid('slider'), variant);
      case 'gallery': return createGalleryBlock(this, base, variant);
      case 'button': return createButtonBlock(this, base, variant);
      case 'icon': return createIconBlock(this, base, variant);
      case 'social': return createSocialBlock(this, base, variant);
      case 'product': return createProductBlock(this, base, variant);
      case 'offer': return createOfferBlock(this, base, variant);
      case 'html': return createHtmlBlock(this, base, variant);
      case 'form': return createFormBlock(this, base, variant);
      case 'contact': return createContactBlock(this, base, variant);
      case 'whatsapp': return createWhatsappBlock(this, base, variant);
      case 'map': return createMapBlock(this, base, variant);
      case 'scanner': return createScannerBlock(this, base, variant);
      case 'timer': return createTimerBlock(this, base, variant);
      case 'counter': return createCounterBlock(this, base, variant);
      case 'rating': return createRatingBlock(this, base, variant);
      case 'chart': return createChartBlock(this, base, variant);
      case 'media': return createMediaBlock(this, base, variant);
      case 'navbar': return createNavbarBlock(base, variant);
      case 'hero': return createHeroBlock(this, base, variant);
      case 'services': return createServicesBlock(this, base, variant);
      case 'testimonial': return createTestimonialBlock(this, base, variant);
      case 'pricing': return createPricingBlock(this, base, variant);
      case 'faq': return createFaqBlock(this, base, variant);
      case 'stats': return createStatsBlock(this, base, variant);
      case 'tabs': return createTabsBlock(this, base, variant);
      case 'timeline': return createTimelineBlock(this, base, variant);
      case 'team': return createTeamBlock(this, base, variant);
      case 'footer': return createFooterBlock(this, base, variant);
      case 'popup': return createPopupBlock(this, base, variant);
      case 'floating': return createFloatingBlock(this, base, variant);
      case 'divider': return createDividerBlock(this, base, variant);
      case 'spacer': return createSpacerBlock(this, base, variant);
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



  private buildHtml(design: EditorDesign): string {
    const pageBg = design.body.values.backgroundColor || '#F5F7FA';
    const width = design.body.values.contentWidth || '760px';
    const sections = design.body.rows.map(block => this.renderBlock(block)).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BRAIN TECHNO</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0" rel="stylesheet"><style>html,body{margin:0;padding:0;background:${this.attr(pageBg)};font-family:Inter,'Noto Sans Bengali',Arial,sans-serif;color:#0F172A}*{box-sizing:border-box}.bt-page{width:100%;padding:24px 12px}.bt-container{max-width:${this.attr(width)};margin:0 auto}.bt-img{max-width:100%;display:block}.bt-btn{display:inline-block;text-decoration:none}.bt-grid{display:grid}.bt-card{border:1px solid #E2E8F0;overflow:hidden}.bt-muted{color:#64748B}.bt-form input,.bt-form textarea,.bt-form select{width:100%;padding:12px;border:1px solid #E2E8F0;border-radius:10px;margin:5px 0 10px;font:inherit}.bt-form-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0 12px}.bt-form-field--full{grid-column:span 6}.bt-form-field--half{grid-column:span 3}.bt-form-field--third{grid-column:span 2}.bt-choice-list{display:grid;gap:8px;margin:7px 0 12px}.bt-choice-list label,.bt-choice{display:flex;gap:8px;align-items:center}.bt-choice-list input,.bt-choice input{width:auto;margin:0}.bt-rating-stars{display:flex;justify-content:center;gap:4px;margin:8px 0 16px;flex-direction:row-reverse}.bt-rating-stars input{position:absolute;opacity:0;pointer-events:none}.bt-rating-stars span{font-size:38px;color:#CBD5E1;cursor:pointer}.bt-rating-stars label:hover span,.bt-rating-stars label:hover~label span,.bt-rating-stars input:checked~span,.bt-rating-stars label:has(input:checked)~label span{color:#F59E0B}.bt-powered{max-width:760px;margin:0 auto;padding:18px 12px 28px;text-align:center;font-size:12px;font-weight:700;letter-spacing:.04em;color:#64748B}.bt-form button{border:0;cursor:pointer}.material-symbols-rounded{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}.bt-social{display:flex;gap:10px;flex-wrap:wrap}.bt-social a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.bt-slider{position:relative;overflow:hidden}.bt-slider img{width:100%;height:100%;object-fit:cover;display:none}.bt-slider img.is-active{display:block}.bt-timer-units{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.bt-timer-unit{min-width:72px;padding:12px;border:1px solid #E2E8F0;border-radius:12px}.bt-chart-bars{display:flex;align-items:flex-end;gap:10px;height:180px}.bt-chart-bar{flex:1;min-width:0;text-align:center}.bt-chart-bar i{display:block;width:100%;background:#FF4D6D;border-radius:8px 8px 3px 3px}.bt-media-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}.bt-tabs>button{border:0;background:transparent;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer;border-bottom:2px solid transparent}.bt-tabs>button.is-active{color:#FF4D6D;border-bottom-color:#FF4D6D}@media(max-width:600px){.bt-page{padding:12px 8px}.bt-responsive-grid{grid-template-columns:1fr!important}.bt-form-field--half,.bt-form-field--third{grid-column:span 6}}</style></head><body><main class="bt-page"><div class="bt-container">${sections}</div></main><footer class="bt-powered">Proudly Powered by BRAIN TECHNO</footer>${this.exportRuntimeScript()}</body></html>`;
  }

  private renderBlock(block: EditorBlock): string {
    const c = block.content || {};
    const s = block.style || {};
    const common = `${this.exportBackgroundStyle(s)}padding:${this.cssPx(s.padding, 24)};margin-top:${this.cssPx(s.marginTop, 0)};margin-bottom:${this.cssPx(s.marginBottom, 0)};text-align:${this.css(s.align, 'left')};border-radius:${this.cssPx(s.radius, 0)};color:${this.css(s.color, '#0F172A')};border:${Number(s.borderWidth) || 0}px ${this.css(s.borderStyle, 'solid')} ${this.css(s.borderColor, '#E2E8F0')};box-shadow:${this.shadowCss(s.shadow)};font-family:${this.css(s.fontFamily, 'Inter,Arial,sans-serif')};font-style:${this.css(s.fontStyle, 'normal')};letter-spacing:${Number(s.letterSpacing) || 0}px;text-decoration:${s.underline ? 'underline ' : ''}${s.strike ? 'line-through' : ''};`;

    switch (block.type) {
      case 'section': return renderSectionBlock(this, block, common);
      case 'block': return renderBlockBlock(this, block, common);
      case 'heading': return renderHeadingBlock(this, block, common);
      case 'text': return renderTextBlock(this, block, common);
      case 'link': return renderLinkBlock(this, block, common);
      case 'image': return renderImageBlock(this, block, common);
      case 'video': return renderVideoBlock(this, block, common);
      case 'slider': return renderSliderBlock(this, block, common);
      case 'gallery': return renderGalleryBlock(this, block, common);
      case 'button': return renderButtonBlock(this, block, common);
      case 'icon': return renderIconBlock(this, block, common);
      case 'social': return renderSocialBlock(this, block, common);
      case 'product': return renderProductBlock(this, block, common);
      case 'offer': return renderOfferBlock(this, block, common);
      case 'html': return renderHtmlBlock(this, block, common);
      case 'form': return renderFormBlock(this, block, common);
      case 'contact': return renderContactBlock(this, block, common);
      case 'whatsapp': return renderWhatsappBlock(this, block, common);
      case 'map': return renderMapBlock(this, block, common);
      case 'scanner': return renderScannerBlock(this, block, common);
      case 'timer': return renderTimerBlock(this, block, common);
      case 'counter': return renderCounterBlock(this, block, common);
      case 'rating': return renderRatingBlock(this, block, common);
      case 'chart': return renderChartBlock(this, block, common);
      case 'media': return renderMediaBlock(this, block, common);
      case 'navbar': return renderNavbarBlock(block, common, { escape: (value) => this.escape(value), attr: (value) => this.attr(value) });
      case 'hero': return renderHeroBlock(this, block, common);
      case 'services': return renderServicesBlock(this, block, common);
      case 'testimonial': return renderTestimonialBlock(this, block, common);
      case 'pricing': return renderPricingBlock(this, block, common);
      case 'faq': return renderFaqBlock(this, block, common);
      case 'stats': return renderStatsBlock(this, block, common);
      case 'tabs': return renderTabsBlock(this, block, common);
      case 'timeline': return renderTimelineBlock(this, block, common);
      case 'team': return renderTeamBlock(this, block, common);
      case 'footer': return renderFooterBlock(this, block, common);
      case 'popup': return renderPopupBlock(this, block, common);
      case 'floating': return renderFloatingBlock(this, block, common);
      case 'divider': return renderDividerBlock(this, block, common);
      case 'spacer': return renderSpacerBlock(this, block, common);
      default: return '';
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
