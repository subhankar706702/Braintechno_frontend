import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for social; only ownership changed. */
export function renderSocialBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items = socialItems(c);
        const variant = String(c.variant || 'logo-only');
        const justify = s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start';
        const showName = typeof s.showName === 'boolean' ? s.showName : !['logo-only', 'logo-round', 'logo-square', 'logo-hover'].includes(variant);
        const showUrl = typeof s.showUrl === 'boolean' ? s.showUrl : ['logo-url-left', 'logo-url-center', 'logo-url-right'].includes(variant);
        const hover = Boolean(s.hover || variant === 'logo-hover');
        const dark = variant === 'logo-dark';
        const card = ['logo-card', 'logo-outline', 'logo-soft', 'logo-dark', 'logo-footer'].includes(variant);
        const shape = String(s.socialIconShape || (variant === 'logo-round' || variant === 'logo-circle-name' ? 'round' : variant === 'logo-square' || variant === 'logo-square-name' ? 'square' : 'none'));
        const logoSize = Math.max(20, Math.min(96, Number(s.iconSize) || 36));
        const gap = Math.max(4, Math.min(48, Number(s.gap) || 12));
        const href = (url: string) => /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url) || /^\//.test(url) || url === '#' ? url : `https://${url}`;
        const socialClass = `bt-social bt-social--${parent.safeDomId(variant)}${hover ? ' bt-social--hover' : ''}`;
        const logoStyle = `width:${logoSize}px;height:${logoSize}px;object-fit:contain;flex:0 0 ${logoSize}px;border-radius:${shape === 'round' ? '999px' : shape === 'square' ? '10px' : '0'};`;
        const shellBg = dark ? '#172033' : variant === 'logo-soft' ? '#F8FAFC' : '#FFFFFF';
        const shellBorder = Number(s.borderWidth) > 0 ? `border:${Number(s.borderWidth)}px solid ${parent.css(s.borderColor, '#E2E8F0')};` : (card ? 'border:1px solid #E2E8F0;' : 'border:0;');
        const nameColor = dark ? '#FFFFFF' : parent.css(s.color, '#0F172A');
        const urlColor = dark ? '#CBD5E1' : '#64748B';
        const layoutDirection = ['logo-url-center', 'logo-url-right'].includes(variant) ? 'column' : 'row';
        const itemAlign = variant === 'logo-url-center' ? 'center' : 'flex-start';
        const list = items.map(item => {
          const safeUrl = href(item.url);
          const isImage = /^https?:\/\//i.test(item.icon || '') || /^data:image\//i.test(item.icon || '') || /\.(svg|png|jpe?g|webp)(\?|$)/i.test(item.icon || '');
          const iconHtml = isImage
            ? `<img src="${parent.attr(item.icon)}" alt="${parent.attr(item.name)} logo" style="${logoStyle}" loading="lazy">`
            : `<span class="material-symbols-rounded" style="font-size:${logoSize}px;line-height:1">${parent.escape(item.icon || 'link')}</span>`;
          const nameHtml = showName ? `<strong style="font-size:14px;font-weight:800;color:${nameColor};line-height:1.2">${parent.escape(item.name)}</strong>` : '';
          const urlHtml = showUrl ? `<span style="font-size:12px;color:${urlColor};line-height:1.35;word-break:break-all">${parent.escape(item.url)}</span>` : '';
          const textHtml = (showName || showUrl) ? `<span style="display:flex;flex-direction:column;gap:3px;min-width:0;align-items:${itemAlign}">${nameHtml}${urlHtml}</span>` : '';
          const content = layoutDirection === 'column'
            ? `${iconHtml}${textHtml}`
            : `${iconHtml}${textHtml}`;
          return `<a class="bt-social__item" href="${parent.attr(safeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${parent.attr(item.name)}" style="display:inline-flex;align-items:center;justify-content:${variant === 'logo-url-center' ? 'center' : 'flex-start'};flex-direction:${layoutDirection};gap:${layoutDirection === 'column' ? '8px' : '10px'};min-width:${layoutDirection === 'column' ? Math.max(logoSize, 56) : showUrl ? '220px' : Math.max(logoSize, 56)};padding:${card ? '12px 14px' : '4px'};text-decoration:none;background:${shellBg};${shellBorder}border-radius:${variant === 'logo-card' ? '14px' : variant === 'logo-outline' ? '10px' : shape === 'round' ? '999px' : '8px'};transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease;">${content}</a>`;
        }).join('');
        const hoverCss = hover
          ? `<style>.${socialClass.replace(/ /g, '.')} .bt-social__item:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(15,23,42,.12);border-color:#CBD5E1;}</style>`
          : '';
        return `<section style="${common}">${hoverCss}<div class="${socialClass}" style="display:flex;gap:${gap}px;flex-wrap:wrap;align-items:center;justify-content:${justify};width:100%;">${list}</div></section>`;
}

/** Existing Social item normalization moved with the Social renderer. */
function socialItems(content: Record<string, any>): Array<{ name: string; url: string; icon: string }> {

    const iconMap: Record<string, string> = {
      facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
      instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
      youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
      linkedin: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png',
      telegram: 'https://cdn.simpleicons.org/telegram/229ED9',
      x: 'https://cdn.simpleicons.org/x/111111',
      whatsapp: 'https://cdn.simpleicons.org/whatsapp/25D366',
      website: 'public',
      github: 'https://cdn.simpleicons.org/github/181717',
      tiktok: 'https://cdn.simpleicons.org/tiktok/111111'
    };

    const dynamic = Array.isArray(content['items']) ? content['items'] : [];
    if (dynamic.length) {
      return dynamic
        .filter((item: any) => String(item?.url || '').trim())
        .map((item: any) => {
          const platform = String(item?.platform || '').toLowerCase();
          return {
            name: String(item?.name || item?.label || item?.platform || 'Link'),
            url: String(item.url),
            // The selected platform is the source of truth for the default logo.
            // This fixes stale icons when an existing item is switched from one platform to another.
            icon: String(iconMap[platform] || item?.icon || 'link')
          };
        });
    }

    const all = [
      { key: 'facebook', name: 'Facebook' },
      { key: 'instagram', name: 'Instagram' },
      { key: 'youtube', name: 'YouTube' },
      { key: 'linkedin', name: 'LinkedIn' },
      { key: 'x', name: 'X' },
      { key: 'whatsapp', name: 'WhatsApp' }
    ];

    return all
      .filter(item => String(content[item.key] || '').trim())
      .map(item => ({ name: item.name, url: String(content[item.key]), icon: iconMap[item.key] || 'link' }));
  
}
