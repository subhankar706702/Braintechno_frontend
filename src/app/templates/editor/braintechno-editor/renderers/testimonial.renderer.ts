import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for testimonial; only ownership changed. */
export function renderTestimonialBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const items=Array.isArray(c.items)?c.items:[]; const cols=Math.max(1,Number(s.columns)||1);
        return `<section style="${common}"><h2 style="margin-top:0">${parent.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${parent.cssPx(s.gap,12)}">${items.map((x:any)=>`<blockquote style="margin:0;padding:20px;border:1px solid #E2E8F0;border-radius:14px"><div style="color:#F59E0B">★★★★★</div><p style="font-size:18px;line-height:1.6">“${parent.escape(x.quote)}”</p><strong>${parent.escape(x.name)}</strong><small style="display:block;opacity:.7">${parent.escape(x.role)}</small></blockquote>`).join('')}</div></section>`;
}
