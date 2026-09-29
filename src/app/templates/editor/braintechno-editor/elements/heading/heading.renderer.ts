import { EditorBlock } from '../../models/editor-block.model';

export function renderHeadingBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const variant = String(c.variant || 'classic');
  const level = /^h[1-6]$/.test(String(c.level)) ? String(c.level) : 'h2';
  const safeTag = level as 'h1'|'h2'|'h3'|'h4'|'h5'|'h6';
  const text = String(c.text || 'Your Heading');
  const eyebrow = String(c.eyebrow || '').trim();
  const subtitle = String(c.subtitle || '').trim();
  const description = String(c.description || '').trim();
  const number = String(c.number || '').trim();
  const icon = String(c.icon || '').trim();
  const highlight = String(c.highlight || '').trim();
  const accent = parent.css(s.accent, '#FF4D6D');
  const color = parent.css(s.color, '#0F172A');
  const highlightColor = parent.css(s.highlightColor, '#FFE8EE');
  const overlay = parent.css(s.overlay, 'rgba(15,23,42,.55)');
  const bgImage = String(s.backgroundImage || '').trim();
  const gradient = String(s.textGradient || '').toLowerCase() === 'true' || s.textGradient === true;

  const textHtml = s.highlightWord && highlight
    ? String(text).replace(new RegExp(`(${escapeRegExp(highlight)})`, 'i'), `<mark style="background:${highlightColor};color:inherit;padding:0 .14em;border-radius:.18em">$1</mark>`)
    : parent.escape(text);

  const numberHtml = s.showNumber ? `<span class="bt-heading-number">${parent.escape(number || '01')}</span>` : '';
  const iconHtml = s.showIcon && icon ? `<span class="bt-heading-icon material-symbols-rounded" aria-hidden="true">${parent.escape(icon)}</span>` : '';
  const eyebrowHtml = eyebrow ? `<div class="bt-heading-eyebrow">${parent.escape(eyebrow)}</div>` : '';
  const subtitleHtml = subtitle ? `<div class="bt-heading-subtitle">${parent.escape(subtitle)}</div>` : '';
  const descriptionHtml = description ? `<div class="bt-heading-description">${parent.escape(description)}</div>` : '';
  const linkHtml = c.linkLabel ? `<a class="bt-heading-link" href="${parent.attr(c.linkUrl || '#')}">${parent.escape(c.linkLabel)}</a>` : '';

  let background = '';
  if (bgImage) {
    background = `background-color:#0F172A;background-image:linear-gradient(${overlay},${overlay}),url('${parent.attr(bgImage)}');background-size:cover;background-position:center;`;
  }

  const styleClass = `bt-heading bt-heading--${parent.safeDomId(variant)}`;
  const headingStyle = [
    `font-size:${Number(s.fontSize) || 32}px`,
    `font-weight:${Number(s.fontWeight) || 700}`,
    `color:${color}`,
    `margin:0`,
    `line-height:1.12`,
    `letter-spacing:${Number(s.letterSpacing) || -0.02}em`,
    gradient ? `background:linear-gradient(90deg,${accent},#7C3AED);-webkit-background-clip:text;background-clip:text;color:transparent` : '',
    s.headingDecoration === 'underline' ? `text-decoration:underline;text-decoration-color:${accent};text-decoration-thickness:4px;text-underline-offset:10px` : ''
  ].filter(Boolean).join(';');

  const css = `<style>
.${styleClass}{box-sizing:border-box;position:relative;overflow:hidden;text-align:${parent.css(s.align,'left')};${background}}
.${styleClass} .bt-heading-inner{max-width:${Number(s.maxWidth)||920}px;margin:0 auto;}
.${styleClass} .bt-heading-row{display:flex;align-items:flex-start;gap:14px;}
.${styleClass} .bt-heading-number{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-width:42px;height:42px;padding:0 10px;border-radius:999px;background:${accent};color:#fff;font-weight:900;font-size:13px;letter-spacing:.05em;}
.${styleClass} .bt-heading-icon{display:inline-grid;place-items:center;flex:0 0 46px;width:46px;height:46px;border-radius:14px;background:${parent.css(s.iconBackground, 'rgba(255,77,109,.10)')};color:${accent};font-size:25px;}
.${styleClass} .bt-heading-eyebrow{margin:0 0 9px;color:${accent};font-size:12px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;}
.${styleClass} .bt-heading-subtitle{margin:12px auto 0;max-width:780px;color:${parent.css(s.subtitleColor,'#475569')};font-size:18px;line-height:1.55;}
.${styleClass} .bt-heading-description{margin:12px 0 0;color:${parent.css(s.descriptionColor,'#64748B')};font-size:16px;line-height:1.7;max-width:620px;}
.${styleClass} .bt-heading-link{display:inline-flex;margin-top:16px;padding:10px 14px;border-radius:10px;background:${accent};color:#fff;text-decoration:none;font-weight:800;font-size:13px;}
.${styleClass} .bt-heading--split-copy{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(240px,.9fr);gap:34px;align-items:end;}
.${styleClass} .bt-heading-split-side{color:${parent.css(s.descriptionColor,'#64748B')};font-size:16px;line-height:1.7;}
.${styleClass} .bt-heading-split-side .bt-heading-link{margin-top:0;}
.${styleClass} .bt-heading--image-copy h1,.${styleClass} .bt-heading--image-copy h2,.${styleClass} .bt-heading--image-copy h3{color:#fff;}
@media(max-width:700px){
  .${styleClass} .bt-heading--split-copy{grid-template-columns:1fr;gap:16px;}
  .${styleClass} .bt-heading-subtitle{font-size:16px;}
}
</style>`;

  if (variant === 'split') {
    return `<section class="${styleClass}" style="${common};">
      ${css}<div class="bt-heading-inner bt-heading--split-copy">
        <div>${eyebrowHtml}<${safeTag} style="${headingStyle}">${textHtml}</${safeTag}>${subtitleHtml}</div>
        <div class="bt-heading-split-side">${descriptionHtml || '<span>Add supporting copy here.</span>'}${linkHtml}</div>
      </div></section>`;
  }

  return `<section class="${styleClass}" style="${common};">
    ${css}<div class="bt-heading-inner ${variant === 'image' ? 'bt-heading--image-copy' : ''}">
      ${eyebrowHtml}
      <div class="bt-heading-row" style="justify-content:${s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start'}">
        ${numberHtml}${iconHtml}<${safeTag} style="${headingStyle}">${textHtml}</${safeTag}>
      </div>
      ${subtitleHtml}${descriptionHtml}${linkHtml}
    </div>
  </section>`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
