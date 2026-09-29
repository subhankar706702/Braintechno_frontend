import { EditorBlock } from '../../models/editor-block.model';

function escapeHtml(value: any): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(value: string): string {
  return value.replace(/\r?\n/g, '<br>');
}

export function renderTextBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const variant = String(c.variant || 'paragraph');
  const css = (value: any, fallback: string) => parent.css ? parent.css(value, fallback) : String(value || fallback);
  const cssPx = (value: any, fallback: number) => parent.cssPx ? parent.cssPx(value, fallback) : `${Number(value) || fallback}px`;
  const text = nl2br(escapeHtml(c.text || ''));
  const textColor = css(s.color, '#475569');
  const lineHeight = Number(s.lineHeight) || 1.75;
  const fontSize = cssPx(s.fontSize, 16);
  const fontWeight = Number(s.fontWeight) || 400;
  const icon = escapeHtml(c.icon || 'info');

  const paragraphHtml = `<p style="margin:0;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${text}</p>`;

  switch (variant) {
    case 'lead':
      return `<section style="${common}"><p style="margin:0;font-size:${cssPx(s.fontSize, 20)};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor};max-width:860px">${text}</p></section>`;

    case 'muted':
      return `<section style="${common}"><p style="margin:0;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${css(s.color, '#64748B')};opacity:.92">${text}</p></section>`;

    case 'quote':
      return `<section style="${common}border-left:4px solid ${css(s.borderLeft, '#FF4D6D')};"><span style="display:block;font-size:42px;line-height:.8;color:${css(s.quoteMarkColor, '#FF4D6D')};font-weight:900;margin-bottom:8px">“</span>${paragraphHtml}</section>`;

    case 'note':
    case 'callout':
    case 'success':
    case 'warning': {
      const iconBg = variant === 'success' ? '#DCFCE7' : variant === 'warning' ? '#FEF3C7' : variant === 'note' ? '#E2E8F0' : '#FFF1F4';
      const iconColor = variant === 'success' ? '#15803D' : variant === 'warning' ? '#B45309' : variant === 'note' ? '#475569' : '#E11D48';
      return `<section style="${common}display:flex;gap:12px;align-items:flex-start"><span class="material-symbols-rounded" style="display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:34px;height:34px;border-radius:10px;background:${iconBg};color:${iconColor};font-size:20px">${icon}</span><div style="min-width:0;flex:1">${paragraphHtml}</div></section>`;
    }

    case 'center':
      return `<section style="${common}">${paragraphHtml}</section>`;

    case 'two-column':
      return `<section style="${common}"><div class="bt-text-two-column" style="column-count:2;column-gap:${cssPx(s.columnGap, 28)};column-fill:balance;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${text}</div><style>@media(max-width:700px){.bt-text-two-column{column-count:1!important}}</style></section>`;

    case 'highlight': {
      const rawText = String(c.text || '');
      const rawHighlight = String(c.highlight || '').trim();
      const safeText = escapeHtml(rawText);
      const safeHighlight = escapeHtml(rawHighlight);
      const highlighted = safeHighlight ? safeText.replace(safeHighlight, `<mark style="background:${css(s.highlightBg, '#FFF1F4')};color:${css(s.highlightColor, '#E11D48')};padding:0 5px;border-radius:6px">${safeHighlight}</mark>`) : safeText;
      return `<section style="${common}"><p style="margin:0;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${nl2br(highlighted)}</p></section>`;
    }

    case 'checklist': {
      const items = Array.isArray(c.items) ? c.items : [];
      return `<section style="${common}"><div style="display:flex;flex-direction:column;gap:${cssPx(s.checklistGap, 10)}">${items.map((item:any) => `<div style="display:flex;gap:10px;align-items:flex-start"><span class="material-symbols-rounded" style="font-size:22px;line-height:1.2;color:${css(s.checklistColor, '#FF4D6D')}">${escapeHtml(item?.icon || 'check_circle')}</span><p style="margin:0;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${nl2br(escapeHtml(item?.text || ''))}</p></div>`).join('')}</div></section>`;
    }

    case 'quote-card': {
      const author = escapeHtml(c.author || '');
      const source = escapeHtml(c.source || '');
      const avatar = String(c.avatar || '').trim();
      const avatarHtml = avatar ? `<img src="${escapeHtml(avatar)}" alt="" style="width:46px;height:46px;border-radius:50%;object-fit:cover">` : `<span class="material-symbols-rounded" style="display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#FFF1F4;color:#FF4D6D;font-size:24px">person</span>`;
      return `<section style="${common}"><div style="font-size:42px;line-height:.8;color:${css(s.quoteMarkColor, '#FF4D6D')};font-weight:900">“</div><p style="margin:12px 0 20px;font-size:${cssPx(s.fontSize, 19)};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${text}</p><div style="display:flex;align-items:center;gap:12px">${avatarHtml}<div><strong style="display:block;color:${css(s.authorColor, '#0F172A')}">${author || 'Customer'}</strong>${source ? `<span style="display:block;font-size:13px;color:#64748B;margin-top:2px">${source}</span>` : ''}</div></div></section>`;
    }

    case 'numeric':
      return `<section style="${common}"><div style="font-size:${cssPx(s.numberSize, 46)};font-weight:${Number(s.numberWeight) || 900};line-height:1;color:${css(s.numberColor, '#0F172A')}">${escapeHtml(c.value || '100+')}${escapeHtml(c.suffix || '')}</div><div style="margin-top:10px;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${escapeHtml(c.label || 'Key result')}</div>${c.text ? `<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#64748B">${text}</p>` : ''}</section>`;

    case 'expandable':
      return `<section style="${common}"><details${c.defaultOpen ? ' open' : ''}><summary style="cursor:pointer;font-weight:700;color:${css(s.summaryColor, '#0F172A')}">${escapeHtml(c.eyebrow || 'Read more')}</summary><div style="padding-top:12px"><p style="margin:0;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${text}</p>${c.moreText ? `<div style="margin-top:12px;font-size:${fontSize};font-weight:${fontWeight};line-height:${lineHeight};color:${textColor}">${nl2br(escapeHtml(c.moreText))}</div>` : ''}</div></details></section>`;

    case 'paragraph':
    default:
      return `<section style="${common}">${paragraphHtml}</section>`;
  }
}
