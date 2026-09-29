import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for faq; only ownership changed. */
export function renderFaqBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items=Array.isArray(c.items)?c.items:[];
        return `<section style="${common}"><h2>${parent.escape(c.title)}</h2><div>${items.map((x:any)=>`<details style="border-bottom:1px solid #E2E8F0;padding:14px 0"><summary style="font-weight:800;cursor:pointer">${parent.escape(x.q)}</summary><p style="line-height:1.7;opacity:.78">${parent.escape(x.a)}</p></details>`).join('')}</div></section>`;
}
