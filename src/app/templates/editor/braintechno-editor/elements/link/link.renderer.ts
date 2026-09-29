function esc(value: any): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function css(value: any, fallback: string): string {
  return String(value ?? fallback);
}

function cssPx(value: any, fallback: number): string {
  const n = Number(value);
  return Number.isFinite(n) ? `${n}px` : `${fallback}px`;
}

function normalizeUrl(raw: any, action: string): string {
  const value = String(raw ?? '').trim();
  if (!value) return '#';
  if (action === 'anchor') return value.startsWith('#') ? value : `#${value.replace(/^#+/, '')}`;
  if (action === 'email') return /^mailto:/i.test(value) ? value : `mailto:${value}`;
  if (action === 'phone') return /^tel:/i.test(value) ? value : `tel:${value.replace(/[^+\d]/g, '')}`;
  if (action === 'whatsapp') {
    if (/^https:\/\/wa\.me\//i.test(value)) return value;
    const digits = value.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '#';
  }
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(value)) return value;
  return `https://${value}`;
}

function renderIcon(icon: string, color: string, bg: string, size: number, bordered = false): string {
  return `<span class="material-symbols-rounded" aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:${size + 10}px;height:${size + 10}px;font-size:${size}px;line-height:1;color:${esc(color)};background:${esc(bg)};border:${bordered ? '1px solid rgba(148,163,184,.24)' : '0'};border-radius:999px">${esc(icon || 'arrow_forward')}</span>`;
}

