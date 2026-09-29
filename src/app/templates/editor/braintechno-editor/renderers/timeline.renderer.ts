import { EditorBlock } from "../models/editor-block.model";

/** Preserves the existing renderBlock branch for timeline; only ownership changed. */
export function renderTimelineBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items=Array.isArray(c.items)?c.items:[];
        return `<section style="${common}"><h2>${parent.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${items.length||1},1fr);gap:14px">${items.map((x:any,i:number)=>`<div style="padding:18px;border-top:3px solid ${parent.css(s.accent,'#FF4D6D')}"><strong style="display:block;color:${parent.css(s.accent,'#FF4D6D')}">0${i+1}</strong><h3>${parent.escape(x.title)}</h3><p style="opacity:.75">${parent.escape(x.text)}</p></div>`).join('')}</div></section>`;
}
