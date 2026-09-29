import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for counter; only ownership changed. */
export function renderCounterBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items = Array.isArray(c.items) && c.items.length ? c.items : [{ start:c.start,end:c.end,prefix:c.prefix,suffix:c.suffix,label:c.label,duration:c.duration }];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${Math.min(4, Math.max(1, items.length))},1fr);gap:12px">${items.map((item:any,index:number)=>`<div id="counter-${parent.safeDomId(block.id)}-${index}" data-bt-counter data-start="${Number(item.start) || 0}" data-end="${Number(item.end) || 0}" data-duration="${Number(item.duration) || 1600}" data-prefix="${parent.attr(item.prefix || '')}" data-suffix="${parent.attr(item.suffix || '')}" style="padding:14px;text-align:center"><div data-counter-value style="font-size:44px;font-weight:900;color:${parent.css(s.accent, '#FF4D6D')}">${parent.escape(item.prefix || '')}${parent.escape(item.end)}${parent.escape(item.suffix || '')}</div><p style="margin:6px 0 0">${parent.escape(item.label || '')}</p></div>`).join('')}</div></section>`;
}
