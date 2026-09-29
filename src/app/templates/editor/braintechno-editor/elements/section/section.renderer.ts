import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for section; only ownership changed. */
export function renderSectionBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const columns = parent.sectionColumns(String(c.variant || 'one'));
        const cells = Array.isArray(c.cells) ? c.cells : [];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${parent.cssPx(s.gap, 14)}">${cells.map((cell: any) => `<div style="min-width:0;padding:18px;border:1px solid #E2E8F0;border-radius:12px;background:#FFFFFF"><h3 style="margin:0 0 8px;font-size:20px">${parent.escape(cell?.title || '')}</h3><p style="margin:0;line-height:1.65;color:#475569">${parent.nl2br(parent.escape(cell?.text || ''))}</p></div>`).join('')}</div></section>`;
}
