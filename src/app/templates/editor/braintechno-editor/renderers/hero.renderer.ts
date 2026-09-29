import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for hero; only ownership changed. */
export function renderHeroBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const img = String(c.image||'').trim();
        const visual = img ? `<img src="${parent.attr(img)}" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:16px">` : `<div style="width:100%;aspect-ratio:4/3;background:#D1D5DB;border-radius:16px;display:grid;place-items:center;color:#6B7280">Image</div>`;
        const copy = `<div><small style="font-weight:800;letter-spacing:.12em;color:#FF4D6D">${parent.escape(c.eyebrow||'')}</small><h1 style="font-size:48px;line-height:1.05;margin:10px 0 14px">${parent.escape(c.title)}</h1><p style="font-size:18px;line-height:1.7;color:inherit;opacity:.78">${parent.escape(c.text)}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><a class="bt-btn" href="${parent.attr(c.primaryUrl||'#')}" style="background:#FF4D6D;color:#fff;padding:12px 20px;border-radius:10px;font-weight:800">${parent.escape(c.primary)}</a><a class="bt-btn" href="${parent.attr(c.secondaryUrl||'#')}" style="border:1px solid #CBD5E1;color:inherit;padding:12px 20px;border-radius:10px;font-weight:700">${parent.escape(c.secondary)}</a></div></div>`;
        return `<section style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:${c.variant==='split'||c.variant==='image'?'1fr 1fr':'1fr'};gap:28px;align-items:center">${copy}${c.variant==='split'||c.variant==='image'?visual:''}</div></section>`;
}
