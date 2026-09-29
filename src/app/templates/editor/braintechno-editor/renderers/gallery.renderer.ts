import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for gallery; only ownership changed. */
export function renderGalleryBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const images = Array.isArray(c.images) ? c.images : [];
        return `<section style="${common}"><div class="bt-grid" style="grid-template-columns:repeat(${Math.max(1, Math.min(4, Number(s.columns) || 3))},1fr);gap:${parent.cssPx(s.gap, 10)}">${images.map((url: string) => url ? `<img src="${parent.attr(url)}" alt="Gallery image" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:${parent.cssPx(s.radius, 10)}">` : `<div style="width:100%;aspect-ratio:1/1;display:grid;place-items:center;background:#D1D5DB;color:#6B7280;border-radius:${parent.cssPx(s.radius, 10)};font-weight:700">Image</div>`).join('')}</div></section>`;
}
