import { EditorBlock } from '../../models/editor-block.model';

interface SliderSlide {
  image: string;
  mediaId?: string | number | null;
  alt: string;
  eyebrow: string;
  badge: string;
  title: string;
  description: string;
  subtitle: string;
  showButton: boolean;
  buttonText: string;
  buttonStyle: string;
  buttonIcon: string;
  buttonAction: {
    type: string;
    url: string;
    target: string;
    sectionId: string;
    phone: string;
    whatsapp: string;
    message: string;
    email: string;
    subject: string;
    fileUrl: string;
  };
  // legacy fields
  buttonUrl: string;
  target: string;
}

const VARIANTS = new Set([
  'hero', 'fullscreen', 'banner', 'card', 'split', 'center', 'fade', 'zoom', 'ken-burns',
  'parallax', 'coverflow', 'product', 'portfolio', 'testimonial', 'logos', 'vertical', 'thumbnail',
  'filmstrip', 'centered-cards', 'multi-card', 'editorial', 'polaroid', 'framed', 'minimal', 'dark',
  'gradient', 'glass', 'bordered', 'offer', 'story'
]);

function safeVariant(value: any): string {
  const key = String(value || 'hero');
  return VARIANTS.has(key) ? key : 'hero';
}

function num(value: any, fallback: number, min?: number, max?: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const lower = min === undefined ? n : Math.max(min, n);
  return max === undefined ? lower : Math.min(max, lower);
}

function px(value: any, fallback: number): string {
  return `${num(value, fallback)}px`;
}

function escapeText(parent: any, value: any): string {
  return parent.escape(String(value ?? ''));
}

function escapeAttr(parent: any, value: any): string {
  return parent.attr(String(value ?? ''));
}

function slidesFromContent(c: Record<string, any>): SliderSlide[] {
  const images = Array.isArray(c['images']) ? c['images'].slice(0, 6) : [];
  const rawItems = Array.isArray(c['items']) ? c['items'].slice(0, 6) : [];
  const count = Math.max(1, Math.min(6, Math.max(images.length, rawItems.length, 1)));

  return Array.from({ length: count }, (_, index) => {
    const item: any = rawItems[index] || {};
    const legacyUrl = String(item.buttonUrl || '#');
    const action = item.buttonAction && typeof item.buttonAction === 'object'
      ? item.buttonAction
      : {
          type: legacyUrl !== '#' ? 'website' : 'none',
          url: legacyUrl !== '#' ? legacyUrl : '',
          target: item.target === '_blank' ? '_blank' : '_self'
        };

    return {
      image: String(item.image || images[index] || '').trim(),
      mediaId: item.mediaId ?? null,
      alt: String(item.alt || `Slide ${index + 1}`),
      eyebrow: String(item.eyebrow || ''),
      badge: String(item.badge || ''),
      title: String(item.title || ''),
      description: String(item.description || ''),
      subtitle: String(item.subtitle || (item.description || '')),
      showButton: item.showButton !== false,
      buttonText: String(item.buttonText || ''),
      buttonStyle: String(item.buttonStyle || 'primary'),
      buttonIcon: String(item.buttonIcon || ''),
      buttonAction: {
        type: String(action.type || 'none'),
        url: String(action.url || ''),
        target: action.target === '_blank' ? '_blank' : '_self',
        sectionId: String(action.sectionId || ''),
        phone: String(action.phone || ''),
        whatsapp: String(action.whatsapp || ''),
        message: String(action.message || ''),
        email: String(action.email || ''),
        subject: String(action.subject || ''),
        fileUrl: String(action.fileUrl || '')
      },
      buttonUrl: legacyUrl,
      target: item.target === '_blank' ? '_blank' : '_self'
    };
  });
}

function buttonHref(slide: SliderSlide): { href: string; target: string; clickable: boolean } {
  const action = slide.buttonAction || ({} as any);
  switch (String(action.type || 'none')) {
    case 'website':
      return { href: action.url || '#', target: action.target === '_blank' ? '_blank' : '_self', clickable: !!action.url };
    case 'section':
      return { href: action.sectionId ? `#${String(action.sectionId).replace(/^#/, '')}` : '#', target: '_self', clickable: !!action.sectionId };
    case 'whatsapp': {
      const phone = String(action.whatsapp || '').replace(/[^0-9]/g, '');
      const text = encodeURIComponent(String(action.message || ''));
      return { href: phone ? `https://wa.me/${phone}${text ? `?text=${text}` : ''}` : '#', target: '_blank', clickable: !!phone };
    }
    case 'phone':
      return { href: action.phone ? `tel:${String(action.phone).trim()}` : '#', target: '_self', clickable: !!action.phone };
    case 'email': {
      const subject = action.subject ? `?subject=${encodeURIComponent(action.subject)}` : '';
      return { href: action.email ? `mailto:${String(action.email).trim()}${subject}` : '#', target: '_self', clickable: !!action.email };
    }
    case 'sms': {
      const body = action.message ? `?body=${encodeURIComponent(action.message)}` : '';
      return { href: action.phone ? `sms:${String(action.phone).trim()}${body}` : '#', target: '_self', clickable: !!action.phone };
    }
    case 'download':
      return { href: action.fileUrl || '#', target: action.target === '_blank' ? '_blank' : '_self', clickable: !!action.fileUrl };
    default:
      return { href: '#', target: '_self', clickable: false };
  }
}

function imageHtml(parent: any, slide: SliderSlide, c: Record<string, any>, index: number, variant: string): string {
  if (!slide.image) {
    return `<div class="bt-slider__empty"><span>Image ${index + 1}</span></div>`;
  }

  const fit = String(c['objectFit'] || (variant === 'logos' ? 'contain' : 'cover'));
  const position = String(c['objectPosition'] || 'center');
  const loading = c['lazyLoad'] === false && index === 0 ? 'eager' : 'lazy';
  return `<img class="bt-slider__image" src="${escapeAttr(parent, slide.image)}" alt="${escapeAttr(parent, slide.alt)}" loading="${loading}" style="object-fit:${escapeAttr(parent, fit)};object-position:${escapeAttr(parent, position)}">`;
}

