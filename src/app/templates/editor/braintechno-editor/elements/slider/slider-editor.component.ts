import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ElementEditorContext } from '../../models/element-editor-context.model';
import { EditorBlock } from '../../models/editor-block.model';
import {
  createSliderAction,
  createSliderItem,
  SliderActionType,
  SliderButtonAction,
  SliderItem
} from './slider.repeat';

const MAX_SLIDES = 6;

@Component({
  selector: 'bt-slider-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './slider-editor.component.html',
  styleUrls: ['./slider-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SliderEditorComponent implements OnInit {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  readonly maxSlides = MAX_SLIDES;
  readonly actionTypes: Array<{ value: SliderActionType; label: string }> = [
    { value: 'none', label: 'No Action' },
    { value: 'website', label: 'Website URL' },
    { value: 'section', label: 'Section Anchor' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'download', label: 'Download' }
  ];

  ngOnInit(): void {
    this.normalizeSlides();
  }

  get slides(): SliderItem[] {
    this.normalizeSlides();
    return this.block.content['items'] as SliderItem[];
  }

  get canAddSlide(): boolean {
    return this.slides.length < MAX_SLIDES;
  }

  update(): void {
    this.normalizeSlides();
    this.syncLegacyImages();
    this.context.updateSelected();
  }

  setIntervalSeconds(value: any): void {
    const seconds = Math.max(1, Math.min(60, Number(value) || 1));
    this.block.content['interval'] = seconds * 1000;
    this.update();
  }

  addSlide(): void {
    const slides = this.slides;
    if (slides.length >= MAX_SLIDES) return;
    slides.push(createSliderItem(slides.length));
    this.update();
  }

  removeSlide(index: number): void {
    const slides = this.slides;
    if (slides.length <= 1 || index < 0 || index >= slides.length) return;
    slides.splice(index, 1);
    this.reindexSlides();
    this.update();
  }

  moveSlide(index: number, direction: -1 | 1): void {
    const slides = this.slides;
    const target = index + direction;
    if (index < 0 || target < 0 || target >= slides.length) return;
    [slides[index], slides[target]] = [slides[target], slides[index]];
    this.reindexSlides();
    this.update();
  }

  chooseSlideImage(index: number): void {
    const slide = this.slides[index];
    if (!slide) return;
    this.context.openMediaPicker(
      slide as unknown as Record<string, any>,
      'image',
      'mediaId',
      `Choose image for Slide ${index + 1}`
    );
  }

  chooseImages(): void {
    const ctx = this.context as any;
    if (typeof ctx.openMultipleMediaPicker !== 'function') return;
    ctx.openMultipleMediaPicker(
      this.block.content,
      'images',
      'mediaIds',
      'Choose slider images',
      MAX_SLIDES
    );
  }

  clearSlideImage(index: number): void {
    const slide = this.slides[index];
    if (!slide) return;
    slide.image = '';
    slide.mediaId = null;
    this.update();
  }

  setActionType(index: number, type: SliderActionType): void {
    const slide = this.slides[index];
    if (!slide) return;
    const current = this.ensureAction(slide);
    const legacyUrl = slide.buttonUrl;
    const legacyTarget = slide.target;
    slide.buttonAction = {
      ...createSliderAction(),
      ...current,
      type
    };

    if (type === 'website' && !slide.buttonAction.url && legacyUrl && legacyUrl !== '#') {
      slide.buttonAction.url = legacyUrl;
      slide.buttonAction.target = legacyTarget;
    }
    this.update();
  }

  setActionValue(index: number, field: keyof SliderButtonAction, value: any): void {
    const slide = this.slides[index];
    if (!slide) return;
    const action = this.ensureAction(slide);
    (action as any)[field] = value;
    slide.buttonAction = action;

    if (field === 'url') slide.buttonUrl = String(value || '#');
    if (field === 'target') slide.target = value === '_blank' ? '_blank' : '_self';

    this.update();
  }

  ensureAction(slide: SliderItem): SliderButtonAction {
    const action = slide.buttonAction && typeof slide.buttonAction === 'object'
      ? slide.buttonAction
      : createSliderAction();

    if ((!action.type || action.type === 'none') && slide.buttonUrl && slide.buttonUrl !== '#') {
      action.type = 'website';
      action.url = slide.buttonUrl;
      action.target = slide.target || '_self';
    }

    slide.buttonAction = { ...createSliderAction(), ...action };
    return slide.buttonAction;
  }

  actionLabel(type: string): string {
    return this.actionTypes.find(item => item.value === type)?.label || 'No Action';
  }

  trackByIndex(index: number): number {
    return index;
  }

  private normalizeSlides(): void {
    if (!this.block?.content) return;

    let slides: SliderItem[] = Array.isArray(this.block.content['items'])
      ? this.block.content['items']
      : [];
    const legacyImages: string[] = Array.isArray(this.block.content['images'])
      ? this.block.content['images'].slice(0, MAX_SLIDES).map((v: any) => String(v || ''))
      : [];

    const count = Math.max(1, Math.min(MAX_SLIDES, Math.max(slides.length, legacyImages.length, 1)));
    while (slides.length < count) slides.push(createSliderItem(slides.length));
    slides = slides.slice(0, MAX_SLIDES);

    slides.forEach((slide, index) => {
      if (!slide || typeof slide !== 'object') slides[index] = createSliderItem(index);
      const item = slides[index];
      item.image = String(item.image || legacyImages[index] || '');
      item.mediaId = item.mediaId ?? null;
      item.alt = String(item.alt || `Slide ${index + 1}`);
      item.eyebrow = String(item.eyebrow || '');
      item.badge = String(item.badge || '');
      item.title = String(item.title || '');
      if (!item.subtitle && item.description) {
        item.subtitle = String(item.description);
        item.description = '';
      } else {
        item.subtitle = String(item.subtitle || '');
        item.description = String(item.description || '');
      }
      item.showButton = item.showButton !== false;
      item.buttonText = String(item.buttonText || '');
      item.buttonStyle = String(item.buttonStyle || 'primary');
      item.buttonIcon = String(item.buttonIcon || '');
      item.buttonUrl = String(item.buttonUrl || '#');
      item.target = item.target === '_blank' ? '_blank' : '_self';
      this.ensureAction(item);
    });

    this.block.content['items'] = slides;
    this.block.content['images'] = slides.map(item => item.image || '');
    this.block.content['mediaIds'] = slides.map(item => item.mediaId ?? null);
    this.block.content['maxSlides'] = MAX_SLIDES;
  }

  private syncLegacyImages(): void {
    const slides = this.slides;
    this.block.content['images'] = slides.map(item => item.image || '');
    this.block.content['mediaIds'] = slides.map(item => item.mediaId ?? null);
  }

  private reindexSlides(): void {
    this.slides.forEach((slide, index) => {
      if (!slide.alt || /^Slide\s+\d+$/i.test(slide.alt)) slide.alt = `Slide ${index + 1}`;
    });
  }
}
