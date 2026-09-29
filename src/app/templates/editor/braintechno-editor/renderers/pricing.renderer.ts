import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for pricing; only ownership changed. */
export function renderPricingBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const plans=Array.isArray(c.plans)?c.plans:[]; const cols=Math.max(1,Number(s.columns)||3);
        return `<section style="${common}"><h2 style="margin-top:0">${parent.escape(c.title)}</h2><div class="bt-grid bt-responsive-grid" style="grid-template-columns:repeat(${cols},1fr);gap:${parent.cssPx(s.gap,12)}">${plans.map((x:any,i:number)=>`<article style="padding:22px;border:${c.variant==='featured'&&i===1?'2px solid #FF4D6D':'1px solid #E2E8F0'};border-radius:16px"><h3>${parent.escape(x.name)}</h3><div style="font-size:34px;font-weight:900">${parent.escape(x.price)}<small style="font-size:14px;font-weight:500">${parent.escape(x.period)}</small></div><div style="white-space:pre-line;line-height:1.8;margin:16px 0">${parent.escape(x.features)}</div><a class="bt-btn" href="#" style="background:#FF4D6D;color:#fff;padding:11px 16px;border-radius:10px;font-weight:700">${parent.escape(x.cta)}</a></article>`).join('')}</div></section>`;
}
