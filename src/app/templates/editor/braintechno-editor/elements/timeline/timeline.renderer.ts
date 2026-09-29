import { EditorBlock } from '../../models/editor-block.model';

export function renderTimelineBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const rawVariant = String(c.variant || 'classic-vertical');
  const legacyMap: Record<string, string> = {
    steps: 'numbered',
    vertical: 'classic-vertical',
    horizontal: 'horizontal',
    cards: 'cards',
    dark: 'classic-vertical',
    minimal: 'minimal',
    process: 'process',
    roadmap: 'milestone'
  };
  const variant = legacyMap[rawVariant] || rawVariant;
  const items = Array.isArray(c.items) ? c.items : [];
  const accent = parent.css(s.accent, '#FF4D6D');
  const bg = parent.css(s.background, '#FFFFFF');
  const color = parent.css(s.color, '#0F172A');
  const muted = parent.css(s.mutedColor, '#64748B');
  const line = parent.css(s.lineColor, '#E2E8F0');
  const cardBg = parent.css(s.cardBackground, '#FFFFFF');
  const cardBorder = parent.css(s.cardBorder, '#E2E8F0');
  const iconBg = parent.css(s.iconBackground, '#FFF1F4');
  const radius = Math.max(0, Number(s.radius ?? 16));
  const itemRadius = Math.max(0, Number(s.itemRadius ?? 14));
  const gap = Math.max(8, Number(s.gap ?? 28));
  const sectionBg = String(s.backgroundImage || '').trim()
    ? `background-color:${bg};background-image:linear-gradient(${parent.css(s.overlay, 'rgba(255,255,255,.78)')},${parent.css(s.overlay, 'rgba(255,255,255,.78)')}),url('${parent.attr(s.backgroundImage)}');background-size:cover;background-position:center;`
    : `background:${bg};`;

  const href = (url: string) => {
    const value = String(url || '#').trim();
    return /^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value) || /^\//.test(value) || value === '#'
      ? value : `https://${value}`;
  };

  const marker = (item: any, i: number, numbered = false): string => {
    if (numbered) return `<span class="bt-timeline-marker bt-timeline-marker--number">${String(i + 1).padStart(2, '0')}</span>`;
    if (c.showIcons !== false && item?.icon) {
      return `<span class="bt-timeline-marker"><span class="material-symbols-rounded" aria-hidden="true">${parent.escape(item.icon)}</span></span>`;
    }
    return `<span class="bt-timeline-marker"><span class="bt-timeline-dot"></span></span>`;
  };

  const media = (item: any): string => {
    if (c.showImages !== true) return '';
    return item?.image
      ? `<img class="bt-timeline-image" src="${parent.attr(item.image)}" alt="${parent.attr(item?.title || '')}">`
      : `<div class="bt-timeline-image bt-timeline-image--empty">Image</div>`;
  };

  const content = (item: any, i: number, opts: { number?: boolean; compact?: boolean; featured?: boolean } = {}): string => {
    const date = c.showDates !== false && item?.date ? `<div class="bt-timeline-date">${parent.escape(item.date)}</div>` : '';
    const badge = c.showBadges === true && item?.badge ? `<span class="bt-timeline-badge">${parent.escape(item.badge)}</span>` : '';
    const status = c.showStatus === true && item?.status ? `<span class="bt-timeline-status bt-timeline-status--${parent.safeDomId(item.status)}">${parent.escape(item.status)}</span>` : '';
    const button = c.showButtons === true && item?.buttonLabel
      ? `<a class="bt-timeline-button" href="${parent.attr(href(item.buttonUrl || '#'))}">${parent.escape(item.buttonLabel)}</a>` : '';
    const cls = [
      'bt-timeline-content',
      opts.compact ? 'bt-timeline-content--compact' : '',
      opts.featured ? 'bt-timeline-content--featured' : ''
    ].filter(Boolean).join(' ');
    return `<article class="${cls}">
      <div class="bt-timeline-meta">${date}${badge}${status}</div>
      <h3>${opts.number ? '' : ''}${parent.escape(item?.title || `Step ${i + 1}`)}</h3>
      ${item?.text ? `<p>${parent.escape(item.text)}</p>` : ''}
      ${button}
    </article>`;
  };

  const entries = items.map((item: any, i: number) => ({ item, i }));
  let body = '';

  if (variant === 'left-aligned' || variant === 'right-aligned' || variant === 'minimal' || variant === 'numbered' || variant === 'icon' || variant === 'date-badge' || variant === 'process' || variant === 'milestone') {
    const numbered = variant === 'numbered';
    const right = variant === 'right-aligned';
    body = `<div class="bt-timeline-list bt-timeline-list--${variant} ${right ? 'is-right' : ''}">
      ${entries.map(({ item, i }) => `<div class="bt-timeline-row">
        <div class="bt-timeline-rail">${marker(item, i, numbered)}</div>
        <div class="bt-timeline-slot">${content(item, i, { number: numbered, compact: ['minimal', 'numbered'].includes(variant) })}</div>
      </div>`).join('')}
    </div>`;
  } else if (variant === 'alternating' || variant === 'classic-vertical') {
    body = `<div class="bt-timeline-alternating">
      ${entries.map(({ item, i }) => `<div class="bt-timeline-alt-row ${i % 2 ? 'is-reverse' : ''}">
        <div class="bt-timeline-alt-side">${i % 2 ? content(item, i, { compact: false }) : ''}</div>
        <div class="bt-timeline-alt-center">${marker(item, i)}</div>
        <div class="bt-timeline-alt-side">${i % 2 ? '' : content(item, i, { compact: false })}</div>
      </div>`).join('')}
    </div>`;
  } else if (variant === 'cards') {
    body = `<div class="bt-timeline-card-grid">${entries.map(({ item, i }) => `<article class="bt-timeline-card"><div class="bt-timeline-card-marker">${marker(item, i)}</div>${content(item, i)}</article>`).join('')}</div>`;
  } else if (variant === 'image') {
    body = `<div class="bt-timeline-image-list">${entries.map(({ item, i }) => `<article class="bt-timeline-image-card"><div class="bt-timeline-image-wrap">${media(item)}</div><div>${marker(item, i)}${content(item, i)}</div></article>`).join('')}</div>`;
  } else if (variant === 'featured') {
    const first = items[0];
    body = `${first ? `<article class="bt-timeline-featured">${media(first)}<div class="bt-timeline-featured-copy">${marker(first, 0)}${content(first, 0, { featured: true })}</div></article>` : ''}
      <div class="bt-timeline-featured-list">${entries.slice(1).map(({ item, i }) => `<div class="bt-timeline-featured-item">${marker(item, i)}${content(item, i, { compact: true })}</div>`).join('')}</div>`;
  } else if (variant === 'horizontal' || variant === 'scrollable') {
    body = `<div class="bt-timeline-horizontal ${variant === 'scrollable' ? 'is-scrollable' : ''}">${entries.map(({ item, i }) => `<article class="bt-timeline-horizontal-item"><div class="bt-timeline-horizontal-marker">${marker(item, i, false)}</div><div class="bt-timeline-horizontal-line"></div>${content(item, i, { compact: variant === 'scrollable' })}</article>`).join('')}</div>`;
  } else {
    body = `<div class="bt-timeline-alternating">${entries.map(({ item, i }) => `<div class="bt-timeline-alt-row ${i % 2 ? 'is-reverse' : ''}"><div class="bt-timeline-alt-side">${i % 2 ? content(item, i) : ''}</div><div class="bt-timeline-alt-center">${marker(item, i)}</div><div class="bt-timeline-alt-side">${i % 2 ? '' : content(item, i)}</div></div>`).join('')}</div>`;
  }

  const styleClass = `bt-timeline bt-timeline--${parent.safeDomId(variant)}`;
  const css = `
    <style>
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list{display:flex;flex-direction:column;gap:${gap}px;position:relative;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-row{display:grid;grid-template-columns:48px minmax(0,1fr);gap:16px;position:relative;min-width:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-row:before{content:'';position:absolute;left:23px;top:38px;bottom:calc(-${gap}px + 2px);width:2px;background:${line};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-row:last-child:before{display:none;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-rail,.${styleClass.replace(/ /g, '.')} .bt-timeline-alt-center{display:flex;justify-content:center;align-items:flex-start;position:relative;z-index:2;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-marker{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${iconBg};color:${accent};border:2px solid ${accent};box-sizing:border-box;font-size:20px;font-weight:900;flex:0 0 auto;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-marker--number{font-size:12px;letter-spacing:.06em;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-dot{width:10px;height:10px;border-radius:50%;background:${accent};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-slot,.${styleClass.replace(/ /g, '.')} .bt-timeline-alt-side{min-width:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-content{padding:4px 0;min-width:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-content h3{margin:0 0 6px;font-size:21px;line-height:1.25;color:${color};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-content p{margin:0;color:${muted};line-height:1.7;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:6px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-date{font-size:12px;font-weight:900;color:${accent};letter-spacing:.02em;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-badge,.${styleClass.replace(/ /g, '.')} .bt-timeline-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:900;background:${iconBg};color:${accent};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-status--completed{color:#15803D;background:#DCFCE7;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-status--current{color:#B45309;background:#FEF3C7;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-status--upcoming{color:#475569;background:#E2E8F0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-button{display:inline-flex;align-items:center;margin-top:12px;padding:9px 13px;border-radius:10px;background:${accent};color:#fff;text-decoration:none;font-weight:800;}

      .${styleClass.replace(/ /g, '.')} .bt-timeline-alternating{display:flex;flex-direction:column;position:relative;gap:${gap}px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-alternating:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:${line};transform:translateX(-50%);}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row{display:grid;grid-template-columns:minmax(0,1fr) 48px minmax(0,1fr);gap:18px;align-items:start;position:relative;z-index:1;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row.is-reverse .bt-timeline-alt-side:first-child{grid-column:1;grid-row:1;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row.is-reverse .bt-timeline-alt-center{grid-column:2;grid-row:1;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row.is-reverse .bt-timeline-alt-side:last-child{grid-column:3;grid-row:1;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row:not(.is-reverse) .bt-timeline-alt-side:last-child{grid-column:3;}

      .${styleClass.replace(/ /g, '.')} .bt-timeline-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${gap}px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-card{padding:20px;background:${cardBg};border:1px solid ${cardBorder};border-radius:${itemRadius}px;box-sizing:border-box;min-width:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-card-marker{margin-bottom:12px;}

      .${styleClass.replace(/ /g, '.')} .bt-timeline-image-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:${gap}px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-image-card{display:grid;grid-template-columns:160px minmax(0,1fr);gap:18px;padding:16px;background:${cardBg};border:1px solid ${cardBorder};border-radius:${itemRadius}px;align-items:center;min-width:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-image{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:${itemRadius}px;background:${line};display:block;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-image--empty{display:grid;place-items:center;color:${muted};font-size:12px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-image-card .bt-timeline-marker{width:38px;height:38px;font-size:16px;margin-bottom:9px;}

      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured{display:grid;grid-template-columns:minmax(260px,.9fr) minmax(0,1.1fr);gap:24px;padding:20px;background:${cardBg};border:1px solid ${cardBorder};border-radius:${itemRadius}px;align-items:center;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured .bt-timeline-image{aspect-ratio:16/10;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured-copy .bt-timeline-marker{margin-bottom:12px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured-list{display:flex;flex-direction:column;gap:10px;margin-top:${gap}px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured-item{display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;align-items:start;padding:14px 0;border-bottom:1px solid ${line};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured-item:last-child{border-bottom:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-featured-item .bt-timeline-marker{width:40px;height:40px;font-size:15px;}

      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal{display:flex;position:relative;align-items:flex-start;gap:${gap}px;overflow:visible;padding:12px 0 6px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal.is-scrollable{overflow-x:auto;scrollbar-width:thin;padding-bottom:12px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal-item{position:relative;flex:1 1 0;min-width:190px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal-marker{position:relative;display:flex;justify-content:flex-start;z-index:2;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal-line{position:absolute;left:30px;right:-${gap}px;top:23px;height:2px;background:${line};z-index:0;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal-item:last-child .bt-timeline-horizontal-line{display:none;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal-item .bt-timeline-content{padding-top:12px;padding-right:12px;}

      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--minimal .bt-timeline-marker{width:18px;height:18px;border:0;background:${accent};margin-top:6px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--minimal .bt-timeline-row{grid-template-columns:22px minmax(0,1fr);gap:12px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--minimal .bt-timeline-row:before{left:8px;top:22px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--minimal .bt-timeline-dot{display:none;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--numbered .bt-timeline-content h3{font-size:22px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--process .bt-timeline-marker{box-shadow:0 0 0 6px ${iconBg};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--milestone .bt-timeline-content{padding:14px 16px;background:${cardBg};border:1px solid ${cardBorder};border-radius:${itemRadius}px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--date-badge .bt-timeline-date{padding:6px 9px;border-radius:8px;background:${iconBg};}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-row{grid-template-columns:minmax(0,1fr) 48px;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-rail{grid-column:2;grid-row:1;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-slot{grid-column:1;grid-row:1;text-align:right;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-meta{justify-content:flex-end;}
      .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-row:before{left:auto;right:23px;}

      @media (max-width: 820px){
        .${styleClass.replace(/ /g, '.')} .bt-timeline-card-grid,.${styleClass.replace(/ /g, '.')} .bt-timeline-image-list{grid-template-columns:1fr;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-featured{grid-template-columns:1fr;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-image-card{grid-template-columns:120px minmax(0,1fr);}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row{grid-template-columns:34px minmax(0,1fr);gap:12px;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row.is-reverse .bt-timeline-alt-side:first-child,.${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row.is-reverse .bt-timeline-alt-side:last-child,.${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row:not(.is-reverse) .bt-timeline-alt-side:first-child{display:none;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row .bt-timeline-alt-center{grid-column:1 !important;grid-row:1;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-row .bt-timeline-alt-side:last-child{grid-column:2 !important;grid-row:1;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-alternating:before{left:16px;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-alt-center .bt-timeline-marker{width:34px;height:34px;font-size:15px;}
      }
      @media (max-width: 560px){
        .${styleClass.replace(/ /g, '.')} .bt-timeline-image-card{grid-template-columns:1fr;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal{overflow-x:auto;padding-bottom:12px;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-horizontal-item{min-width:215px;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-row{grid-template-columns:34px minmax(0,1fr);}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-rail{grid-column:1;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-slot{grid-column:2;text-align:left;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-meta{justify-content:flex-start;}
        .${styleClass.replace(/ /g, '.')} .bt-timeline-list--right-aligned .bt-timeline-row:before{left:16px;right:auto;}
      }
    </style>`;

  return `<section class="${styleClass}" style="${common};${sectionBg}color:${color};border-radius:${radius}px;box-sizing:border-box;">
    ${css}
    ${c.showTitle !== false && c.title ? `<h2 style="margin:0 0 6px;font-size:28px;line-height:1.2">${parent.escape(c.title)}</h2>` : ''}
    ${c.showSubtitle !== false && c.subtitle ? `<p style="margin:0 0 ${gap}px;color:${muted};line-height:1.65">${parent.escape(c.subtitle)}</p>` : ''}
    ${body}
  </section>`;
}