function buttonClass(style: string): string {
  const safe = ['primary', 'outline', 'soft', 'pill', 'dark', 'link'].includes(style) ? style : 'primary';
  return `bt-slider__cta bt-slider__cta--${safe}`;
}

function textHtml(parent: any, slide: SliderSlide, c: Record<string, any>, options: { button?: boolean; quote?: boolean; chapter?: boolean } = {}): string {
  const parts: string[] = [];
  if (options.chapter) parts.push(`<span class="bt-slider__chapter">${escapeText(parent, slide.eyebrow || 'Story')}</span>`);
  else if (slide.eyebrow) parts.push(`<span class="bt-slider__eyebrow">${escapeText(parent, slide.eyebrow)}</span>`);
  if (slide.badge) parts.push(`<span class="bt-slider__badge">${escapeText(parent, slide.badge)}</span>`);
  if (slide.title && c['showCaption'] !== false) {
    parts.push(options.quote ? `<blockquote>${escapeText(parent, slide.title)}</blockquote>` : `<h3>${escapeText(parent, slide.title)}</h3>`);
  }
  if (slide.subtitle && c['showCaption'] !== false) {
    parts.push(`<div class="bt-slider__subtitle">${escapeText(parent, slide.subtitle)}</div>`);
  }
  if (slide.description && c['showCaption'] !== false) {
    parts.push(`<p>${escapeText(parent, slide.description)}</p>`);
  }
  const action = buttonHref(slide);
  if (options.button !== false && c['showButton'] !== false && slide.showButton !== false && slide.buttonText) {
    const icon = slide.buttonIcon ? `<span class="material-symbols-rounded" aria-hidden="true">${escapeText(parent, slide.buttonIcon)}</span>` : '';
    if (action.clickable) {
      parts.push(`<a class="${buttonClass(slide.buttonStyle)}" href="${escapeAttr(parent, action.href)}" target="${escapeAttr(parent, action.target)}" rel="${action.target === '_blank' ? 'noopener noreferrer' : ''}">${escapeText(parent, slide.buttonText)}${icon}</a>`);
    } else {
      parts.push(`<span class="${buttonClass(slide.buttonStyle)} is-disabled" aria-disabled="true">${escapeText(parent, slide.buttonText)}${icon}</span>`);
    }
  }
  return parts.length ? parts.join('') : '';
}

function slideMarkup(parent: any, slide: SliderSlide, c: Record<string, any>, variant: string, index: number): string {
  const media = imageHtml(parent, slide, c, index, variant);
  const overlayText = textHtml(parent, slide, c, { button: true });

  switch (variant) {
    case 'card':
      return `<div class="bt-slider__media">${media}</div><div class="bt-slider__card-copy">${overlayText}</div>`;
    case 'split':
      return `<div class="bt-slider__split-media">${media}</div><div class="bt-slider__split-copy">${overlayText}</div>`;
    case 'product':
      return `<div class="bt-slider__product-media">${media}</div><div class="bt-slider__product-copy"><span class="bt-slider__product-label">PRODUCT</span>${overlayText}</div>`;
    case 'portfolio':
      return `<div class="bt-slider__portfolio-media">${media}</div><div class="bt-slider__portfolio-copy">${overlayText}</div>`;
    case 'testimonial':
      return `<div class="bt-slider__testimonial-avatar">${media}</div><div class="bt-slider__testimonial-copy"><span class="bt-slider__quote-mark">“</span>${textHtml(parent, slide, c, { button: false, quote: true })}</div>`;
    case 'logos':
      return `<div class="bt-slider__logo-media">${media}</div>${slide.title ? `<div class="bt-slider__logo-label">${escapeText(parent, slide.title)}</div>` : ''}`;
    case 'editorial':
      return `<div class="bt-slider__editorial-number">${String(index + 1).padStart(2, '0')}</div><div class="bt-slider__editorial-media">${media}</div><div class="bt-slider__editorial-copy">${overlayText}</div>`;
    case 'polaroid':
      return `<div class="bt-slider__polaroid-photo">${media}</div><div class="bt-slider__polaroid-copy">${overlayText}</div>`;
    case 'offer':
      return `<div class="bt-slider__offer-media">${media}</div><div class="bt-slider__offer-copy">${textHtml(parent, slide, c, { button: true })}</div>`;
    case 'story':
      return `<div class="bt-slider__story-media">${media}</div><div class="bt-slider__story-copy">${textHtml(parent, slide, c, { button: true, chapter: true })}</div>`;
    case 'framed':
      return `<div class="bt-slider__frame-inner">${media}<div class="bt-slider__frame-copy">${overlayText}</div></div>`;
    case 'fullscreen':
      return `<div class="bt-slider__fullscreen-media">${media}</div><div class="bt-slider__fullscreen-copy">${overlayText}</div>`;
    case 'banner':
      return `<div class="bt-slider__banner-media">${media}</div><div class="bt-slider__banner-copy">${overlayText}</div>`;
    case 'center':
      return `<div class="bt-slider__center-media">${media}</div><div class="bt-slider__center-copy">${overlayText}</div>`;
    case 'fade':
      return `<div class="bt-slider__fade-media">${media}</div><div class="bt-slider__fade-copy">${overlayText}</div>`;
    case 'zoom':
      return `<div class="bt-slider__zoom-media">${media}</div><div class="bt-slider__zoom-copy">${overlayText}</div>`;
    case 'ken-burns':
      return `<div class="bt-slider__ken-media">${media}</div><div class="bt-slider__ken-copy">${overlayText}</div>`;
    case 'parallax':
      return `<div class="bt-slider__parallax-media">${media}</div><div class="bt-slider__parallax-copy">${overlayText}</div>`;
    case 'coverflow':
      return `<div class="bt-slider__coverflow-media">${media}</div><div class="bt-slider__coverflow-copy">${overlayText}</div>`;
    case 'vertical':
      return `<div class="bt-slider__vertical-media">${media}</div><div class="bt-slider__vertical-copy">${overlayText}</div>`;
    case 'thumbnail':
      return `<div class="bt-slider__thumb-main">${media}</div><div class="bt-slider__thumb-copy">${overlayText}</div>`;
    case 'filmstrip':
      return `<div class="bt-slider__film-main">${media}</div><div class="bt-slider__film-copy">${overlayText}</div>`;
    case 'centered-cards':
      return `<div class="bt-slider__center-card-media">${media}</div><div class="bt-slider__center-card-copy">${overlayText}</div>`;
    case 'multi-card':
      return `<div class="bt-slider__multi-card-media">${media}</div><div class="bt-slider__multi-card-copy">${overlayText}</div>`;
    case 'minimal':
      return `<div class="bt-slider__minimal-media">${media}</div><div class="bt-slider__minimal-copy">${overlayText}</div>`;
    case 'dark':
      return `<div class="bt-slider__dark-media">${media}</div><div class="bt-slider__dark-copy">${overlayText}</div>`;
    case 'gradient':
      return `<div class="bt-slider__gradient-media">${media}</div><div class="bt-slider__gradient-copy">${overlayText}</div>`;
    case 'glass':
      return `<div class="bt-slider__glass-media">${media}</div><div class="bt-slider__glass-copy">${overlayText}</div>`;
    case 'bordered':
      return `<div class="bt-slider__border-media">${media}</div><div class="bt-slider__border-copy">${overlayText}</div>`;
    default:
      return `${media}<div class="bt-slider__overlay-copy">${overlayText}</div>`;
  }
}

