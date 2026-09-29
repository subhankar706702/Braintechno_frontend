import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for offer; only ownership changed. */
export function renderOfferBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items = Array.isArray(c.items) && c.items.length ? c.items : [c];
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${Math.min(items.length,3)},minmax(0,1fr));gap:14px">${items.map((x:any)=>`<article style="padding:22px;border:1px solid #FFD1D9;border-radius:18px"><small style="font-weight:900;color:#FF4D6D">${parent.escape(x.badge||'')}</small><h3>${parent.escape(x.title)}</h3><strong style="display:block;font-size:32px;color:#FF4D6D">${parent.escape(x.discount)}</strong><p>${parent.escape(x.description)}</p><a class="bt-btn" href="${parent.attr(x.url||'#')}" style="background:#FF4D6D;color:#fff;padding:10px 14px;border-radius:10px;font-weight:800">${parent.escape(x.cta||'View offer')}</a></article>`).join('')}</div></section>`;
}
