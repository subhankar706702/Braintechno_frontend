import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for stats; only ownership changed. */
export function renderStatsBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items=Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||4);
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${parent.cssPx(s.gap,12)}">${items.map((x:any)=>`<div style="padding:18px;text-align:center"><strong style="display:block;font-size:38px;color:${parent.css(s.accent,'#FF4D6D')}">${parent.escape(x.value)}</strong><span>${parent.escape(x.label)}</span></div>`).join('')}</div></section>`;
}
