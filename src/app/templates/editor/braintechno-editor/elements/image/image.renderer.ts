import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for image; only ownership changed. */
export function renderImageBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const shadow = s.shadow ? 'box-shadow:0 18px 45px rgba(15,23,42,.18);' : '';
        const border = Number(s.borderWidth) ? `border:${Number(s.borderWidth)}px solid ${parent.css(s.borderColor, '#CBD5E1')};` : '';
        const width = Math.max(1, Math.min(100, Number(s.imageWidth) || 100));
        const height = Math.max(1, Math.min(200, Number(s.imageHeight) || 56));
        const media = c.url
          ? `<img class="bt-img" src="${parent.attr(c.url)}" alt="${parent.attr(c.alt || '')}" style="width:${width}%;aspect-ratio:${width}/${height};object-fit:cover;margin:${s.align === 'center' ? '0 auto' : s.align === 'right' ? '0 0 0 auto' : '0'};border-radius:${parent.cssPx(s.radius, 10)};${shadow}${border}">`
          : `<div style="width:${width}%;aspect-ratio:${width}/${height};margin:${s.align === 'center' ? '0 auto' : s.align === 'right' ? '0 0 0 auto' : '0'};display:grid;place-items:center;background:#D1D5DB;color:#6B7280;border-radius:${parent.cssPx(s.radius, 10)};${border}"><span style="font-size:14px;font-weight:700">Image</span></div>`;
        return `<section style="${common}">${media}</section>`;
}
