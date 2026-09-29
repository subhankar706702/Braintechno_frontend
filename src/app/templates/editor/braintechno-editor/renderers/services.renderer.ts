import { EditorBlock } from '../models/editor-block.model';

/** Existing Services renderer moved out of the main editor without changing markup/logic. */
export function renderServicesBlock(parent: any, block: EditorBlock, common: string): string {

    const c = block.content || {};
    const s = block.style || {};
    const items = Array.isArray(c.items) ? c.items : [];
    const variant = String(c.variant || 'three');
    const cols = Math.max(1, Number(s.columns) || (variant === 'four' ? 4 : 3));
    const gap = Math.max(8, Number(s.gap) || 16);
    const isDark = variant === 'dark';
    const isHorizontal = variant === 'horizontal';
    const isDropdown = variant === 'dropdown';
    const isMinimal = variant === 'minimal';
    const isLinks = variant === 'links';
    const isNumbers = variant === 'numbers';
    const isSplit = variant === 'split';
    const isShowcase = variant === 'showcase';

    const actionHtml = (item: any): string => {
      const type = String(item?.actionType || c.actionMode || 'button');
      const label = String(item?.cta || 'Learn more');
      const href = String(item?.url || '#');
      const command = String(item?.command || '');
      if (type === 'none') return '';
      if (type === 'command') {
        const commandHref = command.startsWith('http://') || command.startsWith('https://') || command.startsWith('tel:') || command.startsWith('mailto:') || command.startsWith('sms:') ? command : href;
        return `<a href="${parent.attr(commandHref || '#')}" style="display:inline-flex;align-items:center;gap:7px;text-decoration:none;font-weight:800;color:${parent.css(s.actionColor, isDark ? '#FFFFFF' : '#FF4D6D')};padding:9px 0"><span class="material-symbols-rounded" style="font-size:18px">${commandHref.startsWith('tel:') ? 'call' : commandHref.startsWith('mailto:') ? 'mail' : commandHref.includes('wa.me') ? 'chat' : 'open_in_new'}</span>${parent.escape(label)}</a>`;
      }
      if (type === 'link') {
        return `<a href="${parent.attr(href)}" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-weight:800;color:${parent.css(s.actionColor, isDark ? '#FFFFFF' : '#FF4D6D')}">${parent.escape(label)}<span aria-hidden="true">→</span></a>`;
      }
      return `<a class="bt-btn" href="${parent.attr(href)}" style="display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 15px;background:${parent.css(s.buttonBg, isDark ? '#FFFFFF' : '#FF4D6D')};color:${parent.css(s.buttonColor, isDark ? '#0F172A' : '#FFFFFF')};border:1px solid ${parent.css(s.buttonBorder, 'transparent')};border-radius:${parent.cssPx(s.buttonRadius, 10)};font-weight:800;text-decoration:none;max-width:100%;box-sizing:border-box">${parent.escape(label)}</a>`;
    };

    const mediaHtml = (item: any, index: number): string => {
      const mode = String(item?.mediaMode || c.mediaMode || 'auto');
      const useImage = mode === 'image' || (mode === 'auto' && String(item?.image || '').trim());
      if (useImage) {
        const src = String(item?.image || '').trim();
        return src
          ? `<img src="${parent.attr(src)}" alt="${parent.attr(item?.title || '')}" style="display:block;width:100%;aspect-ratio:${isSplit ? '16/10' : '4/3'};object-fit:cover;border-radius:${parent.cssPx(s.imageRadius, 14)};background:#E5E7EB">`
          : `<div style="width:100%;aspect-ratio:${isSplit ? '16/10' : '4/3'};display:grid;place-items:center;background:#E5E7EB;color:#64748B;border-radius:${parent.cssPx(s.imageRadius, 14)}">Service image</div>`;
      }
      if (mode === 'icon' || (mode === 'auto' && String(item?.icon || '').trim())) {
        return `<span class="material-symbols-rounded" style="display:inline-flex;align-items:center;justify-content:center;width:${parent.cssPx(s.iconBox, 52)};height:${parent.cssPx(s.iconBox, 52)};font-size:${parent.cssPx(s.iconSize, 26)};color:${parent.css(s.iconColor, '#FF4D6D')};background:${parent.css(s.iconBg, isDark ? 'rgba(255,255,255,.10)' : '#FFF1F4')};border:1px solid ${parent.css(s.iconBorder, isDark ? 'rgba(255,255,255,.14)' : '#FFD6DE')};border-radius:${parent.cssPx(s.iconRadius, 14)};flex:0 0 auto">${parent.escape(item?.icon || 'star')}</span>`;
      }
      return '';
    };

    const card = (item: any, index: number, compact = false): string => {
      const media = mediaHtml(item, index);
      const badge = c.showBadge !== false && item?.badge ? `<span style="display:inline-flex;align-self:flex-start;padding:5px 9px;border-radius:999px;background:${parent.css(s.badgeBg, isDark ? 'rgba(255,255,255,.10)' : '#FFF1F4')};color:${parent.css(s.badgeColor, isDark ? '#FFFFFF' : '#FF4D6D')};font-size:11px;font-weight:900;letter-spacing:.04em;text-transform:uppercase">${parent.escape(item.badge)}</span>` : '';
      const number = isNumbers ? `<span style="display:block;font-size:13px;font-weight:900;letter-spacing:.12em;color:${parent.css(s.numberColor, '#FF4D6D')};margin-bottom:8px">${String(index + 1).padStart(2, '0')}</span>` : '';
      const title = `<h3 style="margin:0;font-size:${compact ? '17px' : '21px'};line-height:1.25">${parent.escape(item?.title || '')}</h3>`;
      const text = item?.text ? `<p style="margin:0;color:${parent.css(s.textColor, isDark ? 'rgba(255,255,255,.72)' : '#64748B')};line-height:1.65;font-size:${compact ? '13px' : '14px'}">${parent.escape(item.text)}</p>` : '';
      const actions = c.showAction !== false ? actionHtml(item) : '';
      const secondary = c.showSecondaryAction && item?.secondaryCta ? `<a href="${parent.attr(item.secondaryUrl || '#')}" style="display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border:1px solid ${parent.css(s.secondaryBorder, isDark ? 'rgba(255,255,255,.2)' : '#D7DEE7')};border-radius:10px;color:${parent.css(s.secondaryColor, isDark ? '#FFFFFF' : '#334155')};font-weight:800;text-decoration:none">${parent.escape(item.secondaryCta)}</a>` : '';
      if (isLinks) {
        return `<article style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 0;border-bottom:1px solid ${parent.css(s.lineColor, '#E2E8F0')};min-width:0"><div style="display:flex;align-items:center;gap:12px;min-width:0">${media}<div style="min-width:0">${badge}${title}</div></div><div style="flex:0 0 auto">${actions}</div></article>`;
      }
      if (variant === 'minimal') {
        return `<article style="display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid ${parent.css(s.lineColor, '#E2E8F0')};min-width:0">${media}${`<div style="min-width:0">${badge}${title}${text}</div>`}${actions}</article>`;
      }
      const splitStyle = isSplit ? 'display:grid;grid-template-columns:minmax(110px,.75fr) minmax(0,1.25fr);' : 'display:flex;flex-direction:column;';
      return `<article style="${splitStyle}gap:${parent.cssPx(compact ? 10 : 16, 16)};padding:${compact ? '14px' : '18px'};border:1px solid ${parent.css(s.cardBorder, isDark ? 'rgba(255,255,255,.12)' : '#E2E8F0')};background:${parent.css(s.cardBg, isDark ? '#111827' : '#FFFFFF')};border-radius:${parent.cssPx(s.cardRadius, variant === 'soft' ? 18 : 14)};box-shadow:${parent.shadowCss(s.cardShadow || (variant === 'showcase' ? 'soft' : 'none'))};min-width:0;box-sizing:border-box;overflow:hidden">${media}${`<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${number}${badge}${title}${text}${actions || secondary ? `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0">${actions}${secondary}</div>` : ''}</div>`}</article>`;
    };

    const heading = `<div style="display:flex;justify-content:space-between;align-items:end;gap:18px;flex-wrap:wrap;margin-bottom:20px"><div style="min-width:0"><h2 style="margin:0">${parent.escape(c.title || 'Our Services')}</h2>${c.showSubtitle !== false && c.subtitle ? `<p style="margin:7px 0 0;color:${parent.css(s.subtitleColor, isDark ? 'rgba(255,255,255,.68)' : '#64748B')};line-height:1.55">${parent.escape(c.subtitle)}</p>` : ''}</div></div>`;

    if (!items.length) {
      return `<section style="${common}">${heading}<div style="padding:28px 0;color:#64748B">Add a service to get started.</div></section>`;
    }

    if (isHorizontal) {
      const scroll = `<div style="display:flex;gap:${gap}px;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;padding:2px 2px 14px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:thin">${items.map((x:any,i:number)=>`<div style="flex:0 0 clamp(260px,31vw,360px);min-width:0;scroll-snap-align:start">${card(x,i)}</div>`).join('')}</div>`;
      return `<section style="${common}overflow:hidden;">${heading}${scroll}</section>`;
    }

    if (isDropdown) {
      const desktop = `<div class="bt-services-dropdown-desktop" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>card(x,i)).join('')}</div>`;
      const mobile = `<div class="bt-services-dropdown-mobile" style="display:none;flex-direction:column;gap:8px">${items.map((x:any,i:number)=>`<details style="border:1px solid #E2E8F0;border-radius:12px;background:#FFFFFF;overflow:hidden"><summary style="list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;font-weight:800"><span>${parent.escape(x?.title || `Service ${i+1}`)}</span><span class="material-symbols-rounded">expand_more</span></summary><div style="padding:0 14px 14px">${x?.text?`<p style="margin:0 0 12px;color:#64748B;line-height:1.6">${parent.escape(x.text)}</p>`:''}${mediaHtml(x,i)}<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px">${actionHtml(x)}</div></div></details>`).join('')}</div>`;
      const style = `<style>.bt-services-dropdown-mobile{box-sizing:border-box}.bt-services-dropdown-mobile summary::-webkit-details-marker{display:none}@media(max-width:700px){.bt-services-dropdown-desktop{display:none!important}.bt-services-dropdown-mobile{display:flex!important}}</style>`;
      return `<section style="${common}">${heading}${desktop}${mobile}${style}</section>`;
    }

    if (isShowcase) {
      const featured = items[0];
      const rest = items.slice(1);
      return `<section style="${common}">${heading}<div class="bt-services-showcase" style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);gap:${gap}px;align-items:stretch;min-width:0">${card(featured,0)}<div style="display:grid;grid-template-columns:1fr;gap:${gap}px;min-width:0">${rest.map((x:any,i:number)=>card(x,i+1,true)).join('')}</div></div><style>@media(max-width:760px){.bt-services-showcase{grid-template-columns:1fr!important}}</style></section>`;
    }

    if (isSplit) {
      return `<section style="${common}">${heading}<div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${Math.min(cols,2)},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>card(x,i)).join('')}</div></section>`;
    }

    const grid = `<div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px;align-items:stretch">${items.map((x:any,i:number)=>card(x,i)).join('')}</div>`;
    return `<section style="${common}overflow:hidden">${heading}${grid}</section>`;
  
}
