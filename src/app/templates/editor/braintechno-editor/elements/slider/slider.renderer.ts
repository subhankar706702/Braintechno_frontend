import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for slider; only ownership changed. */
export function renderSliderBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const images = Array.isArray(c.images) ? c.images : [];
        const id = `slider-${parent.safeDomId(block.id)}`;
        return `<section style="${common}"><div id="${id}" class="bt-slider" data-bt-slider data-interval="${Number(c.interval) || 3500}" data-autoplay="${c.autoplay !== false}" style="height:${parent.cssPx(s.height, 420)};border-radius:${parent.cssPx(s.radius, 14)}">${images.map((url: string, index: number) => url ? `<img class="${index === 0 ? 'is-active' : ''}" src="${parent.attr(url)}" alt="Slide ${index + 1}">` : `<div class="${index === 0 ? 'is-active' : ''}" style="display:${index === 0 ? 'grid' : 'none'};width:100%;height:100%;place-items:center;background:#D1D5DB;color:#6B7280;font-weight:700">Image</div>`).join('')}</div></section>`;
}