export function renderSliderBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const variant = safeVariant(c['variant']);
  const slides = slidesFromContent(c);
  const id = `slider-${String(block.id || 'slider').replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const height = variant === 'fullscreen' ? 'min(78vh,760px)' : px(s['height'] ?? c['height'], 420);
  const mobileHeight = px(s['mobileHeight'] ?? c['mobileHeight'], 300);
  const radius = num(s['radius'], 0, 0, 60);
  const gap = num(s['gap'], 16, 0, 48);
  const speed = num(c['transitionSpeed'], 600, 100, 5000);
  const interval = num(c['interval'], 3500, 1000, 60000);
  const autoplay = c['autoplay'] !== false;
  const loop = c['loop'] !== false;
  const pauseHover = c['pauseOnHover'] !== false;
  const pauseInteraction = c['pauseOnInteraction'] !== false;
  const swipe = c['swipe'] !== false;
  const keyboard = c['keyboard'] !== false;
  const transition = String(c['transition'] || (variant === 'fade' ? 'fade' : variant === 'zoom' ? 'zoom' : 'slide'));
  const forceSingle = ['fade', 'fullscreen', 'hero', 'banner', 'split', 'center', 'zoom', 'ken-burns', 'parallax', 'portfolio', 'testimonial', 'logos', 'vertical', 'thumbnail', 'filmstrip', 'editorial', 'polaroid', 'framed', 'minimal', 'dark', 'gradient', 'glass', 'bordered', 'offer', 'story', 'product', 'card'].includes(variant);
  const defaultSpv = ['multi-card', 'centered-cards', 'coverflow'].includes(variant) ? 3 : 1;
  const slidesPerView = forceSingle ? 1 : num(c['slidesPerView'], defaultSpv, 1, 3);
  const mobileSlidesPerView = forceSingle ? 1 : num(c['mobileSlidesPerView'], 1, 1, 2);
  const showArrows = c['showArrows'] !== false;
  const showDots = c['showDots'] !== false;
  const showCounter = c['showCounter'] === true;
  const showProgress = c['showProgress'] === true || variant === 'story' || variant === 'offer';
  const showThumbs = c['showThumbnails'] === true || variant === 'thumbnail' || variant === 'filmstrip';
  const arrowStyle = String(c['arrowStyle'] || 'circle');
  const arrowPosition = String(c['arrowPosition'] || 'inside');
  const dotStyle = String(c['dotStyle'] || 'circle');
  const captionAlign = String(c['captionAlign'] || 'left');
  const captionPosition = String(c['captionPosition'] || 'bottom');

  const slideHtml = slides.map((slide, index) => {
    const active = index === 0 ? ' is-active' : '';
    return `<article class="bt-slider__slide${active}" data-slide-index="${index}">${slideMarkup(parent, slide, c, variant, index)}</article>`;
  }).join('');

  const dots = showDots && slides.length > 1
    ? `<div class="bt-slider__dots bt-slider__dots--${dotStyle}" aria-label="Slider navigation">${slides.map((_, index) => `<button type="button" class="bt-slider__dot${index === 0 ? ' is-active' : ''}" data-slider-dot="${index}" aria-label="Go to slide ${index + 1}"></button>`).join('')}</div>`
    : '';

  const arrows = showArrows && slides.length > 1
    ? `<button type="button" class="bt-slider__arrow bt-slider__arrow--prev bt-slider__arrow--${arrowStyle} bt-slider__arrow--${arrowPosition}" data-slider-prev aria-label="Previous slide">‹</button><button type="button" class="bt-slider__arrow bt-slider__arrow--next bt-slider__arrow--${arrowStyle} bt-slider__arrow--${arrowPosition}" data-slider-next aria-label="Next slide">›</button>`
    : '';

  const counter = showCounter
    ? `<div class="bt-slider__counter"><span data-slider-current>01</span><b>/</b><span>${String(slides.length).padStart(2, '0')}</span></div>`
    : '';

  const progress = showProgress
    ? `<div class="bt-slider__progress"><i data-slider-progress></i></div>`
    : '';

  const thumbs = showThumbs && slides.length > 1
    ? `<div class="bt-slider__thumbs">${slides.map((slide, index) => `<button type="button" class="bt-slider__thumb${index === 0 ? ' is-active' : ''}" data-slider-thumb="${index}" aria-label="Preview slide ${index + 1}">${slide.image ? `<img src="${escapeAttr(parent, slide.image)}" alt="">` : `<span>${index + 1}</span>`}</button>`).join('')}</div>`
    : '';

  const style = `<style>
