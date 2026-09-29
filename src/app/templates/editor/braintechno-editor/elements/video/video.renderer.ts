import { EditorBlock } from '../../models/editor-block.model';

function youtubeId(url: string): string {
  const value = String(url || '').trim();
  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/i);
  return match?.[1] || '';
}

function vimeoId(url: string): string {
  const value = String(url || '').trim();
  const match = value.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  return match?.[1] || '';
}

function detectProvider(c: Record<string, any>): 'youtube' | 'vimeo' | 'direct' | '' {
  const requested = String(c.provider || 'auto').toLowerCase();
  if (requested === 'youtube' && youtubeId(c.url)) return 'youtube';
  if (requested === 'vimeo' && vimeoId(c.url)) return 'vimeo';
  if (requested === 'direct') return 'direct';

  const url = String(c.url || '');
  if (youtubeId(url)) return 'youtube';
  if (vimeoId(url)) return 'vimeo';
  return url ? 'direct' : '';
}

function query(params: Record<string, string | number | boolean>): string {
  return Object.entries(params)
    .filter(([, value]) => value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

export function renderVideoBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const variant = String(c.variant || 'wide');
  const provider = detectProvider(c);
  const url = String(c.url || '').trim();
  const poster = String(c.poster || '').trim();
  const title = parent.escape(c.title || 'Video');
  const caption = String(c.caption || '').trim();
  const radius = Math.max(0, Number(s.radius ?? 0));
  const borderWidth = Math.max(0, Number(s.borderWidth ?? 0));
  const maxWidth = parent.css(s.maxWidth, '100%');
  const aspect = parent.css(s.aspect, '16/9');
  const fit = parent.css(s.objectFit, 'cover');
  const shadow = parent.shadowCss ? parent.shadowCss(s.shadow) : 'none';
  const border = borderWidth ? `${borderWidth}px ${parent.css(s.borderStyle, 'solid')} ${parent.css(s.borderColor, '#E2E8F0')}` : 'none';
  const align = parent.css(s.align, 'center');
  const frameStyle = [
    `position:relative`,
    `width:100%`,
    `max-width:${parent.attr(maxWidth)}`,
    `aspect-ratio:${parent.attr(aspect)}`,
    `margin-left:${align === 'right' ? 'auto' : '0'}`,
    `margin-right:${align === 'left' ? 'auto' : '0'}`,
    `border-radius:${radius}px`,
    `overflow:hidden`,
    `background:${parent.css(s.background, '#0F172A')}`,
    `border:${border}`,
    `box-shadow:${shadow}`
  ].join(';');

  if (!url) {
    return `<section style="${common}"><div style="${frameStyle};display:grid;place-items:center;color:#94A3B8;font:600 14px/1.4 Arial,sans-serif"><span style="text-align:center;padding:24px">Add a video URL to preview this video.</span></div></section>`;
  }

  const start = Math.max(0, Number(c.start) || 0);
  const end = Math.max(0, Number(c.end) || 0);
  const controls = c.controls !== false;
  const autoplay = !!c.autoplay;
  const muted = !!c.muted || autoplay;
  const loop = !!c.loop;
  const playsinline = c.playsinline !== false;

  let media = '';

  if (provider === 'youtube') {
    const id = youtubeId(url);
    const params = query({
      autoplay: autoplay ? 1 : 0,
      mute: muted ? 1 : 0,
      controls: controls ? 1 : 0,
      loop: loop ? 1 : 0,
      playlist: loop ? id : '',
      start: start || '',
      end: end || ''
    });
    const src = `https://www.youtube.com/embed/${parent.attr(id)}?${params}`;
    media = `<iframe src="${src}" title="${title}" style="position:absolute;inset:0;width:100%;height:100%;border:0" loading="${c.lazy === false ? 'eager' : 'lazy'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  } else if (provider === 'vimeo') {
    const id = vimeoId(url);
    const params = query({
      autoplay,
      muted,
      controls,
      loop,
      title: 0,
      byline: 0,
      portrait: 0
    });
    const src = `https://player.vimeo.com/video/${parent.attr(id)}?${params}`;
    media = `<iframe src="${src}" title="${title}" style="position:absolute;inset:0;width:100%;height:100%;border:0" loading="${c.lazy === false ? 'eager' : 'lazy'}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    const posterAttr = poster ? ` poster="${parent.attr(poster)}"` : '';
    const startAttr = start > 0 ? ` data-start="${start}"` : '';
    const endAttr = end > 0 ? ` data-end="${end}"` : '';
    media = `<video src="${parent.attr(url)}" title="${title}"${posterAttr} ${controls ? 'controls' : ''}${autoplay ? ' autoplay' : ''}${muted ? ' muted' : ''}${loop ? ' loop' : ''}${playsinline ? ' playsinline' : ''}${c.lazy === false ? '' : ' preload="metadata"'} style="position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:${parent.attr(fit)}"${startAttr}${endAttr}></video>`;
  }

  const captionHtml = caption ? `<div style="margin:10px 2px 0;color:${parent.css(s.color, '#475569')};font:500 13px/1.5 Arial,sans-serif">${parent.escape(caption)}</div>` : '';
  const titleHtml = variant === 'theater' && c.title ? `<div style="margin:0 0 10px;color:${parent.css(s.color, '#FFFFFF')};font:700 16px/1.35 Arial,sans-serif">${title}</div>` : '';

  return `<section style="${common}">${titleHtml}<div style="${frameStyle}">${media}</div>${captionHtml}</section>`;
}
