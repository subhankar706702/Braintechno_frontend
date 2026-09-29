import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for button; only ownership changed. */
export function renderButtonBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const fullWidth = !!s.fullWidth;
        const shadow = s.shadow ? 'box-shadow:0 8px 18px rgba(15,23,42,.14);' : '';
        const items = Array.isArray(c.items) && c.items.length ? c.items : [{ label: c.label, url: c.url, target: c.target, icon: s.icon || '' }];
        return `<section style="${common}"><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:${s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start'}">${items.map((item:any)=>`<a class="bt-btn" href="${parent.attr(item.url || '#')}" target="${parent.attr(item.target || '_self')}" style="display:${fullWidth ? 'flex' : 'inline-flex'};align-items:center;justify-content:center;gap:8px;${fullWidth ? 'flex:1 1 100%;' : ''}text-align:center;background:${parent.css(s.buttonBg, '#FF4D6D')};color:${parent.css(s.buttonText, '#FFFFFF')};border:${Number(s.borderWidth) || 0}px solid ${parent.css(s.borderColor, '#FF4D6D')};padding:13px 22px;border-radius:${parent.cssPx(s.radius, 10)};font-weight:700;font-size:${parent.cssPx(s.fontSize, 15)};${shadow}">${item.icon ? `<span class="material-symbols-rounded">${parent.escape(item.icon)}</span>` : ''}${parent.escape(item.label || 'Button')}</a>`).join('')}</div></section>`;
}
