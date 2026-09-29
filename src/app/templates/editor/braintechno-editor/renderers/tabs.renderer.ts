import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for tabs; only ownership changed. */
export function renderTabsBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items=Array.isArray(c.items)?c.items:[];
        return `<section style="${common}"><div class="bt-tabs" data-bt-tabs>${items.map((x:any,i:number)=>`<button type="button" data-tab-btn="${i}" class="${i===0?'is-active':''}">${parent.escape(x.title)}</button>`).join('')}<div class="bt-tab-panels">${items.map((x:any,i:number)=>`<div data-tab-panel="${i}" style="display:${i===0?'block':'none'};padding:18px 0;line-height:1.7">${parent.escape(x.text)}</div>`).join('')}</div></div></section>`;
}
