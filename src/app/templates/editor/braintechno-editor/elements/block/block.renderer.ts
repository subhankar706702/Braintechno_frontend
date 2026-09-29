import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for block; only ownership changed. */
export function renderBlockBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const columns = parent.sectionColumns(String(c.variant || 'two'));
        const slots = Array.isArray(c.slots) ? c.slots : [];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${parent.cssPx(s.gap, 14)}">${slots.map((slot: EditorBlock[]) => `<div style="min-width:0">${(Array.isArray(slot) ? slot : []).map(child => parent.renderBlock(child)).join('')}</div>`).join('')}</div></section>`;
}
