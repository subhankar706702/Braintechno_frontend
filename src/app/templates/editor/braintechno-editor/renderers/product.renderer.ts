import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for product; only ownership changed. */
export function renderProductBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items = Array.isArray(c.items) && c.items.length ? c.items : [c];
        const wrap = c.slider ? 'display:flex;overflow-x:auto;scroll-snap-type:x mandatory;' : `display:grid;grid-template-columns:repeat(${Math.min(items.length,3)},minmax(0,1fr));`;
        return `<section style="${common}"><div style="${wrap}gap:14px">${items.map((x:any)=>`<article style="${c.slider?'min-width:min(320px,82vw);scroll-snap-align:start;':''}padding:18px;border:1px solid #E2E8F0;border-radius:16px">${x.image?`<img src="${parent.attr(x.image)}" alt="" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px">`:`<div style="aspect-ratio:1/1;background:#E5E7EB;border-radius:12px;display:grid;place-items:center;color:#64748B">Product image</div>`}<h3>${parent.escape(x.name)}</h3><strong style="font-size:22px">${parent.escape(x.price)}</strong>${x.oldPrice?` <del style="opacity:.55">${parent.escape(x.oldPrice)}</del>`:''}<p style="opacity:.72">${parent.escape(x.description||'')}</p><a class="bt-btn" href="${parent.attr(x.url||'#')}" style="background:#FF4D6D;color:#fff;padding:10px 14px;border-radius:10px;font-weight:800">${parent.escape(x.cta||'Buy Now')}</a></article>`).join('')}</div></section>`;
}
