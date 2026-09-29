import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for icon; only ownership changed. */
export function renderIconBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items = Array.isArray(c.items) && c.items.length ? c.items : [{ materialIcon: c.materialIcon, label: c.label, url: c.url || '#' }];
        return `<section style="${common}"><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:${s.align === 'center' ? 'center' : s.align === 'right' ? 'flex-end' : 'flex-start'}">${items.map((item:any)=>`<a href="${parent.attr(item.url || '#')}" style="display:inline-flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:inherit"><span class="material-symbols-rounded" style="display:inline-flex;align-items:center;justify-content:center;width:${parent.cssPx(Number(s.iconSize) + 24, 60)};height:${parent.cssPx(Number(s.iconSize) + 24, 60)};font-size:${parent.cssPx(s.iconSize, 36)};color:${parent.css(s.iconColor, '#FF4D6D')};background:${parent.css(s.iconBg, 'transparent')};border-radius:${parent.cssPx(s.radius, 999)}">${parent.escape(item.materialIcon || 'star')}</span>${item.label ? `<strong>${parent.escape(item.label)}</strong>` : ''}</a>`).join('')}</div></section>`;
}
