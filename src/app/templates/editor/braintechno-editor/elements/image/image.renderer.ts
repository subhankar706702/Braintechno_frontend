import { EditorBlock } from '../../models/editor-block.model';

export function renderImageBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const rawVariant = String(c.variant || 'banner');
  const legacyMap: Record<string, string> = {
    full: 'full-bleed',
    rounded: 'rounded',
    card: 'card',
    compact: 'compact',
    shadow: 'shadow',
    square: 'square',
    portrait: 'portrait',
    circle: 'circle',
    bordered: 'bordered',
    banner: 'banner'
  };
  const variant = legacyMap[rawVariant] || rawVariant;
  const src = String(c.url || '').trim();
  const alt = parent.attr(c.alt || 'Image');
  const caption = String(c.caption || '').trim();
  const linkUrl = String(c.linkUrl || '').trim();
  const target = String(c.linkTarget || '_self');
  const fit = String(s.objectFit || 'cover');
  const position = String(s.objectPosition || 'center');
  const width = Math.max(1, Math.min(100, Number(s.imageWidth) || 100));
  const height = Math.max(1, Math.min(200, Number(s.imageHeight) || 56));
  const radius = Math.max(0, Number(s.radius ?? 0));
  const borderWidth = Math.max(0, Number(s.borderWidth) || 0);
  const borderColor = parent.css(s.borderColor, '#E2E8F0');
  const shadowMap: Record<string, string> = {
    none: 'none',
    soft: '0 8px 24px rgba(15,23,42,.08)',
    medium: '0 16px 36px rgba(15,23,42,.14)',
    strong: '0 24px 56px rgba(15,23,42,.22)'
  };
  const shadow = shadowMap[String(s.shadow || 'none')] || String(s.shadow || 'none');
  const srcOrPlaceholder = (url = src, emptyLabel = 'Choose image'): string => {
    const imageUrl = String(url || '').trim();
    return imageUrl
      ? `<img src="${parent.attr(imageUrl)}" alt="${alt}" ${c.lazy !== false ? 'loading="lazy"' : ''} style="display:block;width:100%;height:100%;object-fit:${parent.attr(fit)};object-position:${parent.attr(position)};">`
      : `<div style="width:100%;height:100%;display:grid;place-items:center;background:#E2E8F0;color:#64748B;font-weight:800;font-size:13px;">${parent.escape(emptyLabel)}</div>`;
  };

  const frame = (inner: string, custom = ''): string =>
    `<div style="position:relative;width:${width}%;aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;border:${borderWidth}px solid ${borderColor};box-shadow:${shadow};margin:${s.align === 'center' ? '0 auto' : s.align === 'right' ? '0 0 0 auto' : '0'};background:${parent.css(s.background,'#FFFFFF')};${custom}">${inner}</div>`;

  let visual = '';
  switch (variant) {
    case 'polaroid':
      visual = `<figure style="width:${Math.min(width,82)}%;margin:${s.align === 'center' ? '0 auto' : '0'};padding:12px 12px 18px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:${radius}px;box-shadow:${shadow};"><div style="aspect-ratio:${width} / ${height};overflow:hidden;border-radius:2px;">${srcOrPlaceholder()}</div>${caption ? `<figcaption style="padding:12px 2px 0;text-align:center;font-size:14px;font-weight:700;color:#334155;line-height:1.45;">${parent.escape(caption)}</figcaption>` : ''}</figure>`;
      break;
    case 'frame':
      visual = `<div style="position:relative;width:${Math.min(width,92)}%;margin:${s.align === 'center' ? '0 auto' : '0'};padding:8px;background:#111827;box-shadow:${shadow};transform:rotate(-.7deg);"><div style="aspect-ratio:${width} / ${height};overflow:hidden;border:1px solid rgba(255,255,255,.18);">${srcOrPlaceholder()}</div></div>`;
      break;
    case 'overlay-caption':
      visual = frame(`${srcOrPlaceholder()}${caption ? `<div style="position:absolute;left:0;right:0;bottom:0;padding:24px 16px 14px;background:linear-gradient(transparent,rgba(15,23,42,.78));color:#FFFFFF;font-size:14px;font-weight:800;line-height:1.4;">${parent.escape(caption)}</div>` : ''}`);
      break;
    case 'gradient-overlay':
      visual = frame(`${srcOrPlaceholder()}${caption ? `<div style="position:absolute;inset:auto 0 0;padding:26px 18px 16px;background:linear-gradient(180deg,transparent,rgba(124,58,237,.92));color:#FFFFFF;font-size:14px;font-weight:800;line-height:1.45;">${parent.escape(caption)}</div>` : ''}`);
      break;
    case 'editorial':
      visual = `<div style="display:grid;grid-template-columns:minmax(130px,${Math.max(45, Math.round(width))}%) minmax(0,1fr);gap:22px;align-items:center;max-width:960px;margin:${s.align === 'center' ? '0 auto' : '0'};"><div style="aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;box-shadow:${shadow};">${srcOrPlaceholder()}</div><div style="padding:8px 0;">${caption ? `<p style="margin:0;font-size:22px;line-height:1.35;font-weight:800;color:${parent.css(s.color,'#0F172A')};">${parent.escape(caption)}</p>` : '<span style="color:#64748B;font-size:13px;">Add a caption</span>'}</div></div>`;
      break;
    case 'split':
      visual = `<div style="display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:24px;align-items:center;max-width:1000px;margin:${s.align === 'center' ? '0 auto' : '0'};padding:${Number(s.padding)||0}px;background:${parent.css(s.background,'#F8FAFC')};border-radius:${radius}px;"><div style="aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${Math.max(0, radius - 4)}px;box-shadow:${shadow};">${srcOrPlaceholder()}</div><div style="padding:10px 4px;">${caption ? `<div style="font-size:28px;font-weight:900;line-height:1.18;color:${parent.css(s.color,'#0F172A')};">${parent.escape(caption)}</div>` : '<strong style="font-size:18px;">Image content</strong>'}<div style="margin-top:8px;color:#64748B;line-height:1.6;">Use this style for a visual + message side-by-side section.</div></div></div>`;
      break;
    case 'before-after': {
      const after = String(c.afterUrl || '').trim();
      visual = `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:${Math.max(8,Number(s.gap)||12)}px;max-width:900px;margin:${s.align === 'center' ? '0 auto' : '0'};"><div><div style="position:relative;aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;box-shadow:${shadow};">${srcOrPlaceholder(src,'Before image')}<span style="position:absolute;left:10px;top:10px;padding:5px 8px;border-radius:999px;background:rgba(15,23,42,.78);color:#fff;font-size:11px;font-weight:900;">${parent.escape(c.beforeLabel || 'Before')}</span></div></div><div><div style="position:relative;aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;box-shadow:${shadow};">${srcOrPlaceholder(after,'After image')}<span style="position:absolute;left:10px;top:10px;padding:5px 8px;border-radius:999px;background:${parent.css(s.ringColor || '#FF4D6D','#FF4D6D')};color:#fff;font-size:11px;font-weight:900;">${parent.escape(c.afterLabel || 'After')}</span></div></div></div>`;
      break;
    }
    case 'hover-zoom':
      visual = `<div class="bt-image-hover-zoom" style="width:${width}%;aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;box-shadow:${shadow};margin:${s.align === 'center' ? '0 auto' : s.align === 'right' ? '0 0 0 auto' : '0'};">${srcOrPlaceholder()}${caption ? `<span style="position:absolute;left:14px;bottom:12px;padding:6px 9px;border-radius:8px;background:rgba(15,23,42,.72);color:#fff;font-size:12px;font-weight:800;">${parent.escape(caption)}</span>` : ''}</div>`;
      break;
    case 'tilt-card':
      visual = `<div style="width:${Math.min(width,86)}%;margin:${s.align === 'center' ? '0 auto' : '0'};padding:14px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:${radius}px;box-shadow:${shadow};transform:rotate(-1.2deg);"><div style="aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${Math.max(0,radius-5)}px;transform:rotate(1.2deg);">${srcOrPlaceholder()}</div>${caption ? `<div style="padding:12px 4px 2px;text-align:center;font-weight:900;color:#334155;">${parent.escape(caption)}</div>` : ''}</div>`;
      break;
    case 'cutout':
      visual = `<div style="width:${Math.min(width,82)}%;aspect-ratio:${width} / ${height};margin:${s.align === 'center' ? '0 auto' : '0'};overflow:hidden;clip-path:polygon(10% 0,90% 0,100% 18%,92% 88%,72% 100%,20% 94%,0 68%,5% 18%);box-shadow:${shadow};">${srcOrPlaceholder()}</div>`;
      break;
    case 'duotone': {
      const tint = parent.css(s.duoColor, '#FF4D6D');
      visual = `<div style="position:relative;width:${width}%;aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;box-shadow:${shadow};margin:${s.align === 'center' ? '0 auto' : '0'};"><div style="position:absolute;inset:0;z-index:2;background:${tint};mix-blend-mode:color;opacity:.82;pointer-events:none;"></div>${srcOrPlaceholder('', 'Choose image')}</div>`;
      break;
    }
    case 'monochrome':
      visual = `<div style="width:${width}%;aspect-ratio:${width} / ${height};overflow:hidden;border-radius:${radius}px;box-shadow:${shadow};margin:${s.align === 'center' ? '0 auto' : '0'};filter:grayscale(1);">${srcOrPlaceholder()}</div>`;
      break;
    case 'ring': {
      const ringWidth = Math.max(2, Number(s.ringWidth)||6);
      const ringColor = parent.css(s.ringColor, '#FF4D6D');
      visual = `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:${Math.min(width,52)}%;margin:${s.align === 'center' ? '0 auto' : '0'};"><div style="width:100%;aspect-ratio:1;border-radius:999px;padding:${ringWidth}px;background:${ringColor};box-shadow:${shadow};"><div style="width:100%;height:100%;border-radius:999px;overflow:hidden;background:#E2E8F0;">${srcOrPlaceholder()}</div></div>${caption ? `<strong style="font-size:14px;color:${parent.css(s.color,'#0F172A')};">${parent.escape(caption)}</strong>` : ''}</div>`;
      break;
    }
    case 'magazine':
      visual = `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(160px,.55fr);gap:28px;align-items:end;max-width:1000px;margin:${s.align === 'center' ? '0 auto' : '0'};"><div style="min-height:300px;aspect-ratio:${width} / ${height};overflow:hidden;box-shadow:${shadow};">${srcOrPlaceholder()}</div><div style="padding-bottom:18px;border-left:4px solid ${parent.css(s.ringColor,'#FF4D6D')};padding-left:18px;"><div style="font-size:30px;line-height:1.05;font-weight:950;color:${parent.css(s.color,'#0F172A')};">${parent.escape(caption || 'Visual story')}</div><div style="margin-top:10px;font-size:12px;line-height:1.6;color:#64748B;">Magazine-inspired image composition for campaigns, portfolios and feature stories.</div></div></div>`;
      break;
    default: {
      const showCaption = caption ? `<div style="padding:10px 2px 0;font-size:13px;line-height:1.5;color:${parent.css(s.color,'#475569')};text-align:${parent.css(s.align,'center')};">${parent.escape(caption)}</div>` : '';
      visual = `${frame(srcOrPlaceholder())}${showCaption}`;
      break;
    }
  }

  const linked = linkUrl
    ? `<a href="${parent.attr(linkUrl)}" target="${parent.attr(target)}" rel="noopener noreferrer" style="display:block;text-decoration:none;color:inherit;">${visual}</a>`
    : visual;

  const extraStyle = ['hover-zoom','monochrome'].includes(variant)
    ? `<style>.bt-image-hover-zoom{position:relative}.bt-image-hover-zoom img,.bt-image-hover-zoom>div{transition:transform .35s ease}.bt-image-hover-zoom:hover img{transform:scale(1.08)}</style>`
    : '';
  return `<section style="${common}">${extraStyle}<div class="bt-image-render bt-image-render--${parent.attr(variant)}">${linked}</div></section>`;
}
