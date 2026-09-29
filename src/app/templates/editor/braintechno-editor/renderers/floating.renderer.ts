import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for floating; only ownership changed. */
export function renderFloatingBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items = Array.isArray(c.items) && c.items.length ? c.items : [c];
        return `<section style="${common}"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">${items.map((x:any)=>`<a class="bt-btn" href="${parent.attr(x.url||'#')}" style="display:inline-flex;align-items:center;gap:7px;background:#FF4D6D;color:#fff;padding:9px 13px;border-radius:999px;font-weight:800;font-size:13px"><span class="material-symbols-rounded" style="font-size:19px">${parent.escape(x.icon||'chat')}</span>${parent.escape(x.label||'Action')}</a>`).join('')}</div></section>`;
}
