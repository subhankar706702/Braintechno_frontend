import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for team; only ownership changed. */
export function renderTeamBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items=Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||3);
        return `<section style="${common}"><h2>${parent.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${parent.cssPx(s.gap,12)}">${items.map((x:any)=>`<article style="text-align:center;padding:16px"><div style="aspect-ratio:1/1;background:#D1D5DB;border-radius:16px;margin-bottom:12px;display:grid;place-items:center;color:#6B7280">Image</div><strong>${parent.escape(x.name)}</strong><small style="display:block;opacity:.7">${parent.escape(x.role)}</small></article>`).join('')}</div></section>`;
}