export function renderLinkBlock(parent: any, block: any, common: string): string {
  const c = block?.content || {};
  const s = block?.style || {};
  const variant = String(c.variant || 'text');
  const label = String(c.label || 'Learn more');
  const action = String(c.action || 'web');
  const href = normalizeUrl(c.url, action);
  const target = String(c.target || (c.openExternal ? '_blank' : '_self')) === '_blank' ? '_blank' : '_self';
  const rel = target === '_blank' ? String(c.rel || 'noopener noreferrer') : '';
  const download = Boolean(c.download) || variant === 'download';
  const downloadAttr = download ? ` download="${esc(c.downloadName || '')}"` : '';
  const icon = String(c.icon || 'arrow_forward');
  const fontSize = Number(s.fontSize) || 15;
  const weight = Number(s.fontWeight) || 700;
  const color = css(s.color, '#2563EB');
  const hover = css(s.hoverColor, '#1D4ED8');
  const bg = css(s.background, 'transparent');
  const radius = cssPx(s.radius, 8);
  const padding = typeof s.padding === 'number' ? `${s.padding}px` : css(s.padding, '8px 12px');
  const border = `${Number(s.borderWidth) || 0}px solid ${css(s.borderColor, '#CBD5E1')}`;
  const shadowMap: Record<string,string> = {
    none: 'none',
    soft: '0 8px 24px rgba(15,23,42,.08)',
    medium: '0 12px 30px rgba(15,23,42,.13)',
    strong: '0 18px 44px rgba(15,23,42,.18)'
  };
  const shadow = shadowMap[String(s.shadow || 'none')] || String(s.shadow || 'none');
  const align = css(s.align, 'left');
  const safeUrl = esc(href);
  const data = `data-bt-link data-bt-link-variant="${esc(variant)}"`;

  let inner = '';
  let extraStyle = '';
  let wrapperStyle = '';

  switch (variant) {
    case 'underline':
      inner = esc(label);
      extraStyle = `text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px;`;
      break;
    case 'arrow':
      inner = `<span>${esc(label)}</span><span aria-hidden="true" style="color:${esc(css(s.accent, '#FF4D6D'))};font-size:${fontSize + 2}px">→</span>`;
      break;
    case 'chevron':
      inner = `<span>${esc(label)}</span><span class="material-symbols-rounded" aria-hidden="true" style="font-size:${fontSize + 18}px">chevron_right</span>`;
      break;
    case 'pill':
    case 'outline':
    case 'soft':
      inner = esc(label);
      break;
    case 'card':
      inner = `<span style="display:flex;flex-direction:column;gap:5px;min-width:0"><strong style="font-size:${fontSize + 1}px;color:${esc(color)}">${esc(label)}</strong><span style="font-size:12px;color:#64748B">Open this link</span></span><span class="material-symbols-rounded" aria-hidden="true" style="font-size:${fontSize + 20}px;color:${esc(css(s.iconColor, color))}">${esc(icon)}</span>`;
      wrapperStyle = 'width:100%;box-sizing:border-box;justify-content:space-between;';
      break;
    case 'icon-left':
      inner = `${renderIcon(icon, css(s.iconColor, color), css(s.iconBg, '#EFF6FF'), Number(s.iconSize) || 16)}<span>${esc(label)}</span>`;
      break;
    case 'icon-right':
      inner = `<span>${esc(label)}</span>${renderIcon(icon, css(s.iconColor, color), css(s.iconBg, '#EEF2FF'), Number(s.iconSize) || 16)}`;
      break;
    case 'external':
      inner = `<span>${esc(label)}</span><span class="material-symbols-rounded" aria-hidden="true" style="font-size:${fontSize + 2}px">open_in_new</span>`;
      break;
    case 'download':
      inner = `${renderIcon('download', css(s.iconColor, '#FFFFFF'), css(s.iconBg, 'rgba(255,255,255,.10)'), Number(s.iconSize) || 16)}<span>${esc(label)}</span>`;
      break;
    case 'contact':
      inner = `${renderIcon(icon || 'mail', css(s.iconColor, '#FFFFFF'), css(s.iconBg, 'rgba(255,255,255,.14)'), Number(s.iconSize) || 16)}<span>${esc(label)}</span>`;
      break;
    case 'anchor':
      inner = `<span>${esc(label.startsWith('#') ? label : `# ${label}`)}</span><span class="material-symbols-rounded" aria-hidden="true" style="font-size:${fontSize + 2}px">keyboard_arrow_down</span>`;
      break;
    case 'stacked':
      inner = `<span style="display:flex;flex-direction:column;gap:4px;min-width:0"><strong style="font-size:${fontSize}px;color:${esc(color)}">${esc(label)}</strong><span style="font-size:12px;color:#64748B;word-break:break-all">${esc(String(c.url || href))}</span></span><span class="material-symbols-rounded" aria-hidden="true" style="font-size:${fontSize + 2}px">open_in_new</span>`;
      wrapperStyle = 'width:100%;box-sizing:border-box;justify-content:space-between;';
      break;
    default:
      inner = esc(label);
      break;
  }

  const linkStyle = [
    'display:inline-flex',
    'align-items:center',
    'justify-content:center',
    'gap:' + cssPx(s.gap, 8),
    'box-sizing:border-box',
    'padding:' + padding,
    'margin:0',
    'text-decoration:none',
    'font-size:' + fontSize + 'px',
    'font-weight:' + weight,
    'font-family:inherit',
    'line-height:1.25',
    'color:' + color,
    'background:' + bg,
    'border:' + border,
    'border-radius:' + radius,
    'box-shadow:' + shadow,
    'transition:color .18s ease,background .18s ease,border-color .18s ease,transform .18s ease,box-shadow .18s ease',
    extraStyle,
    wrapperStyle
  ].join(';') + ';';

  const hoverClass = `bt-link-${String(block?.id || 'item').replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const hoverCss = `<style>.${hoverClass}:hover{color:${esc(hover)}!important}.${hoverClass}:focus-visible{outline:2px solid #93C5FD;outline-offset:3px}.${hoverClass}:active{transform:translateY(1px)}</style>`;

  const showUrl = Boolean(c.showUrl) || variant === 'stacked';
  const textUrl = showUrl && variant !== 'stacked'
    ? `<span style="display:block;margin-top:6px;font-size:12px;color:#64748B;word-break:break-all">${esc(String(c.url || href))}</span>`
    : '';

  const contentHtml = `<a ${data} class="${hoverClass}" href="${safeUrl}" target="${target}"${rel ? ` rel="${esc(rel)}"` : ''}${downloadAttr} title="${esc(c.title || label)}" style="${linkStyle}">${inner}</a>${textUrl}`;
  const blockStyle = `${common}text-align:${align};`;

  return `<section style="${blockStyle}">${hoverCss}<div style="display:flex;justify-content:${align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'};width:100%">${contentHtml}</div></section>`;
}
