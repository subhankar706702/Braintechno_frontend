import { EditorBlock } from '../../models/editor-block.model';

export function renderTabsBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const rawVariant = String(c.variant || 'simple');
  const legacyMap: Record<string, string> = {
    simple: 'simple',
    pills: 'pills',
    underline: 'underline',
    cards: 'cards',
    dark: 'cards',
    services: 'icon',
    features: 'feature',
    compact: 'segmented'
  };
  const variant = legacyMap[rawVariant] || rawVariant;
  const items = Array.isArray(c.items) && c.items.length ? c.items : [];
  const activeIndex = Math.max(0, Math.min(items.length - 1, Number(c.active ?? 0) || 0));
  const showIcons = c.showIcons !== false;
  const showImages = c.showImages === true || ['image', 'feature'].includes(variant);
  const showBadges = c.showBadges === true;
  const showButtons = c.showButtons === true || variant === 'feature';
  const isVerticalLeft = variant === 'vertical-left';
  const isVerticalRight = variant === 'vertical-right';
  const isScrollable = variant === 'scrollable' || c.mobileLayout === 'scroll';
  const isDropdown = variant === 'dropdown' || c.mobileLayout === 'accordion';
  const isIconOnly = variant === 'icon-only';
  const isNumbered = variant === 'numbered';
  const isSegmented = variant === 'segmented';
  const isFeature = variant === 'feature';
  const isImage = variant === 'image';
  const dark = rawVariant === 'dark';
  const accent = parent.css ? parent.css(s.accent, '#FF4D6D') : (s.accent || '#FF4D6D');
  const textColor = parent.css ? parent.css(s.tabTextColor, dark ? '#CBD5E1' : '#475569') : (s.tabTextColor || '#475569');
  const activeColor = parent.css ? parent.css(s.tabActiveText, dark ? '#FFFFFF' : '#0F172A') : (s.tabActiveText || '#0F172A');
  const tabBg = parent.css ? parent.css(s.tabBg, dark ? '#162033' : '#F8FAFC') : (s.tabBg || '#F8FAFC');
  const activeBg = parent.css ? parent.css(s.tabActiveBg, dark ? '#24324A' : '#FFF1F4') : (s.tabActiveBg || '#FFF1F4');
  const panelBg = parent.css ? parent.css(s.panelBg, dark ? '#111827' : '#FFFFFF') : (s.panelBg || '#FFFFFF');
  const panelBorder = parent.css ? parent.css(s.panelBorder, dark ? '#334155' : '#E2E8F0') : (s.panelBorder || '#E2E8F0');
  const tabRadius = Math.max(0, Number(s.tabRadius ?? (variant === 'pills' ? 999 : 10)));
  const panelRadius = Math.max(0, Number(s.panelRadius ?? 12));
  const gap = Math.max(0, Number(s.gap ?? 12));
  const tabGap = Math.max(0, Number(s.tabGap ?? 10));
  const padX = Math.max(6, Number(s.tabPaddingX ?? 14));
  const padY = Math.max(6, Number(s.tabPaddingY ?? 10));
  const href = (url: string) => {
    const value = String(url || '#').trim();
    return /^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value) || /^\//.test(value) || value === '#' ? value : `https://${value}`;
  };

  const backgroundImage = String(s.backgroundImage || '').trim();
  const outerBackground = backgroundImage
    ? `background-color:${parent.css(s.background, '#FFFFFF')};background-image:linear-gradient(${parent.css(s.overlay, 'rgba(255,255,255,.75)')},${parent.css(s.overlay, 'rgba(255,255,255,.75)')}),url('${parent.attr(backgroundImage)}');background-size:cover;background-position:center;`
    : `background:${parent.css(s.background, '#FFFFFF')};`;

  const label = (item: any, i: number): string => {
    const icon = showIcons && item?.icon && !isNumbered ? `<span class="material-symbols-rounded bt-tabs-icon" aria-hidden="true">${parent.escape(item.icon)}</span>` : '';
    const num = isNumbered ? `<span class="bt-tabs-number">${String(i + 1).padStart(2, '0')}</span>` : '';
    const title = `<span class="bt-tabs-label">${parent.escape(item?.title || `Tab ${i + 1}`)}</span>`;
    const badge = showBadges && item?.badge ? `<span class="bt-tabs-badge">${parent.escape(item.badge)}</span>` : '';
    return `${num}${icon}${isIconOnly ? icon || num : title}${badge}`;
  };

  const navButtons = items.map((item: any, i: number) => `
    <button type="button" class="bt-tabs-tab ${i === activeIndex ? 'is-active' : ''}" data-tab-btn="${i}">
      ${label(item, i)}
    </button>`).join('');

  const panel = (item: any, i: number): string => {
    const image = showImages
      ? (item?.image
        ? `<img class="bt-tabs-panel-image" src="${parent.attr(item.image)}" alt="${parent.attr(item?.title || '')}">`
        : `<div class="bt-tabs-panel-image bt-tabs-panel-image--empty">Image</div>`)
      : '';
    const badge = showBadges && item?.badge ? `<span class="bt-tabs-panel-badge">${parent.escape(item.badge)}</span>` : '';
    const button = showButtons && item?.buttonLabel
      ? `<a class="bt-tabs-action" href="${parent.attr(href(item.buttonUrl || '#'))}">${parent.escape(item.buttonLabel)}</a>`
      : '';
    const body = `<div class="bt-tabs-copy"><h3>${parent.escape(item?.title || '')}</h3>${badge}<p>${parent.escape(item?.text || '')}</p>${button}</div>`;
    let content = '';
    if (isFeature) content = `<div class="bt-tabs-feature-grid">${image}${body}</div>`;
    else if (isImage) content = `<div class="bt-tabs-image-grid">${image}${body}</div>`;
    else content = `<div class="bt-tabs-copy">${badge}<p>${parent.escape(item?.text || '')}</p>${button}</div>`;
    return `<div class="bt-tabs-panel ${i === activeIndex ? 'is-active' : ''}" data-tab-panel="${i}" style="display:${i === activeIndex ? 'block' : 'none'}">${content}</div>`;
  };

  const selectHtml = isDropdown
    ? `<div class="bt-tabs-select-wrap"><select class="bt-tabs-select" data-tab-select>${items.map((item: any, i: number) => `<option value="${i}"${i === activeIndex ? ' selected' : ''}>${parent.escape(item?.title || `Tab ${i + 1}`)}</option>`).join('')}</select></div>`
    : '';

  const mobileAccordion = isDropdown
    ? `<div class="bt-tabs-accordion">${items.map((item: any, i: number) => `<details ${i === activeIndex ? 'open' : ''}><summary>${label(item, i)}</summary><div class="bt-tabs-accordion-panel">${parent.escape(item?.text || '')}${showButtons && item?.buttonLabel ? `<a class="bt-tabs-action" href="${parent.attr(href(item.buttonUrl || '#'))}">${parent.escape(item.buttonLabel)}</a>` : ''}</div></details>`).join('')}</div>`
    : '';

  const styleClass = `bt-tabs bt-tabs--${parent.safeDomId(rawVariant)}`;
  const navStyle = `display:flex;align-items:center;gap:${tabGap}px;${isScrollable ? 'overflow-x:auto;scrollbar-width:thin;' : 'flex-wrap:wrap;'}${isSegmented ? 'background:'+tabBg+';border:1px solid '+panelBorder+';border-radius:12px;padding:4px;' : ''}`;
  const shellStyle = `color:${parent.css(s.color, dark ? '#FFFFFF' : '#0F172A')};${outerBackground}padding:${parent.cssPx(s.padding, 18)};border-radius:${parent.cssPx(s.radius, 0)};margin-top:${parent.cssPx(s.marginTop, 0)};margin-bottom:${parent.cssPx(s.marginBottom, 0)};box-sizing:border-box;`;

  let markup = '';
  if (isVerticalLeft || isVerticalRight) {
    markup = `
      <div class="bt-tabs-vertical ${isVerticalRight ? 'is-right' : 'is-left'}" style="display:grid;grid-template-columns:${isVerticalRight ? 'minmax(0,1fr) minmax(170px,.32fr)' : 'minmax(170px,.32fr) minmax(0,1fr)'};gap:${gap}px;align-items:start;">
        <div class="bt-tabs-nav" style="display:flex;flex-direction:column;gap:${tabGap}px;${isVerticalRight ? 'grid-column:2;grid-row:1;' : ''}">${navButtons}</div>
        <div class="bt-tabs-panels" style="${isVerticalRight ? 'grid-column:1;grid-row:1;' : ''}">${items.map(panel).join('')}</div>
      </div>`;
  } else {
    markup = `
      ${selectHtml}
      ${mobileAccordion}
      <div class="bt-tabs-nav bt-tabs-nav--desktop" style="${navStyle}">${navButtons}</div>
      <div class="bt-tabs-panels" style="margin-top:${gap}px;">${items.map(panel).join('')}</div>`;
  }

  const inlineStyles = `
    <style>
      .${styleClass.replace(/ /g, '.')} .bt-tabs-nav{min-width:0}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-tab{appearance:none;border:1px solid ${panelBorder};background:${tabBg};color:${textColor};padding:${padY}px ${padX}px;border-radius:${tabRadius}px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font:inherit;font-weight:800;line-height:1.2;cursor:pointer;white-space:nowrap;box-sizing:border-box;transition:.18s ease}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-tab:hover{transform:translateY(-1px);border-color:${accent};}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-tab.is-active{background:${activeBg};color:${activeColor};border-color:${accent};}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-icon{font-size:18px;line-height:1}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-number{font-size:11px;font-weight:900;letter-spacing:.08em;color:${accent};}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-badge,.${styleClass.replace(/ /g, '.')} .bt-tabs-panel-badge{display:inline-flex;align-items:center;padding:3px 7px;border-radius:999px;background:${accent};color:#fff;font-size:10px;font-weight:900;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-panel{min-width:0;box-sizing:border-box;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-panels{min-width:0}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-copy{min-width:0;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-copy h3{margin:0 0 8px;font-size:22px;line-height:1.25;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-copy p{margin:8px 0 0;line-height:1.75;color:${parent.css(s.tabTextColor, dark ? '#CBD5E1' : '#64748B')};}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-panel:not(.bt-tabs--plain){background:${panelBg};border:1px solid ${panelBorder};border-radius:${panelRadius}px;padding:20px;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-panel-image{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:${Math.max(0, Number(s.imageRadius ?? 14))}px;background:${dark ? '#1E293B' : '#E2E8F0'};}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-panel-image--empty{display:grid;place-items:center;color:#64748B;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-action{display:inline-flex;align-items:center;justify-content:center;margin-top:14px;padding:10px 15px;background:${accent};color:#fff;border-radius:10px;font-weight:800;text-decoration:none;max-width:100%;box-sizing:border-box;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-feature-grid,.${styleClass.replace(/ /g, '.')} .bt-tabs-image-grid{display:grid;grid-template-columns:minmax(160px,.85fr) minmax(0,1.15fr);gap:20px;align-items:center;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-select-wrap,.${styleClass.replace(/ /g, '.')} .bt-tabs-accordion{display:none;}
      .${styleClass.replace(/ /g, '.')} .bt-tabs--underline{}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-number{}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-tab:first-child{}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-nav--desktop::-webkit-scrollbar{height:6px}
      .${styleClass.replace(/ /g, '.')} .bt-tabs-nav--desktop::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:999px}
      @media (max-width: 720px){
        .${styleClass.replace(/ /g, '.')} .bt-tabs-vertical{display:block !important;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-vertical .bt-tabs-nav{display:flex !important;flex-direction:row !important;overflow-x:auto;scrollbar-width:thin;margin-bottom:${gap}px;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-vertical .bt-tabs-panels{display:block !important;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-nav--desktop{overflow-x:auto;flex-wrap:nowrap !important;scrollbar-width:thin;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-tab{flex:0 0 auto;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-feature-grid,.${styleClass.replace(/ /g, '.')} .bt-tabs-image-grid{grid-template-columns:1fr;gap:14px;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-select-wrap{display:block;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-select{width:100%;padding:11px 12px;border:1px solid ${panelBorder};border-radius:10px;background:${tabBg};color:${textColor};font:inherit;font-weight:800;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-accordion{display:block;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-accordion details{border:1px solid ${panelBorder};border-radius:10px;background:${panelBg};overflow:hidden;margin-top:8px;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-accordion summary{cursor:pointer;list-style:none;padding:12px 14px;font-weight:800;display:flex;align-items:center;gap:7px;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-accordion summary::-webkit-details-marker{display:none;}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-accordion-panel{padding:0 14px 14px;line-height:1.7;color:${parent.css(s.tabTextColor, dark ? '#CBD5E1' : '#64748B')};}
        .${styleClass.replace(/ /g, '.')} .bt-tabs-accordion + .bt-tabs-nav--desktop,.${styleClass.replace(/ /g, '.')} .bt-tabs-select-wrap + .bt-tabs-accordion + .bt-tabs-nav--desktop{display:none;}
        ${isDropdown ? '' : `.${styleClass.replace(/ /g, '.')} .bt-tabs-select-wrap,.${styleClass.replace(/ /g, '.')} .bt-tabs-accordion{display:none;}`}
        ${isDropdown ? `.${styleClass.replace(/ /g, '.')} .bt-tabs-select-wrap{display:block}. ${styleClass.replace(/ /g,'.')} .bt-tabs-accordion{display:none}`.replace('. ',' .') : ''}
      }
      @media (min-width: 721px){
        .${styleClass.replace(/ /g, '.')} .bt-tabs-select-wrap,.${styleClass.replace(/ /g, '.')} .bt-tabs-accordion{display:none !important;}
      }
    </style>`;

  return `<section class="${styleClass}" style="${common}${shellStyle}">
    ${inlineStyles}
    ${c.showTitle !== false ? `<h2 style="margin:0 0 6px;font-size:28px;line-height:1.2">${parent.escape(c.title || '')}</h2>` : ''}
    ${c.showSubtitle !== false && c.subtitle ? `<p style="margin:0 0 ${gap}px;color:${parent.css(s.tabTextColor, dark ? '#CBD5E1' : '#64748B')};line-height:1.6">${parent.escape(c.subtitle)}</p>` : ''}
    ${markup}
  </section>`;
}
