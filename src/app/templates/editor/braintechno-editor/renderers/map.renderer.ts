import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for map; only ownership changed. */
export function renderMapBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
return `<section style="${common}">${c.title && c.variant === 'office' ? `<h3 style="margin:0 0 12px">${parent.escape(c.title)}</h3>` : ''}<iframe title="Business location" src="${parent.attr(c.url)}" style="width:100%;height:${parent.cssPx(c.height, 300)};border:0;border-radius:${parent.cssPx(s.radius, 10)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></section>`;
}
