import { EditorBlock } from '../models/editor-block.model';

/** Stats renderer: 15 genuinely different layouts, with safe responsive behavior. */
export function renderStatsBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const items = Array.isArray(c.items) ? c.items : [];
  const variant = String(c.variant || 'four');
  const cols = Math.max(1, Math.min(6, Number(s.columns) || 4));
  const gap = Math.max(0, Number(s.gap) || 0);
  const accent = parent.css(s.accent, '#FF4D6D');
  const textColor = parent.css(s.textColor || s.color, '#0F172A');
  const mutedColor = parent.css(s.mutedColor, '#64748B');
  const cardBg = parent.css(s.cardBg, '#FFFFFF');
  const cardBorder = parent.css(s.cardBorder, '#E2E8F0');
  const cardRadius = parent.cssPx(Math.max(0, Number(s.cardRadius) || 0), 0);
  const iconRadius = parent.cssPx(Math.max(0, Number(s.iconRadius) || 0), 14);
  const iconBg = parent.css(s.iconBg, '#FFF1F4');
  const iconColor = parent.css(s.iconColor, accent);
  const progressBg = parent.css(s.progressBg, '#E9EEF3');
  const progressColor = parent.css(s.progressColor, accent);
  const overlay = parent.css(s.overlay, 'transparent');
  const showTitle = c.showTitle !== false;
  const showSubtitle = c.showSubtitle !== false;
  const showIcons = c.showIcons === true || variant === 'icon' || variant === 'business';
  const showProgress = c.showProgress === true || variant === 'progress' || variant === 'percent';
  const mobileLayout = String(c.mobileLayout || (variant === 'dropdown' ? 'dropdown' : 'stack'));
  const bgImage = String(s.backgroundImage || '').trim();
  const hasBgImage = !!bgImage;

  const valueHtml = (item: any, large = true): string => {
    const value = `${String(item?.prefix || '')}${String(item?.value || '0')}${String(item?.suffix || '')}`;
    return `<strong style="display:block;color:${textColor};font-size:${large ? '38px' : '28px'};line-height:1.05;font-weight:900;letter-spacing:-.03em;word-break:break-word">${parent.escape(value)}</strong>`;
  };

  const iconHtml = (item: any, size?: number): string => `<span class="material-symbols-rounded" style="display:inline-flex;align-items:center;justify-content:center;width:${size || Number(s.iconBox) || 48}px;height:${size || Number(s.iconBox) || 48}px;font-size:${Math.max(18, (size || Number(s.iconBox) || 48) * .48)}px;color:${iconColor};background:${iconBg};border-radius:${iconRadius};flex:0 0 auto">${parent.escape(item?.icon || 'monitoring')}</span>`;

  const progressHtml = (item: any): string => {
    if (!showProgress) return '';
    const percent = Math.max(0, Math.min(100, Number(item?.progress) || 0));
    return `<div style="margin-top:12px;height:8px;border-radius:999px;background:${progressBg};overflow:hidden"><span style="display:block;width:${percent}%;height:100%;background:${progressColor};border-radius:inherit"></span></div>`;
  };

  const actionHtml = (item: any, label = 'View details'): string => {
    const url = String(item?.url || '').trim();
    return url ? `<a href="${parent.attr(url)}" style="display:inline-flex;margin-top:12px;text-decoration:none;color:${accent};font-size:13px;font-weight:800">${parent.escape(item?.cta || label)} →</a>` : '';
  };

  const statCard = (item: any, index: number, extra = ''): string => `
    <article style="min-width:0;padding:20px;border:1px solid ${cardBorder};background:${cardBg};border-radius:${cardRadius};${extra}">
      ${showIcons ? iconHtml(item) : ''}
      ${variant === 'accent' ? `<span style="display:block;width:38px;height:4px;margin-bottom:12px;background:${accent};border-radius:999px"></span>` : ''}
      ${variant === 'percent' ? `<span style="display:inline-flex;margin-bottom:10px;padding:4px 8px;border-radius:999px;background:${iconBg};color:${accent};font-size:11px;font-weight:900">${Math.max(0,Math.min(100,Number(item?.progress)||0))}%</span>` : ''}
      ${variant === 'business' ? `<span style="display:block;margin-bottom:8px;color:${accent};font-size:11px;font-weight:900;letter-spacing:.10em;text-transform:uppercase">KPI ${String(index + 1).padStart(2,'0')}</span>` : ''}
      ${valueHtml(item, true)}
      <span style="display:block;margin-top:7px;color:${textColor};font-size:15px;font-weight:800;line-height:1.35">${parent.escape(item?.label || `Metric ${index + 1}`)}</span>
      ${c.showDescription || variant === 'business' ? `<p style="margin:7px 0 0;color:${mutedColor};line-height:1.55;font-size:13px">${parent.escape(item?.text || 'Add a short explanation for this metric.')}</p>` : ''}
      ${progressHtml(item)}
      ${actionHtml(item)}
    </article>`;

  const heading = showTitle || (showSubtitle && c.subtitle)
    ? `<div style="margin-bottom:20px;min-width:0"><h2 style="margin:0;color:${textColor};line-height:1.18;font-size:28px">${showTitle ? parent.escape(c.title || 'Our Impact') : ''}</h2>${showSubtitle && c.subtitle ? `<p style="margin:7px 0 0;color:${mutedColor};line-height:1.55">${parent.escape(c.subtitle)}</p>` : ''}</div>`
    : '';

  if (!items.length) {
    return `<section style="${common}margin-top:${parent.cssPx(s.marginTop,0)};margin-bottom:${parent.cssPx(s.marginBottom,0)}"><div style="padding:20px 0;color:${mutedColor}">Add a stat to get started.</div></section>`;
  }

  const background = hasBgImage
    ? `background-image:linear-gradient(${overlay},${overlay}),url('${parent.attr(bgImage)}');background-size:${parent.css(s.backgroundSize,'cover')};background-position:${parent.css(s.backgroundPosition,'center')};background-repeat:${parent.css(s.backgroundRepeat,'no-repeat')};`
    : '';
  const sectionStyle = `${common}${background}overflow:hidden;position:relative;`;
  const inner = `<div style="position:relative;z-index:1">${heading}`;

  if (variant === 'four') {
    const grid = `<div class="bt-stats-four" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:${gap}px">${items.slice(0,4).map((x:any,i:number)=>statCard(x,i)).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:900px){.bt-stats-four{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:520px){.bt-stats-four{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'three') {
    const grid = `<div class="bt-stats-three" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${gap + 8}px">${items.slice(0,3).map((x:any,i:number)=>`<div style="min-width:0;text-align:center;padding:10px 18px;border-right:${i<2?`1px solid ${cardBorder}`:'0'}">${valueHtml(x,true)}<span style="display:block;margin-top:8px;color:${mutedColor};font-weight:800">${parent.escape(x.label||'')}</span></div>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:700px){.bt-stats-three{grid-template-columns:1fr!important}.bt-stats-three>div{border-right:0!important;border-bottom:1px solid ${cardBorder};padding:14px 0}.bt-stats-three>div:last-child{border-bottom:0}}</style>`;
  }

  if (variant === 'cards') {
    const grid = `<div class="bt-stats-cards" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px;align-items:stretch">${items.map((x:any,i:number)=>statCard(x,i,'box-shadow:0 10px 24px rgba(15,23,42,.06);')).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:760px){.bt-stats-cards{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-cards{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'dark') {
    const grid = `<div class="bt-stats-dark" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>statCard(x,i,'background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14);')).join('')}</div>`;
    return `<section style="${sectionStyle}background-color:#0F172A;">${inner}${grid}</div></section><style>@media(max-width:760px){.bt-stats-dark{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-dark{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'minimal') {
    const row = `<div class="bt-stats-minimal" style="display:flex;gap:${gap}px;align-items:stretch">${items.map((x:any,i:number)=>`<div style="flex:1 1 0;min-width:0;text-align:center;padding:8px 14px;border-right:${i<items.length-1?`1px solid ${cardBorder}`:'0'}">${valueHtml(x)}<span style="display:block;margin-top:7px;color:${mutedColor};font-size:13px;font-weight:800">${parent.escape(x.label||'')}</span></div>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${row}</div></section><style>@media(max-width:650px){.bt-stats-minimal{display:grid!important;grid-template-columns:1fr 1fr}.bt-stats-minimal>div{border-right:0!important;border-bottom:1px solid ${cardBorder}}}</style>`;
  }

  if (variant === 'accent') {
    const grid = `<div class="bt-stats-accent" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>`<article style="min-width:0;padding:20px;border-left:4px solid ${accent};background:${cardBg};border-top:1px solid ${cardBorder};border-right:1px solid ${cardBorder};border-bottom:1px solid ${cardBorder};border-radius:${cardRadius}">${valueHtml(x,true)}<span style="display:block;margin-top:8px;font-weight:800;color:${textColor}">${parent.escape(x.label||'')}</span></article>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:760px){.bt-stats-accent{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-accent{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'percent') {
    const list = `<div class="bt-stats-percent" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>`<article style="min-width:0;padding:18px;border:1px solid ${cardBorder};background:${cardBg};border-radius:${cardRadius}"><div style="display:flex;align-items:end;justify-content:space-between;gap:10px">${valueHtml(x,false)}<strong style="color:${accent};font-size:18px">${Math.max(0,Math.min(100,Number(x.progress)||0))}%</strong></div><span style="display:block;margin-top:8px;font-weight:800;color:${textColor}">${parent.escape(x.label||'')}</span>${progressHtml(x)}</article>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${list}</div></section><style>@media(max-width:760px){.bt-stats-percent{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-percent{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'business') {
    const grid = `<div class="bt-stats-business" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>`<article style="min-width:0;padding:22px;border:1px solid ${cardBorder};background:linear-gradient(180deg,${cardBg},#F8FAFC);border-radius:${cardRadius}">${iconHtml(x,40)}<div style="margin-top:14px">${valueHtml(x,true)}<span style="display:block;margin-top:7px;font-weight:800;color:${textColor}">${parent.escape(x.label||'')}</span><p style="margin:7px 0 0;color:${mutedColor};font-size:13px;line-height:1.5">${parent.escape(x.text||'')}</p></div></article>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:760px){.bt-stats-business{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-business{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'side-side') {
    // Desktop: always side-by-side. Mobile: always stack vertically.
    // Do not depend on the editor's mobileLayout value for this preset; the
    // preset itself defines the responsive behavior requested by the design.
    const row = `<div class="bt-stats-side" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:${gap}px;min-width:0;align-items:stretch">${items.slice(0,4).map((x:any,i:number)=>`<div class="bt-stats-side-item" style="min-width:0;">${statCard(x,i,'height:100%;')}</div>`).join('')}</div>`;
    const mobile = `<style>@media(max-width:700px){.bt-stats-side{grid-template-columns:1fr!important}.bt-stats-side-item{width:100%!important}}</style>`;
    return `<section style="${sectionStyle}">${inner}${row}</div></section>${mobile}`;
  }

  if (variant === 'dropdown') {
    const desktop = `<div class="bt-stats-dropdown-desktop" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>statCard(x,i)).join('')}</div>`;
    const mobile = `<div class="bt-stats-dropdown-mobile" style="display:none;flex-direction:column;gap:8px">${items.map((x:any,i:number)=>`<details style="border:1px solid ${cardBorder};border-radius:${cardRadius};background:${cardBg};overflow:hidden"><summary style="list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px;color:${textColor};font-weight:800"><span>${parent.escape(x.label||`Metric ${i+1}`)}</span><span class="material-symbols-rounded">expand_more</span></summary><div style="padding:0 15px 15px">${valueHtml(x,false)}${x.text?`<p style="margin:8px 0 0;color:${mutedColor};line-height:1.55">${parent.escape(x.text)}</p>`:''}${progressHtml(x)}</div></details>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${desktop}${mobile}</div></section><style>.bt-stats-dropdown-mobile summary::-webkit-details-marker{display:none}@media(max-width:700px){.bt-stats-dropdown-desktop{display:none!important}.bt-stats-dropdown-mobile{display:flex!important}}</style>`;
  }

  if (variant === 'icon') {
    const grid = `<div class="bt-stats-icon" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>`<article style="min-width:0;padding:20px;border:1px solid ${cardBorder};background:${cardBg};border-radius:${cardRadius};text-align:center"><div style="display:flex;justify-content:center">${iconHtml(x,56)}</div>${valueHtml(x,true)}<span style="display:block;margin-top:7px;font-weight:800;color:${textColor}">${parent.escape(x.label||'')}</span></article>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:760px){.bt-stats-icon{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-icon{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'progress') {
    const list = `<div class="bt-stats-progress" style="display:grid;gap:${gap}px">${items.map((x:any)=>`<article style="min-width:0;padding:12px 0;border-bottom:1px solid ${cardBorder}"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="font-weight:800;color:${textColor}">${parent.escape(x.label||'')}</span><strong style="color:${accent}">${parent.escape(String(x.value||''))}</strong></div>${progressHtml(x)}</article>`).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${list}</div></section>`;
  }

  if (variant === 'split') {
    const first = items[0];
    const rest = items.slice(1);
    const layout = `<div class="bt-stats-split" style="display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:${gap}px"><article style="min-width:0;padding:28px;border:1px solid ${cardBorder};background:${cardBg};border-radius:${cardRadius};display:flex;flex-direction:column;justify-content:center">${iconHtml(first,56)}<div style="margin-top:16px">${valueHtml(first,true)}<span style="display:block;margin-top:8px;color:${textColor};font-size:18px;font-weight:900">${parent.escape(first.label||'')}</span><p style="margin:8px 0 0;color:${mutedColor};line-height:1.6">${parent.escape(first.text||'')}</p></div></article><div style="display:grid;grid-template-columns:1fr 1fr;gap:${gap}px;min-width:0">${rest.map((x:any,i:number)=>statCard(x,i+1)).join('')}</div></div>`;
    return `<section style="${sectionStyle}">${inner}${layout}</div></section><style>@media(max-width:760px){.bt-stats-split{grid-template-columns:1fr!important}.bt-stats-split>div{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'featured') {
    const index = Math.max(0, Math.min(items.length - 1, Number(c.featuredIndex) || 0));
    const featured = items[index];
    const rest = items.filter((_: any,i:number)=>i!==index);
    const layout = `<div class="bt-stats-featured" style="display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:${gap}px"><article style="min-width:0;padding:30px;border:2px solid ${accent};background:${cardBg};border-radius:${cardRadius};display:flex;flex-direction:column;justify-content:center">${iconHtml(featured,60)}<span style="display:block;margin-top:14px;color:${accent};font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase">Featured KPI</span>${valueHtml(featured,true)}<span style="display:block;margin-top:8px;font-size:19px;font-weight:900;color:${textColor}">${parent.escape(featured.label||'')}</span><p style="margin:8px 0 0;color:${mutedColor};line-height:1.6">${parent.escape(featured.text||'')}</p>${progressHtml(featured)}</article><div style="display:grid;gap:${gap}px">${rest.map((x:any,i:number)=>statCard(x,i+1)).join('')}</div></div>`;
    return `<section style="${sectionStyle}">${inner}${layout}</div></section><style>@media(max-width:760px){.bt-stats-featured{grid-template-columns:1fr!important}}</style>`;
  }

  if (variant === 'photo-bg') {
    const grid = `<div class="bt-stats-photo" style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>statCard(x,i,'background:rgba(255,255,255,.94);backdrop-filter:blur(5px);border-color:rgba(255,255,255,.55);')).join('')}</div>`;
    return `<section style="${sectionStyle}">${inner}${grid}</div></section><style>@media(max-width:760px){.bt-stats-photo{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.bt-stats-photo{grid-template-columns:1fr!important}}</style>`;
  }

  const grid = `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px">${items.map((x:any,i:number)=>statCard(x,i)).join('')}</div>`;
  return `<section style="${sectionStyle}">${inner}${grid}</div></section>`;
}