#${id}.bt-slider{position:relative;width:100%;height:${height};overflow:hidden;border-radius:${radius}px;box-sizing:border-box;background:#F1F5F9;touch-action:pan-y}
#${id}.bt-slider .bt-slider__track{display:flex;gap:${gap}px;width:max-content;min-width:100%;height:100%;transition:transform ${speed}ms cubic-bezier(.22,.61,.36,1);will-change:transform}
#${id}.bt-slider .bt-slider__slide{position:relative;height:100%;flex:0 0 ${100 / slidesPerView}%;min-width:0;overflow:hidden;box-sizing:border-box;background:#fff}
#${id}.bt-slider .bt-slider__image{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform ${speed}ms ease,opacity ${speed}ms ease}
#${id}.bt-slider .bt-slider__empty{display:grid;place-items:center;width:100%;height:100%;background:#E2E8F0;color:#64748B;font-size:13px;font-weight:800}
#${id}.bt-slider .bt-slider__overlay-copy{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;justify-content:${captionPosition === 'center' ? 'center' : captionPosition === 'top' ? 'flex-start' : 'flex-end'};align-items:${captionAlign === 'center' ? 'center' : captionAlign === 'right' ? 'flex-end' : 'flex-start'};padding:clamp(22px,5vw,58px);color:#fff;background:linear-gradient(180deg,rgba(2,6,23,.02) 15%,rgba(2,6,23,.76) 100%);text-align:${captionAlign}}
#${id}.bt-slider .bt-slider__overlay-copy h3,#${id}.bt-slider .bt-slider__split-copy h3,#${id}.bt-slider .bt-slider__card-copy h3,#${id}.bt-slider .bt-slider__product-copy h3,#${id}.bt-slider .bt-slider__portfolio-copy h3,#${id}.bt-slider .bt-slider__testimonial-copy blockquote,#${id}.bt-slider .bt-slider__editorial-copy h3,#${id}.bt-slider .bt-slider__polaroid-copy h3,#${id}.bt-slider .bt-slider__frame-copy h3,#${id}.bt-slider .bt-slider__offer-copy h3,#${id}.bt-slider .bt-slider__story-copy h3{margin:0 0 8px;font-size:clamp(22px,3vw,42px);line-height:1.06;font-weight:850}
#${id}.bt-slider .bt-slider__overlay-copy p,#${id}.bt-slider .bt-slider__split-copy p,#${id}.bt-slider .bt-slider__card-copy p,#${id}.bt-slider .bt-slider__product-copy p,#${id}.bt-slider .bt-slider__portfolio-copy p,#${id}.bt-slider .bt-slider__testimonial-copy p,#${id}.bt-slider .bt-slider__editorial-copy p,#${id}.bt-slider .bt-slider__polaroid-copy p,#${id}.bt-slider .bt-slider__frame-copy p,#${id}.bt-slider .bt-slider__offer-copy p,#${id}.bt-slider .bt-slider__story-copy p{margin:0 0 15px;max-width:720px;line-height:1.65;font-size:15px}
#${id}.bt-slider .bt-slider__eyebrow,#${id}.bt-slider .bt-slider__chapter,#${id}.bt-slider .bt-slider__product-label{display:block;margin-bottom:8px;font-size:11px;font-weight:850;letter-spacing:.14em;text-transform:uppercase;opacity:.78}
#${id}.bt-slider .bt-slider__badge{display:inline-flex;align-items:center;min-height:27px;padding:5px 10px;margin-bottom:10px;background:#FF4D6D;color:#fff;border-radius:999px;font-size:11px;font-weight:850}
#${id}.bt-slider .bt-slider__subtitle{font-size:clamp(16px,1.8vw,20px);font-weight:650;line-height:1.5;opacity:.92;margin-top:-3px}.bt-slider .bt-slider__cta{display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none}.bt-slider .bt-slider__cta--primary{background:#FF4D6D;color:#fff}.bt-slider .bt-slider__cta--outline{background:transparent;color:inherit;border:1px solid currentColor}.bt-slider .bt-slider__cta--soft{background:#FFF1F4;color:#BE123C}.bt-slider .bt-slider__cta--pill{background:#FF4D6D;color:#fff;border-radius:999px}.bt-slider .bt-slider__cta--dark{background:#0F172A;color:#fff}.bt-slider .bt-slider__cta--link{background:transparent;color:inherit;padding:6px 0;border-radius:0}.bt-slider .bt-slider__cta.is-disabled{cursor:default;opacity:.85}
.bt-slider .bt-slider__cta{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 16px;background:#FF4D6D;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:800}

#${id}.bt-slider--card .bt-slider__slide{background:#fff;border:1px solid #E2E8F0;display:grid;grid-template-rows:minmax(0,1fr) auto}
#${id}.bt-slider--card .bt-slider__media{min-height:0}.bt-slider--card .bt-slider__image{height:100%}.bt-slider--card .bt-slider__card-copy{padding:20px;color:#0F172A}
#${id}.bt-slider--card .bt-slider__card-copy h3{font-size:25px}

#${id}.bt-slider--split .bt-slider__slide{display:grid;grid-template-columns:1.05fr .95fr;background:#fff}
#${id}.bt-slider--split .bt-slider__split-media{grid-column:2;grid-row:1}.bt-slider--split .bt-slider__split-copy{grid-column:1;grid-row:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,5vw,72px);color:#0F172A;text-align:${captionAlign}}
#${id}.bt-slider--split .bt-slider__split-copy .bt-slider__cta{align-self:${captionAlign === 'right' ? 'flex-end' : captionAlign === 'center' ? 'center' : 'flex-start'}}

#${id}.bt-slider--product .bt-slider__slide{display:grid;grid-template-columns:.95fr 1.05fr;background:#FAFAFA}
#${id}.bt-slider--product .bt-slider__product-media{display:flex;align-items:center;justify-content:center;padding:34px;background:#fff}.bt-slider--product .bt-slider__product-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,5vw,64px);color:#0F172A}.bt-slider--product .bt-slider__product-copy .bt-slider__cta{align-self:flex-start}

#${id}.bt-slider--portfolio .bt-slider__slide{background:#0F172A}.bt-slider--portfolio .bt-slider__portfolio-media{height:100%}.bt-slider--portfolio .bt-slider__portfolio-copy{position:absolute;left:0;right:0;bottom:0;padding:34px;color:#fff;background:linear-gradient(180deg,transparent,rgba(2,6,23,.86))}

#${id}.bt-slider--testimonial .bt-slider__slide{display:grid;grid-template-columns:220px minmax(0,1fr);align-items:center;gap:42px;padding:clamp(24px,6vw,70px);background:#fff;color:#0F172A}
#${id}.bt-slider--testimonial .bt-slider__testimonial-avatar{width:190px;height:190px;border-radius:50%;overflow:hidden;background:#F1F5F9}.bt-slider--testimonial .bt-slider__quote-mark{display:block;font-size:72px;line-height:.65;color:#FF4D6D;margin-bottom:16px}.bt-slider--testimonial .bt-slider__testimonial-copy blockquote{font-size:clamp(24px,3vw,42px);font-weight:700;line-height:1.15}.bt-slider--testimonial .bt-slider__testimonial-copy p{color:#64748B}

#${id}.bt-slider--logos .bt-slider__slide{display:grid;place-items:center;align-content:center;background:#fff;padding:40px}.bt-slider--logos .bt-slider__logo-media{width:100%;height:100%;display:grid;place-items:center}.bt-slider--logos .bt-slider__image{width:min(80%,340px);height:min(70%,160px);object-fit:contain}.bt-slider--logos .bt-slider__logo-label{text-align:center;color:#334155;font-weight:750;margin-top:10px}

#${id}.bt-slider--editorial .bt-slider__slide{display:grid;grid-template-columns:74px minmax(0,1.25fr) minmax(280px,.75fr);align-items:center;gap:28px;background:#F8FAFC;color:#0F172A;padding:28px}.bt-slider--editorial .bt-slider__editorial-number{font-size:56px;font-weight:900;color:#CBD5E1;writing-mode:vertical-rl}.bt-slider--editorial .bt-slider__editorial-media{height:100%;min-height:300px}.bt-slider--editorial .bt-slider__editorial-copy{padding:24px}.bt-slider--editorial .bt-slider__editorial-copy .bt-slider__cta{background:#0F172A}.bt-slider--editorial .bt-slider__image{border-radius:${num(s['imageRadius'],0,0,60)}px}

#${id}.bt-slider--polaroid{background:#EEF2F7}.bt-slider--polaroid .bt-slider__slide{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;background:#fff;padding:14px;color:#0F172A;box-shadow:0 16px 40px rgba(15,23,42,.12)}.bt-slider--polaroid .bt-slider__polaroid-photo{min-height:0}.bt-slider--polaroid .bt-slider__polaroid-copy{padding:15px 4px 8px}.bt-slider--polaroid .bt-slider__polaroid-copy h3{font-size:24px}

#${id}.bt-slider--framed .bt-slider__slide{background:#fff;padding:14px}.bt-slider--framed .bt-slider__frame-inner{position:relative;width:100%;height:100%;overflow:hidden;border:1px solid #CBD5E1}.bt-slider--framed .bt-slider__frame-copy{position:absolute;left:0;right:0;bottom:0;padding:26px;color:#fff;background:linear-gradient(180deg,transparent,rgba(15,23,42,.8))}

#${id}.bt-slider--minimal{background:#fff}.bt-slider--minimal .bt-slider__slide{background:#fff}.bt-slider--minimal .bt-slider__overlay-copy{background:linear-gradient(180deg,transparent,rgba(15,23,42,.55));padding:32px}

#${id}.bt-slider--dark{background:#0F172A}.bt-slider--dark .bt-slider__slide{background:#172033}.bt-slider--dark .bt-slider__overlay-copy{background:linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,.94))}
#${id}.bt-slider--gradient .bt-slider__overlay-copy{background:linear-gradient(90deg,rgba(15,23,42,.92),rgba(15,23,42,.22) 72%,transparent)}
#${id}.bt-slider--glass .bt-slider__overlay-copy{justify-content:flex-end;padding:24px}.bt-slider--glass .bt-slider__overlay-copy>*{max-width:min(760px,100%)}.bt-slider--glass .bt-slider__overlay-copy{background:linear-gradient(180deg,transparent 20%,rgba(15,23,42,.25) 100%)}.bt-slider--glass .bt-slider__overlay-copy h3,.bt-slider--glass .bt-slider__overlay-copy p,.bt-slider--glass .bt-slider__overlay-copy .bt-slider__cta{position:relative;z-index:1}.bt-slider--glass .bt-slider__overlay-copy:before{content:"";position:absolute;left:24px;right:24px;bottom:24px;min-height:170px;border:1px solid rgba(255,255,255,.3);border-radius:16px;background:rgba(15,23,42,.28);backdrop-filter:blur(14px)}
#${id}.bt-slider--bordered{background:#fff;padding:10px}.bt-slider--bordered .bt-slider__slide{border:1px solid #CBD5E1}.bt-slider--bordered .bt-slider__overlay-copy{padding:28px}

#${id}.bt-slider--offer .bt-slider__slide{display:grid;grid-template-columns:1fr 1fr;background:#FFF7F8;color:#0F172A}.bt-slider--offer .bt-slider__offer-media{min-height:100%}.bt-slider--offer .bt-slider__offer-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,5vw,60px)}.bt-slider--offer .bt-slider__offer-copy .bt-slider__badge{background:#0F172A}.bt-slider--offer .bt-slider__offer-copy .bt-slider__cta{background:#FF4D6D}

#${id}.bt-slider--story .bt-slider__slide{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr);background:#0F172A;color:#fff}.bt-slider--story .bt-slider__story-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,6vw,70px);order:-1}.bt-slider--story .bt-slider__story-media{min-height:100%}.bt-slider--story .bt-slider__progress{top:auto;bottom:0;height:4px;background:rgba(255,255,255,.16)}

#${id}.bt-slider--vertical .bt-slider__slide{max-width:${Math.min(760, Number(s['contentMaxWidth']) || 760)}px;margin:0 auto}.bt-slider--center .bt-slider__track{justify-content:center}.bt-slider--center .bt-slider__slide{max-width:${Math.min(980, Number(s['contentMaxWidth']) || 980)}px}.bt-slider--centered-cards .bt-slider__slide,.bt-slider--multi-card .bt-slider__slide{background:#fff;border:1px solid #E2E8F0}.bt-slider--centered-cards .bt-slider__slide{transform:scale(.92);opacity:.62;transition:transform ${speed}ms ease,opacity ${speed}ms ease}.bt-slider--centered-cards .bt-slider__slide.is-active{transform:scale(1);opacity:1}.bt-slider--coverflow .bt-slider__slide{transform:scale(.84) rotateY(-8deg);opacity:.45;transition:transform ${speed}ms ease,opacity ${speed}ms ease;transform-origin:center}.bt-slider--coverflow .bt-slider__slide.is-active{transform:scale(1) rotateY(0);opacity:1}.bt-slider--coverflow .bt-slider__track{perspective:1200px}.bt-slider--zoom .bt-slider__slide.is-active .bt-slider__image{transform:scale(1.06)}.bt-slider--ken-burns .bt-slider__slide.is-active .bt-slider__image{animation:bt-slider-ken-${id} ${Math.max(interval / 1000, 4)}s ease-in-out infinite alternate}.bt-slider--parallax .bt-slider__image{transform:scale(1.09)}.bt-slider--fade .bt-slider__track{display:block;position:relative;transform:none!important}.bt-slider--fade .bt-slider__slide{position:absolute;inset:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:opacity ${speed}ms ease}.bt-slider--fade .bt-slider__slide.is-active{opacity:1;visibility:visible}

#${id}.bt-slider .bt-slider__arrow{position:absolute;top:50%;z-index:15;transform:translateY(-50%);display:grid;place-items:center;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.55);background:rgba(15,23,42,.38);backdrop-filter:blur(7px);color:#fff;font-size:28px;line-height:1;cursor:pointer}.bt-slider .bt-slider__arrow--prev{left:${arrowPosition === 'edge' ? '8px' : '18px'}}.bt-slider .bt-slider__arrow--next{right:${arrowPosition === 'edge' ? '8px' : '18px'}}.bt-slider .bt-slider__arrow--circle{border-radius:999px}.bt-slider .bt-slider__arrow--square{border-radius:6px}.bt-slider .bt-slider__arrow--minimal{border-color:transparent;background:transparent;backdrop-filter:none;font-size:36px}
#${id}.bt-slider .bt-slider__dots{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;z-index:16}.bt-slider .bt-slider__dot{width:8px;height:8px;padding:0;border:0;border-radius:999px;background:rgba(255,255,255,.5);cursor:pointer}.bt-slider .bt-slider__dots--line .bt-slider__dot{width:22px;height:3px;border-radius:0}.bt-slider .bt-slider__dots--square .bt-slider__dot{border-radius:3px}.bt-slider .bt-slider__dot.is-active{background:#fff;transform:scale(1.2)}
#${id}.bt-slider .bt-slider__counter{position:absolute;right:16px;top:16px;z-index:16;display:flex;gap:6px;padding:7px 10px;border-radius:999px;background:rgba(15,23,42,.5);color:#fff;font-size:12px;font-weight:850}.bt-slider .bt-slider__progress{position:absolute;left:0;right:0;top:0;height:3px;z-index:17;background:rgba(255,255,255,.18)}.bt-slider .bt-slider__progress i{display:block;width:0;height:100%;background:#FF4D6D;transition:width ${speed}ms ease}
#${id}.bt-slider .bt-slider__thumbs{position:absolute;left:12px;right:12px;bottom:12px;z-index:17;display:flex;gap:7px;overflow:auto;padding:3px}.bt-slider .bt-slider__thumb{flex:0 0 72px;width:72px;height:${num(s['thumbHeight'],64,44,100)}px;padding:0;overflow:hidden;border:2px solid transparent;background:rgba(15,23,42,.32);cursor:pointer}.bt-slider .bt-slider__thumb img{display:block;width:100%;height:100%;object-fit:cover}.bt-slider .bt-slider__thumb.is-active{border-color:#fff}.bt-slider .bt-slider__thumb span{display:grid;place-items:center;width:100%;height:100%;color:#fff;font-weight:800}


/* Additional structure-specific layouts */
#${id}.bt-slider--fullscreen .bt-slider__slide{position:relative}.bt-slider--fullscreen .bt-slider__fullscreen-media{position:absolute;inset:0}.bt-slider--fullscreen .bt-slider__fullscreen-copy{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(28px,6vw,78px);color:#fff;background:linear-gradient(180deg,transparent 28%,rgba(2,6,23,.82))}
#${id}.bt-slider--banner .bt-slider__slide{position:relative}.bt-slider--banner .bt-slider__banner-media,.bt-slider--banner .bt-slider__banner-media .bt-slider__image{height:100%}.bt-slider--banner .bt-slider__banner-copy{position:absolute;left:24px;right:24px;bottom:20px;padding:18px 22px;color:#fff;background:rgba(15,23,42,.72);backdrop-filter:blur(6px)}
#${id}.bt-slider--center .bt-slider__slide{display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center}.bt-slider--center .bt-slider__center-media{width:min(780px,85%);height:58%;overflow:hidden}.bt-slider--center .bt-slider__center-copy{width:min(760px,90%);padding:22px 10px}
#${id}.bt-slider--fade .bt-slider__slide{position:relative}.bt-slider--fade .bt-slider__fade-copy{position:absolute;left:0;right:0;bottom:0;padding:30px;color:#fff;background:linear-gradient(180deg,transparent,rgba(15,23,42,.75))}
#${id}.bt-slider--zoom .bt-slider__slide{position:relative}.bt-slider--zoom .bt-slider__zoom-media{height:100%;overflow:hidden}.bt-slider--zoom .bt-slider__zoom-copy{position:absolute;left:0;right:0;bottom:0;padding:28px;color:#fff;background:linear-gradient(180deg,transparent,rgba(15,23,42,.78))}
#${id}.bt-slider--ken-burns .bt-slider__slide{position:relative}.bt-slider--ken-burns .bt-slider__ken-media{height:100%;overflow:hidden}.bt-slider--ken-burns .bt-slider__ken-copy{position:absolute;left:0;right:0;bottom:0;padding:32px;color:#fff;background:linear-gradient(180deg,transparent,rgba(15,23,42,.82))}
#${id}.bt-slider--parallax .bt-slider__slide{position:relative}.bt-slider--parallax .bt-slider__parallax-media{height:100%;overflow:hidden}.bt-slider--parallax .bt-slider__parallax-copy{position:absolute;left:10%;right:10%;top:50%;transform:translateY(-50%);padding:26px;color:#fff;background:rgba(15,23,42,.45);backdrop-filter:blur(4px)}
#${id}.bt-slider--coverflow .bt-slider__coverflow-copy{padding:16px 18px;text-align:center}.bt-slider--vertical .bt-slider__slide{display:grid;place-items:center}.bt-slider--vertical .bt-slider__vertical-media{height:100%;width:min(420px,100%)}.bt-slider--vertical .bt-slider__vertical-copy{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);width:min(420px,80%);padding:20px;color:#fff;background:rgba(15,23,42,.72)}
#${id}.bt-slider--thumbnail .bt-slider__thumb-main{height:72%}.bt-slider--thumbnail .bt-slider__thumb-copy{height:28%;padding:16px 22px;background:#fff}.bt-slider--filmstrip .bt-slider__film-main{height:78%}.bt-slider--filmstrip .bt-slider__film-copy{height:22%;padding:12px 20px;background:#0F172A;color:#fff}
#${id}.bt-slider--centered-cards .bt-slider__slide{display:grid;grid-template-rows:1fr auto}.bt-slider--centered-cards .bt-slider__center-card-copy{padding:14px 16px}.bt-slider--multi-card .bt-slider__slide{display:grid;grid-template-rows:1fr auto}.bt-slider--multi-card .bt-slider__multi-card-copy{padding:12px 14px}
#${id}.bt-slider--minimal .bt-slider__slide{position:relative}.bt-slider--minimal .bt-slider__minimal-copy{padding:18px;background:#fff}.bt-slider--dark .bt-slider__slide{position:relative;background:#111827;color:#fff}.bt-slider--dark .bt-slider__dark-copy{padding:26px;background:#111827}.bt-slider--gradient .bt-slider__slide{position:relative}.bt-slider--gradient .bt-slider__gradient-copy{position:absolute;left:0;right:0;bottom:0;padding:30px;color:#fff;background:linear-gradient(90deg,rgba(15,23,42,.94),rgba(15,23,42,.28),transparent)}
#${id}.bt-slider--glass .bt-slider__slide{position:relative}.bt-slider--glass .bt-slider__glass-copy{position:absolute;left:24px;right:24px;bottom:24px;padding:24px;border:1px solid rgba(255,255,255,.32);background:rgba(15,23,42,.28);backdrop-filter:blur(14px);color:#fff}.bt-slider--bordered .bt-slider__slide{display:grid;grid-template-rows:1fr auto;border:1px solid #CBD5E1}.bt-slider--bordered .bt-slider__border-copy{padding:16px 18px;background:#fff}
/* Final per-slide button styles are intentionally after preset CSS so the slide setting wins. */
#${id}.bt-slider .bt-slider__cta--primary{background:#FF4D6D!important;color:#fff!important;border-color:transparent!important;border-radius:8px}
#${id}.bt-slider .bt-slider__cta--outline{background:transparent!important;color:inherit!important;border:1px solid currentColor!important;border-radius:8px}
#${id}.bt-slider .bt-slider__cta--soft{background:#FFF1F4!important;color:#BE123C!important;border-color:transparent!important;border-radius:8px}
#${id}.bt-slider .bt-slider__cta--pill{background:#FF4D6D!important;color:#fff!important;border-color:transparent!important;border-radius:999px}
#${id}.bt-slider .bt-slider__cta--dark{background:#0F172A!important;color:#fff!important;border-color:transparent!important;border-radius:8px}
#${id}.bt-slider .bt-slider__cta--link{background:transparent!important;color:inherit!important;border:0!important;border-radius:0!important;padding:6px 0!important}
@keyframes bt-slider-ken-${id}{from{transform:scale(1.02) translate3d(0,0,0)}to{transform:scale(1.10) translate3d(-1.5%,-1%,0)}}
@media(max-width:767px){
  #${id}.bt-slider{height:${mobileHeight}!important}
  #${id}.bt-slider .bt-slider__slide{flex-basis:${100 / mobileSlidesPerView}%}
  #${id}.bt-slider--split .bt-slider__slide,#${id}.bt-slider--product .bt-slider__slide,#${id}.bt-slider--offer .bt-slider__slide,#${id}.bt-slider--story .bt-slider__slide,#${id}.bt-slider--testimonial .bt-slider__slide,#${id}.bt-slider--editorial .bt-slider__slide{display:flex;flex-direction:column;grid-template-columns:none;gap:0;padding:0}
  #${id}.bt-slider--split .bt-slider__split-media,#${id}.bt-slider--product .bt-slider__product-media,#${id}.bt-slider--offer .bt-slider__offer-media{height:52%;min-height:0}.bt-slider--split .bt-slider__split-copy,#${id}.bt-slider--product .bt-slider__product-copy,#${id}.bt-slider--offer .bt-slider__offer-copy{height:48%;padding:22px;overflow:auto}.bt-slider--story .bt-slider__story-copy{order:0;height:48%;padding:22px;overflow:auto}.bt-slider--story .bt-slider__story-media{height:52%;min-height:0}.bt-slider--testimonial .bt-slider__testimonial-avatar{width:112px;height:112px;flex:0 0 auto}.bt-slider--testimonial .bt-slider__testimonial-copy{padding:22px}.bt-slider--editorial .bt-slider__editorial-number{display:none}.bt-slider--editorial .bt-slider__editorial-media{height:52%;min-height:0}.bt-slider--editorial .bt-slider__editorial-copy{height:48%;padding:22px;overflow:auto}.bt-slider--testimonial .bt-slider__testimonial-copy blockquote{font-size:24px}.bt-slider .bt-slider__overlay-copy{padding:22px}.bt-slider .bt-slider__overlay-copy h3{font-size:24px}.bt-slider .bt-slider__overlay-copy p{font-size:13px}.bt-slider .bt-slider__arrow{width:36px;height:36px;font-size:22px}
}
</style>`;

  const track = `<div class="bt-slider__track">${slideHtml}</div>`;
  const classNames = ['bt-slider', `bt-slider--${variant}`].join(' ');

  const script = `<script>(function(){
var root=document.getElementById('${id}');if(!root||root.dataset.ready==='1')return;root.dataset.ready='1';
var slides=[].slice.call(root.querySelectorAll('.bt-slider__slide'));if(!slides.length)return;
var track=root.querySelector('.bt-slider__track');var dots=[].slice.call(root.querySelectorAll('[data-slider-dot]'));var thumbs=[].slice.call(root.querySelectorAll('[data-slider-thumb]'));var current=root.querySelector('[data-slider-current]');var progress=root.querySelector('[data-slider-progress]');
var index=0,timer=0,touchX=0,visible=function(){return window.innerWidth<=767?${mobileSlidesPerView}:${slidesPerView};};
var multi=${slidesPerView>1?'true':'false'};var autoplay=${autoplay?'true':'false'};var loop=${loop?'true':'false'};var interval=${interval};var pauseInteraction=${pauseInteraction?'true':'false'};var swipe=${swipe?'true':'false'};var keyboard=${keyboard?'true':'false'};
function maxIndex(){return Math.max(0,slides.length-visible());}
function sync(){var v=visible();var max=maxIndex();if(index>max)index=max;if(track){if('${transition}'==='fade'||'${variant}'==='fade'){track.style.transform='none';}else{var first=slides[0];var gap=parseFloat(getComputedStyle(track).gap)||0;var width=first?first.getBoundingClientRect().width+gap:0;track.style.transform='translate3d('+(-index*width)+'px,0,0)';}}slides.forEach(function(slide,i){slide.classList.toggle('is-active',i===index);});dots.forEach(function(dot,i){dot.classList.toggle('is-active',i===index);});thumbs.forEach(function(thumb,i){thumb.classList.toggle('is-active',i===index);});if(current)current.textContent=String(index+1).padStart(2,'0');if(progress)progress.style.width=((index+1)/slides.length*100)+'%';}
function go(next,manual){var max=maxIndex();if(loop){index=multi?((next%(max+1))+(max+1))%(max+1):((next%slides.length)+slides.length)%slides.length;}else{index=Math.max(0,Math.min(next,max));}sync();if(manual&&pauseInteraction)stop();else if(manual)start();}
function stop(){if(timer){window.clearInterval(timer);timer=0;}}
function start(){if(!autoplay||slides.length<2)return;stop();timer=window.setInterval(function(){go(index+1,false);},interval);}
root.querySelector('[data-slider-prev]')?.addEventListener('click',function(){go(index-1,true);});root.querySelector('[data-slider-next]')?.addEventListener('click',function(){go(index+1,true);});
dots.forEach(function(dot){dot.addEventListener('click',function(){go(Number(dot.getAttribute('data-slider-dot')||0),true);});});thumbs.forEach(function(thumb){thumb.addEventListener('click',function(){go(Number(thumb.getAttribute('data-slider-thumb')||0),true);});});
root.addEventListener('mouseenter',function(){if(${pauseHover?'true':'false'})stop();});root.addEventListener('mouseleave',function(){if(${pauseHover?'true':'false'})start();});
root.addEventListener('touchstart',function(e){if(e.changedTouches&&e.changedTouches[0])touchX=e.changedTouches[0].clientX;},{passive:true});root.addEventListener('touchend',function(e){if(!swipe)return;var x=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0].clientX:touchX;var delta=x-touchX;if(Math.abs(delta)>42)go(delta<0?index+1:index-1,true);},{passive:true});
if(keyboard)root.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(index-1,true);if(e.key==='ArrowRight')go(index+1,true);});
window.addEventListener('resize',function(){sync();});sync();start();
})();</script>`;

  return `${style}<section style="${common}"><div id="${id}" class="${classNames}" data-bt-slider>${track}${arrows}${dots}${counter}${progress}${thumbs}</div></section>${script}`;
}
